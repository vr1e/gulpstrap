# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Gulpstrap is a static site generator built with Gulp 5 that bundles Bootstrap 5, FontAwesome 5, jQuery, and Popper. Features runtime theme switching with hierarchical inheritance and automatic breadcrumb generation.

## Commands

```bash
npm start                              # Development server with live reload
npm run dev                            # Same as npm start
npm run build                          # Production build
npm run clean                          # Remove dist folder
npm run format                         # Format code with Prettier
npm run create-theme <name> [parent]   # Create new theme (auto-updates config)
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

**Runtime Switching:** Themes compile to separate CSS files and switch dynamically without page reload. Theme preference persists in localStorage.

**Hierarchy:**

- `whitelabel/` - Base theme
- `theme1/` - Inherits whitelabel
- `theme1-dark/` - Inherits theme1 (dark mode enabled)

**Creating a Theme:**

```bash
npm run create-theme my-theme              # Inherits from whitelabel
npm run create-theme my-dark theme1        # Inherits from theme1
```

This automatically:

1. Creates theme directory with proper structure
2. Updates `gulpfile.js` to compile the theme
3. Updates `theme-switcher.js` to make it available

**Theme Structure:**

```
themes/
├── whitelabel/
│   ├── index.scss               # Complete theme entry point
│   ├── _variables.scss          # Bootstrap overrides
│   ├── _styles.scss             # Custom styles
│   └── base/
│       ├── index.scss
│       ├── _colors.scss
│       └── _typography.scss
├── theme1/                       # Inherits whitelabel
│   ├── index.scss
│   ├── _variables.scss
│   ├── _styles.scss
│   └── base/
│       ├── _colors.scss
│       └── _typography.scss
└── theme1-dark/                  # Inherits theme1
    ├── index.scss
    ├── _variables.scss
    └── _styles.scss
```

**Each theme's index.scss follows this import order:**

1. Bootstrap functions
2. Parent theme variables (in inheritance order)
3. Current theme variables
4. Bootstrap core
5. Parent theme styles (in inheritance order)
6. Current theme styles

**Customization:**

- Bootstrap variables: Edit theme's `_variables.scss`
- Custom styles: Edit theme's `_styles.scss`
- Colors/Typography: Edit theme's `base/` files
- Bootstrap components: `vendors/bootstrap/bootstrap.scss`
- Dark mode: Set `$enable-dark-mode: true` in `_variables.scss`

## Dependencies

Configured in `gulp.constants.js`:

- Popper (UMD + sourcemaps)
- Bootstrap JS (+ sourcemaps)
- jQuery
- FontAwesome CSS

## Modern Features

### Multiple Page Support

Place HTML files in `src/pages/` with any nested structure. Files copy to `dist/` preserving directory structure.

**Breadcrumbs:**

```html
<div data-breadcrumb></div>
<script src="scripts/breadcrumbs.js"></script>
```

Auto-generates Bootstrap breadcrumbs based on URL path.

### Runtime Theme Switching

**Add theme picker:**

```html
<div data-theme-picker></div>
<script src="scripts/theme-switcher.js"></script>
<script src="scripts/theme-picker.js"></script>
```

**JavaScript API:**

```javascript
ThemeSwitcher.switchTheme('theme1-dark');
ThemeSwitcher.getCurrentTheme();
ThemeSwitcher.getAvailableThemes();

// Listen to changes
document.addEventListener('themeChanged', (e) => {
	console.log(e.detail.themeName);
});
```

**Dark mode:** Theme switcher automatically sets `data-bs-theme="dark"` on `<body>` for themes with "dark" in the name.

## Important Notes

- **gulp-plumber** prevents watch crashes on errors
- **Prettier** formats code (`.prettierrc`)
- Bootstrap compiled from source for variable customization
- Watch tasks optimized for incremental builds
- Production builds include minification, cache busting, and image optimization
- Themes use localStorage for persistence
- All themes compile in parallel
- `npm run create-theme` automatically updates `gulpfile.js` and `theme-switcher.js`
