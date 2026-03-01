# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2025-03-01

### Added

- Jest configuration: `jest.config.js`, `jest/setup.js`, `__mocks__/react-native.js` for unit tests.
- Scripts `test` and `test:watch` in package.json.
- DevDependencies for testing: `jest`, `ts-jest`, `@testing-library/react-native`, `@types/jest`, `react-test-renderer`.
- CONTRIBUTING.md with development setup, workflow, and code expectations.
- CHANGELOG.md (Keep a Changelog format).
- LICENSE (MIT).

### Changed

- README rewritten in English with structure similar to gorhom/react-native-bottom-sheet.
- README: added npm and dependency badges (reanimated, gesture-handler, safe-area-context, keyboard-controller).
- README: added emojis to sections and features.
- README: Installation section with yarn, Dependencies, and "Using Expo?" blocks.
- README: Requirements as a single table (Required/Optional) with npm links and descriptions.
- README: Setup as INFO block for Gesture Handler v2 and Reanimated v3, plus `GestureHandlerRootView` example.
- README: OPTIONAL block for react-native-safe-area-context and react-native-keyboard-controller with installation links.
- README: Contributing section linking to CONTRIBUTING.md.

## [1.0.0] - 2025-03-01

### Added

- Initial release of `@carlosmedina06/react-native-bottom-sheet`.
- Draggable bottom sheet with handle-only drag (top pill).
- `fitContent` mode to size the sheet to content height.
- Internal scroll when content exceeds `maxHeight`.
- Close via backdrop tap, Android back button, or drag-down gesture.
- Lifecycle callbacks: `onOpenStart`, `onOpenEnd`, `onCloseStart`, `onCloseEnd`, `onOpen`, `onDrag`.
- Optional snap points (e.g. `['25%', '50%', '90%']`).
- Keyboard behavior: `padding`, `height`, or `none`.
- `onCloseRequest` to confirm before closing (e.g. unsaved form).
- Customizable colors, handle, header, footer, and accessibility props.
- Optional `react-native-safe-area-context` and `react-native-keyboard-controller` support.
- TypeScript types: `BottomSheetProps`, `BottomSheetDragEvent`.

[Unreleased]: https://github.com/carlosmedina06/react-native-bottom-sheet/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/carlosmedina06/react-native-bottom-sheet/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/carlosmedina06/react-native-bottom-sheet/releases/tag/v1.0.0
