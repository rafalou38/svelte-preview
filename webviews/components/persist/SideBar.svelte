<script lang="ts">
  import { code } from "../stores";

  import Pane from "./Pane.svelte";
  import { variables } from "./persist";
  import Variable from "./Variable.svelte";

  let dragging = false;
  let width = 300;
  function handleMovement(
    e: MouseEvent & { currentTarget: EventTarget & HTMLElement }
  ) {
    if (!dragging) return;
    width = width - e.movementX;
  }
  $: {
    if (dragging) {
      document.querySelector("html")?.classList.add("dragging");
    } else {
      document.querySelector("html")?.classList.remove("dragging");
    }
  }
</script>

<svelte:body
  on:mouseout={(e) => {
    // @ts-ignore
    if (e.toElement === null || e.toElement.tagName == "HTML") {
      dragging = false;
    }
  }}
  on:mousemove={handleMovement}
  on:mouseup={() => {
    dragging = false;
  }} />

<div class="sidebar" style={`width: ${width}px`}>
  <div
    class="sidebar__handle"
    class:dragging
    on:mousedown={() => {
      dragging = true;
    }}
  />
  <div class="sidebar__title">
    <h2>values inspector</h2>
  </div>

  <Pane label="variables">
    <ul>
      {#each $variables as value, i}
        <Variable name={$code?.vars[i]} {value} />
      {/each}
    </ul>
  </Pane>
</div>

<style lang="scss">
  @use "sass:math";

  .sidebar {
    display: flex;
    flex-direction: column;
    background: var(--vscode-sideBar-background, #21222c);
    color: #f8f8f2;
    position: relative;
    height: 100%;
  }

  $handle-height: 6px;
  .sidebar__handle {
    position: absolute;
    width: $handle-height;
    height: 100%;
    left: -/**/ math.div($handle-height, 2);
    cursor: e-resize;
    transition: opacity 0.5s ease;
    opacity: 0;
    &.dragging,
    &:hover {
      background: var(--vscode-focusBorder);
      opacity: 1;
    }
  }

  .sidebar__title {
    height: 35px;
    display: flex;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;
    h2 {
      color: var(--vscode-sideBar-foreground);
      line-height: 35px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 12px;
      text-transform: uppercase;
      font-size: 11px;
      cursor: default;
      font-weight: 400;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  ul {
    list-style: none;
    padding-left: 21px;
    margin: 0;
    .var-name {
      color: #c586c0;
    }
  }
</style>
