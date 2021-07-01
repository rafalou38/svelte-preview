<script lang="ts">
import { config, vscode } from './stores';

	import Switch from './Switch.svelte';
	function update() {
		$vscode?.postMessage({type: "editConfig", value: $config})
	}
</script>

<div class="controls">
	<label for="center">
		center
		<Switch id="center" on:change={update} bind:checked={$config.center}/>
	</label>
	<label for="white">
		background
	<input type="color" on:change={update} bind:value={$config.bg}/>
	</label>
	<label for="zoom">
		zoom
		<select name="zoom" on:blur={update} id="zoom" bind:value={$config.zoom}>

			<option value="0.5">0.5x</option>
			<option value="1">1x</option>
			<option value="1.5">1.5x</option>
			<option value="2">2x</option>
			<option value="2.5">2.5x</option>
			<option value="3">3x</option>
			<option value="4">4x</option>
			<option value="5">5x</option>
			<option value="6">6x</option>
			<option value="7">7x</option>
			<option value="8">8x</option>
			<option value="9">9x</option>
			<option value="10">10x</option>
			<option value="11">11x</option>
			<option value="12">12x</option>
		</select>
	</label>
</div>

<style lang="scss">
	label{
		margin: 0 1em;
		display: flex;
		// flex-direction: column;
		align-items: center;
		gap: 1em;
	}
	.controls{
		display: flex;
		background: var(--vscode-titleBar-activeBackground);
		padding: 1em;
	}
	select{
		padding: .5em;
		color: var(--vscode-input-foreground);
		outline-color: var(--vscode-input-border);
		background-color: var(--vscode-input-background);
		border: none;
	}
</style>