requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        jquery: 'jquery-2.0.3.min',
        backbone: 'backbone-min',
        underscore: 'underscore-min',
        marionette: 'backbone.marionette.min',
        config: 'app/config',

        bootstrap: 'bootstrap/js/bootstrap.min',
        bootstrap_css: 'bootstrap/css/bootstrap.min',
    },
    shim: {
    	jquery : {
	    	exports : 'jQuery'
	    },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        marionette : {
	    	deps : ['jquery', 'underscore', 'backbone'],
	    	exports : 'Marionette'
	    }
    }
});

requirejs(['app/app'], function(app){
    'use strict';

    var onDeviceReady = function(){
        document.getElementsByTagName('body')[0].className = '';
        
        require(
            [
                'css!bootstrap_css',
                'bootstrap',
                'app/modules/conferences',
                'app/modules/auth',
            ],
            function () {
                app.start();
            }
        );   
    }

    $(function () {
        if (window.cordova) {
            document.addEventListener("deviceready", onDeviceReady, false);
        } else {
            onDeviceReady();
        }
    });
});