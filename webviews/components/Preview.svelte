<script lang="ts">
  import Controls from "./Controls.svelte";
	import './global.css';
	import Drawer from "./drawer/drawer.svelte"
import { transformModulesToBlobURLS } from "./modulesHandler";
  import { code, config, InternalsourceMap, vscode } from "./stores";
  if (!$code) {
    $vscode?.postMessage({ type: "actualize", value: "" });
  }

  let iframe: HTMLIFrameElement;

  $: if (iframe && $code) injectPreviewInIframe();

	function dataUrl(content:string) {
		return URL.createObjectURL(new Blob([content]))
	}
  async function injectPreviewInIframe() {
    iframe.contentWindow?.location.reload();

    await new Promise((resolve) => (iframe.onload = resolve));

    if ($code?.err.length !== 0) return;

    const IBody = iframe.contentDocument?.body;
    if (!IBody) return console.error("contentDocument does not have a body");

    const root = document.createElement("div");
    root.className = "root";
    IBody.appendChild(root);
		const {mainModuleURI, sourceMap} = transformModulesToBlobURLS($code.js)
		InternalsourceMap.set(sourceMap)
    const appScript = document.createElement("script");
    appScript.setAttribute("type", "module");
		appScript.setAttribute("src", mainModuleURI)
    IBody.appendChild(appScript);

    const consoleScript = document.createElement("script");
		consoleScript.innerHTML = `
		function logger(level){
			return function(){
				const e = new Error();
				const caller = e.stack.split(/\\r\\n|\\n/)[2]?.trim();
				window.parent.postMessage(
					{
						type: 'iframeLog',
						message: [...arguments],
						level: level,
						caller
					},
					"*"
				);
			}
		}
		window.console.log = logger("info")
		window.console.warn = logger("warn")
		window.onerror = logger("error")
		`
    IBody.appendChild(consoleScript);

    const style = document.createElement("style");
    style.innerHTML = "body{margin:0;height: 100vh;padding: 8px;box-sizing: border-box;}" + $code.css;
    IBody.appendChild(style);

    applyConfig();
  }

  function applyConfig() {
    if (iframe?.contentDocument) {
      const IBody = iframe?.contentDocument?.body;
      const root = IBody?.querySelector(".root") as HTMLDivElement;
      if (root) {
        IBody.style.display = $config.center ? "grid" : "";
        IBody.style.placeItems = "center";
        root.style.width = $config.center ?`max-content` : "auto";
        root.style.height = $config.center ?`max-content` : "auto";


        root.style.transform = `scale(${$config.zoom})`;
        root.style.transformOrigin = $config.center ? "" : `top left`;

        IBody.style.background = $config.activeBg ? $config.bg : "#fff0";
      }
    }
  }

  $: $config, applyConfig();
</script>

<div class="wrapper">
  <Controls />
  <iframe title="preview" bind:this={iframe} />
  {#if $code?.err}
    <ul class="errors">
      {#each $code?.err as error}
        <li class="error">
          <span class="msg">{error.message}</span>
          <span>({error.start.line}:{error.start.column})</span>
        </li>
      {/each}
    </ul>
  {/if}
	<Drawer></Drawer>
</div>

<style lang="scss">
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  :global(body.center) {
    display: grid;
    place-items: center;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  iframe {
    flex-grow: 1;
    border: none;
  }
  .errors {
    border-radius: 1rem 1rem 0 0;
    background: var(--vscode-editorError-foreground);
    color: white;
    margin: 0 1rem;
    padding: 0;
  }
  .error {
    margin: 0;
    padding: 2rem;
    list-style: none;
    display: flex;
    justify-content: space-between;
    & + & {
      border-top: 3px solid #00000012;
    }
    span {
      font-size: 20px;
    }
		.msg{
			max-width: 80%;
			white-space: pre-wrap;
			font-family: var(--vscode-editor-font-family);
		}
  }
</style>
