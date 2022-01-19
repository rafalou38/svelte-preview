<script lang="ts">
  export let name = "";
  export let value: any = null;
</script>

<li>
  <span class="var-name">{name}:</span>
  <span class="var-value">{value}</span>
</li>

<style lang="scss">
  .var-name {
    color: #c586c0;
  }
</style>
