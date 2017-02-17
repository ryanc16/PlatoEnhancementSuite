var chkbox = document.getElementById('enabledchkbox');
var settings = chrome.storage.local;
function SaveSetting(){
	settings.set({"enabled":chkbox.checked});
}
chkbox.addEventListener('change',SaveSetting);
//onload
settings.get("enabled",function(items){
		chkbox.checked = items.enabled;
});