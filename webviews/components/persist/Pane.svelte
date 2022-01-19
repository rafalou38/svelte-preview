<script lang="ts">
  export let label = "";
  export let open = true;
</script>

<div class="header" on:click={() => (open = !open)}>
  {#if open}
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
      /></svg
    >
  {:else}
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
      /></svg
    >
  {/if}
  <h3>{label}</h3>
</div>

<div class="content">
  <div class="shrink" class:opened={open}>
    <slot
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ipsa
      veritatis eveniet ipsum laboriosam ad ut illum eos? Numquam, eligendi
      fugit cumque eos sed fugiat ipsa. Iure similique praesentium explicabo
      magni quis recusandae quod ut consequuntur possimus doloribus assumenda,
      eligendi alias deleniti repudiandae nostrum sunt esse necessitatibus quos
      rerum harum libero eos vero corporis. Voluptatem, nulla! Neque, nemo iusto
      facilis, ea aut ullam maiores explicabo numquam iste similique
      reprehenderit. Earum eligendi quos numquam pariatur accusantium modi
      perferendis libero deserunt sit deleniti perspiciatis sunt, commodi quidem
      cupiditate distinctio incidunt dolores non delectus reprehenderit
      repudiandae. Magnam optio adipisci voluptatem minima quis at.</slot
    >
  </div>
</div>

<style lang="scss">
  .header {
    cursor: pointer;
    display: flex;
    align-items: center;
    background: #282a36;
    line-height: 22px;
  }
  svg {
    color: #c5c5c5;
    margin: 0 2px;
  }
  h3 {
    user-select: none;
    text-transform: uppercase;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 11px;
    min-width: 3ch;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
  }
  .content {
    flex-grow: 1;
    position: relative;
    padding: 0.5em;
  }
  .shrink {
    box-sizing: border-box;
    overflow: hidden;
    height: 0;
    height: 0;

    transition: height 200ms ease-in;
    &.opened {
      height: 100%;
    }
  }
</style>
