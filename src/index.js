const core = require('@actions/core');
const { execSync } = require('child_process');
const generateSVG = require('./generate_svg');
const fs = require('fs');
const path = require('path');
const request = require('sync-request');

function run()
{
	const svgFileName = 'output.svg';
	const githubToken = core.getInput('github-token', { required: true });
	const generatedFilePath = path.join(__dirname, svgFileName);
	const targetBranchName = 'github_defenders_output';
	const repoUrl = core.getInput('repo-url', { required: true });

	const contributions = fetchContributionData(repoUrl, githubToken);
	let contribString = getContributionsAsString(contributions);
	if (!contribString)
	{
		return;
	}
	console.log(contribString);

	generateSVG(generatedFilePath);

	try
	{
		// clone target repo
		const repoWithTokenUrl = repoUrl.replace('https://', `https://x-access-token:${githubToken}@`);
		const cloneDir = path.join('/tmp', 'github_defenders_output_repo');
		if (!fs.existsSync(cloneDir))
		{
			fs.mkdirSync(cloneDir, { recursive: true });
		}
		else
		{
			execSync(`find ${cloneDir} -mindepth 1 -delete`);
		}
		execSync(`git clone --depth 1 ${repoWithTokenUrl} ${cloneDir}`);

		// git config
		execSync(`git -C ${cloneDir} config user.name "🤖 GitHub Invaders Bot"`);
		execSync(`git -C ${cloneDir} config user.email "this_email_doesnt_work@noreply.com"`);

		// Create a clean target branch
		execSync(`git -C ${cloneDir} checkout ${targetBranchName} || git -C ${cloneDir} checkout --orphan ${targetBranchName}`);
		execSync(`git -C ${cloneDir} rm -rf .`);

		// Copy SVG & commit
		fs.copyFileSync(generatedFilePath, path.join(cloneDir, svgFileName));
		execSync(`git -C ${cloneDir} add ${svgFileName}`);
		execSync(`git -C ${cloneDir} commit -m "Update output.svg with at ${new Date().toISOString()}"`);
		execSync(`git -C ${cloneDir} push --force origin ${targetBranchName}`);

		core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

function getContributionsAsString(contributions)
{
	let contributionsString;

	if (contributions && contributions.data && contributions.data.user && contributions.data.user.contributionsCollection)
	{
		const calendar = contributions.data.user.contributionsCollection.contributionCalendar;
		contributionsString += 'Total Contributions Last Year:', calendar.totalContributions;
		calendar.weeks.forEach(week => {
			week.contributionDays.forEach(day => {
				contributionsString += `Date: ${day.date}, Contributions: ${day.contributionCount}`;
			});
		});
		return contributionsString;
	}
	else
	{
		console.error('No contribution data available or data is improperly structured.');
		return null;
	}
}

function extractOwner(repoUrl)
{
	const match = repoUrl.match(/https:\/\/github\.com\/([^\/]+)\/[^\/]+/);
	return match ? match[1] : null;
}

function fetchContributionData(repoUrl, token)
{
	const owner = extractOwner(repoUrl);
	const endpoint = 'https://api.github.com/graphql';
	const query = JSON.stringify({
		query: `
			query contributionData($login: String!) {
				user(login: $login) {
					contributionsCollection(from: "${new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()}", to: "${new Date().toISOString()}") {
						contributionCalendar {
							totalContributions
							weeks {
								contributionDays {
									date
									contributionCount
								}
							}
						}
					}
				}
			}
		`,
		variables: { login: owner }
	});

	const headers = {
		'Authorization': `Bearer ${token}`,
		'User-Agent': 'Node.js'
	};

	const res = request('POST', endpoint, {
		headers: headers,
		body: query
	});

	if (res.statusCode === 200)
	{
		return JSON.parse(res.getBody('utf8'));
	}
	else
	{
		throw new Error(`GitHub API responded with status code: ${res.statusCode}`);
	}
}

run();
