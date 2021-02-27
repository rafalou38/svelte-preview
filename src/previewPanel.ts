import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class PreviewPanel {
	public static panels = new Map<string, PreviewPanel>();

	public static readonly viewType = "preview";

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	private document: vscode.TextDocument | undefined;

	public static createOrShow(extensionUri: vscode.Uri) {
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
					vscode.window.activeTextEditor?.document
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

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		console.log("revive");
	}

	private constructor(
		panel: vscode.WebviewPanel,
		extensionUri: vscode.Uri,
		document: vscode.TextDocument | undefined
	) {
		this.document = document;

		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// // Handle messages from the webview
		// this._panel.webview.onDidReceiveMessage(
		//   (message) => {
		//     switch (message.command) {
		//       case "alert":
		//         vscode.window.showErrorMessage(message.text);
		//         return;
		//     }
		//   },
		//   null,
		//   this._disposables
		// );
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

		this._panel.webview.html = this._getHtmlForWebview(webview);
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
				// case "tokens": {
				//   await Util.globalState.update(accessTokenKey, data.accessToken);
				//   await Util.globalState.update(refreshTokenKey, data.refreshToken);
				//   break;
				// }
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// // And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "svelte", "main.js")
		);

		// const cssUri = webview.asWebviewUri(
		// 	vscode.Uri.joinPath(
		// 		this._extensionUri,
		// 		"out",
		// 		"compiled/swiper.css"
		// 	)
		// );

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<!--
							Use a content security policy to only allow loading images from https or from our extension directory,
							and only allow scripts that have a specific nonce.
				-->
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!--
				<script defer type="module" src="${scriptUri}" nonce="${nonce}"></script>-->
			</head>
			<body>
				<pre>
${this.document
	?.getText()
	.replace(/</gm, "&#60;")
	.replace(/>/gm, "&#62;")
	.replace(/"/gm, "&#34;")}
				</pre>
			</body>
		</html>
		`;
	}
}
