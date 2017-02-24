var Chatter = function(){
	this.VERSION = "1.1.2";
	this.loaded = false;
	this.settings = chrome.storage.local;
	this.enabled;
	var completed_first_run = false;

	this.updateloop;
	this.user_count = 0;
	this.colors = [ "YellowGreen","SteelBlue","Crimson","LimeGreen","CornflowerBlue","Violet","LightSkyBlue","SaddleBrown","DarkOrange","SeaGreen","MediumVioletRed","DarkTurquoise","Olive","Tomato","DarkOliveGreen","Turquoise","DarkRed","Purple","Maroon","RebeccaPurple","DarkCyan","MediumBlue","HotPink","DeepPink","CadetBlue","PaleVioletRed","DarkOrchid","MediumPurple","Brown","DeepSkyBlue","DodgerBlue","SlateBlue","OliveDrab","OrangeRed","Coral","Chocolate","Red","LightCoral","FireBrick","LightSeaGreen","MediumSlateBlue","DarkMagenta","Teal","Orchid","MidnightBlue","Orange","MediumAquaMarine","Green","DarkSalmon","DarkBlue","Navy","DarkGoldenRod","Fuchsia","SkyBlue","ForestGreen","MediumSeaGreen","DarkViolet","RosyBrown","DarkSlateBlue","DarkSeaGreen","RoyalBlue","DarkGreen","MediumOrchid","BlueViolet"];
	this.color_map = {};
	this.emojis = [
		{name:"thumb_up",code:"em-thumbsup"},
		{name:"thumb_down",code:"em-thumbsdown"},
		{name:"gesture_raised_hand",code:"em-raised_hand"},
		{name:"face_angry",code:"em-angry"},
		{name:"face_confused",code:"em-confused"},
		{name:"face_confounded",code:"em-confounded"},
		{name:"face_cry",code:"em-cry"},
		{name:"face_disappointed",code:"em-disappointed"},
		{name:"face_expressionless",code:"em-expressionless"},
		{name:"face_frowning",code:"em-frowning"},
		{name:"face_joy",code:"em-joy"},
		{name:"face_neutral",code:"em-neutral_face"},
		{name:"face_confused",code:"em-confused"},
		{name:"face_gasp",code:"em-open_mouth"},
		{name:"face_smile",code:"em-smile"},
		{name:"face_smirk",code:"em-smirk"},
		{name:"face_sweat",code:"em-sweat_smile"},
		{name:"face_tongue",code:"em-stuck_out_tongue"},
		{name:"face_tongue_eyes",code:"em-stuck_out_tongue_closed_eyes"},
		{name:"face_tongue_wink",code:"em-stuck_out_tongue_winking_eye"},
		{name:"face_worried",code:"em-worried"},
		{name:"item_date",code:"em-date"},
		{name:"item_chicken",code:"em-chicken"},
	];
	this.emoji_css = "<style type='text/css'>i.em{font-size:14px;}div#previewbox{background-color:white;border-radius:5px;border:solid 1px #c0c0c0;min-height:4em;max-height:8em;overflow-y:auto;width:80%;padding:2px 6px;white-space:pre-wrap;line-height:1.25;}div#emoji_palette{border:solid 1px black;background-color:#ECECEC;display:none;}div#emoji_palette.open{display:block;}div#emoji_palette button{margin:5px;}</style>";
	this.document_root;
	this.iframe;
	this.userlist;
	this.msglist;
	this.msgbox;
	this.btnsend;
	this.chkEnterToSend;
	var _this = this;
	var isdev = false;

	this.start = function(){
		_this.checkEnabled();
		setTimeout(function(){
			_this.setup();
			completed_first_run = true;
		},5000);

		chrome.runtime.onMessage.addListener(function(request, sender, callback) {
			if(request.action == "toggle_module"){
				_this.checkEnabled();
				callback("checkEnabled");
			}
		});
	}

	this.setup = function(){

		if(!_this.enabled) return;
		
		_this.iframe = $("iframe").contents();
		$("iframe").prop('style','height:720px');
		_this.document_root = _this.iframe.find("html");
		_this.userlist	= _this.iframe.find("#userlst_id");
		_this.msglist	= _this.iframe.find("#msglst_id");
		_this.msgbox	= _this.iframe.find("#d2l_form textarea");
		_this.btnsend	= _this.iframe.find("#d2l_form a[id*=z_]");
		if(_this.userlist.length == 0 && _this.msglist.length == 0){
			_this.document_root = $("html");
			_this.userlist	= $("#userlst_id");
			_this.msglist	= $("#msglst_id");
			_this.msgbox	= $("#d2l_form textarea");
			_this.btnsend	= $("#d2l_form a[id*=z_]");
			if(_this.userlist.length == 0 && _this.msglist.length == 0)
				return;
		}
		_this.document_root.find("head").append("<link href='https://afeld.github.io/emoji-css/emoji.css' rel='stylesheet'>");
		_this.document_root.find("head").append(_this.emoji_css);
		var snd_wrap = $("<div id='snd_wrap' style='display:inline-block;'></div>");
		_this.btnsend.wrap(snd_wrap);
		snd_wrap = _this.document_root.find("#snd_wrap");
		_this.chkEnterToSend = $("<input type='checkbox' name='enter_to_send' id='enter_to_send' />").insertAfter(_this.btnsend);
		$("<label for='enter_to_send'>Enter to Send</label>").insertAfter(_this.chkEnterToSend);
		$("</br>").insertAfter(_this.btnsend);
		
		var previewbox = $("<div id='previewbox'><div>");
		previewbox.insertAfter(snd_wrap);
		_this.btnsend.on('click',function(){
			previewbox.html("");
		});
		$("<div>Preview:</div>").insertBefore(previewbox);

		var btn_emoji = $("<button><i class='em em-grinning'></i></button>");
		var emoji_palette = $("<div id='emoji_palette'></div>");
		$(btn_emoji).insertAfter(previewbox);
		btn_emoji.on('click',function(){
			if(emoji_palette.hasClass('open'))
				emoji_palette.removeClass('open');
			else emoji_palette.addClass('open');
		});
		$(emoji_palette).insertAfter(btn_emoji);
		var emoji_btn_str = "";
		var br = "<br>";
		_this.emojis.forEach(function(o,i){
			emoji_btn_str += "<button title='"+o.name+"'><i class='em "+o.code+"'></i></button>";
			if((i+1)%13 == 0) emoji_btn_str+=br;
		});
		
		$(emoji_palette).append(emoji_btn_str);
		$(emoji_palette).find("button").each(function(i,o){
			$(o).on('click',function(){
				var currentText = _this.msgbox.val();
				var selectionIndex = _this.msgbox[0].selectionStart;
				var pre = currentText.substring(0,selectionIndex);
				var post = currentText.substring(selectionIndex);
				var emoji_str = ":"+_this.emojis[i].name+":";
				_this.msgbox.val(pre+emoji_str+post);
				_this.msgbox.trigger('keyup');
				_this.msgbox.focus();
				_this.msgbox[0].selectionStart = selectionIndex+emoji_str.length;
				_this.msgbox[0].selectionEnd = selectionIndex+emoji_str.length;
			});
		});
		
		_this.msgbox.on('keyup',function(e){
			if(e.which == 13 && _this.chkEnterToSend.prop('checked')==true){
				_this.btnsend[0].click();
			}
			else {
				selectionIndex = _this.msgbox[0].selectionStart;
				var innerhtml = _this.msgbox.val();
				_this.emojis.forEach(function(o,i){
					innerhtml = innerhtml.replace(new RegExp(":"+o.name+":",'g'),"<i class='em "+o.code+"'></i>");
				});
				previewbox.html(innerhtml);
			}
		});

		_this.userlist.find("li").each(function(i,o){
			var username = $(o).text();
			var color = _this.colors[_this.user_count];
			_this.color_map[username] = color;
			_this.user_count++;
		});

		_this.userlist.find("li span").each(function(i,o){
			var username = $(o).text();
			$(o).prop("style","color:"+_this.color_map[username]);
		});

		_this.msglist.find("div").each(function(i,o){
			$(o).prop("style","white-space:pre-wrap;background-color:#EFEFEF;margin:5px 0;padding:5px;border-radius:10px;");
		});

		_this.msglist.find("h3 span").each(function(i,o){
			var username = $(o).text().replace(":","");
			$(o).prop("style","font-weight:bold;color:"+_this.color_map[username]);
		});

		

		_this.userlist.on("contentChanged",_this.pollUsers);
		_this.msglist.on("contentChanged",_this.pollMessages);

		_this.loaded = true;

		_this.update();
	}

	var ulContent;
	var num_messages;
	this.update = function(){
		cout.log("Plato Enhancement Suite: Chatter has started!");
		chrome.runtime.sendMessage({action: "update_popup_from_module"}, null);
		_this.updateloop = setInterval(function(){

			var $ul = _this.userlist;
			var new_msg_count = _this.msglist.children().length;
			if(ulContent !== $ul.html()){
				ulContent = $ul.html();
				_this.userlist.trigger('contentChanged');
			}
			if(num_messages !== new_msg_count){
				num_messages = new_msg_count;
				_this.msglist.trigger('contentChanged');
			}
			
		},10);
	}

	this.pollUsers = function(){
		_this.userlist.find("li").each(function(i,o){
			var username = $(o).text();
			if(!(username in _this.color_map)){
				var color = _this.colors[_this.user_count];
				_this.color_map[username] = color;
			}
			$(o).find("span").prop("style","color:"+_this.color_map[username]);
		});
	}

	this.pollMessages = function(){
		_this.msglist.find("div").each(function(i,o){
			$(o).prop("style","white-space:pre-wrap;background-color:#ECECEC;margin:5px 0;padding:5px;border-radius:10px;");
			var msg = $(o).html();
			_this.emojis.forEach(function(o,i){
				msg = msg.replace(new RegExp(":"+o.name+":",'g'),"<i class='em "+o.code+"'></i>");
			});
			$(o).html(msg);
		});
		_this.msglist.find("h3 span").each(function(i,o){
			var username = $(o).text().replace(":","");
			$(o).prop("style","font-weight:bold;color:"+_this.color_map[username]);
		});
	}

	this.checkEnabled = function(){
		_this.settings.get("enabled_modules",function(items){
			var isenabled;
			if(items.enabled_modules == undefined) isenabled = true;
			else isenabled = items.enabled_modules.chatter.enabled;
			if(_this.enabled != isenabled){
				_this.enabled = isenabled;
				if(_this.enabled){
					if(completed_first_run){
						if(_this.loaded){
							_this.update();
						}
						else{ 
							_this.setup();
						}
					}
				}
				else{
					clearInterval(_this.updateloop);
					cout.log("Plato Enhancement Suite: Chatter is not running!");
				}
			}
		});
	}

	this.info = function(){
		return {
			"name":"Chatter",
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
var c = new Chatter();
module.exports.start = c.start;
module.exports.getInfo = c.info;
module.exports.dev = c.dev;