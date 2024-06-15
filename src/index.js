const core = require('@actions/core');
const simpleGit = require('simple-git');
const generateSVG = require('./generate_svg');

async function run() {
  try {
    const git = simpleGit();
    const filePath = 'output.svg';
    const branchName = 'github_defenders_output';

    // Generate SVG
    generateSVG();

    // Git configurations
    await git.addConfig('user.name', '🤖github_invaders_bot');
    await git.addConfig('user.email', 'action@github.com');

    // Reset the branch
    await git.fetch();
    try {
      await git.branch(['-D', branchName]);  // Delete if exists
    } catch (error) {
      console.log(`Branch ${branchName} does not exist or was already deleted.`);
    }
    await git.checkout(['--orphan', branchName]);  // Create a fresh orphan branch

    // Git operations
    await git.rm(['-r', '.']);  // Clear all files in the directory
    await git.clean('f', ['-d']);  // Clean untracked files and directories
    await git.add(filePath);
    await git.commit('Update output.svg with current time');
    await git.push(['--force', 'origin', branchName]);

    core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
