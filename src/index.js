const core = require('@actions/core');
const simpleGit = require('simple-git');
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
		simpleGit().clone(repoWithTokenUrl, cloneDir, { '--depth': 1 });

		const targetGit = simpleGit(cloneDir);
		targetGit.addConfig('user.name', 'GitHub Action Bot');
		targetGit.addConfig('user.email', 'action@github.com');

		const branchSummary = targetGit.branch();
		if (branchSummary.all.includes(targetBranchName))
		{
			// Checkout and clean up the existing branch
			targetGit.checkout(targetBranchName);
			targetGit.raw(['rm', '-rf', '.']);
			targetGit.clean('f', ['-dx']);
			targetGit.raw(['commit', '--allow-empty', '-m', 'Clean up branch']);
		}
		else
		{
			// Create as an orphan if it does not exist
			targetGit.checkout(['--orphan', targetBranchName]);
		}

		// Copy the generated SVG to the root of the cloned repo
		fs.copyFileSync(generatedFilePath, path.join(cloneDir, svgFileName));

		targetGit.add(svgFileName);
		targetGit.commit('Update output.svg with current time');
		targetGit.push(['--force', 'origin', targetBranchName]);

		core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
	}
	catch (error)
	{
		core.setFailed(error.message);
	}
}

run();
