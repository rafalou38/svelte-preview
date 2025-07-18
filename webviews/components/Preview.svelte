<script lang="ts">
  import Controls from "./Controls.svelte";
  import "./global.css";
  import Drawer from "./drawer/drawer.svelte";
  import { transformModulesToBlobURLS } from "./modulesHandler";
  import {
    code,
    config,
    InternalsourceMap,
    log,
    panelFullHide,
    preservelog,
    vscode,
  } from "./stores";
  if (!$code) {
    $vscode?.postMessage({ type: "actualize", value: "" });
  }

  let iframe: HTMLIFrameElement;

  $: if (iframe && $code) injectPreviewInIframe();

  function dataUrl(content: string) {
    return URL.createObjectURL(new Blob([content]));
  }
  async function injectPreviewInIframe() {
    iframe.contentWindow?.location.reload();

    await new Promise((resolve) => (iframe.onload = resolve));

    if (!$code || ($code?.err.length !== 0 && $code?.js[""] === "")) return;

    const IBody = iframe.contentDocument?.body;
    if (!IBody) return console.error("contentDocument does not have a body");

    const root = document.createElement("div");
    root.className = "root";
    IBody.appendChild(root);
    const { mainModuleURI, sourceMap } = await transformModulesToBlobURLS(
      $code.js,
      $code.sources
    );
    InternalsourceMap.set(sourceMap);
    const appScript = document.createElement("script");
    appScript.setAttribute("type", "module");
    appScript.setAttribute("src", mainModuleURI);
    IBody.appendChild(appScript);

    const consoleScript = document.createElement("script");
    consoleScript.innerHTML = `
		function logger(level){
			return function(){
				const e = new Error();
				const caller = e.stack.split(/\\r\\n|\\n/)[2]?.trim();
				try{
					window.parent.postMessage(
						{
							type: 'iframeLog',
							message: [...arguments],
							level: level,
							caller
						},
						"*"
					);
				} catch (error) {
					window.parent.postMessage(
						{
							type: 'iframeLog',
							message: [error.toString(), "", 0, 0,  new Error("failed to transmit log" )],
							level: "error",
							caller
						},
						"*" 
					);
				}
			}
		}
		window.console.log = logger("info")
		window.console.info = logger("info")
		window.console.error = logger("error")
		window.console.warn = logger("warn")
		window.onerror = logger("error")
		`;
    IBody.appendChild(consoleScript);

    const style = document.createElement("style");
    style.innerHTML =
      "body{margin:0;height: 100vh;padding: 8px;box-sizing: border-box;}" +
      $code.css;
    IBody.appendChild(style);

    for (const uri of Object.keys($code.js)) {
      if(uri.startsWith("http")){
        const script = document.createElement("script");
        script.innerHTML = $code.js[uri];
        IBody.appendChild(script);
      }
    }

    applyConfig();

    if (!$preservelog) {
      $log = [];
    }
  }

  function applyConfig() {
    if (iframe?.contentDocument) {
      const IBody = iframe?.contentDocument?.body;
      const root = IBody?.querySelector(".root") as HTMLDivElement;
      if (root) {
        IBody.style.display = $config.center ? "grid" : "";
        IBody.style.placeItems = "center";
        root.style.width = $config.center ? `max-content` : "auto";
        root.style.height = $config.center ? `max-content` : "auto";

        root.style.transform = `scale(${$config.zoom})`;
        root.style.transformOrigin = $config.center ? "" : `top left`;

        IBody.style.background = $config.activeBg ? $config.bg : "#fff0";
      }
    }
  }

  $: $config, applyConfig();
</script>

<div class="wrapper">
  {#if !$panelFullHide}
    <Controls />
  {/if}
  <div class="preview" style={$config.activeBg ? `--bg: ${$config.bg}` : ""}>
    <iframe title="preview" bind:this={iframe} />
  </div>
  <Drawer />
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
  .preview {
    position: relative;
    flex-grow: 1;
    background: var(--bg);
    background-repeat: no-repeat;
    background-size: contain;

    & > * {
      border: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
