<script lang="ts">
  import { code, log } from "../stores";

  import Console from "./console.svelte";
  import Errors from "./errors.svelte";

  let dragging = false;
  let height = 300;
  let current: "console" | "errors" | "infos" = "console";
  function handleMovement(
    e: MouseEvent & { currentTarget: EventTarget & HTMLElement }
  ) {
    if (!dragging) return;
    height = height - e.movementY;
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

<div class="main" style={`height: ${height}px`}>
  <div
    class="handle"
    class:dragging
    on:mousedown={() => {
      dragging = true;
    }}
  />
  <ul class="tabs">
    <li
      class="tab"
      class:active={current == "console"}
      on:click={() => (current = "console")}
    >
      console
    </li>
    {#if $log.length > 0}
      <div class="count">{$log.length}</div>
    {/if}
    <li
      class="tab"
      class:active={current == "errors"}
      on:click={() => (current = "errors")}
    >
      errors
    </li>
    {#if ($code?.err?.length || 0) > 0}
      <div class="count">{$code?.err.length}</div>
    {/if}
    <li
      class="tab"
      class:active={current == "infos"}
      on:click={() => (current = "infos")}
    >
      infos
    </li>
    <div class="right">
      {#if current === "console"}
        <button
          class="action-btn"
          title="clear console"
          on:click={() => ($log = [])}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0001 12.6L10.7001 13.3L12.3001 11.7L13.9001 13.3L14.7001 12.6L13.0001 11L14.7001 9.40005L13.9001 8.60005L12.3001 10.3L10.7001 8.60005L10.0001 9.40005L11.6001 11L10.0001 12.6Z"
              fill="#C5C5C5"
            />
            <path
              d="M1.00006 4L15.0001 4L15.0001 3L1.00006 3L1.00006 4Z"
              fill="#C5C5C5"
            />
            <path
              d="M1.00006 7L15.0001 7L15.0001 6L1.00006 6L1.00006 7Z"
              fill="#C5C5C5"
            />
            <path
              d="M9.00006 9.5L9.00006 9L1.00006 9L1.00006 10L9.00006 10L9.00006 9.5Z"
              fill="#C5C5C5"
            />
            <path
              d="M9.00006 13L9.00006 12.5L9.00006 12L1.00006 12L1.00006 13L9.00006 13Z"
              fill="#C5C5C5"
            />
          </svg>
        </button>
      {/if}
    </div>
  </ul>
  {#if current == "console"}
    <Console />
  {:else if current == "errors"}
    <Errors />
  {:else if current == "infos"}
    <!-- else if content here -->
  {/if}
</div>

<style lang="scss">
  .main {
    background: var(--vscode-panel-background);
    border-top: 1px solid var(--vscode-panel-border);
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  $handle-height: 6px;
  .handle {
    position: absolute;
    height: $handle-height;
    width: 100%;
    top: -($handle-height/2);
    cursor: n-resize;
    transition: opacity 0.5s ease;
    opacity: 0;
    &.dragging,
    &:hover {
      background: var(--vscode-focusBorder);
      opacity: 1;
    }
  }
  ul.tabs {
    display: flex;
    margin: 0 auto;
    padding: 0;
    height: 35px;
    width: 100%;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;

    li.tab {
      box-sizing: border-box;
      cursor: pointer;
      margin: 0 0 0 20px;
      padding: 4px 10px 3px;
      list-style: none;
      display: grid;
      height: 100%;
      place-items: center;
      background: none;
      border: none;
      text-transform: uppercase;
      color: var(--vscode-panelTitle-inactiveForeground);
      &:hover,
      &:focus,
      &.active {
        color: var(--vscode-panelTitle-activeForeground);
      }
      &.active {
        border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
      }
    }
    .right {
      margin-left: auto;
      padding-right: 1em;
      .action-btn {
        border: none;
        background: none;
        padding: 3px;
        border-radius: 5px;
        display: grid;
        place-items: center;
        &:hover {
          background-color: rgba(90, 93, 94, 0.31);
        }
        &:focus {
          outline: none;
        }
      }
    }
  }
  .count {
    font-family: var(--vscode-repl-font-family);
    padding: 3px 6px;
    border-radius: 11px;
    font-size: 11px;
    min-width: 18px;
    min-height: 16px;
    line-height: 11px;
    font-weight: 400;
    text-align: center;
    display: inline-block;
    box-sizing: border-box;
    background-color: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
  }
</style>
