// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

/* Base paths */
const BASE_PATHS = {
	src: 'src/',
	dist: 'dist/',
	nodeModules: 'node_modules/'
};

/* Source paths */
const SRC_PATHS = {
	scripts: `${BASE_PATHS.src}scripts/`,
	styles: `${BASE_PATHS.src}styles/`,
	assets: `${BASE_PATHS.src}assets/`,
	html: BASE_PATHS.src,
	pages: `${BASE_PATHS.src}pages/`
};

/* Distribution paths */
const DEST_PATHS = {
	scripts: `${BASE_PATHS.dist}scripts/`,
	styles: `${BASE_PATHS.dist}styles/`,
	assets: `${BASE_PATHS.dist}assets/`,
	webfonts: `${BASE_PATHS.dist}webfonts/`,
	html: BASE_PATHS.dist
};

/* File patterns */
const FILE_PATTERNS = {
	scripts: `${SRC_PATHS.scripts}*.js`,
	styles: `${SRC_PATHS.styles}**/*.scss`,
	html: [`${SRC_PATHS.html}*.html`, `${SRC_PATHS.pages}**/*.html`],
	assets: `${SRC_PATHS.assets}**/*`,
	icons: `${SRC_PATHS.assets}icons/*`
};

/* Watch patterns */
const WATCH_PATTERNS = {
	styles: `${SRC_PATHS.styles}**/*.scss`,
	scripts: `${SRC_PATHS.scripts}**/*.js`,
	html: [`${SRC_PATHS.html}*.html`, `${SRC_PATHS.pages}**/*.html`],
	assets: `${SRC_PATHS.assets}**/*`
};

/* JavaScript dependencies from node_modules */
const jsDependencies = [
	`${BASE_PATHS.nodeModules}@popperjs/core/dist/umd/popper.min.js`,
	`${BASE_PATHS.nodeModules}@popperjs/core/dist/umd/popper.min.js.map`,
	`${BASE_PATHS.nodeModules}bootstrap/dist/js/bootstrap.js`,
	`${BASE_PATHS.nodeModules}bootstrap/dist/js/bootstrap.js.map`,
	`${BASE_PATHS.nodeModules}jquery/dist/jquery.js`
];

/* CSS dependencies from node_modules (excluding Bootstrap - compiled from source) */
const cssDependencies = [`${BASE_PATHS.nodeModules}@fortawesome/fontawesome-free/css/all.css`];

/* Font dependencies */
const fontDependencies = {
	fontawesome: `${BASE_PATHS.nodeModules}@fortawesome/fontawesome-free/webfonts/**`
};

/* Build configuration options */
const BUILD_CONFIG = {
	// Environment
	isProduction,
	isDevelopment: !isProduction,

	// Sourcemaps
	sourcemaps: !isProduction,

	// Minification
	minifyCSS: isProduction,
	minifyJS: isProduction,

	// Cache busting
	cacheBusting: isProduction,

	// Image optimization
	optimizeImages: isProduction,

	// Sass options
	sass: {
		loadPaths: ['.', BASE_PATHS.nodeModules],
		quietDeps: true,
		silenceDeprecations: ['import', 'global-builtin', 'color-functions']
	},

	// Autoprefixer options
	autoprefixer: {
		// Uses browserslist from package.json
	},

	// CleanCSS options
	cleanCSS: {
		compatibility: 'ie11'
	}
};

/* Legacy exports for backward compatibility */
exports.paths = {
	scripts: FILE_PATTERNS.scripts,
	styles: SRC_PATHS.styles,
	dist: BASE_PATHS.dist,
	dest: DEST_PATHS.scripts,
	assets: SRC_PATHS.assets,
	watch: Object.values(WATCH_PATTERNS)
};

exports.jsDependencies = jsDependencies;
exports.cssDependencies = cssDependencies;

/* New structured exports */
exports.BASE_PATHS = BASE_PATHS;
exports.SRC_PATHS = SRC_PATHS;
exports.DEST_PATHS = DEST_PATHS;
exports.FILE_PATTERNS = FILE_PATTERNS;
exports.WATCH_PATTERNS = WATCH_PATTERNS;
exports.fontDependencies = fontDependencies;
exports.BUILD_CONFIG = BUILD_CONFIG;
