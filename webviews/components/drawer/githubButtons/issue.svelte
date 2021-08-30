<script>
  const fetchRepo = (async () => {
    const response = await fetch(
      "https://api.github.com/repos/rafalou38/svelte-preview"
    );
    return await response.json();
  })();
</script>

<div class="widget widget-lg">
  <a
    class="btn"
    href="https://github.com/rafalou38/svelte-preview/issues"
    rel="noopener"
    target="_blank"
    aria-label="Issue rafalou38/svelte-preview on GitHub"
    ><svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      class="octicon octicon-issue-opened"
      aria-hidden="true"
      ><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /><path
        fill-rule="evenodd"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
      /></svg
    >&nbsp;<span>Issue</span></a
  ><a
    class="social-count"
    href="https://github.com/rafalou38/svelte-preview/issues"
    rel="noopener"
    target="_blank"
  >
    {#await fetchRepo}
      ?
    {:then repo}
      {repo.open_issues_count}
    {:catch error}
      ?
    {/await}
  </a>
</div>

<style>
  a {
    text-decoration: none;
    outline: 0;
  }
  .widget {
    display: inline-block;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif;
    font-size: 0;
    line-height: 0;
    white-space: nowrap;
  }
  .btn,
  .social-count {
    position: relative;
    display: inline-block;
    display: inline-flex;
    height: 14px;
    padding: 2px 5px;
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    vertical-align: bottom;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-repeat: repeat-x;
    background-position: -1px -1px;
    background-size: 110% 110%;
    border: 1px solid;
  }
  .btn {
    border-radius: 0.25em;
  }
  .btn:not(:last-child) {
    border-radius: 0.25em 0 0 0.25em;
  }
  .social-count {
    border-left: 0;
    border-radius: 0 0.25em 0.25em 0;
  }
  .widget-lg .btn,
  .widget-lg .social-count {
    height: 16px;
    padding: 5px 10px;
    font-size: 12px;
    line-height: 16px;
  }
  /* .octicon {
 display:inline-block;
 vertical-align:text-top;
 fill:currentColor;
 overflow:visible
} */
  .btn {
    color: #adbac7;
    background-color: #30363d;
    border-color: #444c56;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23373e47'/%3e%3cstop offset='90%25' stop-color='%2330363d'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
    background-image: -moz-linear-gradient(top, #373e47, #30363d 90%);
    background-image: linear-gradient(180deg, #373e47, #30363d 90%);
  }
  :root .btn {
    filter: none;
  }
  .btn:focus,
  .btn:hover {
    background-color: #3c444d;
    background-position: 0 -0.5em;
    border-color: #768390;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23444c56'/%3e%3cstop offset='90%25' stop-color='%233c444d'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
    background-image: -moz-linear-gradient(top, #444c56, #3c444d 90%);
    background-image: linear-gradient(180deg, #444c56, #3c444d 90%);
  }
  :root .btn:focus,
  :root .btn:hover {
    filter: none;
  }
  .btn:active {
    background-color: #2e3031;
    border-color: #768390;
    box-shadow: inset 0 0.15em 0.3em rgba(28, 33, 40, 0.15);
    background-image: none;
    filter: none;
  }
  .social-count {
    color: #adbac7;
    background-color: #373e47;
    border-color: #444c56;
  }
  .social-count:focus,
  .social-count:hover {
    color: #539bf5;
  }
  /* .octicon-heart {
 color:#ae4c82
} */
  @media (prefers-color-scheme: light) {
    .btn {
      color: #24292e;
      background-color: #eff3f6;
      border-color: #cfd3d6;
      border-color: rgba(27, 31, 35, 0.15);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23fafbfc'/%3e%3cstop offset='90%25' stop-color='%23eff3f6'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
      background-image: -moz-linear-gradient(top, #fafbfc, #eff3f6 90%);
      background-image: linear-gradient(180deg, #fafbfc, #eff3f6 90%);
    }
    :root .btn {
      filter: none;
    }
    .btn:focus,
    .btn:hover {
      background-color: #e9ebef;
      background-position: 0 -0.5em;
      border-color: #caccd0;
      border-color: rgba(27, 31, 35, 0.15);
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23f3f4f6'/%3e%3cstop offset='90%25' stop-color='%23e9ebef'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
      background-image: -moz-linear-gradient(top, #f3f4f6, #e9ebef 90%);
      background-image: linear-gradient(180deg, #f3f4f6, #e9ebef 90%);
    }
    :root .btn:focus,
    :root .btn:hover {
      filter: none;
    }
    .btn:active {
      background-color: #e9ecef;
      border-color: #cacdd0;
      border-color: rgba(27, 31, 35, 0.15);
      box-shadow: inset 0 0.15em 0.3em rgba(27, 31, 35, 0.15);
      background-image: none;
      filter: none;
    }
    .social-count {
      color: #24292e;
      background-color: #fff;
      border-color: #ddddde;
      border-color: rgba(27, 31, 35, 0.15);
    }
    .social-count:focus,
    .social-count:hover {
      color: #0366d6;
    }
    /* .octicon-heart {
  color:#ea4aaa
 } */
  }
  @media (prefers-color-scheme: dark) {
    .btn {
      color: #adbac7;
      background-color: #30363d;
      border-color: #444c56;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23373e47'/%3e%3cstop offset='90%25' stop-color='%2330363d'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
      background-image: -moz-linear-gradient(top, #373e47, #30363d 90%);
      background-image: linear-gradient(180deg, #373e47, #30363d 90%);
    }
    :root .btn {
      filter: none;
    }
    .btn:focus,
    .btn:hover {
      background-color: #3c444d;
      background-position: 0 -0.5em;
      border-color: #768390;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3clinearGradient id='o' x2='0' y2='1'%3e%3cstop stop-color='%23444c56'/%3e%3cstop offset='90%25' stop-color='%233c444d'/%3e%3c/linearGradient%3e%3crect width='100%25' height='100%25' fill='url(%23o)'/%3e%3c/svg%3e");
      background-image: -moz-linear-gradient(top, #444c56, #3c444d 90%);
      background-image: linear-gradient(180deg, #444c56, #3c444d 90%);
    }
    :root .btn:focus,
    :root .btn:hover {
      filter: none;
    }
    .btn:active {
      background-color: #2e3031;
      border-color: #768390;
      box-shadow: inset 0 0.15em 0.3em rgba(28, 33, 40, 0.15);
      background-image: none;
      filter: none;
    }
    .social-count {
      color: #adbac7;
      background-color: #373e47;
      border-color: #444c56;
    }
    .social-count:focus,
    .social-count:hover {
      color: #539bf5;
    }
    /* .octicon-heart {
  color:#ae4c82
 } */
  }
</style>
