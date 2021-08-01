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

### 1.0.0

Initial release

### 1.1.0

Add support for preprocessors:

- scss
- typescript
- babel
- coffeescript
- less
- sass
- stylus

editor icon is the same as the extension icon:

![extension icon](media/logo.png)

### 2.0.0

- Add support for imports:
  - svelte files
  - node modules
  - scripts
    - typescript
    - javascript
  - parse tsconfig for paths aliases
    - ex: `$lib` `$app`
  - option to chose between custom dependencies parser and rollup
- fix styling issues
  - body not full width when not centered
- Add counter for compilation duration
- Add bottom drawer with:
  - **CONSOLE**
    - auto scroll
    - clear button
    - object view
  - more compact errors
- Add option to unlock and preview the curently focused file
