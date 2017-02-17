var SessionMonitor = function(){

	this.VERSION = "1.0.0";
	this.poller;
	this.enableupdate;
	this.settings = chrome.storage.local;
	this.enabled;
	var _this = this;

	this.start = function(){
		_this.checkEnabled();
		_this.poller = setInterval(_this.poll,5000);
		_this.enableupdate = setInterval(_this.checkEnabled,5000);
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
			console.log("Plato Enhancement Suite: SessionMonitor has kept your session active!");
			return true;
		}
		return false;
	}

	this.checkEnabled = function(){
		_this.settings.get("enabled",function(items){
			if(_this.enabled != items.enabled){
				_this.enabled = items.enabled;
				if(items.enabled)
					console.log("Plato Enhancement Suite: SessionMonitor has started!");
				else console.log("Plato Enhancement Suite: SessionMonitor is not running!");
			}
		});
	}

}
var sessionmonitor = new SessionMonitor();
sessionmonitor.start();