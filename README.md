# [Bootstrap 5.3, FontAwesome 5, jQuery, and Popper using Gulp 5](https://gulpstrap.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/fc05ecaa-ee9b-4f2c-920f-04fcf3f6874c/deploy-status)](https://app.netlify.com/sites/gulpstrap/deploys)

A modern static site generator built with Gulp that bundles Bootstrap, FontAwesome, jQuery, and Popper. Perfect for rapid prototyping with multi-theme support.

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

## 📁 Project Structure

```
gulpstrap/
├── src/                    # Source files
│   ├── assets/            # Static assets (images, icons, etc.)
│   ├── scripts/           # Custom JavaScript
│   ├── styles/            # SCSS files
│   └── *.html             # HTML pages
└── dist/                  # Compiled output (generated)
    ├── assets/
    ├── scripts/
    ├── styles/
    └── *.html
```

## 🎨 Styling and Themes

### Theme Hierarchy

The project uses a hierarchical theme system:

- **`whitelabel/`** - Base theme with universal Bootstrap overrides
- **`theme1/`** - Inherits from whitelabel
- **`theme1-dark/`** - Dark variant inheriting from theme1

### Customizing Styles

**Global Bootstrap Overrides:**

- Variables: `src/styles/themes/whitelabel/_variables.scss`
- Colors: `src/styles/themes/whitelabel/base/_colors.scss`
- Typography: `src/styles/themes/whitelabel/base/_typography.scss`

**Theme-Specific Styles:**
Edit files in `src/styles/themes/theme1/` or `src/styles/themes/theme1-dark/`

**Bootstrap Components:**
Add/remove Bootstrap modules in `src/styles/vendors/bootstrap/bootstrap.scss`

### Switching Themes

To change the active theme, update these two files:

**1. `src/styles/themes/active_theme_variables.scss`**

```scss
@import 'node_modules/bootstrap/scss/functions';
@import 'theme1-dark/variables'; // Change this line
```

**2. `src/styles/themes/active_theme.scss`**

```scss
@import './theme1-dark'; // Change this line
```

Currently active: **theme1-dark**

### Theme Structure

```
src/styles/
├── themes/
│   ├── active_theme_variables.scss  # Points to active theme
│   ├── active_theme.scss            # Points to active theme
│   │
│   ├── whitelabel/                  # Base theme
│   │   ├── _variables.scss
│   │   ├── _styles.scss
│   │   ├── index.scss
│   │   └── base/
│   │       ├── _colors.scss
│   │       ├── _typography.scss
│   │       └── index.scss
│   │
│   ├── theme1/                      # Light theme
│   │   ├── _variables.scss
│   │   ├── _styles.scss
│   │   └── base/
│   │       ├── _colors.scss
│   │       └── _typography.scss
│   │
│   └── theme1-dark/                 # Dark theme
│       ├── _variables.scss
│       └── _styles.scss
│
└── vendors/
    └── bootstrap/
        └── bootstrap.scss
```

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
