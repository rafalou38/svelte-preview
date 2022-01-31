<script>
  import Issue from "./githubButtons/issue.svelte";

  import Star from "./githubButtons/star.svelte";
</script>

<div class="wrapper">
  <h3>❤️ Do you like this extension?</h3>
  <div class="field">
    <Star />
  </div>

  <h3>Want to talk or get help?</h3>
  <div class="field">
    <a class="discord-btn" href="https://discord.gg/dE8xgATM67">
      <svg viewBox="0 0 71 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60.1045 13.8978C55.5792 11.8214 50.7265 10.2916 45.6527 9.41542C45.5603 9.39851 45.468 9.44077 45.4204 9.52529C44.7963 10.6353 44.105 12.0834 43.6209 13.2216C38.1637 12.4046 32.7345 12.4046 27.3892 13.2216C26.905 12.0581 26.1886 10.6353 25.5617 9.52529C25.5141 9.44359 25.4218 9.40133 25.3294 9.41542C20.2584 10.2888 15.4057 11.8186 10.8776 13.8978C10.8384 13.9147 10.8048 13.9429 10.7825 13.9795C1.57795 27.7309 -0.943561 41.1443 0.293408 54.3914C0.299005 54.4562 0.335386 54.5182 0.385761 54.5576C6.45866 59.0174 12.3413 61.7249 18.1147 63.5195C18.2071 63.5477 18.305 63.5139 18.3638 63.4378C19.7295 61.5728 20.9469 59.6063 21.9907 57.5383C22.0523 57.4172 21.9935 57.2735 21.8676 57.2256C19.9366 56.4931 18.0979 55.6 16.3292 54.5858C16.1893 54.5041 16.1781 54.304 16.3068 54.2082C16.679 53.9293 17.0513 53.6391 17.4067 53.3461C17.471 53.2926 17.5606 53.2813 17.6362 53.3151C29.2558 58.6202 41.8354 58.6202 53.3179 53.3151C53.3935 53.2785 53.4831 53.2898 53.5502 53.3433C53.9057 53.6363 54.2779 53.9293 54.6529 54.2082C54.7816 54.304 54.7732 54.5041 54.6333 54.5858C52.8646 55.6197 51.0259 56.4931 49.0921 57.2228C48.9662 57.2707 48.9102 57.4172 48.9718 57.5383C50.038 59.6034 51.2554 61.5699 52.5959 63.435C52.6519 63.5139 52.7526 63.5477 52.845 63.5195C58.6464 61.7249 64.529 59.0174 70.6019 54.5576C70.6551 54.5182 70.6887 54.459 70.6943 54.3942C72.1747 39.0791 68.2147 25.7757 60.1968 13.9823C60.1772 13.9429 60.1437 13.9147 60.1045 13.8978ZM23.7259 46.3253C20.2276 46.3253 17.3451 43.1136 17.3451 39.1693C17.3451 35.225 20.1717 32.0133 23.7259 32.0133C27.308 32.0133 30.1626 35.2532 30.1066 39.1693C30.1066 43.1136 27.28 46.3253 23.7259 46.3253ZM47.3178 46.3253C43.8196 46.3253 40.9371 43.1136 40.9371 39.1693C40.9371 35.225 43.7636 32.0133 47.3178 32.0133C50.9 32.0133 53.7545 35.2532 53.6986 39.1693C53.6986 43.1136 50.9 46.3253 47.3178 46.3253Z"
          fill="currentColor"
        />
      </svg>
      Join our Discord
    </a>
  </div>

  <h3>🐛 Not working as intended?</h3>
  <div class="field flex">
    <p>create an issue:</p>
    <Issue />
  </div>

  <h3>💡 There is a missing feature?</h3>
  <div class="field flex">
    <p>make a suggestion:</p>
    <Issue />
  </div>

  <h3>📄 Latest changes:</h3>
  <div class="field">
    <h4>2.5.0</h4>
    <ul>
      <li>Add external styles support</li>
      <ul>
        <li>includes tailwind support</li>
      </ul>
    </ul>

    <h4>2.4.2</h4>
    <ul>
      <li>
        Show more details for Typescript issues no more `[svelte-preprocess]
        Encountered type error`
      </li>
      <li>
        Fix unresolved svelte/internal when no node_modules folder present in
        project
      </li>
      <ul>
        <li>preview without svelte installed now possible again</li>
        <ul>
          <li>No folder opened</li>
        </ul>
      </ul>
    </ul>
    <h4>2.4.0</h4>
    <ul class="changes">
      <li>add description tooltips to each switch</li>
      <li>Add option to only reload on save</li>
      <li>Reorganise switches order</li>
      <li>disable error shown for unused css selector</li>
      <li>Improve blinking issues</li>
    </ul>
    <h4>2.3.2</h4>
    <ul class="changes">
      <li>Add button to hide controls</li>
    </ul>
    <h4>2.3.1</h4>
    <ul class="changes">
      <li>Fix images preview</li>
    </ul>
    <h4>2.3.0</h4>
    <ul class="changes">
      <li>Fix failed svelte/internal import</li>
      <li>Controls more responsive (wrap on different lines)</li>
      <li>Add drawer info badge for when a new version is added</li>
    </ul>
    <h4>2.2.0</h4>
    <ul class="changes">
      <li>Add info tab in bottom drawer</li>
      <li>add button to clear log on each code update</li>
    </ul>
    <h4>2.1.0</h4>
    <ul class="changes">
      <li>Fix critical errors</li>
      <ul>
        <li>remove nonce to allow user code execution</li>
        <li>fix error caused by non existent path in tsconfig</li>
      </ul>
    </ul>
  </div>
</div>

<style lang="scss">
  :global(body) {
    padding: 0;
  }
  .wrapper {
    overflow: scroll;
    padding: 1em;
  }
  .discord-btn {
    display: flex;
    align-items: center;
    gap: 1em;

    width: max-content;

    background-color: #5865f2;
    color: #fff;
    text-decoration: none;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    border-radius: 5px;
    padding: 0.5em 1em;
    svg {
      height: 2em;
    }
  }
  h3:not(:first-child) {
    margin-top: 2em;
    margin-bottom: 1em;
  }
  h4 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    &:first-child {
      font-weight: 900;
    }
  }
  .field {
    padding-left: 2em;
    &.flex {
      display: flex;
      align-items: center;
      gap: 1em;
    }
  }
  ul {
    padding-left: 2em;
    margin: 0;
  }
</style>
