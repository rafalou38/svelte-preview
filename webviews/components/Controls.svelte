<script lang="ts">
  import { bind } from "svelte/internal";
  import Settings from "./Settings.svelte";
  import { code, config, locked, vscode } from "./stores";

  import Switch from "./Switch.svelte";
  function update() {
    $vscode?.postMessage({ type: "editConfig", value: $config });
  }
  function updateSaveReload(e: unknown) {
    if ($config.rollup) return;

    // set only if rollup is not enabled
    $config.saveReload = !!SaveReload.checked;
    update();
  }
  function updateLock(e: Event) {
    $vscode?.postMessage({ type: "updateLock", value: $locked });
  }

  $: {
    if (!$config.rollup) {
      SaveReload;
    }
  }

  let SaveReload: Switch;
  let opened = true;
  let settingsOpened = false;
</script>

<Settings bind:opened={settingsOpened} />

<button class="visibility-toggle" on:click={() => (opened = !opened)}>
  {#if opened}
    <!-- Carret Up svg -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"
      />
    </svg>
  {:else}
    <!-- Carret Down svg -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
      />
    </svg>
  {/if}
</button>
<div class="controls" class:closed={!opened}>
  <vscode-button
    appearance="icon"
    aria-label="open settings"
    on:click={() => (settingsOpened = true)}
  >
    <span class="codicon codicon-settings-gear" />
  </vscode-button>

  <div class="wrap">
    <label for="lock" title="Keep the preview on the same file.">
      lock
      <Switch id="lock" on:change={updateLock} bind:checked={$locked} />
    </label>
    <label for="saveReload" title="Only reload preview when you save a file.">
      reload <br /> on save
      <Switch
        id="saveReload"
        on:change={updateSaveReload}
        disabled={$config.rollup}
        checked={$config.rollup ? true : $config.saveReload}
        bind:this={SaveReload}
      />
    </label>
    <label
      for="rollup"
      title="If your code does not preview this switch may help. Usually slower and need to save for preview."
    >
      use rollup
      <Switch id="rollup" on:change={update} bind:checked={$config.rollup} />
    </label>
    <label
      for="center"
      title="Wheter your component should be centered on the page, useful for small components."
    >
      center
      <Switch id="center" on:change={update} bind:checked={$config.center} />
    </label>
    <label for="background" title="Change the background of the preview.">
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
    <label for="zoom" title="Zoom your component to make it bigger or smaller.">
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
  .visibility-toggle {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    margin: 0.25rem;
    padding: 0.25rem;
    border-radius: 100%;
    cursor: pointer;
    border: none;
    background: var(--vscode-titleBar-activeBackground);
    color: var(--vscode-icon-foreground);
    opacity: 0.3;
    transition: opacity 0.2s ease-in-out;
    width: 24px;
    box-sizing: content-box;
    height: 24px;
    display: grid;
    place-items: center;
    &:hover {
      opacity: 1;
    }
  }
  .controls {
    display: flex;
    background: var(--vscode-titleBar-activeBackground);
    padding: 1em;
    position: relative;
    transition: transform 0.2s ease-in-out;
    &.closed {
      transform: translateY(-100%);
      position: absolute;
    }

    .wrap {
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
  @media (max-width: 855px) {
    label {
      margin-bottom: 1.5em;
    }
  }
</style>
