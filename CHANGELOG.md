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

## [2.3.0]

- Fix failed svelte/internal import
- Controls are more responsive (wrap on different lines)
- Add drawer info badge for when a new version is added

## [2.3.1]

- Fix images preview

## [2.3.2]

- Add button to hide controls

## [2.4.0]

- add description tooltips to each switch 
- Add option to only reload on save
- Reorganise switches order
- disable error shown for unused css selector
- Improve blinking issues
- Removed the changelog from the readme

## [2.4.2]

- Show more details for Typescript issues no more `[svelte-preprocess] Encountered type error`
- Fix unresolved svelte/internal when no node_modules folder present in project
  - preview without svelte installed now possible again
    - No folder opened

## [2.5.0]

- Add external styles support
  - includes tailwind support

## [2.5.1]

- Fix codespaces support
- Fix failed import of some modules

## [2.5.2]

- Upgrade typescript version
  - fixes `Unknown compiler option 'preserveValueImports'.`

## [2.5.3]

- Add $lib fallback for when tsconfig.json is not used 