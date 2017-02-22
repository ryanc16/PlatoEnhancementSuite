var chkbox_sessionmonitor = $('#chkbox_enable_sessionmonitor')[0];
var chkbox_chatter = $("#chkbox_enable_chatter")[0];

var settings = chrome.storage.local;
function SaveSetting(){
	var enabled_modules = {
		"sessionmonitor":{"enabled":chkbox_sessionmonitor.checked},
		"chatter":{"enabled":chkbox_chatter.checked}
	}
	settings.set({"enabled_modules":enabled_modules});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: "toggle_module"}, function(response) {
			update_loaded_modules();
		});
	});
}

chkbox_sessionmonitor.addEventListener('change',SaveSetting);
chkbox_chatter.addEventListener('change',SaveSetting);
onload
settings.get("enabled_modules",function(items){
	chkbox_sessionmonitor.checked = items.enabled_modules.sessionmonitor.enabled;
	chkbox_chatter.checked = items.enabled_modules.chatter.enabled;
});
$("#modules div.module-header").on('click',function(e){
	e.stopPropagation();
	
	var settings_box = $(this).parent().find("div.settings");
	if(settings_box.hasClass('open')){
		settings_box.removeClass('open');
		$(this).removeClass('open');
		$(this).find('.img_expand').removeClass('rotate-up');
	}
	else{ 
		settings_box.addClass('open');
		$(this).addClass('open');
		$(this).find('.img_expand').addClass('rotate-up');
	}
});
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if(tabs[0].url.indexOf("https://learn.pct.edu") < 0){
		$("h2").text("Please navigate to Plato to begin using PES");
		$("#modules").remove();
		return;
	}
	chrome.tabs.sendMessage(tabs[0].id,{action:"get_app_version"},function(response){
		if(response!=undefined)
			$("#app_version").text("v"+response);
	});
	chrome.tabs.sendMessage(tabs[0].id, {action: "get_loaded_modules"}, function(response) {
		$("#modules div div.is_module_loaded").each(function(i,o){
			$(o).addClass((response.module_info[i].is_loaded)?"is_loaded":"not_loaded");
		});
	});
});
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if (request.action == "update_popup_from_module")
		update_loaded_modules();
});
function update_loaded_modules(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: "get_loaded_modules"}, function(response2) {
			$("#modules div div.is_module_loaded").each(function(i,o){
				$(o).removeClass("is_loaded not_loaded").addClass((response2.module_info[i].is_loaded)?"is_loaded":"not_loaded");
			});
		});
	});
}