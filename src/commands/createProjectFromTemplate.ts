'use strict';

import * as vscode from 'vscode';
import ProjectTemplate from '../projectTemplate';

export async function run(template: ProjectTemplate, args: any) {
    let workspace = await template.selectWorkspace(args);
    if (!workspace) {
        vscode.window.showErrorMessage("No workspace selected");
        return;
    }

    // load latest configuration
    template.updateConfiguration(vscode.workspace.getConfiguration('projectTemplate'));
    console.debug('template update configuration.');
    template.createFromTemplate(workspace).then(
        (templateName: string | undefined) => {
            if (templateName) {
                vscode.window.showInformationMessage("Created project from template '" + template + "'");
            }
        },
        (reason: any) => {
            vscode.window.showErrorMessage("Failed to create project from template: " + reason);
        }
    );
}
