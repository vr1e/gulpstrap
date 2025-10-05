# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Gulpstrap is a static site generator built with Gulp 5 that bundles Bootstrap 5, FontAwesome 5, jQuery, and Popper. Features multi-theme styling with hierarchical inheritance.

## Commands

```bash
npm start          # Development server with live reload
npm run dev        # Same as npm start
npm run build      # Production build
npm run clean      # Remove dist folder
npm run format     # Format code with Prettier
```

## Architecture

### Build System

Configuration in `gulpfile.js` and `gulp.constants.js`.

**Key gulp tasks:**

- `cleanDist()` - Remove dist folder
- `compileSass()` - Compile SCSS to CSS with sourcemaps (dev) or minified (prod)
- `compileCustomJavaScript()` - Process custom JS with sourcemaps (dev) or minified (prod)
- `copyJavaScriptDependencies()` - Copy Popper, Bootstrap, jQuery from node_modules
- `copyCssDependencies()` - Copy FontAwesome CSS
- `copyFontawesomeFonts()` - Copy FontAwesome webfonts
- `copyHtml()` - Copy HTML files (with cache busting in production)
- `copyAssets()` - Copy assets (with image optimization in production)
- `copyIcons()` - Copy favicon files to dist root

### Theme System

Hierarchical inheritance model. Entry point: `src/styles/main.scss`

**Import order:**

1. `themes/active_theme_variables.scss` - Bootstrap variable overrides
2. `vendors/bootstrap/bootstrap.scss` - Bootstrap core
3. `themes/active_theme.scss` - Theme-specific styles

**Hierarchy:**

- `whitelabel/` - Base theme
- `theme1/` - Inherits whitelabel
- `theme1-dark/` - Inherits theme1 (currently active)

**To switch themes:**
Edit `active_theme.scss` and `active_theme_variables.scss` to point to desired theme.

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

- Bootstrap variables: `whitelabel/_variables.scss`
- Colors: `whitelabel/base/_colors.scss`
- Typography: `whitelabel/base/_typography.scss`
- Theme-specific: Edit specific theme folder
- Bootstrap components: `vendors/bootstrap/bootstrap.scss`

## Dependencies

Configured in `gulp.constants.js`:

- Popper (UMD + sourcemaps)
- Bootstrap JS (+ sourcemaps)
- jQuery
- FontAwesome CSS

## Important Notes

- **gulp-plumber** prevents watch crashes on errors
- **Prettier** formats code (`.prettierrc`)
- Bootstrap compiled from source for variable customization
- Watch tasks optimized for incremental builds (only rebuilds changed file types)
- Production builds include minification, cache busting, and image optimization
