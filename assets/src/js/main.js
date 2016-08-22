'use strict';

( function ( global ) {
	var fooConsoleLogger = require( './modules/foo-console-logger.js' );
	var keyboardUtils = require( './modules/keyboard-utils.js' );

	fooConsoleLogger.helloWorld( global );

	keyboardUtils.logTo( 'js-kblog' );
	keyboardUtils.searchShortcut( 'js-search-input' );
	keyboardUtils.toggleShortcut( 'js-ctrl-a', 'a' );
}( window ) );
