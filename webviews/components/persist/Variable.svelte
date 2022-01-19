<script lang="ts">
  import JSONTree from "svelte-json-tree";

  export let name = "";
  export let value: any = null;
</script>

<li>
  <span class="var-name">{name}:</span>
  <span class="var-value {typeof value}">
    {#if typeof value === "object"}
      <JSONTree {value} class="treeee" />
    {:else}
      {value}
    {/if}
  </span>
</li>

<style lang="scss">
  li {
    font-family: var(--vscode-editor-font-family);
    line-height: 22px;
    padding-left: 21px;
    &:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
  }
  .var-name {
    color: var(--vscode-debugTokenExpression-name);
  }
  .var-value {
    /* color */
    --json-tree-label-color: var(--vscode-debugTokenExpression-name);
    --json-tree-number-color: var(--vscode-debugTokenExpression-number);
    --json-tree-string-color: var(--vscode-debugTokenExpression-string);
    --json-tree-boolean-color: var(--vscode-debugTokenExpression-boolean);
    --json-tree-symbol-color: var(--vscode-debugTokenExpression-value);
    --json-tree-function-color: var(--vscode-debugTokenExpression-value);
    --json-tree-null-color: var(--vscode-debugTokenExpression-value);
    --json-tree-undefined-color: var(--vscode-debugTokenExpression-value);
    --json-tree-date-color: var(--vscode-debugTokenExpression-value);

    --json-tree-arrow-color: var(
      --vscode-editorGutter-foldingControlForeground
    ); // or --vscode-icon-foreground
    /* position */
    --json-tree-li-indentation: 1em;
    --json-tree-li-line-height: 1.3;
    /* font */
    --json-tree-font-size: 14px;
    --json-tree-font-family: var(--vscode-editor-font-family);

    color: var(--vscode-debugTokenExpression-value);

    margin-left: 6px;
    &.string {
      color: var(--vscode-debugTokenExpression-string);
    }
    &.boolean {
      color: var(--vscode-debugTokenExpression-boolean);
    }
    &.number {
      color: var(--vscode-debugTokenExpression-number);
    }
    &.object {
      & > :global(ul) {
        display: inline;
        & > :global(li) {
          display: inline;
        }
      }
    }
  }
</style>
