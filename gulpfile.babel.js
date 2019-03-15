import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import del from 'del';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

const server = browserSync.create();

const paths = {
	sctipts: 'src/scripts/*.js',
	styles: 'src/styles/',
	dist: 'dist/',
	dest: 'dist/scripts/',
	lib: 'src/scripts/',
	watch: ['src/styles/**', 'src/scripts/**', 'src/*.html']
};

const clean = () => del(['dist']);

function scripts() {
	return gulp
		.src(paths.sctipts, { sourcemaps: true })
		.pipe(babel())
		.pipe(uglify())
		.pipe(concat('index.min.js'))
		.pipe(gulp.dest(paths.dest));
}

function copy() {
	return gulp.src(['./src/*.html']).pipe(gulp.dest(paths.dist));
}

function jsDependencies() {
	return gulp
		.src([
			'node_modules/bootstrap/dist/js/bootstrap.js',
			'node_modules/jquery/dist/jquery.js',
			'src/lib/popper.min.js'
		])
		.pipe(gulp.dest(paths.dest));
}

const dependencies = done => {
	gulp
		.src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(gulp.dest(`${paths.dist}webfonts/`));
	done();
};

const styles = () => {
	return gulp
		.src(`${paths.styles}main.scss`, { sourcemaps: true })
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${paths.dist}styles/`));
};

function cssDependencies() {
	return gulp
		.src([
			'node_modules/bootstrap/dist/css/bootstrap.css',
			'node_modules/@fortawesome/fontawesome-free/css/all.css'
		])
		.pipe(gulp.dest(`${paths.dist}styles/`));
}

function reload(done) {
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

const watch = () =>
	gulp.watch(paths.watch, gulp.series(copy, styles, scripts, reload));

const dev = gulp.series(
	clean,
	copy,
	dependencies,
	jsDependencies,
	cssDependencies,
	styles,
	scripts,
	serve,
	watch
);
export default dev;
