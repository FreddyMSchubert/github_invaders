const core = require('@actions/core');
const { execSync } = require('child_process');
const generateSVG = require('./generate_svg');
const fs = require('fs');
const path = require('path');

function run()
{
	const svgFileName = 'output.svg';
	const githubToken = core.getInput('github-token', { required: true });
	const generatedFilePath = path.join(__dirname, svgFileName);
	const targetBranchName = 'github_defenders_output';
	const repoUrl = core.getInput('repo-url', { required: true });

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

run();
