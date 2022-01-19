<script lang="ts">
  import Controls from "./Controls.svelte";
  import "./global.css";
  import Drawer from "./drawer/drawer.svelte";
  import { transformModulesToBlobURLS } from "./modulesHandler";
  // import { updateVariables } from "./persist/persist";
  import {
    code,
    config,
    InternalsourceMap,
    log,
    preservelog,
    previewIframe,
    vscode,
  } from "./stores";
  import SideBar from "./persist/SideBar.svelte";
  import { updateVariables } from "./persist/persist";
  if (!$code) {
    $vscode?.postMessage({ type: "actualize", value: "" });
  }

  $: if ($previewIframe && $code) injectPreviewInIframe();

  function dataUrl(content: string) {
    return URL.createObjectURL(new Blob([content]));
  }
  async function injectPreviewInIframe() {
    if (!$previewIframe) return;
    $previewIframe.contentWindow?.location.reload();

    await new Promise((resolve) => ($previewIframe!.onload = resolve));

    if ($code?.err.length !== 0) return;

    const IBody = $previewIframe.contentDocument?.body;
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

    applyConfig();

    if (!$preservelog) {
      $log = [];
    }

    // updateVariables($previewIframe);
  }

  function applyConfig() {
    if ($previewIframe?.contentDocument) {
      const IBody = $previewIframe?.contentDocument?.body;
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

  window.addEventListener("message", (event) => {
    if (!event.origin.startsWith("vscode-webview://"))
      return console.warn("wrong origin: " + event.origin);

    switch (event.data.type) {
      case "rendered":
        updateVariables($previewIframe);
        break;

      default:
        break;
    }
  });
</script>

<div class="wrapper">
  <Controls />
  <div class="sideBarWrapper">
    <div class="preview" style={$config.activeBg ? `--bg: ${$config.bg}` : ""}>
      <iframe title="preview" bind:this={$previewIframe} />
    </div>
    <SideBar />
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
  .sideBarWrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
</style>
