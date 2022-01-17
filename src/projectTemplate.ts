import * as vscode from 'vscode';
import fs = require('fs');
import path = require('path');

export default class ProjectTemplate {
    config: vscode.WorkspaceConfiguration;
    econtext: vscode.ExtensionContext;

    constructor(econtext: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        this.config = config;
        this.econtext = econtext;
    }

    public updateConfiguration(config: vscode.WorkspaceConfiguration) {
        this.config = config;
    }

    public async selectWorkspace(args: any) : Promise<string> {
        let workspace : string = "";
        if (args && args.fsPath) {
            workspace = args.fsPath;
        } else if (vscode.workspace.workspaceFolders) {
            if (vscode.workspace.workspaceFolders?.length === 1) {
                workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
            } else if (vscode.workspace.workspaceFolders?.length > 1) {
                let ws = await vscode.window.showWorkspaceFolderPick();
                if (ws) {
                    workspace = ws.uri.fsPath;
                }
            }
        }
        return workspace;
    }

    private getDefaultTemplateDir(): string {
        // extract from log path
        let userDataDir : string | undefined = this.econtext.storageUri?.path;
        if (!userDataDir) {
            userDataDir = this.econtext.logUri.path;
            let basePath : string = path.dirname(path.dirname(path.dirname(path.dirname(userDataDir))));
            userDataDir = path.join(basePath, 'User', 'template');
        } else {
            // get parent of parent of parent to remove workspaceStorage/<UID>/<extension>
            let basePath = path.dirname(path.dirname(path.dirname(userDataDir)));
            // add subfolder 'template'
            userDataDir = path.join(basePath, 'template');
        }
        return userDataDir;
    }
}