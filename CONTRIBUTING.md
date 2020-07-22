# Contributing
Pull requests and issues are welcome! For all contributions, please:

1. Read the [Contributing](CONTRIBUTING.md)
2. Search the existing [issues](https://github.com/KieranFleckney/Battle-Lines/issues) and [pull requests](https://github.com/KieranFleckney/Battle-Lines/pulls) to make sure your contribution isn't a duplicate

## Issues

If you're submitting a bug, please include the environment (browser/node) and relevant environment version(s) that you have encountered the bug in.

## Pull Requests

*Important: if you are submitting a pull request that does not address an open issue in the issue tracker, it would be a very good idea to create an issue to discuss your proposed changes/additions before working on them.*

1. Fork the repo on GitHub.
2. Install dependencies with `npm install`
3. Create a topic branch and make your changes.
4. (Optional) Run `npm run test` to test your code with jasmine
5. Run `npm run build` to make sure it complies
6. Submit a pull request to merge your topic branch into `master`.

**Developing**

You can use `npm run tsc:w` to start the typescript compiler and watch for changes. This will help to check for errors and keep unused code out of the library. I would recommend using the TextRenderer when developing a new Mode.

### Commits Message
I use a very similar commit message guidelines as angular. This help to make looking the histroy of the project easier.

Commit Message Format
Each commit message consists of a header, a body and a footer. The header has a special format that includes a type and subject.

&lt;type&gt;: &lt;subject&gt;

&lt;BLANK LINE&gt;

&lt;body&gt;

&lt;BLANK LINE&gt;

&lt;footer&gt;


The header is mandatory.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

The footer should contain a closing reference to an issue if any.

**Example**

fix: incorrect config name

**Revert**

If the commit reverts a previous commit, it should begin with revert: , followed by the header of the reverted commit. In the body it should say: This reverts commit &lt;hash&gt;,where the hash is the SHA of the commit being reverted.

**Type**

Must be one of the following:

build: Changes that affect the build system or external dependencies

ci: Changes to our CI configuration files and scripts

docs: Documentation only changes

feat: A new feature

fix: A bug fix

perf: A code change that improves performance

refactor: A code change that neither fixes a bug nor adds a feature

style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)

test: Adding missing tests or correcting existing tests

**Subject**

The subject contains a succinct description of the change:

use the imperative, present tense: "change" not "changed" nor "changes"
don't capitalize the first letter
no dot (.) at the end

**Body**

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior. Each line does not exceed 100 characters.

**Footer**

The footer should contain any information about Breaking Changes and is also the place to reference GitHub issues that this commit Closes.

Breaking Changes should start with the word BREAKING CHANGE: with a space or two newlines. The rest of the commit message is then used for this.

**Simple Example**

fix: Change one of clashmode config name

Change the config name ColourTwoChancePercent to ColourTwoBiasFactor as it miss represents what
it does.

BREAKING CHANGE: config name change for clashmode
