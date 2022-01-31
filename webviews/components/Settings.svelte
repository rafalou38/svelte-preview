<script lang="ts">
  import { config, vscode } from "./stores";

  export let opened = false;

  function close() {
    $vscode?.postMessage({ type: "editConfig", value: $config });
    opened = false;
  }
  $: console.log($config.externalStyles);
</script>

<div class="cover" on:click={close} class:shown={opened}>
  <div class="popup" on:click|stopPropagation={null}>
    <h3>settings</h3>
    <h4>External styles</h4>
    <ul>
      {#each $config.externalStyles as style, i}
        <li>
          <input type="checkbox" bind:checked={style.enabled} />
          <input type="text" bind:value={style.link} />
          <button
            on:click={() =>
              ($config.externalStyles = $config.externalStyles.filter(
                (_, j) => i !== j
              ))}
          >
            x
          </button>
        </li>
      {/each}
    </ul>
    <button
      on:click={() =>
        ($config.externalStyles = [
          ...$config.externalStyles,
          {
            enabled: true,
            link: "https://example.com/style.css",
          },
        ])}>Add</button
    >
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
  }
  input[type="text"] {
    flex-grow: 1;
  }
</style>
