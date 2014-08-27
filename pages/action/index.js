
    var view = require('./view');
    view = require('./view');

	var fly = require('nuit/taginput/taginput');

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
		new fly.ui.Taginput({
			el:$('#taginput')
		});
    };
    exports.dispose = function(){
        console.log("alarm dispose");
        view.dispose();
        model.dispose();

    };
