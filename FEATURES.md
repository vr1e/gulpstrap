# Modern Features Guide

This guide covers the modern development features added to Gulpstrap.

## 🎨 Runtime Theme Switching

Switch between themes dynamically without reloading the page. Theme preference is saved to localStorage.

### Quick Start

1. **Add theme picker to your HTML:**
   ```html
   <div data-theme-picker></div>
   ```
   The picker automatically renders as a **Bootstrap 5 dropdown** component with proper styling and accessibility.

2. **Include required scripts:**
   ```html
   <script src="scripts/theme-switcher.js"></script>
   <script src="scripts/theme-picker.js"></script>
   ```

3. **Remove static theme CSS link:**
   Remove `<link rel="stylesheet" href="./styles/main.css" />` from your HTML as themes load dynamically.

**Note:** The theme picker uses Bootstrap 5.3+ components with modern color modes. It automatically applies `data-bs-theme="dark"` to the dropdown when using dark themes, following Bootstrap's latest best practices instead of the deprecated `.dropdown-menu-dark` class.

### JavaScript API

```javascript
// Switch to a different theme
ThemeSwitcher.switchTheme('theme1-dark');

// Get current active theme
const current = ThemeSwitcher.getCurrentTheme(); // 'theme1-dark'

// Get all available themes
const themes = ThemeSwitcher.getAvailableThemes();
// Returns: [{ id: 'whitelabel', name: 'Whitelabel', active: false }, ...]
```

### Listen to Theme Changes

```javascript
document.addEventListener('themeChanged', function(e) {
  console.log('Theme changed to:', e.detail.themeName);
  console.log('Theme ID:', e.detail.themeId);
});
```

## 📄 Multiple Page Support

Create nested page structures with automatic directory preservation and breadcrumb generation.

### Directory Structure

```
src/
├── index.html              → dist/index.html
└── pages/
    ├── about.html          → dist/pages/about.html
    ├── blog/
    │   ├── index.html      → dist/pages/blog/index.html
    │   └── post-1.html     → dist/pages/blog/post-1.html
    └── products/
        └── item.html       → dist/pages/products/item.html
```

### Breadcrumbs

Auto-generate breadcrumbs on any page:

```html
<!-- Add to your page -->
<div data-breadcrumb></div>

<!-- Include the script -->
<script src="../../scripts/breadcrumbs.js"></script>
```

**Features:**
- Automatic path parsing
- Capitalizes and formats segment names
- Removes `.html` extension from display
- Uses Bootstrap breadcrumb styling
- Active item has `aria-current="page"`

**Example output for `/pages/blog/my-post.html`:**
```
Home > Blog > My Post
```

## 🛠️ Theme CLI Tool

Generate new themes with proper structure and inheritance.

### Create a Theme

```bash
# Create theme inheriting from whitelabel (default)
npm run create-theme my-awesome-theme

# Create theme inheriting from another theme
npm run create-theme my-dark-theme theme1
```

### Generated Files

```
src/styles/themes/my-awesome-theme/
├── index.scss              # Complete theme entry point
├── _variables.scss         # Bootstrap variable overrides
├── _styles.scss           # Custom theme styles
└── base/
    ├── index.scss         # Base styles index
    ├── _colors.scss       # Color definitions
    └── _typography.scss   # Typography definitions
```

### Making Your Theme Available

After creating a theme, follow these steps to make it available for use:

#### 1. Update `gulpfile.js`

Add your theme to the `compileAllThemes()` function:

```javascript
function compileAllThemes() {
  const rename = require('gulp-rename');
  const themes = ['whitelabel', 'theme1', 'theme1-dark', 'my-awesome-theme']; // Add here
  // ... rest of function
}
```

#### 2. Update `src/scripts/theme-switcher.js`

Add your theme to the THEMES object:

```javascript
const THEMES = {
  whitelabel: {
    name: 'Whitelabel',
    file: '/styles/themes/main-whitelabel.css'
  },
  theme1: {
    name: 'Theme 1',
    file: '/styles/themes/main-theme1.css'
  },
  'theme1-dark': {
    name: 'Theme 1 Dark',
    file: '/styles/themes/main-theme1-dark.css'
  },
  'my-awesome-theme': {
    name: 'My Awesome Theme',
    file: '/styles/themes/main-my-awesome-theme.css'
  }
};
```

#### 3. Compile and Test

```bash
npm start
```

Your new theme will be compiled and available in the theme picker!

### Customizing Your Theme

#### Variables (`_variables.scss`)

Override Bootstrap variables:

```scss
// my-awesome-theme/_variables.scss
@import '../whitelabel/variables';

$primary: #ff6b6b;
$secondary: #4ecdc4;
$body-bg: #f7f7f7;
$font-family-base: 'Inter', sans-serif;
```

#### Custom Styles (`_styles.scss`)

Add theme-specific styles:

```scss
// my-awesome-theme/_styles.scss

.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-primary {
  border-radius: 8px;
  font-weight: 600;
}
```

#### Colors (`base/_colors.scss`)

Define custom color variables:

```scss
// my-awesome-theme/base/_colors.scss
@import '../../../whitelabel/base/colors';

$accent-color: #ffd93d;
$highlight-color: #6bcf7f;
```

## 📁 Project Structure

```
gulpstrap/
├── scripts/
│   └── create-theme.js          # Theme generator CLI
├── src/
│   ├── index.html               # Root page
│   ├── pages/                   # Nested pages (new!)
│   │   └── examples/
│   │       └── sample.html
│   ├── scripts/
│   │   ├── breadcrumbs.js       # Breadcrumb generator (new!)
│   │   ├── theme-switcher.js    # Theme switching logic (new!)
│   │   ├── theme-picker.js      # Theme picker UI (new!)
│   │   └── index.js
│   └── styles/
│       └── themes/
│           ├── whitelabel/
│           ├── theme1/
│           └── theme1-dark/
└── dist/                         # Build output
    ├── pages/                    # Nested pages output (new!)
    └── styles/
        └── themes/               # Compiled themes (new!)
            ├── main-whitelabel.css
            ├── main-theme1.css
            └── main-theme1-dark.css
```

## 🎯 Best Practices

### Theme Development

1. **Start simple:** Begin with a child theme of whitelabel
2. **Use variables:** Prefer Bootstrap variables over custom CSS
3. **Test inheritance:** Ensure styles cascade properly from parent themes
4. **Mobile first:** Always test responsive behavior

### Multi-Page Sites

1. **Use relative paths:** Account for nested directory depth
2. **Consistent navigation:** Include breadcrumbs for deep hierarchies
3. **Shared components:** Consider creating reusable HTML snippets
4. **SEO friendly:** Use proper heading hierarchy and meta tags

### Performance

1. **Themes compile in parallel:** Build performance stays fast
2. **localStorage caching:** Theme preference loads instantly
3. **Lazy theme loading:** Only selected theme CSS is loaded
4. **Production builds:** Automatic minification and cache busting

## 🐛 Troubleshooting

### Theme not appearing in picker

- Check that theme is added to `compileAllThemes()` in gulpfile.js
- Verify theme exists in `THEMES` object in theme-switcher.js
- Run `npm start` to recompile themes

### Breadcrumbs not showing

- Ensure `breadcrumbs.js` is included in your HTML
- Check that `data-breadcrumb` attribute is present
- Verify script loads after DOM is ready

### Nested pages not copying

- Confirm files are in `src/pages/` directory
- Check file has `.html` extension
- Verify gulp watch is running

### Theme styles not loading

- Check browser console for 404 errors
- Verify theme CSS files exist in `dist/styles/themes/`
- Ensure theme-switcher.js loads before theme-picker.js

## 💡 Examples

See working examples:

- **Theme switching:** `src/index.html`
- **Nested page with breadcrumbs:** `src/pages/examples/sample.html`
- **Theme creation:** Run `npm run create-theme` for CLI help

## 🚀 Next Steps

1. **Create a custom theme:** `npm run create-theme my-brand`
2. **Build a multi-page site:** Add pages to `src/pages/`
3. **Customize the experience:** Edit theme variables and styles
4. **Deploy:** Run `npm run build` for production-ready output
