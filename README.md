[![Join our discord](https://img.shields.io/discord/881522554286792714?color=%235865f2&logo=discord&logoColor=%23fff&style=for-the-badge)](https://discord.gg/dE8xgATM67)
[![stars](https://img.shields.io/github/stars/rafalou38/svelte-preview?color=%23FFA505&logo=github&style=for-the-badge)](https://github.com/rafalou38/svelte-preview/stargazers)
![version](https://img.shields.io/visual-studio-marketplace/v/RafaelMartinez.svelte-preview?color=%230f&style=for-the-badge)
![last updated](https://img.shields.io/visual-studio-marketplace/last-updated/RafaelMartinez.svelte-preview?style=for-the-badge)

# svelte-preview

Svelte-preview is a vscode extension to preview your svelte components live

![extension icon](media/logo.png)

## Features

### Live preview of svelte files

![live preview](images/2.0.0/live%20preview.gif)

### Console

![Console](images/2.0.0/console.gif)

### Errors display

![Errors display](images/2.0.0/errors.gif)

### Support imports

![Support imports](images/2.0.0/imports.gif)
![Support modules imports](images/2.0.0/modules.gif)

### Preview focused file

![Preview focused file](images/2.0.0/unlock.gif)

### Preview controls

![Preview controls](images/2.0.0/controls.gif)

### Theme aware

![theme aware](images/2.0.0/themeAware.gif)

### compatible with preprocessors

- scss
- typescript
- babel
- coffeescript
- less
- sass
- stylus

## Use rollup

This switch allows you to use rollup to compile your svelte files it is generaly slower and require you to save your files to update.

- custom dependencies parser:
  - sometimes does not work
  - generaly faster
  - no need to save files
  - errors and logs show true file paths
- custom dependencies parser:
  - sometimes does not work
  - generaly slower
  - need to save files
  - errors and logs show fake (blob) path

I recomend not using rollup unless it dosent work or it take longer to compile without it.

## Extension Settings

None

> If you think I should add some settings, create an issue in [github](https://github.com/rafalou38/svelte-preview/issues)

## Known Issues

Some node modules raise this when using custom dependencies parser:

    Error: Function called outside component initialization

## Release Notes

See changelog to see all the versions

## latest [2.6.0]

- Switch to embedded `svelte/internal` to avoid version mismatch
- Run preview even with warnings
- Reworked import system
