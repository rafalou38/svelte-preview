<script lang="ts">
  export let checked = false;
  export let label = "label";
  function update(e: Event & { target: HTMLInputElement }) {
    checked = e.target?.checked;
  }
</script>

<vscode-checkbox on:change={update} {checked}>
  {#if label}
    <!-- content here -->
    {label}
  {/if}
</vscode-checkbox>
