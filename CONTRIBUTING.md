# Contributing

Thanks for your interest in contributing to **@carlosmedina06/react-native-bottom-sheet**. This document explains how to get set up and submit changes.

## How to contribute

- 🐛 **Report bugs** — [open an issue](https://github.com/carlosmedina06/react-native-bottom-sheet/issues) with steps to reproduce and environment details.
- 💡 **Suggest features** — [open an issue](https://github.com/carlosmedina06/react-native-bottom-sheet/issues) describing the use case and proposed API/behavior.
- 📝 **Improve docs** — fix typos, clarify README or code comments via a pull request.
- 🔧 **Submit code** — follow the workflow below and open a pull request.

## Development setup

1. **Fork and clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/react-native-bottom-sheet.git
   cd react-native-bottom-sheet
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Verify setup**

   ```bash
   npm run lint
   npm test
   npm run build
   ```

   All three should complete without errors.

## Development workflow

1. **Create a branch** from `main` (or default branch):

   ```bash
   git checkout -b fix/short-description
   # or
   git checkout -b feat/short-description
   ```

2. **Make your changes** in `src/`. Do not modify `android/` or `ios/` (native code is out of scope for this repo).

3. **Run checks before committing**

   - Lint: `npm run lint`
   - Tests: `npm test`
   - Build: `npm run build`

4. **Commit** with a clear message, e.g.:

   - `fix: correct backdrop press when sheet is closing`
   - `feat: add prop X for Y`
   - `docs: clarify keyboardBehavior in README`

5. **Push** and open a **Pull Request** against the upstream `main` branch. Describe what changed and why; link any related issues.

## Code expectations

- **TypeScript** — keep types accurate; no `any` unless justified.
- **Lint** — the project uses ESLint; your changes must pass `npm run lint`.
- **Tests** — new behavior should be covered by tests in `__tests__/`; existing tests must stay green.
- **Build** — `npm run build` must succeed (output in `dist/`).
- **Exports** — use `export default`; avoid barrel `index` re-exports for new modules unless agreed.

## Pull request review

- A maintainer will review your PR. You may be asked for changes.
- Once approved, your PR will be merged. Thank you for contributing.

## Questions

If something is unclear, open a [GitHub Discussion](https://github.com/carlosmedina06/react-native-bottom-sheet/discussions) or an [Issue](https://github.com/carlosmedina06/react-native-bottom-sheet/issues).
