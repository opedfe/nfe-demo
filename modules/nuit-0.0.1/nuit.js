/**
 *
 *
 *
 */
define('nuit', ['nuit/combox/combox', 'nuit/taginput/taginput', 'nuit/pager/pager', 'nuit/dialog/dialog'], function(require,exports,module){

	var fly = require('fly');
	fly.ui = fly.ui || {};

	require('nuit/combox/combox');
	require('nuit/taginput/taginput');
	require('nuit/pager/pager');
	require('nuit/dialog/dialog');

	return fly;
});
__inline('combox/combox.js');
__inline('taginput/taginput.js');
__inline('pager/pager.js');
__inline('dialog/dialog.js');
