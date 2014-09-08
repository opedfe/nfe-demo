
    var view = require(__uri('./view'));
    view = require('./view?__inline');

	var fly = require('fly');
	var nuit = require('nuit');

    var model = require('./model');

    var $ = require('jquery');

    var echarts = require('echarts');

    //require.async('action/test.css');

    exports.init = function(options){

        console.log("i'm in alarm");
        view.init(options);
        model.init(options);

        console.log($);

        console.log(echarts);

		console.log('-------');
		console.log(JSON.stringify(module));
		console.log('-------');
		console.log(nuit);
		new nuit.ui.Taginput({
			el:$('#taginput')
		});
    };
    exports.dispose = function(){
        console.log("alarm dispose");
        view.dispose();
        model.dispose();

    };
