import * as vscode from "vscode";
import { PreviewPanel } from "./previewPanel";
import { loadSvelteCode } from "./svelte-tools";

export function activate(context: vscode.ExtensionContext) {
  loadSvelteCode(context);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    const document = editor?.document;
    if (document?.fileName.endsWith(".svelte")) {
      PreviewPanel.panels.forEach((panel) => {
        if (!panel.locked) {
          panel.setCurrentDocument(document);
        }
      });
    }
  });

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.fileName.endsWith(".svelte")) {
      PreviewPanel.panels.get(document.fileName)?.update();
    }
  });
  vscode.workspace.onDidChangeTextDocument(({ contentChanges, document }) => {
    if (
      document.fileName.endsWith(".svelte") ||
      document.fileName.endsWith(".js") ||
      document.fileName.endsWith(".ts") ||
      document.languageId === "svelte"
    ) {
      const { rollup: useRollup } = context.workspaceState.get(
        "svelte-preview-config",
        {
          rollup: false,
        }
      );
      if (useRollup) return;
      PreviewPanel.panels.forEach((e) => e.update());
    }
  });
  context.subscriptions.push(
    vscode.commands.registerCommand("svelte-preview.componentPreview", () => {
      PreviewPanel.createOrShow(context.extensionUri, context);
    })
  );
}

export function deactivate() {}
