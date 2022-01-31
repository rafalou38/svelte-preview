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
    console.log(SaveReload.checked);

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
  <!-- cog button -->
  <button class="settings-btn" on:click={() => (settingsOpened = true)}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      ><path
        d="M9.1 4.4L8.6 2H7.4l-.5 2.4-.7.3-2-1.3-.9.8 1.3 2-.2.7-2.4.5v1.2l2.4.5.3.8-1.3 2 .8.8 2-1.3.8.3.4 2.3h1.2l.5-2.4.8-.3 2 1.3.8-.8-1.3-2 .3-.8 2.3-.4V7.4l-2.4-.5-.3-.8 1.3-2-.8-.8-2 1.3-.7-.2zM9.4 1l.5 2.4L12 2.1l2 2-1.4 2.1 2.4.4v2.8l-2.4.5L14 12l-2 2-2.1-1.4-.5 2.4H6.6l-.5-2.4L4 13.9l-2-2 1.4-2.1L1 9.4V6.6l2.4-.5L2.1 4l2-2 2.1 1.4.4-2.4h2.8zm.6 7c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8 9c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"
      /></svg
    >
  </button>

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
  .settings-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--vscode-icon-foreground);
    width: 32px;
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
