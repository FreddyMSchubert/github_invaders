const core = require('@actions/core');
const fs = require('fs');
const moment = require('moment');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();
    const filePath = core.getInput('file-path');
    let fileContent = fs.readFileSync(filePath, 'utf8');
    const timestamp = moment().format();
    const startTag = '<!--START_SECTION:github_invaders-->';
    const endTag = '<!--END_SECTION:github_invaders-->';
    const sectionRegex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');

    const newText = `${startTag}\nThis text was automatically generated using a workflow from repo github_invaders at ${timestamp}\n${endTag}`;

    // Check if the section already exists and replace it
    if (!fileContent.match(sectionRegex))
        throw new Error('The target section was not found in the file.');
    fileContent = fileContent.replace(sectionRegex, newText);

    fs.writeFileSync(filePath, fileContent, 'utf8');

    await git.addConfig('user.name', '🤖github_invaders_bot');
    await git.addConfig('user.email', 'action@github.com');

    await git.add(filePath);
    await git.commit('Automatically update README.md via github_invaders');
    await git.push();

    core.setOutput('message', 'The file has been updated, committed & pushed.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
