import * as vscode from "vscode";
import { PreviewPanel } from "./previewPanel";

export function activate(context: vscode.ExtensionContext) {
	console.log(
		'Congratulations, your extension "svelte-preview" is now active!'
	);

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
