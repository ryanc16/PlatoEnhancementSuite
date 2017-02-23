var dev = false;
$(function(){
	var modules = [];

	var PES = function(){
		var _this = this;
		this.VERSION = "1.2.1";
		this.sessionmonitor;
		this.chatter;

		this.start = function(){
			
			_this.sessionmonitor = require("./modules/sessionmonitor.min.js");
			modules.push(_this.sessionmonitor);

			_this.chatter = require("./modules/chatter.min.js");
			modules.push(_this.chatter);

			chrome.storage.local.get("enabled_modules",function(items){
				if(items.enabled_modules == undefined){
					_this.first_time_init();
				}
			});
			
			modules.forEach(function(o,i){
				o.dev(dev);
				o.start();
			});
		}

		this.first_time_init = function(){
			var enabled_modules = {};
			modules.forEach(function(o,i){
				enabled_modules[o.getInfo().name.toLowerCase()] = {"enabled":true};
			});
			chrome.storage.local.set({"enabled_modules":enabled_modules});
		}
	}
	var pes = new PES();
	pes.start();
	chrome.runtime.onMessage.addListener(function(request, sender, callback) {
		if(request.action == "get_loaded_modules"){
			module_info = [];
			modules.forEach(function(o,i){
				module_info.push(o.getInfo());
			});
			callback({"module_info":module_info});
		}
		else if(request.action == "get_app_version"){
			callback(pes.VERSION);
		}
	});
});
