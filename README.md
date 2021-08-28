# Gulp 4, Bootstrap 5, Fontawesome 5 and jQuery

Use this to startup your project using gulp in a couple of seconds.

### Installation

Requires [node.js](https://nodejs.org/) and [gulp-cli](https://www.npmjs.com/package/gulp-cli) installed globally (-g) to run.

```
npm install gulp-cli -g
```

Install the dependencies and devDependencies.

```
$ cd project
$ npm install
$ gulp
```

### Styling and themes

The default styling for all themes is inside `whitelabel` folder and it holds universal bootstrap overrides for all themes inside the `_variables.scss` file.

The other themes example `theme1` inherit from `whitelabel` and dark version of themes should inherit from it's light parent theme. for example `theme1-dark` from `theme1`.

To **override bootstrap variables** edit: `styles/themes/whitelabel/_variables.scss`.
To **override bootstrap colors** edit: `styles/themes/whitelabel/base/_colors.scss`.
To **override bootstrap typography** edit: `styles/themes/whitelabel/base/_typography.scss`.

To **override styles for specific theme** edit: `styles/themes/theme1`.

To **change current active theme** edit `theme1` and change the path inside: `styles/themes/active_theme.scss` and `styles/active_theme_variables.scss`.

Add more bootstrap optional components by editing: `styles/vendors/bootstrap/bootstrap.scss`.

```
styles/
├── themes/
│   ├── active_theme_variables.scss
│   ├── active_theme.scss
│   │
│   ├── theme1/
│   │   ├── _styles.scss
│   │   ├── _variables.scss
│   │   ├── index.scss
│   │   └── base/
│   │       ├── _colors.scss
│   │       ├── _typography.scss
│   │       └── index.scss
│   │
│   ├── theme1-dark/
│   │   ├── _styles.scss
│   │   ├── _variables.scss
│   │   └── index.scss
│   │
│   └── whitelabel/
│       ├── _styles.scss
│       ├── _variables.scss
│       ├── index.scss
│       └── base/
│           ├── _base.scss
│           ├── _colors.scss
│           ├── _typography.scss
│           └── index.scss
└──  vendors/
     └── bootstrap/
         └── bootstrap.scss
```

### Tech

- [node.js](https://nodejs.org) - Node.js JavaScript runtime
- [Gulp](https://gulpjs.com/) - Automate and enhance your workflow
- [Font Awesome](http://fontawesome.io/) - The iconic font and CSS toolkit
- [Twitter Bootstrap](https://getbootstrap.com/) - Build responsive, mobile-first projects on the web with the world’s most popular front-end component library
- [jQuery](https://jquery.com/) - Write less do more library
- [Popper](https://popper.js.org/) - Tooltip & popover positioning engine
