# Gulp 4, Bootstrap 4, Fontawesome 5 and jQuery

Use this to startup your project with gulp tasks in a couple of seconds.

### Installation

Requires [node.js](https://nodejs.org/) and [gulp-cli](https://www.npmjs.com/package/gulp-cli) installed globally (-g) to run.

Install the dependencies and devDependencies.

```
$ cd project
$ npm install
$ gulp
```

### Styling

To _change default bootstrap variables_ edit: `/src/styles/themes/default_theme/_variables.scss`.

To _change current active theme_ add it with same structure as `default_theme` and change the path inside: `/src/styles/themes/active_theme.scss` and for the variables import edit `/src/styles/vendors/bootstrap/bootstrap.scss`.

Add more bootstrap partial functionalities by editing: `src/styles/vendors/bootstrap/bootstrap.scss`.

### Tech

- [node.js](https://nodejs.org) - Node.js JavaScript runtime
- [Gulp](https://gulpjs.com/) - Automate and enhance your workflow
- [Font Awesome](http://fontawesome.io/) - The iconic font and CSS toolkit
- [Twitter Bootstrap](https://getbootstrap.com/) - Build responsive, mobile-first projects on the web with the world’s most popular front-end component library
- [jQuery](https://jquery.com/) - Write less do more library
