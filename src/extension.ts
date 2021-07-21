import * as vscode from "vscode";
import { PreviewPanel } from "./previewPanel";
import { loadSvelteCode } from "./svelte-tools";

export function activate(context: vscode.ExtensionContext) {
  loadSvelteCode(context);

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.fileName.endsWith(".svelte")) {
      PreviewPanel.panels.get(document.fileName)?.update();
    }
  });
  vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
    if (document.fileName.endsWith(".svelte")) {
      const { rollup: useRollup } = context.workspaceState.get(
        "svelte-preview-config",
        {
          rollup: false,
        }
      );
      if (useRollup) return;
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
