/* jshint ignore:start */

/*jshint node: true, unused: false*/
/*global require*/

var gulp = require( 'gulp' );
var plumber = require( 'gulp-plumber' );
var del = require( 'del' );
var flatten = require( 'gulp-flatten' );
/* STYLES */
var cleanCSS = require('gulp-clean-css');
var sass = require( 'gulp-sass' );
var postcss = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var reporter = require( 'postcss-reporter' );
var scss = require( 'postcss-scss' );
var stylelint = require( 'stylelint' );
var stylefmt = require( 'stylefmt' );
/* IMAGES */
var imagemin = require( 'gulp-imagemin' );
var pngquant = require( 'imagemin-pngquant' );
/* CONFIG */
var configuration = require( './config' ).configuration;
configuration.styles.inputFiles = configuration.styles.input + '**/*.scss';
configuration.styles.outputFiles = configuration.styles.output + '**/*.css';
configuration.scripts.inputFiles = configuration.scripts.input + '**/*.js';
configuration.images.inputFiles = configuration.images.input + '**/*';

/****************************
 * STYLES
****************************/

// Erase previously compiled styles
function clean_css() {
	return del( [ configuration.styles.output ] );
}

// Styles compiling
function compile_css() {
	return gulp.src( configuration.styles.inputFiles)
		.pipe( plumber() )
		.pipe( sass( {
			outputStyle: 'expanded'
		 } ).on( 'error', sass.logError ) )
		.pipe( flatten() )
		.pipe( postcss( [
			autoprefixer( {
				browsers: configuration.styles.browserSupport,
				cascade: true,
				remove: true
			 } )
		] ) )
		.pipe( gulp.dest( configuration.styles.output ) );
};

// Styles formatting & linting
function format_css() {
	return gulp.src( configuration.styles.inputFiles )
		.pipe( postcss( [
			stylefmt()
			], {
				syntax: scss
			} ) )
		.pipe( postcss( [
			stylelint(),
			reporter( { clearMessages: true } )
		], {
			syntax: scss
		} ) )
		.pipe( gulp.dest( configuration.styles.input ) );
}

// Styles minification
function minify_css( done ) {
	if ( configuration.styles.minification ) {
		return gulp.src( configuration.styles.outputFiles )
			.pipe(cleanCSS( { debug: true }, function( details ) {
				var percentageSaved = ( ( 1.00 - details.stats.minifiedSize/details.stats.originalSize ) * 100).toFixed( 2 );
				var kilobytesSaved = ( ( details.stats.originalSize - details.stats.minifiedSize ) / 1024 ).toFixed( 2 );
				console.log( details.name + ' : saved ' + percentageSaved + '% file size through minification (' + kilobytesSaved + ' KB)' );
			}))
			.pipe( gulp.dest( configuration.styles.output ) );
	} else {
		done();
	}
}

/****************************
 * IMAGES
****************************/

function compress_images() {
	return gulp.src( configuration.images.inputFiles )
		.pipe( imagemin( {
			progressive: true,
			use: [pngquant()]
		} ) )
		.pipe( gulp.dest( configuration.images.output ) );
}

/****************************
 * WATCH
****************************/

function watch() {
	gulp.watch( configuration.styles.inputFiles, compile_css );
}

/* MAIN TAKSS */

gulp.task( 'build', gulp.series(
	gulp.parallel(
		gulp.series( clean_css, format_css, compile_css, minify_css ),
		compress_images
	)
) );

gulp.task( 'watch', gulp.series( clean_css, format_css, compile_css,
	gulp.parallel( watch )
) );

// Compile files for production ( default )
gulp.task( 'default', gulp.series( 'build' ) );
