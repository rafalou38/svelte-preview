import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import * as svelte from "./svelte-tools";
import * as rollup from "./rollup-version";
import * as path from "path";
import { IResult } from "./ambient";
import { fetchExternalStyles } from "./fetchExternalStyles";

export class PreviewPanel {
  public static panels = new Map<string, PreviewPanel>();

  public static readonly viewType = "preview";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  private document: vscode.TextDocument | undefined;

  private context: vscode.ExtensionContext | undefined;

  public locked = true;

  public static createOrShow(
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    const document = vscode.window.activeTextEditor?.document;
    const currentFile = document?.fileName;
    if (
      currentFile &&
      (document?.languageId === "svelte" || currentFile?.endsWith(".svelte"))
    ) {
      const column = vscode.ViewColumn.Beside;

      const existingPanel = PreviewPanel.panels.get(currentFile);

      if (existingPanel) {
        existingPanel._panel.reveal(column);
        existingPanel._update();
        return;
      }
      const workspaceURIS =
        vscode.workspace.workspaceFolders?.map((folder) => folder.uri) || [];
      const panel = vscode.window.createWebviewPanel(
        PreviewPanel.viewType,
        path.basename(currentFile) + " - preview",
        column,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "out/compiled"),
            vscode.Uri.joinPath(extensionUri, "node_modules", "@vscode"),
            ...workspaceURIS,
          ],
        }
      );
      panel.iconPath = vscode.Uri.joinPath(extensionUri, "media/logo.png");
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

  setCurrentDocument(document: vscode.TextDocument | undefined) {
    if (!document?.fileName || this.document?.fileName === document.fileName)
      return;
    this._panel.reveal(vscode.ViewColumn.Beside);
    this._panel.title = path.basename(document?.fileName) + " - preview";
    this.document = document;
    const webview = this._panel.webview;
    webview.html = this._getHtmlForWebview(webview);
    this._update();
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

    const webview = this._panel.webview;
    webview.html = this._getHtmlForWebview(webview);

    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "actualize": {
          this.update();
          break;
        }
        case "editConfig": {
          const { rollup: oldRollup } = this.context?.workspaceState.get(
            "svelte-preview-config"
          ) || {
            rollup: false,
          };

          this.context?.workspaceState.update(
            "svelte-preview-config",
            data.value
          );

          if (oldRollup !== data.value.rollup) {
            this.update();
          }
          break;
        }
        case "updateLock": {
          this.locked = data.value;
          break;
        }
        case "reveal": {
          const document = await vscode.workspace.openTextDocument(
            data.value.file
          );
          await vscode.window.showTextDocument(document);
          break;
        }
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

    // this._update();

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

  private async sendCode() {
    const startTime = Date.now();
    const { rollup: useRollup } = this.context?.workspaceState.get(
      "svelte-preview-config"
    ) || {
      rollup: false,
    };
    let result: IResult | undefined;
    if (useRollup) {
      result = await rollup.generate(
        this.document?.getText() || "",
        this.document?.fileName || "",
        "",
        false,
        true,
        ".root"
      );
    } else {
      result = await svelte.generate(
        this._panel.webview,
        this.document?.getText() || "",
        this.document?.fileName || "",
        "",
        false,
        true,
        ".root"
      );
    }
    const config = await this._getConfig();
    if (config.externalStyles?.length > 0) {
      result.css += fetchExternalStyles(config.externalStyles);
    }
    result.startTime = startTime;
    this._panel.webview.postMessage({
      type: "codeUpdate",
      value: result,
    });
  }
  private async _getConfig() {
    const intitial = {
      center: false,
      bg: "#fff0",
      zoom: "1",
      rollup: false,
      saveReload: false,
      externalStyles: [],
    };
    return {
      ...intitial,
      ...this.context?.workspaceState.get("svelte-preview-config", intitial),
    };
  }
  private async sendConfig() {
    const config = await this._getConfig();

    this._panel.webview.postMessage({
      type: "setConfig",
      value: config,
    });
    this._panel.webview.postMessage({
      type: "setLock",
      value: this.locked,
    });
  }
  private async _update() {
    this.sendCode();
    this.sendConfig();
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/preview.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/preview.css")
    );
    const toolkitUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules",
        "@vscode",
        "webview-ui-toolkit",
        "dist",
        "toolkit.js"
      )
    );

    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules",
        "@vscode",
        "codicons",
        "dist",
        "codicon.css"
      )
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return /*html*/ `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link href="${styleMainUri}" rel="stylesheet">
          <link href="${codiconsUri}" rel="stylesheet" />
				</head>
				<body>
        <script type="module" src="${toolkitUri}"></script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>`;
  }
}
