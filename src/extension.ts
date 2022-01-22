// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import CreateProjectTemplateCommand = require('./commands/createProjectFromTemplate');
import ProjectTemplate from './projectTemplate';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"pytemplate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pytemplate.activatePyTemplate', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-python-template!');
		vscode.commands.executeCommand('setContext', 'pyTemplate.activated', true);
	});
	context.subscriptions.push(disposable);

	let template = new ProjectTemplate(context, vscode.workspace.getConfiguration('projectTemplate'));
	context.subscriptions.push(
		vscode.commands.registerCommand('pytemplate.createProject', CreateProjectTemplateCommand.run.bind(undefined, template)));

	

}

// this method is called when your extension is deactivated
export function deactivate() {}
