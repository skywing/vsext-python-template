# A Visual Studio Code Python Development Baseline Template
 
This a baseline starter template for a typical Python development following the modern build and packaging conventions. It utilizes popular libraries for unit test, code coverage, common security scan, code documentation, and configuration file management.

## Creating and Using Virtual Environments
```python
python -m venv .venv
```

### Activating virtual environment
```zsh
source ./.venv/bin/activate
```
 
## Folder structure
- .vscode - Visual Studio Code workspace settings
- config/ - sample configuration files used in the project
- src/ - Python source code should be in this folder
- tests/ - Unit test cases
- test/runtime - Test files (config, data, etc.) not checked into source control
 
## VS Code workspace settings
 
### Python debugging
- Python: Current -> Debug current file
- Python: Remote -> Attach debugger to remote process. 5678 is the default port used in Python debugger
 
### Pytest Unit Test
1. Use `⇧⌘P, F1` in mac os or `Ctrl+Shift+P, F1` in windows to bring up the command palette
2. Type `Python: Configure Tests`
3. Select `pytest` as testing framework
4. Select the `tests` folder where the unit test code in
5. Makesure `.env` file with `PYTHONPATH=./src` is in the project root folder as it is needed for VS Code Testing sidebar to discover test cases in the `tests` folder specified above.
 
### Code Coverage
Coverage is used with Pytest to create code coverage report when executing Pytest. For coverage quick start, go to [coverage-quickstart].
 
1. Run coverage with pytest. To limit the scope of code coverage to your code, you need to add the --source=/path/to/your/python_source_code so the report only have code coverage matrix for your code
 
```console
coverage run --source=./src -m pytest tests/
```
2. Run the following command in terminal to see the report
```console
coverage report -m
```
3. The following command will create a HTML detail code coverage report with the condition you need to run the coverage first
```console
coverage html
```

### Pylance + Pylint
Pylance is an extension that works alongside Python in Visual Studio Code to provide performant language support. Under the hood, Pylance is powered by Pyright, Microsoft's static type checking tool. Using Pyright, Pylance has the ability to supercharge your Python IntelliSense experience with rich type information, helping you write better code faster.

Pylint is a source-code, bug and quality checker for the Python programming language. It is named following a common convention in Python of a "py" prefix, and a nod to the C programming lint program. It follows the style recommended by PEP 8, the Python style guide.


### Logging
Example of configuring logging by using TOML configuration file. Setup and organize loggers in a hierachy with different type of handlers and formatters.

```toml
version = 1
disable_exsiting_loggers = false

[formatters.simple]
format = '[%(asctime)s.%(msecs)03d [%(threadName)s] %(module)s %(levelname)s] - %(message)s]'
datefmt = '%H:%M:%S'

[handlers.console]
class = 'logging.StreamHandler'
level = 'INFO'
formatter = 'simple'
stream = 'ext://sys.stdout'

[handlers.file-rotating]
class = 'logging.handlers.TimedRotatingFileHandler'
filename = './tests/runtime/logs/app.log'
level = 'DEBUG'
formatter = 'simple'
when = 'D'

[loggers.util]
level = 'DEBUG'
propagate = true

[root]
level = 'DEBUG'
handlers = ['console', 'file-rotating']
```
 
### VS code Python settings
The following will setup Visual Studio Code to use Pylance for linting Python code with basic type checking. It enable the Pytest for running unit tests, set "./tests" as where the unit tests are ,and exclude some runtime folders from Python, git, OS, and etc. The settings also let the terminal to know where to search Python code/modules when running Python code in the integrated terminal. 
 
```json
{
    "python.languageServer": "Pylance",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true,
    "python.analysis.typeCheckingMode": "basic",
    "python.analysis.autoSearchPaths": true ,
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/__pycache__": true,
        "**/.pytest_cache": true
    },
    "python.testing.pytestArgs": [
        "tests"
    ],
    "python.testing.unittestEnabled": false,
    "python.testing.pytestEnabled": true,
    "terminal.integrated.env.osx": {
        "PYTHONPATH": "${workspaceFolder}/src"
    },
}
```
 
## Python Library Installation and Dependency Management
 
### Library installation with pipenv
Same as pip, third party libraries should be installed from the bank Nexus repository. It is not recommend, but if you run into SSL verification issue, you can set the verify_ssl to false until you resolve the certification issue.

 
## Contribution workflow
 
Here's how we suggest you to go about proposing a change to this project:
 
1. [Fork this project][fork] to your account.
2. [Create a branch][branch] for the change you intent to make.
3. Make your changes to your fork.
4. [Send a pull request][pr] from your fork's branch to our `master` branch.
 
[fork]: https://help.github.com/articles/fork-a-repo/
[branch]: https://help.github.com/articles/creating-and-deleting-branches-within-your-repository
[pr]: https://help.github.com/articles/using-pull-requests/
[coverage-quickstart]: https://coverage.readthedocs.io/en/coverage-5.5/#quick-start
 