'use strict';

// Require
const
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	ftp = require('vinyl-ftp'),
	sass = require('gulp-sass'),
	eslint = require('gulp-eslint'),
	beautify = require('gulp-beautify'),

	// Load all the plugins
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*'],
		replaceString: /\bgulp[\-.]/,
		lazy: true,
		camelize: true
	}),

	// Source
	source = 'src',

	// Destination
	destination = 'dist';

// Compile PUG
gulp.task('pug', function buildHTML() {
	return gulp
		.src(source + '/templates/page.pug')
		.pipe($.rename("index.html"))
		.pipe($.pug({}))
		.pipe(gulp.dest(destination))
		.pipe($.connect.reload())
});

// Compile SCSS
gulp.task('sass', function () {
	return gulp
		.src(source + '/stylesheets/main.sass')
		.pipe($.sass().on('error', sass.logError))
		.pipe($.autoprefixer())
		.pipe($.csso())
		.pipe($.rename({
			suffix: ".min",
    	extname: ".css"
		}))
		.pipe(gulp.dest(destination + '/stylesheets'))
		.pipe($.connect.reload())
});

// Move assets
gulp.task('img', function () {
	return gulp
		.src(source + '/assets/images/*')
		.pipe(gulp.dest(destination + '/assets/images'))
});

gulp.task('trck', function () {
	return gulp
		.src(source + '/assets/sounds/*')
		.pipe(gulp.dest(destination + '/assets/sounds'))
});

// Check JS
gulp.task('js', function() {
	return gulp
		.src(source + '/js/*.js')
		//.pipe(jsValidate())
		.pipe(eslint({
			rules:{
        'camelcase': 1,
        'comma-dangle': 2,
        'quotes': 0
    	},
			parserOptions: {
        'ecmaVersion': 2017
    	},
			env: {
        'es6': true
    	}
		}))
		.pipe(eslint.format())
		.pipe(beautify.js())
		.pipe($.rename({
			suffix: ".min",
    	extname: ".js"
		}))
		.pipe(gulp.dest(destination + '/js'))
		.pipe($.connect.reload())
});

// Move the libs into dist
gulp.task('plyr', function() {
 	return gulp
		.src('node_modules/plyr/dist/plyr.min.js')
		.pipe(gulp.dest(destination + '/js'))
		.pipe($.connect.reload()),
		gulp
			.src('node_modules/plyr/dist/plyr.css')
			.pipe(gulp.dest(destination + '/stylesheets'))
			.pipe($.connect.reload())
})

// Running server
gulp.task('connect', function() {
	$.connect.server({
		root: destination,
		ivereload: true,
	});
});

// Watch
gulp.task('stream', function() {
	return gulp.watch(source + '/stylesheets/*.sass', gulp.series('sass')),
		gulp.watch(source + '/templates/*.pug', gulp.series('pug')),
		gulp.watch(source + '/js/*.js', gulp.series('js')),
		gulp.watch(source + '/assets/**/*', gulp.series('img'))
});

// Deploy
gulp.task('deploy', function() {
	var conn = ftp.create({
		host:     'ftp.host.com',
		user:     'yourun',
		password: 'yourpwd',
		port: 21,
		parallel: 3,
		log:      gutil.log
	});

	var globs = [
		destination + '/assets/**',
		destination + '/js/**',
		destination + '/stylesheets/**',
		destination + '/index.html'
	]

	return gulp
		.src(globs, {base: '.', buffer: false})
		.pipe(conn.newer('/jean-bobby-radio'))
		.pipe(conn.dest('/jean-bobby-radio'));
});

// Build
gulp.task(
	'default',
	gulp.series('pug', 'img', 'trck', 'js', 'sass', 'plyr', 'stream'),
	function() {}
)
