<script lang="ts">
  export let name = "";
  export let value: any = null;
</script>

<li>
  <span class="var-name">{name}:</span>
  <span class="var-value {typeof value}">{value}</span>
</li>

<style lang="scss">
  .var-name {
    color: var(--vscode-debugTokenExpression-name);
  }
  .var-value {
    color: var(--vscode-debugTokenExpression-value);
    &.string {
      color: var(--vscode-debugTokenExpression-string);
    }
    &.boolean {
      color: var(--vscode-debugTokenExpression-boolean);
    }
    &.number {
      color: var(--vscode-debugTokenExpression-number);
    }
  }
</style>
