'use strict';
module.exports = ( function () {
	return {
		logTo: function( selector ) {

			var loggingElm = document.getElementById( selector ),
				logKey,
				countNewLines;

			countNewLines = function( text ) {
				var lines = text.split( '\n' ).length;
				if ( lines ) {
					return lines;
				} else {
					return 0;
				}
			};

			logKey = function(event) {
				var keyText = event.key,
					writtenText = loggingElm.innerText;
				writtenText += keyText + '\n';
				if ( countNewLines( writtenText ) > 19 ) { // limit history to 20 lines
					writtenText = writtenText.substr( writtenText.indexOf( '\n' ) + 1 );
				}
				loggingElm.innerText = writtenText;
			};

			document.addEventListener( 'keydown', logKey );
		},

		searchShortcut: function( selector ) {

			var searchInput = document.getElementById( selector ),
				label = searchInput.previousElementSibling,
				focusSearch;

			focusSearch = function( pressed ) {
				if ( pressed.ctrlKey && 'f' === pressed.key ) {
					searchInput.focus();
					searchInput.select();
				}
			};

			if ( 'label' === label.nodeName.toLowerCase() ) {
				label.setAttribute( 'title', 'AccessKey: CTRL+F' );
			}
			document.addEventListener( 'keyup', focusSearch );

		},

		toggleShortcut: function( selector, character ) {

			var toggledElement = document.getElementById( selector ),
				toggleElement,
				toggledElementClass,
				toggledElementClassActivePos;

			toggledElementClass = toggledElement.getAttribute('class');

			if ( null === toggledElementClass ) {
				toggledElement.setAttribute( 'class', '' );
			}

			toggleElement = function( pressed ) {

				if ( pressed.ctrlKey && character === pressed.key ) {

					pressed.preventDefault();

					toggledElementClass = toggledElement.getAttribute('class');
					toggledElementClassActivePos = toggledElementClass.indexOf( 'active' );

					if ( toggledElementClassActivePos !== -1 ) { // remove 'active' class
						toggledElementClass = toggledElementClass.substr(0, toggledElementClassActivePos) +
							toggledElementClass.substr( toggledElementClassActivePos + 'active'.length );
					} else { // add 'active' class
						toggledElementClass += ' active ';
					}

					toggledElement.setAttribute( 'class', toggledElementClass );

				}

			};

			document.addEventListener( 'keyup', toggleElement );
		}
	};
}() );
