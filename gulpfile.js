/* jshint ignore:start */

/*jshint node: true, unused: false*/
/*global require*/

var gulp = require( 'gulp' );
/* UTILS */
var configuration = require( './config' ).configuration;
var del = require( 'del' );
var notify = require("gulp-notify");
/* STYLES */
var autoprefixer = require( 'autoprefixer' );
var cleanCSS = require( 'gulp-clean-css' );
var flatten = require( 'gulp-flatten' );
var mqpacker = require( 'css-mqpacker' );
var plumber = require( 'gulp-plumber' );
var postcss = require( 'gulp-postcss' );
var reporter = require( 'postcss-reporter' );
var sass = require( 'gulp-sass' );
var sassdoc = require( 'sassdoc' );
var scss = require( 'postcss-scss' );
var stylelint = require( 'stylelint' );
var stylefmt = require( 'stylefmt' );
/* IMAGES */
var imagemin = require( 'gulp-imagemin' );
var pngquant = require( 'imagemin-pngquant' );
/* SCRIPTS */
var browserify = require( 'browserify' );
var buffer = require( 'vinyl-buffer' );
var eslint = require( 'gulp-eslint' );
var gulpIf = require('gulp-if');
var jshint = require( 'gulp-jshint' );
var source = require( 'vinyl-source-stream' );
var sourcemaps = require( 'gulp-sourcemaps' );

/* CONFIG STYLES */
configuration.styles.inputFiles = configuration.styles.input + '**/*.scss';
configuration.styles.outputFiles = configuration.styles.output + '**/*.css';
/* Turns the vendor relative paths into absolute ones */
for ( var i = 0, length = configuration.styles.vendors.length; i < length; i++ ) {
	configuration.styles.vendors[ i ] = __dirname + '/' + configuration.styles.vendors[ i ];
}

/* CONFIG IMAGES */
configuration.images.inputFiles = configuration.images.input + '**/*';

/* CONFIG SCRIPTS */
configuration.scripts.inputFiles = configuration.scripts.input + '**/*.js';

/****************************
 * STYLES
****************************/

// Erase previously compiled styles
function clean_css() {
	return del( [ configuration.styles.output ] );
}

// Styles compiling
function compile_css() {
	return gulp.src( configuration.styles.inputFiles )
		.pipe( plumber() )
		.pipe( sass( {
			includePaths: configuration.styles.vendors,
			outputStyle: 'expanded'
		 } ).on( 'error', sass.logError ) )
		.pipe( flatten() )
		.pipe( postcss( [
			autoprefixer( {
				browsers: configuration.styles.browserSupport,
				cascade: true,
				remove: true
			} ),
			mqpacker()
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

// Styles documentation
function document_css( done ) {
	if ( configuration.styles.documentation ) {
		return gulp
			.src( configuration.styles.inputFiles )
			.pipe( sassdoc( {
				dest: configuration.styles.documentation
			} ) );
	} else {
		done();
	}
}

// Styles minification
function minify_css( done ) {
	if ( configuration.styles.minification ) {
		return gulp.src( configuration.styles.outputFiles )
			.pipe( cleanCSS( { debug: true }, function( details ) {
				var percentageSaved = ( ( 1.00 - details.stats.minifiedSize/details.stats.originalSize ) * 100 ).toFixed( 2 );
				var kilobytesSaved = ( ( details.stats.originalSize - details.stats.minifiedSize ) / 1024 ).toFixed( 2 );
				console.log( details.name + ' : saved ' + percentageSaved + '% file size through minification (' + kilobytesSaved + ' KB)' );
			} ) )
			.pipe( gulp.dest( configuration.styles.output ) );
	} else {
		done();
	}
}

/****************************
 * JAVASCRIPT
 ****************************/

// Erase previously compiled styles
function clean_js() {
	return del( [ configuration.scripts.output ] );
}

// Scripts compiling
function compile_js() {
	var b = browserify( {
		entries: configuration.scripts.input + configuration.scripts.entryPoint,
		debug: true
	} );

	return b.bundle()
		.on( 'error', function( err ) {
			console.log( err.stack );
			notify( { message: err.message } );
			this.emit( 'end' );
		})
		.pipe( source( configuration.scripts.entryPoint ) )
		/** @todo: add sourcemaps / uglification support
		 *
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			 Add transformation tasks to the pipeline here.
			.pipe(uglify())
			.on('error', gutil.log)
			.pipe(sourcemaps.write('./'))
		 */
		.pipe( gulp.dest( configuration.scripts.output ) );
}

// Scripts jsHint
function hint_js() {
	return gulp.src( configuration.scripts.inputFiles )
		.pipe( jshint( '.jshintrc' ) )
		.pipe( jshint.reporter( 'jshint-stylish' ) )
		.pipe( notify( function ( file ) {
			if ( file.jshint.success ) {
				// Don't show something if success
				return false;
			}
			var errorCount = 0;
			var warningCount = 0;
			var counts = '';
			var errors = file.jshint.results.map(function (data) {
				if (data.error) {
					var isError = data.code && data.code[0] === 'E';
					if (isError) {
						errorCount++;
					} else {
						warningCount++;
					}
					return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
				}
			}).join(" ");
			if ( errorCount ) {
				var counts = 'x' + errorCount;
			}
			if ( warningCount ) {
				var counts = '!' + warningCount;
			}
			return file.relative + " " + counts + " - " + errors;
		} ) );
}

// Scripts esLint (+ autofix)
function isEsLintFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint != null && file.eslint.fixed;
}

function lint_js() {
	return gulp.src( configuration.scripts.inputFiles )
		.pipe( eslint( {
			fix: true
		} ) )
		.pipe( eslint.format() )
		.pipe( gulpIf( isEsLintFixed, gulp.dest( configuration.scripts.input ) ) );
}

/****************************
 * IMAGES
****************************/

function compress_images() {
	return gulp.src( configuration.images.inputFiles )
		.pipe( imagemin( {
			progressive: true,
			use: [ pngquant() ]
		} ) )
		.pipe( gulp.dest( configuration.images.output ) );
}

/****************************
 * WATCH
****************************/

function watch() {
	gulp.watch( [ configuration.styles.inputFiles ], compile_css );
	gulp.watch( [ configuration.scripts.inputFiles ], gulp.series( lint_js, hint_js, compile_js ) );
}

/* MAIN TASKS */

gulp.task( 'build',
	gulp.parallel(
		gulp.series(
			clean_css,
			format_css,
			compile_css,
			gulp.parallel(
				minify_css,
				document_css
			)
		),
		gulp.series(
			clean_js,
			lint_js,
			hint_js,
			compile_js
		),
		compress_images
	)
);

gulp.task( 'watch',
	gulp.series(
		'build',
		gulp.parallel( watch )
	)
);

gulp.task( 'lint',
	gulp.parallel(
		format_css,
		lint_js,
		hint_js
	)
);

// Compile files for production ( default )
gulp.task( 'default', gulp.series( 'build' ) );
