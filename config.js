/*global module*/

// Paths
module.exports = {
  configuration: {
  	styles: {
  		input: 'assets/src/scss/',
  		output: 'assets/dist/css/',
  		vendors: [
  			'bower_components/normalize-scss',
  			'bower_components/scss-query'
			],
  		minification: true,
  		browserSupport: [ 'last 2 versions', '> 3%' ]
  	},
  	scripts: {
  		input: 'assets/src/js/',
  		output: 'assets/dist/js/',
  		minification: true,
  		entryPoint: 'main.js'
  	},
  	images: {
  		input: 'assets/images/',
  		output: 'assets/images/'
  	}
	}
};
