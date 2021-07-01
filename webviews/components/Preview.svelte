<script lang="ts">
	import { code, svelteCode, vscode } from "./stores";
	if (!$code || !$svelteCode) {
		$vscode?.postMessage({type: "actualize", value:""})
	}

	let iframe: HTMLIFrameElement;

	$: if(iframe && $code) injectPreviewInIframe();

	async function injectPreviewInIframe() {
		console.log("injected", {
			iframe,
			code: $code,
			svelteCode :$svelteCode
		});
		iframe.contentWindow?.location.reload()

		await new Promise((resolve)=>iframe.onload =resolve)


		if ($code?.err.length !== 0) return;
		if (!$svelteCode) throw new Error("svelteCode should not be null");


		const IBody = iframe.contentDocument?.body;
		if (!IBody) throw new Error("contentDocument does not have a body");

		const root = document.createElement("div")
		root.className = "root";
		IBody.appendChild(root);

		const appScript = document.createElement("script")
		appScript.setAttribute("type", "module");
		appScript.innerHTML = $code?.js || "";
		IBody.appendChild(appScript);

		const style = document.createElement("style")
		style.innerHTML = $code?.css || "";
		IBody.appendChild(style);

		const svelteScript = document.createElement("script")
		svelteScript.innerHTML = $svelteCode;
		IBody.appendChild(svelteScript);
	}
</script>
<div class="wrapper">
	<div class="controls">
		<input type="checkbox">

	</div>
	<iframe title="preview" bind:this={iframe}></iframe>
</div>

<style lang="scss">
	:global(body),
	:global(html){
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	.controls{
		height: 2em;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	iframe {
		flex-grow: 1;
		border: 1em var(--vscode-statusBar-background) solid;
	}
</style>