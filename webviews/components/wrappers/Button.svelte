<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label = "";
  export let appearance: "primary" | "secondary" | "icon" = "primary";
  export let startIcon = "";

  const dispatch = createEventDispatcher();
</script>

<vscode-button {appearance} on:click={dispatch.bind(null, "click")}>
  {#if label}
    {label}
  {/if}
  {#if startIcon}
    <span slot="start" class="codicon {startIcon}" />
  {/if}
</vscode-button>
