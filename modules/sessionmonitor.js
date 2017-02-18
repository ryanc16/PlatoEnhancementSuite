var SessionMonitor = function() {
	this.VERSION = "1.0.0";
	this.loaded = false;
	this.settings = chrome.storage.local;
	this.enabled;

	this.poller;
	this.enableupdate;
	
	var _this = this;
	var dev = false;

	this.start = function(){
		_this.checkEnabled();
		_this.poller = setInterval(_this.poll,5000);
		//_this.enableupdate = setInterval(_this.checkEnabled,5000);
		chrome.runtime.onMessage.addListener(function(request, sender, callback) {
			if(request.action == "toggle_module"){
				_this.checkEnabled();
				callback("checkEnabled");
			}
		});
		_this.loaded = true;
	}


	this.poll = function(){
		if(_this.checkClick()){
			clearInterval(_this.poller);
			setTimeout(function(){
				_this.poller = setInterval(_this.poll,5000);
			},30000);
		}
	}

	this.checkClick = function(){
		var timeoutdialog = $('#d2l_sessionExpiryWarning');
		if(_this.enabled && timeoutdialog.length == 1 && timeoutdialog[0].style.opacity == 1){
			timeoutdialog[0].click();
			cout.log("Plato Enhancement Suite: SessionMonitor has kept your session active!");
			return true;
		}
		return false;
	}

	this.checkEnabled = function(){
		_this.settings.get("enabled_modules",function(items){
			var isenabled;
			if(items.enabled_modules == undefined) isenabled = true;
			else isenabled = items.enabled_modules.sessionmonitor.enabled;

			if(_this.enabled != isenabled){
				_this.enabled = isenabled;
				if(_this.enabled){
					//console.log("Plato Enhancement Suite: SessionMonitor has started!");
					cout.log("Plato Enhancement Suite: SessionMonitor has started!");
					_this.loaded = true;
				}
				else{
					//console.log("Plato Enhancement Suite: SessionMonitor is not running!");
					cout.log("Plato Enhancement Suite: SessionMonitor is not running!");
					_this.loaded = false;
				}
				chrome.runtime.sendMessage({action: "update_popup_from_module"}, null);
			}
		});
	}

	this.info = function(){
		return {
			"name":"SessionMonitor",
			"version":_this.VERSION,
			"is_loaded":_this.loaded && _this.enabled
		};
	}

	this.dev = function(isdev){
		dev = isdev;
	}

	var cout = {
		log: function(data){
			if(dev)console.log(data);
		}
	}

}
var sm = new SessionMonitor();
module.exports.start = sm.start;
module.exports.getInfo = sm.info;
module.exports.dev = sm.dev;