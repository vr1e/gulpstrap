/* Default paths */
exports.paths = {
	scripts: 'src/scripts/*.js',
	styles: 'src/styles/',
	dist: 'dist/',
	dest: 'dist/scripts/',
	lib: 'src/scripts/',
	assets: 'src/assets/',
	watch: ['src/styles/**', 'src/scripts/**', 'src/*.html']
};

exports.jsDependencies = [
	'node_modules/@popperjs/core/dist/umd/popper.min.js',
	'node_modules/@popperjs/core/dist/umd/popper.min.js.map',
	'node_modules/bootstrap/dist/js/bootstrap.js',
	'node_modules/bootstrap/dist/js/bootstrap.js.map',
	'node_modules/jquery/dist/jquery.js'
];

/* Vendor css dependencies - excluding bootstrap because of variables inside our custom css */
exports.cssDependencies = [
	'node_modules/@fortawesome/fontawesome-free/css/all.css'
];
