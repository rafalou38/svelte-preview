<script lang="ts">
	import Controls from "./Controls.svelte";
	import { code, config, svelteCode, vscode } from "./stores";
	if (!$code || !$svelteCode) {
		$vscode?.postMessage({type: "actualize", value:""})
	}

	let iframe: HTMLIFrameElement;

	$: if(iframe && $code) injectPreviewInIframe();

	async function injectPreviewInIframe() {
		iframe.contentWindow?.location.reload()

		await new Promise((resolve)=>iframe.onload =resolve)


		if ($code?.err.length !== 0) return;
		if (!$svelteCode) return console.error("svelteCode should not be null");


		const IBody = iframe.contentDocument?.body;
		if (!IBody) return console.error("contentDocument does not have a body");

		const root = document.createElement("div")
		root.className = "root";
		IBody.appendChild(root);

		const appScript = document.createElement("script")
		appScript.setAttribute("type", "module");
		appScript.innerHTML = $code?.js || "";
		IBody.appendChild(appScript);

		const style = document.createElement("style")
		style.innerHTML = $code?.css + "body{margin:0;}.root{height: 100vh;width: 100vw;padding: 8px;box-sizing: border-box;}" || "";
		IBody.appendChild(style);

		const svelteScript = document.createElement("script")
		svelteScript.innerHTML = $svelteCode;
		IBody.appendChild(svelteScript);

		applyConfig();
	}

	function applyConfig() {
		if(iframe?.contentDocument){
			const IBody = iframe?.contentDocument?.body
			const root = IBody?.querySelector(".root") as HTMLDivElement
			if (root) {
				root.style.display = $config.center ? "grid" : ""
				root.style.placeItems = "center"

				root.style.transform = `scale(${$config.zoom})`
				root.style.transformOrigin = $config.center ? "" : `top left`

				root.style.background = $config.bg;
			}

		}
	}

	$: $config, applyConfig()

</script>

<div class="wrapper">
	<Controls/>
	<iframe title="preview" bind:this={iframe}></iframe>
	{#if $code?.err}
		<ul class="errors">
			{#each $code?.err as error}
				 <li class="error">
					<span>{error.message}</span> <span>({error.start.line}:{error.start.column})</span>
				 </li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	:global(body),
	:global(html){
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	:global(body.center){
		display: grid;
		place-items: center;
	}

	.wrapper{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	iframe {
		flex-grow: 1;
		border: none;
	}
	.errors{
		border-radius: 1rem 1rem 0 0;
		background: var(--vscode-editorError-foreground);
		color: white;
		margin: 0 1rem;
		padding: 0;
	}
	.error{
		margin: 0;
		padding: 2rem;
		list-style: none;
		display: flex;
		justify-content: space-between;
		&+&{
			border-top: 3px solid #00000012;
		}
		span{
			font-size: 20px;
		}
	}
</style>