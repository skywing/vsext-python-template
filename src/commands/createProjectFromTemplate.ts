'use strict';

import * as vscode from 'vscode';
import ProjectTemplate from '../projectTemplate';

export async function run(template: ProjectTemplate, args: any) {
    let workspace = await template.selectWorkspace(args);
    if (!workspace) {
        vscode.window.showErrorMessage("No workspace selected");
    }

    // load latest configuration
    template.updateConfiguration(vscode.workspace.getConfiguration('projectTemplate'));

}
