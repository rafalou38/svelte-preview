<script lang="ts">
  import { type } from "os";
  import { config, vscode } from "./stores";
  import Button from "./wrappers/Button.svelte";
  import Checkbox from "./wrappers/Checkbox.svelte";
  import TextField from "./wrappers/TextField.svelte";

  export let opened = true;

  function close() {
    $vscode?.postMessage({ type: "editConfig", value: $config });
    opened = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cover" on:click={close} class:shown={opened}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="popup" on:click|stopPropagation={null}>
    <h3>settings</h3>
    <h4>External styles</h4>
    <ul>
      {#each $config.externalElements as element, i}
        {#if element.type == "style"}
          <li>
            <Checkbox bind:checked={element.enabled} label="" />
            <TextField
              placeholder="url or file path"
              bind:value={element.link}
            />
            <Button
              on:click={() =>
                ($config.externalElements = $config.externalElements.filter(
                  (_, j) => i !== j
                ))}
              startIcon="codicon-close"
              appearance="icon"
            />
          </li>
        {/if}
      {/each}
    </ul>
    <Button
      on:click={() =>
        ($config.externalElements = [
          ...$config.externalElements,
          {
            enabled: true,
            link: "",
            type: "style",
          },
        ])}
      label="Add Style"
    />
    <Button
      on:click={() =>
        ($config.externalElements = [
          ...$config.externalElements,
          {
            enabled: true,
            type: "style",
            link: "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
          },
        ])}
      label="add tailwind 2.2.19 [OLD]"
      appearance="secondary"
    />
    <Button
      on:click={() =>
        ($config.externalElements = [
          ...$config.externalElements,
          {
            enabled: true,
            type: "style",
            link: "https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css",
          },
        ])}
      label="add daisy UI"
      appearance="secondary"
    />
    <h4>External scripts</h4>
    <ul>
      {#each $config.externalElements as element, i}
        {#if element.type == "script"}
          <li>
            <Checkbox bind:checked={element.enabled} label="" />
            <TextField
              placeholder="url or file path"
              bind:value={element.link}
            />
            <Button
              on:click={() =>
                ($config.externalElements = $config.externalElements.filter(
                  (_, j) => i !== j
                ))}
              startIcon="codicon-close"
              appearance="icon"
            />
          </li>
        {/if}
      {/each}
    </ul>

    <p>⚠️ Only load scripts you trust !</p>
    <p>Svelte preview is not responsible for the scripts you load.</p>

    <Button
      on:click={() =>
        ($config.externalElements = [
          ...$config.externalElements,
          {
            enabled: true,
            link: "",
            type: "script",
          },
        ])}
      label="Add Script"
    />
    <Button
      on:click={() =>
        ($config.externalElements = [
          ...$config.externalElements,
          {
            enabled: true,
            link: "https://cdn.tailwindcss.com",
            type: "script",
          },
        ])}
      label="add tailwind (script latest)"
      appearance="secondary"
    />
  </div>
</div>

<style lang="scss">
  .cover {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 9999;
    display: none;
    place-items: center;
    &.shown {
      display: grid;
    }
  }
  .popup {
    padding: 2em;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    max-width: 600px;

    background: var(--vscode-editor-background);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
  li,
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    gap: 1em;
  }
  input[type="text"] {
    flex-grow: 1;
  }
</style>
