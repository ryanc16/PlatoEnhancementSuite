var Chatter = function(){
	this.VERSION = "1.0.0";
	this.user_count = 0;
	this.colors = [ "YellowGreen","DarkGoldenRod","Chocolate","LimeGreen","CornflowerBlue","Violet","LightSkyBlue","SaddleBrown","DarkOrange","SeaGreen","MediumVioletRed","DarkTurquoise","Olive","Tomato","DarkOliveGreen","Turquoise","DarkRed","Purple","Maroon","RebeccaPurple","DarkCyan","MediumBlue","HotPink","DeepPink","CadetBlue","PaleVioletRed","DarkOrchid","MediumPurple","Brown","DeepSkyBlue","DodgerBlue","SlateBlue","OliveDrab","OrangeRed","Coral","Crimson","Red","LightCoral","FireBrick","LightSeaGreen","MediumSlateBlue","DarkMagenta","Teal","Orchid","MidnightBlue","Orange","MediumAquaMarine","Green","DarkSalmon","DarkBlue","Navy","SteelBlue","Fuchsia","SkyBlue","ForestGreen","MediumSeaGreen","DarkViolet","RosyBrown","DarkSlateBlue","DarkSeaGreen","RoyalBlue","DarkGreen","MediumOrchid","BlueViolet"];
	this.color_map = {};
	this.iframe;
	this.userlist;
	this.msglist;
	this.msgbox;
	this.btnsend;
	this.chkEnterToSend;
	var _this = this;

	this.start = function(){
		_this.iframe = $("iframe").contents();
		_this.userlist	= _this.iframe.find("#userlst_id");
		_this.msglist	= _this.iframe.find("#msglst_id");
		_this.msgbox	= _this.iframe.find("#d2l_form textarea");
		_this.btnsend	= _this.iframe.find("#d2l_form a[id*=z_]");
		if(_this.userlist.length == 0 && _this.msglist.length == 0){
			_this.userlist	= $("#userlst_id");
			_this.msglist	= $("#msglst_id");
			_this.msgbox	= $("#d2l_form textarea");
			_this.btnsend	= $("#d2l_form a[id*=z_]");
			if(_this.userlist.length == 0 && _this.msglist.length == 0)
				return;
		}
		_this.btnsend.wrap("<div style='display:inline-block;'></div>");
		_this.chkEnterToSend = $("<input type='checkbox' name='enter_to_send' id='enter_to_send' />").insertAfter(_this.btnsend);
		$("<label for='enter_to_send'>Enter to Send</label>").insertAfter(_this.chkEnterToSend);
		$("</br>").insertAfter(_this.btnsend);

		_this.msgbox.on('keyup',function(e){
			if(e.which == 13 && _this.chkEnterToSend.prop('checked')==true)
				_this.btnsend[0].click();
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
			$(o).prop("style","white-space:normal;background-color:#EFEFEF;margin:5px 0;padding:5px;border-radius:10px;");
		});

		_this.msglist.find("h3 span").each(function(i,o){
			var username = $(o).text().replace(":","");
			$(o).prop("style","font-weight:bold;color:"+_this.color_map[username]);
		});

		
		var ulContent;
		var num_messages;
		setInterval(function(){
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

		_this.userlist.on("contentChanged",_this.pollUsers);
		_this.msglist.on("contentChanged",_this.pollMessages);
		console.log("Plato Enhancement Suite: Chatter has started!");
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
			$(o).prop("style","white-space:normal;background-color:#ECECEC;margin:5px 0;padding:5px;border-radius:10px;");
		});
		_this.msglist.find("h3 span").each(function(i,o){
			var username = $(o).text().replace(":","");
			$(o).prop("style","font-weight:bold;color:"+_this.color_map[username]);
		});
	}
}
var chatter = new Chatter();
setTimeout(function(){
	chatter.start();
},5000);