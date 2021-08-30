# Change Log

## [1.0.0]

- Initial release

## [1.1.0]

- Add support for preprocessors:
  - scss
  - typescript
  - babel
  - coffeescript
  - less
  - sass
  - stylus
- editor icon is the same as the extension icon

## [2.0.0]

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

## [2.1.0]

- Fix critical errors
  - remove nonce to allow user code execution
  - fix error caused by non existent path in tsconfig

## [2.2.0]

- Add info tab in bottom drawer
- add button to clear log on each code update
