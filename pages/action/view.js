  
    var viewContainer;
	console.log('--------- call once ---------');

	var widget = require('bcc/mod/widget?__inline');
    exports.init = function(options){
        console.log('view');
      	widget.init(); 
    };

    exports.dispose = function(){
        viewContainer.dispose();
    };

