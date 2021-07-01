import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import * as svelte from "./svelte-tools";
import * as path from "path";

export class PreviewPanel {
  public static panels = new Map<string, PreviewPanel>();

  public static readonly viewType = "preview";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  private document: vscode.TextDocument | undefined;

  private context: vscode.ExtensionContext | undefined;

  public static createOrShow(
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    const currentFile = vscode.window.activeTextEditor?.document.fileName;
    if (currentFile && currentFile?.endsWith(".svelte")) {
      const column = vscode.ViewColumn.Beside;

      const existingPanel = PreviewPanel.panels.get(currentFile);

      if (existingPanel) {
        existingPanel._panel.reveal(column);
        existingPanel._update();
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        PreviewPanel.viewType,
        "Preview",
        column,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "svelte"),
            vscode.Uri.joinPath(extensionUri, "out/compiled"),
          ],
        }
      );

      PreviewPanel.panels.set(
        currentFile,
        new PreviewPanel(
          panel,
          extensionUri,
          vscode.window.activeTextEditor?.document,
          context
        )
      );
    } else {
      console.log("no file opened or not .svelte: ", currentFile);
    }
  }

  public static kill() {
    PreviewPanel.panels.forEach((panel) => {
      panel.dispose();
    });
    PreviewPanel.panels.clear();
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    document: vscode.TextDocument | undefined,
    context: vscode.ExtensionContext
  ) {
    this.context = context;

    this.document = document;

    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }
  public update() {
    this._update();
  }
  public dispose() {
    for (const [file, panel] of PreviewPanel.panels.entries()) {
      if (panel === this) {
        PreviewPanel.panels.delete(file);
        console.log("disposed", file, this);
      }
    }

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = await this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/preview.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/preview.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return /*html*/ `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleResetUri}" rel="stylesheet">
					<link href="${styleVSCodeUri}" rel="stylesheet">
					<link href="${styleMainUri}" rel="stylesheet">
				</head>
				<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>`;
  }
}
