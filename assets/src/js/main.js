'use strict';
( function ( global ) {
	var fooConsoleLogger = require( './modules/foo-console-logger.js' );

	fooConsoleLogger.helloWorld( global );
}( window ) );
