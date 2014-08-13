
    var view = require('action/view');

    var model = require('action/model');

    var $ = require('jquery');

    //require.async('action/test.css');

    exports.init = function(options){

        console.log("i'm in alarm");
        view.init(options);
        model.init(options);

        console.log($);
    };
    exports.dispose = function(){
        console.log("alarm dispose");
        view.dispose();
        model.dispose();
    };
