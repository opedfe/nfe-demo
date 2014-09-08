/**
 *
 *
 *
 */
define(function(require,exports,module){

	var fly = require('fly');
	fly.ui = fly.ui || {};

	require('combox/combox.js');
	require('taginput/taginput.js');
	require('pager/pager.js');
	require('dialog/dialog.js');

	return fly;
});
__inline('combox/combox.js');
__inline('taginput/taginput.js');
__inline('pager/pager.js');
__inline('dialog/dialog.js');
