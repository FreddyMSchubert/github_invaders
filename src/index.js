const core = require('@actions/core');
const fs = require('fs');
const moment = require('moment');
const simpleGit = require('simple-git');

async function run() {
  try {
    const git = simpleGit();

    const filePath = core.getInput('file-path');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const timestamp = moment().format();
    const startTag = '<!--START_SECTION:github_invaders-->';
    const endTag = '<!--END_SECTION:github_invaders-->';

    const newText = `${startTag}\nThis text was automatically generated using a workflow from repo github_invaders at ${timestamp}\n${endTag}`;

    let newFileContent;
    if (fileContent.includes(startTag)) {
      // Replace existing section
      const start = fileContent.indexOf(startTag);
      const end = fileContent.indexOf(endTag) + endTag.length;
      newFileContent = fileContent.substring(0, start) + newText + fileContent.substring(end);
    } else {
      // Append new section
      newFileContent = fileContent + '\n' + newText;
    }

    fs.writeFileSync(filePath, newFileContent, 'utf8');

    await git.add(filePath);
    await git.commit('Automatically update README.md via github_invaders');
    await git.push();

    core.setOutput('message', 'The file has been updated, committed & pushed.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
