# [Gulpstrap](https://gulpstrap.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/fc05ecaa-ee9b-4f2c-920f-04fcf3f6874c/deploy-status)](https://app.netlify.com/sites/gulpstrap/deploys)

A modern static site generator built with Gulp 5 that bundles Bootstrap 5.3, FontAwesome 5, jQuery, and Popper. Features runtime theme switching, hierarchical theme inheritance, and multi-page support with automatic breadcrumbs.

## 🚧 Installation

**Requirements:**

- [Node.js](https://nodejs.org/) v22 or higher

Install project dependencies:

```bash
cd gulpstrap
npm install
```

## 🚀 Getting Started

### Development Mode

Start the development server with live reload:

```bash
npm start
```

This will:

- Clean and rebuild the `dist/` folder
- Compile SCSS to CSS
- Copy all assets and dependencies
- Start BrowserSync server at `http://localhost:3000`
- Watch for changes and auto-reload browser

### Production Build

Build optimized assets for deployment:

```bash
npm run build
```

This creates a production-ready `dist/` folder without starting the dev server.

## ✨ Features

- **🎨 Runtime Theme Switching** - Switch themes without page reload, persists in localStorage
- **📄 Multi-Page Support** - Nested HTML structure with automatic breadcrumbs
- **🛠️ Theme CLI Tool** - Auto-generate themes with proper inheritance
- **🚀 Production Ready** - Minification, cache busting, and image optimization
- **⚡ Fast Development** - Live reload with BrowserSync

## 📁 Project Structure

```
gulpstrap/
├── src/
│   ├── assets/            # Static assets
│   ├── pages/             # Nested HTML pages
│   ├── scripts/           # Custom JavaScript
│   │   ├── breadcrumbs.js
│   │   ├── theme-switcher.js
│   │   └── theme-picker.js
│   ├── styles/
│   │   └── themes/        # Theme files
│   └── *.html
└── dist/                  # Build output
    ├── pages/
    ├── styles/
    │   └── themes/        # Compiled theme CSS
    └── *.html
```

## 🔧 Available Commands

```bash
npm start                              # Start dev server with live reload
npm run dev                            # Same as npm start
npm run build                          # Production build
npm run clean                          # Remove dist folder
npm run format                         # Format code with Prettier
npm run create-theme <name> [parent]   # Create new theme
```

## 🎨 Themes

### Creating a Theme

```bash
# Create theme inheriting from whitelabel (default)
npm run create-theme my-theme

# Create theme inheriting from another theme
npm run create-theme my-dark theme1
```

This automatically:

1. Creates theme directory structure
2. Updates `gulpfile.js` to compile the theme
3. Updates `theme-switcher.js` to make it available in the picker

### Customizing a Theme

Edit your theme's files:

- `_variables.scss` - Override Bootstrap variables
- `_styles.scss` - Add custom styles
- `base/_colors.scss` - Define color variables
- `base/_typography.scss` - Define typography

**Enable dark mode:**

```scss
// In _variables.scss
$enable-dark-mode: true;
```

### Using Themes

**Add theme picker to your HTML:**

```html
<div data-theme-picker></div>

<script src="scripts/theme-switcher.js"></script>
<script src="scripts/theme-picker.js"></script>
```

**Or use JavaScript API:**

```javascript
ThemeSwitcher.switchTheme('theme1-dark');
ThemeSwitcher.getCurrentTheme();
ThemeSwitcher.getAvailableThemes();
```

### Theme Hierarchy

- `whitelabel/` - Base theme
- `theme1/` - Inherits whitelabel
- `theme1-dark/` - Inherits theme1 (dark mode)

## 📄 Multi-Page Support

Create nested page structures - the build system preserves directory structure:

```
src/pages/about.html           → dist/pages/about.html
src/pages/blog/post.html       → dist/pages/blog/post.html
src/pages/products/item.html   → dist/pages/products/item.html
```

**Add breadcrumbs:**

```html
<div data-breadcrumb></div>
<script src="../../scripts/breadcrumbs.js"></script>
```

Automatically generates Bootstrap breadcrumbs from the URL path.

## 🛠️ Tech Stack

- **[Bootstrap 5.3](https://getbootstrap.com/)** - Responsive front-end framework
- **[Font Awesome 5.15](http://fontawesome.io/)** - Icon toolkit
- **[jQuery 3.7](https://jquery.com/)** - JavaScript library
- **[Popper 2.11](https://popper.js.org/)** - Tooltip & popover positioning
- **[Gulp 5](https://gulpjs.com/)** - Build automation
- **[Sass](https://sass-lang.com/)** - CSS preprocessor
- **[BrowserSync 3](https://browsersync.io/)** - Development server with live reload
- **[Node.js 22](https://nodejs.org)** - JavaScript runtime

## 📄 License

MIT
