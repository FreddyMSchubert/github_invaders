const core = require('@actions/core');
const simpleGit = require('simple-git');
const generateSVG = require('./generate_svg');
const fs = require('fs');

async function run() {
  try {
    const git = simpleGit();
    const filePath = 'output.svg';
    const branchName = 'github_defenders_output';

    await generateSVG();

    await git.addConfig('user.name', '🤖github_invaders_bot');
    await git.addConfig('user.email', 'action@github.com');

    // Reset the branch
    await git.fetch();
    try {
      await git.branch(['-D', branchName]);  // Delete if exists
      console.log(`Deleted branch ${branchName}`);
    } catch (error) {
      console.log(`Branch ${branchName} does not exist or was already deleted: ${error}`);
    }

    await git.checkout(['--orphan', branchName]);  // Create fresh orphan branch

    await git.rm(['-r', '.']);  
    await git.clean('f', ['-d']);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }

    await git.add(filePath);
    await git.commit('Update output.svg with current time');
    await git.push(['--force', 'origin', branchName]);

    core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
  } catch (error) {
    core.setFailed(error.message);
    console.log(`Error: ${error.message}`);
  }
}

run();
