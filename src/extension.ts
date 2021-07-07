import * as vscode from "vscode";
import { PreviewPanel } from "./previewPanel";
import { loadSvelteCode } from "./svelte-tools";

export function activate(context: vscode.ExtensionContext) {
  loadSvelteCode(context);

  vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
    if (document.fileName.endsWith(".svelte")) {
      PreviewPanel.panels.get(document.fileName)?.update();
    }
  });
  context.subscriptions.push(
    vscode.commands.registerCommand("svelte-preview.componentPreview", () => {
      PreviewPanel.createOrShow(context.extensionUri, context);
    })
  );
}

export function deactivate() {}
