const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const moment = require('moment');

async function run() {
  try {
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
    core.setOutput('message', 'The file has been updated.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
