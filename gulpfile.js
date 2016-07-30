/* jshint ignore:start */

/*jshint node: true, unused: false*/
/*global require*/

var gulp = require( 'gulp' );
var plumber = require( 'gulp-plumber' );
var del = require( 'del' );
var flatten = require( 'gulp-flatten' );
/* SASS */
var cleanCSS = require('gulp-clean-css');
var sass = require( 'gulp-sass' );
var postcss = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var reporter = require( 'postcss-reporter' );
var scss = require( 'postcss-scss' );
var stylelint = require( 'stylelint' );
var stylefmt = require( 'stylefmt' );
/* CONFIG */
var paths = require( './config' ).paths;

/* SASS */

// Remove existing content from CSS output folder
function clean_css() {
	return del( [ paths.styles.output ] );
}

// Compile SASS
function compile_css() {
	return gulp.src( paths.styles.input )
		.pipe( plumber() )
		.pipe( sass( {
			outputStyle: 'expanded'
		 } ).on( 'error', sass.logError ) )
		.pipe( flatten() )
		.pipe( postcss( [
			autoprefixer( {
				browsers: ['last 2 versions'],
				cascade: true,
				remove: true
			 } )
		] ) )
		.pipe( gulp.dest( paths.styles.output ) );
};

// Format & Lint SASS code
function format_css() {
	return gulp.src( paths.styles.input )
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
		.pipe( gulp.dest( paths.styles.inputFolder ) );
}

// Minify CSS
function minify_css() {
	return gulp.src( paths.styles.inputCompiled )
		.pipe(cleanCSS( { debug: true }, function( details ) {
			var percentageSaved = ( ( 1.00 - details.stats.minifiedSize/details.stats.originalSize ) * 100).toFixed( 2 );
			var kilobytesSaved = ( ( details.stats.originalSize - details.stats.minifiedSize ) / 1024 ).toFixed( 2 );
			console.log( details.name + ' : saved ' + percentageSaved + '% file size through minification (' + kilobytesSaved + ' KB)' );
		}))
		.pipe( gulp.dest( paths.styles.output ) );
}

function watch() {
	gulp.watch( paths.styles.input, compile_css );
}

/* MAIN TAKSS */

gulp.task( 'build', gulp.series( clean_css, format_css,
	gulp.parallel( compile_css ),
	gulp.parallel( minify_css )
) );

gulp.task( 'watch', gulp.series( clean_css, format_css, compile_css,
	gulp.parallel( watch )
) );

// Compile files for production ( default )
gulp.task( 'default', gulp.series( 'build' ) );
