<script lang="ts">
  export let placeholder = "";
  export let value = "";
  export let label = "";

  function update(e: Event & { target: HTMLInputElement }) {
    value = e.target?.value;
  }
</script>

<vscode-text-field {placeholder} on:change={update} {value}
  >{label}</vscode-text-field
>

<style>
  :global(vscode-text-field) {
    flex-grow: 1;
  }
</style>
