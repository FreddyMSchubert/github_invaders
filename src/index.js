const core = require('@actions/core');
const simpleGit = require('simple-git');
const generateSVG = require('./generate_svg');
const fs = require('fs');
const path = require('path');

async function run() {
    const svgFileName = 'output.svg';
    const githubToken = core.getInput('github-token', { required: true });
    const generatedFilePath = path.join(__dirname, svgFileName);
    const targetBranchName = 'github_defenders_output';
    const repoUrl = core.getInput('repo-url', { required: true });

    await generateSVG(generatedFilePath);

  try {

    // clone target repo
    const repoWithTokenUrl = repoUrl.replace('https://', `https://x-access-token:${githubToken}@`);
    const cloneDir = path.join('/tmp', 'github_defenders_output_repo');
    await simpleGit().clone(repoWithTokenUrl, cloneDir, {
        '--depth': 1
    });

    const targetGit = simpleGit(cloneDir);
    await targetGit.addConfig('user.name', 'GitHub Action Bot');
    await targetGit.addConfig('user.email', 'action@github.com');

    const branchSummary = await targetGit.branch();
    if (branchSummary.all.includes(targetBranchName)) {
        // Checkout and clean up the existing branch
        await targetGit.checkout(targetBranchName);
        await targetGit.raw(['rm', '-rf', '.']);
        await targetGit.clean('f', ['-dx']);
        await targetGit.raw(['commit', '--allow-empty', '-m', 'Clean up branch']);
    } else {
        // Create as an orphan if it does not exist
        await targetGit.checkout(['--orphan', targetBranchName]);
    }

    // Copy the generated SVG to the root of the cloned repo
    await fs.copyFile(generatedFilePath, path.join(cloneDir, svgFileName));

    // Add, commit, and push the changes
    await targetGit.add(svgFileName);
    await targetGit.commit('Update output.svg with current time');
    await targetGit.push(['--force', 'origin', targetBranchName]);

    core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
