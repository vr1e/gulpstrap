import gulp from 'gulp';
import babel from 'gulp-babel';
const sass = require('gulp-sass')(require('sass'));
import del from 'del';
// import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import { paths, jsDependencies, cssDependencies } from './gulp.constants';

const server = browserSync.create();

/* cleans dist folder */
function cleanDist() {
	return del(['dist']);
}

/* compiles user written javascript */
function compileCustomJavaScript() {
	return (
		gulp
			.src(paths.scripts, { sourcemaps: true })
			.pipe(babel())
			// .pipe(uglify())
			// .pipe(concat('index.js'))
			.pipe(gulp.dest(paths.dest))
	);
}

/* copies static assets preserving folder structure */
function copyAssets() {
	return gulp
		.src(['./src/assets/**/*'])
		.pipe(gulp.dest(`${paths.dist}assets/`));
}

/* copies all html files from root */
function copyHtml() {
	return gulp.src(['./src/*.html']).pipe(gulp.dest(paths.dist));
}

/* copies third party javascript dependencies */
function copyJavaScriptDependencies() {
	return gulp.src(jsDependencies).pipe(gulp.dest(paths.dest));
}

/* copies fontawesome font dependencies */
function copyFontawesomeFonts(done) {
	gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
	done();
}

/* compiles all user styles including bootstrap and other imports */
function compileSass() {
	return gulp
		.src(`${paths.styles}main.scss`, { sourcemaps: true })
		.pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
		.pipe(gulp.dest(`${paths.dist}styles/`));
}

/* copies third party css dependencies */
function copyCssDependencies() {
	return gulp.src(cssDependencies).pipe(gulp.dest(`${paths.dist}styles/`));
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
		copyHtml,
		copyFontawesomeFonts,
		copyJavaScriptDependencies,
		copyCssDependencies,
		compileSass,
		compileCustomJavaScript
	)
);