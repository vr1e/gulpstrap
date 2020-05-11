/* Default paths */
export const paths = {
	sctipts: 'src/scripts/*.js',
	styles: 'src/styles/',
	dist: 'dist/',
	dest: 'dist/scripts/',
	lib: 'src/scripts/',
	watch: ['src/styles/**', 'src/scripts/**', 'src/*.html']
};

export const jsDependencies = [
	'node_modules/bootstrap/dist/js/bootstrap.js',
	'node_modules/bootstrap/dist/js/bootstrap.js.map',
	'node_modules/jquery/dist/jquery.js',
	'node_modules/popper.js/dist/umd/popper.js',
	'node_modules/popper.js/dist/umd/popper.js.map'
];

export const cssDependencies = [
	'node_modules/@fortawesome/fontawesome-free/css/all.css'
];
