# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gulpstrap is a static site generator built with Gulp 4 that bundles Bootstrap 5, FontAwesome 5, jQuery, and Popper. It supports multi-theme styling with a hierarchical theme inheritance system.

## Commands

### Development
```bash
npm start
# or
gulp
```
Runs the default development workflow:
- Cleans `dist/` folder
- Compiles all assets (SCSS, JS, HTML)
- Copies dependencies and static files
- Starts BrowserSync server on `dist/`
- Watches for changes in `src/styles/**`, `src/scripts/**`, and `src/*.html`

### Production Build
```bash
npm run build
# or
gulp build
```
Builds production-ready assets without starting the dev server.

## Architecture

### Build System (gulpfile.js)

The build process is defined in `gulpfile.js` with configuration in `gulp.constants.js`:

**Key tasks:**
- `cleanDist()` - Removes dist folder
- `compileSass()` - Compiles `src/styles/main.scss` to `dist/styles/`
- `compileCustomJavaScript()` - Copies user scripts from `src/scripts/` to `dist/scripts/`
- `copyJavaScriptDependencies()` - Copies Popper, Bootstrap, jQuery from node_modules
- `copyCssDependencies()` - Copies FontAwesome CSS
- `copyFontawesomeFonts()` - Copies FontAwesome webfonts
- `copyHtml()` - Copies HTML files from `src/` to `dist/`
- `copyAssets()` - Copies `src/assets/` preserving structure
- `copyIcons()` - Copies favicon files from `src/assets/icons/` to `dist/`

### Theme System

The theming system uses a hierarchical inheritance model:

**Entry point:** `src/styles/main.scss`
1. Imports `themes/active_theme_variables.scss` - Bootstrap variable overrides
2. Imports `vendors/bootstrap/bootstrap.scss` - Bootstrap core
3. Imports `themes/active_theme.scss` - Theme-specific styles

**Theme hierarchy:**
- `whitelabel/` - Base theme with universal Bootstrap overrides
- `theme1/` - Inherits from whitelabel
- `theme1-dark/` - Dark variant inheriting from theme1

**Switching themes:**
Edit these two files to point to desired theme:
- `src/styles/themes/active_theme.scss` - Change `@import './theme1-dark'`
- `src/styles/themes/active_theme_variables.scss` - Change `@import 'theme1-dark/variables'`

**Theme structure:**
```
themes/
├── active_theme_variables.scss  # Points to active theme variables
├── active_theme.scss            # Points to active theme styles
├── whitelabel/
│   ├── _variables.scss          # Bootstrap overrides
│   ├── _styles.scss             # Custom styles
│   ├── index.scss               # Imports variables + base
│   └── base/
│       ├── _colors.scss
│       ├── _typography.scss
│       └── index.scss
├── theme1/                       # Inherits whitelabel
│   ├── _variables.scss
│   ├── _styles.scss
│   └── base/
│       ├── _colors.scss
│       └── _typography.scss
└── theme1-dark/                  # Inherits theme1
    ├── _variables.scss
    └── _styles.scss
```

**Customization:**
- Override Bootstrap variables: Edit `whitelabel/_variables.scss`
- Override colors: Edit `whitelabel/base/_colors.scss`
- Override typography: Edit `whitelabel/base/_typography.scss`
- Theme-specific overrides: Edit specific theme folder (e.g., `theme1/`)
- Add Bootstrap components: Edit `vendors/bootstrap/bootstrap.scss`

### Source Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── scripts/         # Custom JavaScript files
├── styles/          # SCSS files (themes, vendors)
└── *.html           # HTML pages
```

### Dependencies

JavaScript dependencies are configured in `gulp.constants.js`:
- Popper (UMD build with source maps)
- Bootstrap JS (with source maps)
- jQuery

CSS dependencies:
- FontAwesome CSS (Bootstrap is compiled from SCSS)

## Important Notes

- The active theme is currently set to `theme1-dark`
- Dark themes should inherit from their light parent theme
- Bootstrap is compiled from source to allow variable customization
- All compiled output goes to `dist/` which is served by BrowserSync
- Sass uses `quietDeps: true` and silences import/global-builtin/color-functions deprecations
