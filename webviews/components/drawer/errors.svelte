<script lang="ts">
  import { code, log, vscode } from "../stores";

  function openFile(ref: string) {
    const match = ref.match(/(?<=\()(.*?):(\d+:\d+)/);
    if (!match) return;
    $vscode?.postMessage({
      type: "reveal",
      value: {
        file: match[1],
        position: match[2],
      },
    });
  }
</script>

<div class="container">
  <ul>
    {#each $code?.err || [] as error}
      <li>
        <div class="left">
          {#if error.code}
            <span class="dim">
              {error.code}
            </span>
          {/if}
          <span class="message">
            {error.message}
          </span>
          <span class="dim">
            [{error.start.column}:{error.start.line}]
          </span>
        </div>
        {#if error.filename}
          <a
            href={error.filename}
            on:click={() => error.filename && openFile(error.filename)}
            class="src-link"
            title={error.filename}
          >
            {error.filename}
          </a>
        {/if}
        {#if error.frame}
          <pre>{error.frame}</pre>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .container {
    flex-grow: 1;
    overflow-y: scroll;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    // display: flex;
    // justify-content: space-between;
    list-style: none;
    padding: 2px;
    padding-left: 30px;
    margin: 0;
    &:hover {
      background-color: var(--vscode-list-hoverBackground);
    }
    .dim {
      opacity: 0.6;
    }
    .message {
      white-space: pre-wrap;
      font-family: var(--vscode-repl-font-family);
      font-size: var(--vscode-repl-font-size);
      line-height: var(--vscode-repl-line-height);
      margin: 0;
    }
    .src-link {
      display: inline-block;
      margin-left: auto;
      margin-right: 8px;
      cursor: pointer;
      text-decoration: underline;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
      direction: rtl;
      max-width: 200px;

      color: var(--vscode-foreground);
    }
  }
</style>
