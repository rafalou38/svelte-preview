<script lang="ts">
  import { code, config, locked, vscode } from "./stores";

  import Switch from "./Switch.svelte";
  function update() {
    $vscode?.postMessage({ type: "editConfig", value: $config });
  }
	function updateLock(e: Event) {
		$vscode?.postMessage({ type: "updateLock", value: $locked });
	}
</script>

<div class="controls">
  <div class="wrap">
    <label for="lock">
      lock
      <Switch id="lock" on:change={updateLock} bind:checked={$locked}/>
    </label>
    <label for="center">
      center
      <Switch id="center" on:change={update} bind:checked={$config.center} />
    </label>
    <label for="background">
      background
      <Switch
        id="background"
        on:change={update}
        bind:checked={$config.activeBg}
      />
      {#if $config.activeBg}
        <input type="color" on:change={update} bind:value={$config.bg} />
      {/if}
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
    <label for="rollup">
      use rollup
      <Switch id="rollup" on:change={update} bind:checked={$config.rollup} />
    </label>
  </div>

  {#if $code?.startTime}
    <p class="right">
      took <span>{(Date.now() - $code?.startTime) / 1000}</span>s
    </p>
  {/if}
</div>

<style lang="scss">
  label {
    margin: 0 1.5em;
    display: flex;
    // flex-direction: column;
    align-items: center;
    gap: 1em;
  }
  .controls {
    display: flex;
    background: var(--vscode-titleBar-activeBackground);
    padding: 1em;
    .wrap{
      display: flex;
      flex-grow: 1;
      flex-wrap: wrap;
    }
  }
  select {
    padding: 0.5em;
    color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    border: none;
  }
  .right {
    margin-left: auto;
    opacity: 0.7;
    font-size: 1.2em;
    span {
      font-weight: bold;
    }
  }
  @media (max-width: 855px){
    label {
      margin-bottom: 1.5em;
    }
  }
</style>
