
    var view = require('./view');

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
    };
    exports.dispose = function(){
        console.log("alarm dispose");
        view.dispose();
        model.dispose();
    };
