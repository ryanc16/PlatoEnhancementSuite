var poller, enableupdate, settings = chrome.storage.local;
var enabled;
function poll(){
	if(checkClick()){
		clearInterval(poller);
		setTimeout(function(){
			poller = setInterval(poll,5000);
		},30000);
	}
}
function checkClick(){
	var timeoutdialog = document.getElementById('d2l_sessionExpiryWarning');
	if(timeoutdialog != 'undefined' && timeoutdialog.style.opacity == 1 && enabled){
		timeoutdialog.click();
		console.log("Plato Prevent Session Timeout has kept your session active!");
		return true;
	}
	return false;
}
function checkEnabled(){
	settings.get("enabled",function(items){
		if(enabled != items.enabled){
			enabled = items.enabled;
			if(items.enabled)
				console.log("Plato Prevent Session Timeout has started!");
			else console.log("Plato Prevent Session Timeout is not running!");
		}
	});
}
checkEnabled();
poller = setInterval(poll,5000);
enableupdate = setInterval(checkEnabled,5000);