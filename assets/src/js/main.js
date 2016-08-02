( function( global ) {
	'use strict';

	var fooConsoleLogger = require( './modules/foo-console-logger.js' );
	fooConsoleLogger.helloWorld( global );

} )( window );