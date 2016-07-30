/*global module*/

// Paths
module.exports = {
  paths: {
		input: 'assets/src/**/*',
		output: 'assets/dist/',
		styles: {
			inputFolder: 'assets/src/scss/',
			input: 'assets/src/scss/**/*.scss',
			bower: 'bower_components/**/*.scss',
			inputCompiled: 'assets/dist/css/**/*.css',
			output: 'assets/dist/css/'
		},
		scripts: {
			input: 'assets/src/js/',
			watch: 'assets/src/js/**/*.js',
			entryPoint: 'main.js',
			output: 'assets/dist/js/'
		},
		images: {
			input: 'assets/src/img/*',
			output: 'assets/dist/img/'
		}
	}
};
