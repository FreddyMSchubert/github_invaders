const core = require('@actions/core');
const simpleGit = require('simple-git');
const generateSVG = require('./generate_svg');

async function run() {
  try {
    const git = simpleGit();
    const filePath = 'output.svg';
    const branchName = 'github_defenders_output';

    console.log(`Current working directory: ${process.cwd()}`);

    // Generate SVG
    await generateSVG();

    // Git configurations
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

    await git.checkout(['--orphan', branchName]);  // Create a fresh orphan branch
    console.log(`Checked out to orphan branch ${branchName}`);

    // Clear all files in the directory
    await git.rm(['-r', '.']);  
    await git.clean('f', ['-d']);
    console.log("Cleared all files in the directory");

    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }

    await git.add(filePath);
    console.log("Added file to git");

    await git.commit('Update output.svg with current time');
    console.log("Committed changes");

    await git.push(['--force', 'origin', branchName]);
    console.log("Pushed to remote");

    core.setOutput('message', 'SVG file has been updated, committed & pushed on a clean branch.');
  } catch (error) {
    core.setFailed(error.message);
    console.log(`Error: ${error.message}`);
  }
}

run();
