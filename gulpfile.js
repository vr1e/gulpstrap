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
const plumber = require('gulp-plumber');
const { paths, jsDependencies, cssDependencies } = require('./gulp.constants');

const server = browserSync.create();

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Error handler for plumber
const errorHandler = (err) => {
	console.error('\x1b[31m%s\x1b[0m', `Error: ${err.message}`);
	this.emit('end');
};

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
	let stream = gulp.src(paths.scripts).pipe(plumber({ errorHandler }));

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
		stream = stream.pipe(rev.manifest('js-manifest.json')).pipe(gulp.dest(paths.dist));
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
	return gulp.src(['./src/assets/icons/*'], { encoding: false }).pipe(gulp.dest(`${paths.dist}`));
}

/* copies all html files from root and pages directory */
function copyHtml() {
	const { readFileSync, existsSync } = require('fs');
	// Support both root-level HTML and nested pages
	let stream = gulp.src(['./src/*.html', './src/pages/**/*.html'], { base: './src' });

	// Rewrite asset references with hashed filenames in production
	if (isProduction) {
		const cssManifestPath = `${paths.dist}css-manifest.json`;
		const jsManifestPath = `${paths.dist}js-manifest.json`;

		// Merge manifests
		const combinedManifest = {};
		if (existsSync(cssManifestPath)) {
			Object.assign(combinedManifest, JSON.parse(readFileSync(cssManifestPath, 'utf8')));
		}
		if (existsSync(jsManifestPath)) {
			Object.assign(combinedManifest, JSON.parse(readFileSync(jsManifestPath, 'utf8')));
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
	return gulp.src(jsDependencies, { encoding: false }).pipe(gulp.dest(paths.dest));
}

/* copies fontawesome font dependencies */
function copyFontawesomeFonts() {
	return gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'], {
			encoding: false
		})
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
}

/* compiles all user styles including bootstrap and other imports */
function compileSass() {
	let stream = gulp.src(`${paths.styles}main.scss`).pipe(plumber({ errorHandler }));

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
		stream = stream.pipe(rev.manifest('css-manifest.json')).pipe(gulp.dest(paths.dist));
	}

	return stream;
}

/* compiles all available themes for runtime switching */
function compileAllThemes() {
	const rename = require('gulp-rename');
	const themes = ['whitelabel', 'theme1', 'theme1-dark', 'monochrome'];

	return Promise.all(
		themes.map((theme) => {
			let stream = gulp
				.src(`${paths.styles}themes/${theme}/index.scss`)
				.pipe(plumber({ errorHandler }));

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

			// Add autoprefixer
			stream = stream.pipe(autoprefixer());

			// Minify CSS in production
			if (isProduction) {
				stream = stream.pipe(cleanCSS({ compatibility: 'ie11' }));
			}

			// Write sourcemaps only in development
			if (!isProduction) {
				stream = stream.pipe(sourcemaps.write('.'));
			}

			// Rename to theme-specific filename
			stream = stream.pipe(rename(`main-${theme}.css`));

			return stream.pipe(gulp.dest(`${paths.dist}styles/themes/`));
		})
	);
}

/* copies third party css dependencies */
function copyCssDependencies() {
	return gulp.src(cssDependencies, { encoding: false }).pipe(gulp.dest(`${paths.dist}styles/`));
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
	// Watch SCSS files - recompile main sass and all themes
	gulp.watch('src/styles/**/*.scss', gulp.series(compileSass, compileAllThemes, reloadServer));

	// Watch JS files - only recompile JavaScript
	gulp.watch('src/scripts/**/*.js', gulp.series(compileCustomJavaScript, reloadServer));

	// Watch HTML files - only copy HTML (including nested pages)
	gulp.watch(['src/*.html', 'src/pages/**/*.html'], gulp.series(copyHtml, reloadServer));

	// Watch assets - only copy assets
	gulp.watch('src/assets/**/*', gulp.series(copyAssets, reloadServer));
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
	compileAllThemes,
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
		compileAllThemes,
		compileCustomJavaScript
	),
	// Copy HTML after CSS/JS compilation in production (for cache busting)
	copyHtml
);
