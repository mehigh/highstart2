module.exports = ( function() {

	return {
		helloWorld: function( global ) {
			global = global || window;
			global.console.info( 'Hello world! Welcome to HighStart2!\nPlease visit https://github.com/mehigh/highstart2 for more information.' );
		}
	};

} )();