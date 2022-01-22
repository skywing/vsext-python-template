import * as vscode from 'vscode';
import fs = require('fs');
import path = require('path');
import fsutils = require('./utilities/fsutils');

/**
 * Template class to handle the logic to copy file from template directory
 */
export default class ProjectTemplate {

    // local copy of workspace configuration to maintain consistency between calls
    config: vscode.WorkspaceConfiguration;
    econtext: vscode.ExtensionContext;

    constructor(econtext: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        this.config = config;
        this.econtext = econtext;
    }

    /**
     * Updates current configuration settings
     * @param config config workspace configuration
     */
    public updateConfiguration(config: vscode.WorkspaceConfiguration) {
        this.config = config;
    }

    /**
     * Select a workspace folder. If args contains an fsPath, then it uses
     * that. Otherwise, for single root workspace it will select the root directory,
     * or for multi-root present a chooser to select a workspace.
     * @param args 
     * @returns 
     */
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

    /**
     * Get the default template directory
     * @returns template direectory
     */
    private async getTemplateDir(): Promise<string> {
        let templateDir : string | undefined = this.econtext.asAbsolutePath('template');
        if (!templateDir) {
            return Promise.reject("Template directory not set.");
        }
        return Promise.resolve(templateDir);
    }

    /**
     * Populate a workspace folder with the content of a template
     * @param workspace current workspace folder to populate
     * @returns 
     */
    public async createFromTemplate(workspace: string) {
        let templateDir = await this.getTemplateDir();

        if (!fs.existsSync(templateDir) || !fs.lstatSync(templateDir).isDirectory()) {
            vscode.window.showErrorMessage("Template '" + templateDir + "' does not exists.");
            return undefined;
        }
        
        // recursively copy files, replacing placeholders as necessary
        let copyFunc = async (src: string, dest: string) => {

            if (fs.lstatSync(src).isDirectory()) {
                // create directory if doesn't exists
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest);
                } else if (!fs.lstatSync(dest).isDirectory()) {
                    // fail if file exists
                    throw new Error("Failed to create directory '" + dest + "': file with same name exists.");
                }
            } else {
                while (fs.existsSync(dest)) {
                    if (!fs.lstatSync(dest).isFile()) {
                        let reldest = path.relative(workspace, dest);
                        let variableInput = <vscode.InputBoxOptions> {
                            prompt: `Cannot overwrite "${reldest}". Please enter a new filename"`,
                            value: reldest
                        };
    
                        // get user's input
                        dest = await vscode.window.showInputBox(variableInput).then(
                            value => {
                                if (!value) {
                                    return dest;
                                }
                                return value;
                            }
                        );
                        if (!path.isAbsolute(dest)) {
                            dest = path.join(workspace, dest);
                        }
                    } else {
                        // ask if user wants to replace, otherwise prompt for new filename
                        let reldest = path.relative(workspace, dest);
                        let choice = await vscode.window.showQuickPick(["Overwrite", "Rename", "Skip", "Abort"], {
                                placeHolder: `Destination file "${reldest}" already exists. What would you like to do?`
                            });
                        
                        if (choice === "Overwrite") {
                            fs.unlinkSync(dest);
                        } else if (choice === "Rename") {
                            let variableInput = <vscode.InputBoxOptions> {
                                prompt: "Please enter a new filename",
                                value: reldest
                            };
    
                            // get user's input
                            dest = await vscode.window.showInputBox(variableInput).then(
                                value => {
                                    if (!value) { return dest; }
                                    return value;
                                }
                            );
    
                            // if not absolute path, make workspace-relative
                            if (!path.isAbsolute(dest)) {
                                dest = path.join(workspace, dest);
                            }
                        } else if (choice === "Skip") {
                            // skip
                            return true;
                        } else {
                            // abort
                            return false;
                        }
                    }
                }
                // get src file contents
                let fileContents : Buffer = fs.readFileSync(src);
                let parent = path.dirname(dest);
                fsutils.mkdirSync(parent);
                fs.writeFileSync(dest, fileContents);
            }
            return true;
        };
        await this.recursiveApplyInDir(templateDir, workspace, copyFunc);
        return templateDir;
    }

    private async recursiveApplyInDir(src: string, dest: string, func: (src: string, dest: string) => Promise<boolean>): Promise<boolean> {
        let success = await func(src, dest);
        if (!success) {
            return false;
        }

        if (fs.lstatSync(src).isDirectory()) {
            const entries: string[] = fs.readdirSync(src);
            for (let entry of entries) {
                const srcPath = path.join(src, entry);
                const destPath = path.join(dest, entry);

                success = await this.recursiveApplyInDir(srcPath, destPath, func);
                if (!success) {
                    return false;
                }
            }
        }
        return true;
    }
}