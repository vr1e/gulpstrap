const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const { rm } = require('fs/promises');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev').default;
const revRewrite = require('gulp-rev-rewrite').default;
const { paths, jsDependencies, cssDependencies } = require('./gulp.constants');

const server = browserSync.create();

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Lazy-load imagemin (ESM module)
let imageminPlugin;
async function loadImagemin() {
	if (!imageminPlugin) {
		const imagemin = await import('gulp-imagemin');
		imageminPlugin = imagemin.default;
	}
	return imageminPlugin;
}

/* cleans dist folder */
function cleanDist() {
	return rm('dist', { recursive: true, force: true });
}

/* compiles user written javascript */
function compileCustomJavaScript() {
	let stream = gulp.src(paths.scripts);

	// Add sourcemaps only in development
	if (!isProduction) {
		stream = stream.pipe(sourcemaps.init());
	}

	// Minify JS in production
	if (isProduction) {
		stream = stream.pipe(uglify());
	}

	// Write sourcemaps only in development
	if (!isProduction) {
		stream = stream.pipe(sourcemaps.write('.'));
	}

	// Add cache busting in production
	if (isProduction) {
		stream = stream.pipe(rev());
	}

	stream = stream.pipe(gulp.dest(paths.dest));

	// Write rev manifest in production
	if (isProduction) {
		stream = stream
			.pipe(rev.manifest('js-manifest.json'))
			.pipe(gulp.dest(paths.dist));
	}

	return stream;
}

/* copies static assets preserving folder structure */
async function copyAssets() {
	let stream = gulp.src(['./src/assets/**/*'], { encoding: false });

	// Optimize images in production
	if (isProduction) {
		const imagemin = await loadImagemin();
		stream = stream.pipe(imagemin());
	}

	return stream.pipe(gulp.dest(`${paths.dist}assets/`));
}

/* copies static assets preserving folder structure */
function copyIcons() {
	return gulp
		.src(['./src/assets/icons/*'], { encoding: false })
		.pipe(gulp.dest(`${paths.dist}`));
}

/* copies all html files from root */
function copyHtml() {
	const { readFileSync, existsSync } = require('fs');
	let stream = gulp.src(['./src/*.html']);

	// Rewrite asset references with hashed filenames in production
	if (isProduction) {
		const cssManifestPath = `${paths.dist}css-manifest.json`;
		const jsManifestPath = `${paths.dist}js-manifest.json`;

		// Merge manifests
		const combinedManifest = {};
		if (existsSync(cssManifestPath)) {
			Object.assign(
				combinedManifest,
				JSON.parse(readFileSync(cssManifestPath, 'utf8'))
			);
		}
		if (existsSync(jsManifestPath)) {
			Object.assign(
				combinedManifest,
				JSON.parse(readFileSync(jsManifestPath, 'utf8'))
			);
		}

		if (Object.keys(combinedManifest).length > 0) {
			stream = stream.pipe(
				revRewrite({
					manifest: Buffer.from(JSON.stringify(combinedManifest))
				})
			);
		}
	}

	return stream.pipe(gulp.dest(paths.dist));
}

/* copies third party javascript dependencies */
function copyJavaScriptDependencies() {
	return gulp
		.src(jsDependencies, { encoding: false })
		.pipe(gulp.dest(paths.dest));
}

/* copies fontawesome font dependencies */
function copyFontawesomeFonts(done) {
	gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'], {
			encoding: false
		})
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
	done();
}

/* compiles all user styles including bootstrap and other imports */
function compileSass() {
	let stream = gulp.src(`${paths.styles}main.scss`);

	// Add sourcemaps only in development
	if (!isProduction) {
		stream = stream.pipe(sourcemaps.init());
	}

	stream = stream.pipe(
		sass
			.sync({
				loadPaths: ['.', 'node_modules'],
				quietDeps: true,
				silenceDeprecations: ['import', 'global-builtin', 'color-functions']
			})
			.on('error', sass.logError)
	);

	// Add autoprefixer for cross-browser compatibility
	stream = stream.pipe(autoprefixer());

	// Minify CSS in production
	if (isProduction) {
		stream = stream.pipe(cleanCSS({ compatibility: 'ie11' }));
	}

	// Write sourcemaps only in development
	if (!isProduction) {
		stream = stream.pipe(sourcemaps.write('.'));
	}

	// Add cache busting in production
	if (isProduction) {
		stream = stream.pipe(rev());
	}

	stream = stream.pipe(gulp.dest(`${paths.dist}styles/`));

	// Write rev manifest in production
	if (isProduction) {
		stream = stream
			.pipe(rev.manifest('css-manifest.json'))
			.pipe(gulp.dest(paths.dist));
	}

	return stream;
}

/* copies third party css dependencies */
function copyCssDependencies() {
	return gulp
		.src(cssDependencies, { encoding: false })
		.pipe(gulp.dest(`${paths.dist}styles/`));
}

function reloadServer(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		server: {
			baseDir: 'dist/'
		}
	});
	done();
}

function watch() {
	gulp.watch(
		paths.watch,
		gulp.series(
			copyAssets,
			copyHtml,
			compileSass,
			compileCustomJavaScript,
			reloadServer
		)
	);
}

/* default development gulp command */
exports.default = gulp.series(
	cleanDist,
	copyAssets,
	copyIcons,
	copyHtml,
	copyFontawesomeFonts,
	copyJavaScriptDependencies,
	copyCssDependencies,
	compileSass,
	compileCustomJavaScript,
	serve,
	watch
);

/* build for deployment */
exports.build = gulp.series(
	cleanDist,
	gulp.parallel(
		copyAssets,
		copyIcons,
		copyFontawesomeFonts,
		copyJavaScriptDependencies,
		copyCssDependencies,
		compileSass,
		compileCustomJavaScript
	),
	// Copy HTML after CSS/JS compilation in production (for cache busting)
	copyHtml
);
