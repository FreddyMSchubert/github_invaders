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

    // Ensure the branch exists or create it
    try {
      await git.fetch();
      await git.checkout(branchName);
    } catch (error) {
      await git.checkoutLocalBranch(branchName);
    }

    // Git operations
    await git.add(filePath);
    await git.commit('Update output.svg with current time');
    await git.push(['-u', 'origin', branchName]);

    core.setOutput('message', 'SVG file has been updated, committed & pushed.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
