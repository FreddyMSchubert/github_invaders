# Github Invaders Changelog

> 3 - Fetching & displaying contribution data

#### [0.3.1] - 16.06.2024
- Added proper logging function of contribution data, to check whether received data is correct

### [0.3.0] - 16.06.2024
- Theoretical synchoronous contribution data fetching, which for now just gets logged

> 2 - Generic SVG pushed to seperate branch

#### [0.2.13] - 16.06.2024
- index.js efficiency improvements, wider svg
- Removed simplegit package, packages reload

#### [0.2.12] - 16.06.2024
- Replaced simplegit with a more manual solution, using execSync and running strings as shell commands, because simplegit only works async.

#### [0.2.11] - 16.06.2024
- Removed async / await functionality for simplicity
- Tab / Spaces situation cleanup

#### [0.2.10] - 15.06.2024
- Updated repository cloning url, including github token

#### [0.2.9] - 15.06.2024
- Added a repourl logging statement, that's it.

#### [0.2.8] - 15.06.2024
- Fixed incorrect file writing call i generate svg

#### [0.2.7] - 15.06.2024
- Target repo confusion logic fixes
- Added github token input, it's required

#### [0.2.6] - 15.06.2024
- Various minor tweaks

#### [0.2.5] - 15.06.2024
- Added missing fs import, removed some unnecessary logging

#### [0.2.4] - 15.06.2024
- Added extensive logging to index.js, as it still can't find the output file

#### [0.2.3] - 15.06.2024
- Fixed generateSVG using a synchronous file writing method
- Made svg wider so time is fully readable

#### [0.2.2] - 15.06.2024
- Fixed svg generation taking too long, making program get out of sync

#### [0.2.1] - 15.06.2024
- Fixed weird git branching issues, by just deleting and recreating a clean branch every time the script updates

### [0.2.0] - 15.06.2024
- Removed line update functionality, instead made generate_svg.js file that generates an svg of the current timestamp. This is pushed to a new branch, github_defenders_output, from where it can be referenced by the README on main
- removed moment package
- removed unnecessary action.yml inputs

> 1 - Basic text update workflow

#### [0.1.7] - 15.06.2024
- Reworked index.js logic to not mess up readme file

#### [0.1.6] - 15.06.2024
- Added config user.name and user.email to index.js script

#### [0.1.5] - 15.06.2024
- Fixed git object not being initialized
- removed actions/github require since it's unused

#### [0.1.4] - 15.06.2024
- Workflow runs but the file doesn't seem to have changed. Added simple-git package & committed & pushed file from the index.js script.

#### [0.1.3] - 15.06.2024
- Committed dependencies to repo. This is usually a terrible idea, but is a necessary evil here to make working with actions easier. Maybe I'll do a docker setup at some point.

#### [0.1.2] - 15.06.2024
- `action.yml` still can't be found. Moved it to root.
- Added github username & token as inputs

#### [0.1.1] - 15.06.2024
- Moved index.js into src folder & specified that in test.yml
- Fixed incorrect action file naming. Apparently it can't be anything but `action.yml`

### [0.1.0] - 15.06.2024
- Basic node project setup
- Changelog & Readme
- Basic `index.js` & `.github/action/text_writing_test/test.yml` action setup. Untested & highly theoretical.