
    var view = require('action/view');

    var model = require('action/model');


    exports.init = function(options){

        console.log("i'm in alarm");
        view.init(options);
        model.init(options);
    };
    exports.dispose = function(){
        console.log("alarm dispose");
        view.dispose();
        model.dispose();
    };
