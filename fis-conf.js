

fis.config.set('settings.spriter.csssprites.margin', 20);

fis.config.merge({
    pack : {
		'modules/nuit/nuit.js':['modules/nuit/combox/combox.js', 'modules/nuit/dialog/dialog.js'],
        'pages/test/index.js' : ['pages/action/index.js', 'pages/action/view.js','pages/action/model.js']
    }
});
