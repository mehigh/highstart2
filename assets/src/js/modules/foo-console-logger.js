'use strict';
module.exports = ( function() {
	return {
		helloWorld: function( global ) {
			global.console.info( 'Hello world! Welcome to HighStart2!\n' +
				'Please visit https://github.com/mehigh/highstart2 for more information.' );
		}
	};
}() );
