# Gulp 4, Bootstrap 4, Fontawesome 5 and jQuery

Use this to startup your project with gulp tasks in a couple of seconds.

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

The default theme is inside `_white_label` folder and it holds universal bootstrap overrides for all themes inside the `_variables.scss` file. The other themes example `theme1` inherit from `_white_label` and dark version of themes should inherit from it's light (default) theme. for example `theme1-dark` from `theme1`.

To **change default bootstrap variables** edit: `/src/styles/themes/_white_label/_variables.scss`.

To **change current active theme** add it with same structure as example `theme1` and change the path inside: `/src/styles/themes/active_theme.scss` and for the bootstrap variables import edit `/src/styles/vendors/bootstrap/bootstrap.scss`.

Add more bootstrap partial functionalities by editing: `src/styles/vendors/bootstrap/bootstrap.scss`.

### Tech

- [node.js](https://nodejs.org) - Node.js JavaScript runtime
- [Gulp](https://gulpjs.com/) - Automate and enhance your workflow
- [Font Awesome](http://fontawesome.io/) - The iconic font and CSS toolkit
- [Twitter Bootstrap](https://getbootstrap.com/) - Build responsive, mobile-first projects on the web with the world’s most popular front-end component library
- [jQuery](https://jquery.com/) - Write less do more library
