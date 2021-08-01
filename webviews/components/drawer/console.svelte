<script lang="ts">
  import { log, vscode } from "../stores";
	import JSONTree from 'svelte-json-tree';

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

  function autoScroll(elem: HTMLLIElement, params: ScrollIntoViewOptions) {
    elem.scrollIntoView(params);
  }
	let behavior: ScrollBehavior  = "auto";
	setTimeout(()=>{behavior = "smooth"}, 100);
</script>

<div class="container">
  <ul>
    {#each $log as message, i}
      <li use:autoScroll={{ behavior }}>
        <div class="left">
          {#if message.count > 1}
            <span class="count">{message.count}</span>
          {/if}
          {#if message.level === "error"}
            <pre
              class={"message " +
                message.level}>
							{message.message[4].stack}
						</pre>
						{:else if message.message.find(e=>typeof e === "object")}
            <pre
              class="message object">
							<JSONTree value={message.message[0]} />
						</pre>
          {:else}
            <span class={"message " + message.level}>
              {message.message.join(", ")}
            </span>
          {/if}
        </div>
        {#if message.caller}
          <a
            href={message.caller}
            on:click={() => message.caller && openFile(message.caller)}
            class="src-link"
            title={message.caller}
          >
            {message.caller}
          </a>
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
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding-left: 30px;
    margin: 0;
    &:hover {
      background-color: var(--vscode-list-hoverBackground);
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
    .message {
      font-family: var(--vscode-repl-font-family);
      font-size: var(--vscode-repl-font-size);
      line-height: var(--vscode-repl-line-height);
      margin: 0;
      &.info {
        color: var(--vscode-debugConsole-infoForeground);
      }
      &.warn {
        color: var(--vscode-debugConsole-warningForeground);
      }
      &.error {
        font-style: italic;
        color: var(--vscode-debugConsole-errorForeground);
      }
			&.object{
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

				--json-tree-arrow-color: var(--vscode-editorGutter-foldingControlForeground); // or --vscode-icon-foreground
				/* position */
				--json-tree-li-indentation: 1em;
				--json-tree-li-line-height: 1.3;
				/* font */
				--json-tree-font-size: 14px;
				--json-tree-font-family: var(--vscode-editor-font-family);
			}
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
