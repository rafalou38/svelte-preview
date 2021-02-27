import * as vscode from "vscode";
import { PreviewPanel } from "./previewPanel";

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "svelte-preview" is now active!'
	);
	vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
		if (document.fileName.endsWith(".svelte")) {
			PreviewPanel.panels.get(document.fileName)?.update();
		}
	});
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"svelte-preview.componentPreview",
			() => {
				PreviewPanel.createOrShow(context.extensionUri);
			}
		)
	);
}

export function deactivate() {}
