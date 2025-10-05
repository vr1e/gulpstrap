# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Gulpstrap is a static site generator built with Gulp 5 that bundles Bootstrap 5, FontAwesome 5, jQuery, and Popper. Features multi-theme styling with hierarchical inheritance.

## Commands

```bash
npm start                        # Development server with live reload
npm run dev                      # Same as npm start
npm run build                    # Production build
npm run clean                    # Remove dist folder
npm run format                   # Format code with Prettier
npm run create-theme <name>      # Create a new theme (optionally specify parent)
```

## Architecture

### Build System

Configuration in `gulpfile.js` and `gulp.constants.js`.

**Key gulp tasks:**

- `cleanDist()` - Remove dist folder
- `compileSass()` - Compile active theme SCSS to CSS with sourcemaps (dev) or minified (prod)
- `compileAllThemes()` - Compile all themes for runtime switching
- `compileCustomJavaScript()` - Process custom JS with sourcemaps (dev) or minified (prod)
- `copyJavaScriptDependencies()` - Copy Popper, Bootstrap, jQuery from node_modules
- `copyCssDependencies()` - Copy FontAwesome CSS
- `copyFontawesomeFonts()` - Copy FontAwesome webfonts
- `copyHtml()` - Copy HTML files from root and `pages/` directory (with cache busting in production)
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

## Modern Features

### Multiple Page Support

Place HTML files in `src/pages/` with any nested structure. Files are copied to `dist/` preserving directory structure.

**Breadcrumbs:**
Add `<div data-breadcrumb></div>` to any page and include `scripts/breadcrumbs.js` to auto-generate breadcrumbs.

**Example:**
```
src/pages/examples/sample.html → dist/pages/examples/sample.html
```

### Runtime Theme Switching

Themes are compiled to separate CSS files and can be switched at runtime without page reload.

**Files:**
- `src/scripts/theme-switcher.js` - Core theme switching logic with localStorage
- `src/scripts/theme-picker.js` - UI component for theme selection
- Compiled themes: `dist/styles/themes/main-{theme-name}.css`

**Usage:**
Add `<div data-theme-picker></div>` to your HTML to show theme picker dropdown.

**JavaScript API:**
```javascript
ThemeSwitcher.switchTheme('theme1-dark');
ThemeSwitcher.getCurrentTheme();
ThemeSwitcher.getAvailableThemes();
```

### Theme CLI Tool

Generate new themes with proper inheritance structure:

```bash
npm run create-theme my-theme              # Creates theme inheriting from whitelabel
npm run create-theme my-dark-theme theme1  # Creates theme inheriting from theme1
```

**Generated structure:**
- `_variables.scss` - Bootstrap variable overrides
- `_styles.scss` - Custom theme styles
- `index.scss` - Complete theme entry point with Bootstrap
- `base/_colors.scss` - Color definitions (if parent has it)
- `base/_typography.scss` - Typography definitions (if parent has it)

**After creating a theme:**
1. Edit theme files to customize
2. Add theme to `compileAllThemes()` in `gulpfile.js`
3. Add theme to `THEMES` object in `src/scripts/theme-switcher.js`
4. Run `npm start` to compile

## Important Notes

- **gulp-plumber** prevents watch crashes on errors
- **Prettier** formats code (`.prettierrc`)
- Bootstrap compiled from source for variable customization
- Watch tasks optimized for incremental builds (only rebuilds changed file types)
- Production builds include minification, cache busting, and image optimization
- Themes use localStorage for persistence across sessions
- All themes compile in parallel for optimal build performance
