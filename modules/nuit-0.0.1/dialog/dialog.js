/**!
 * fly.ui.Dialog
 * =======================================
 * Copyright 2011-2012 baidu.com
 * =======================================
 *
 * @since 2012-05-13
 * @author lifayu@baidu.com
 * @version $Id: dialog.js 1145 2012-08-17 10:40:16Z lifayu $
 */
define("nuit/dialog/dialog", ["jquery", "fly", "./dialog.css"], function(require, exports, module) {
	
	var $ = jQuery = require("jquery");

	var fly = require("fly");

	fly.ui = fly.ui || {};

	/**
	 * ESC 关闭最外层的dialog
	 */
	$(function(){
		$(document).bind("keyup.dialog",function(event){
			if(event.keyCode == 27){
				var ins = window["$FLYJS$"]._instances;
				var dialog = null;
				$.each(ins,function(i,item){
					if(item.uiType == "dialog"){
						dialog = item;
					}
				});
				if(dialog != null && dialog.escClose === true && dialog.showState == 1) dialog.hide();
			}
		});
	});

	(function(m) {

		/**
		 * 遮罩层
		 */
		m.ui.Mask = m.View.createClass(function() {

		}, {
			uiType : "mask",
			tplString : "<div id='#{id}' style='z-index:#{zIndex}' class='#{panel}'><iframe class='#{iframe}' frameborder='0' src='about:blank;'></iframe></div>",
			getString : function() {
				var me = this;
				return m.format(me.tplString, {
					id : me.getId(),
					panel : me.getClass("panel"),
					iframe : me.getClass("iframe"),
					zIndex : me.zIndex || 9999
				});
			},
			init : function() {
				var me = this;
				var htm = me.getString();
				me.$mask = $(htm).appendTo($("body")).height($(document).height());
				me.show();
			},
			show : function() {
				this.$mask.show();
			},
			hide : function() {
				this.$mask.hide();
			},
			close : function() {
				this.$mask.remove();
				this.fire("dispose");
			}
		});
		/**
		 * 弹出层
		 * @param {String} title
		 * @param {String} content
		 * @param {Boolean} once
		 * @param {int} zIndex
		 * @param {Boolean} closeable
		 * @param {Array} buttons
		 * @param {String} iframesrc
		 */
		m.ui.Dialog = m.View.createClass(function() {

		}, {
			uiType : "dialog",
			once : true, //是否为一次性弹出层
			zIndex : 9999,
			buttons:[],
			escClose:true,
			closeable : true, //是否可以被关闭
			showState:0, //显示状态 1：显示 0：隐藏
			autosize:true, //有iframe情况下，是否自动调整大小
			//tplString : "<table id='#{id}' style='z-index:#{zIndex}' class='m-dialog #{wrapcls}'><tr><td class='lt'></td><td class='t'></td><td class='rt'></td></tr><tr><td class='l'></td><td class='c'>#{close}#{title}<div class='#{innercls}'>#{content}</div>#{buttons}</td><td class='r'></td></tr><tr><td class='lb'></td><td class='b'></td><td class='rb'></td></tr></table>",
			tplString:"<div id='#{id}' style='z-index:#{zIndex}' class='#{wrapcls}'><div class='#{innercls}'><div class='#{titlecls}'>#{title}#{close}</div><div class='#{cntcls}'>#{content}</div>#{buttons}</div></div>",
			events : {
				//"click .m-dialog-close" : "hide"
			},
			init : function() {
				var me = this;
				me.mask = new m.ui.Mask({
					zIndex : me.zIndex
				});
				var htm = me.getString();
				me.$dialog = $(htm).appendTo($("body"));
				me._setTopPx(function() {
					me.show();
				});
				if(typeof me.iframesrc != "undefined"){
					var iframe = me.iframe = m.g(me.getId()).find("iframe")[0];
					function resetIframe(){
						me.resetiframe();
					}
					if(me.autosize){
						me.iframeTimer = window.setInterval(function(){
							me.resetiframe();
						},500);
					}
					try{
						iframe.contentWindow.onload = resetIframe;
					}catch(e){}
				}
				
				m.q(me.getClass("close")).bind("click",function(){
					me.hide();
				});
				
				me.$dialog.draggable && me.$dialog.draggable({
					handle:"."+me.getClass("title"),
					opacity:.8,
					containment:"document",
					iframeFix:true
				});
				me.fire("oninit");
			},
			getString : function() {
				var me = this;
				var content = me.content;
				if(typeof me.iframesrc != "undefined"){
					content = "<iframe src='"+me.iframesrc+"' frameborder='0' scrolling='no' style='padding:0;margin:0;'></iframe>";
				}
				return m.format(me.tplString, {
					id : me.getId(),
					wrapcls : me.getClass("wrap"),
					innercls : me.getClass("inner"),
					titlecls:me.getClass("title-wrap"),
					cntcls : me.getClass("cnt"),
					close : me.closeable ? "<a href='javascript:void(0);' title='关闭' class='" + me.getClass("close") + "'></a>" : "",
					title : me.title ? "<div class='" + me.getClass("title") + "'>" + me.title + "</div>" : "",
					buttons:me.buttons.length > 0 ? "<div class='"+me.getClass("buttons_wrap")+"'>"+me.getButtonsString(me.buttons)+"</div>" : "",
					content : content,
					zIndex : me.zIndex
				})
			},
			getButtonsString:function(btns){
				var me = this,htm = [];
				$.each(btns,function(i,btn){
					htm.push(m.format('<a href="javascript:void(0);" class="buttons #{clazz}" onclick="#{onclick}"><span>#{text}</span></a> ',{
						text:btn.text,
						clazz:btn.clazz || "btn03",
						onclick:me.getCallString(btn.onclick)
					}));
				});
				return htm.join("");
			},
			resetiframe:function(){
				var me = this;
				var $iframe = m.g(me.getId()).find("iframe");
				var iframe = $iframe[0];
				try{
					var height,width;
					if($.browser.ie){
						height = iframe.contentWindow.document.body.scrollHeight;
						width = iframe.contentWindow.document.body.scrollWidth;
					}else{
						height = iframe.contentWindow.document.documentElement.scrollHeight;		
						width = iframe.contentWindow.document.documentElement.scrollWidth;		
					}
					/*
					console.log("width:" + width);
					console.log("height:" + height);
					console.log($(iframe.contentWindow.document.body).height());
					console.log("--------------------------");
					//iframe.height =  height;
					//iframe.width =  width;
					height = $(iframe.contentWindow.document).height();
					width = $(iframe.contentWindow.document).width();
					*/
					$iframe.height(height);
					$iframe.width(width);
					/*
					var bHeight = iframe.contentWindow.document.body.scrollHeight;
					var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;		
					var height = Math.max(bHeight, dHeight);
					iframe.height =  height;
					var bWidth = iframe.contentWindow.document.body.scrollWidth;
					var dWidth = iframe.contentWindow.document.documentElement.scrollWidth;		
					var width = Math.max(bWidth, dWidth);
					iframe.width =  width;
					*/
		
					me._setTopPx(null,1);
				}catch (ex){}
			},
			_setTopPx : function(callback,fix) {
				var me = this;
				var windowHeight, scrollTop, dialogHeight;
				windowHeight = $(window).height();
				windowWidth = $(window).width();
				scrollTop = $(window).scrollTop();
				dialogHeight = me.$dialog.height();
				dialogWidth = me.$dialog.width();
				if(fix != 1){
					me.$dialog.css({
						left:0,
						top:scrollTop
					});	
				}
				me.$dialog.stop().css({
					top : windowHeight / 2 + scrollTop - dialogHeight / 2,
					left : (windowWidth - dialogWidth) / 2
				});
				if( typeof callback == "function") {
					callback();
				}
			}
		}).extend({
			setContent:function(txt){
				var me = this;
				var cnt = fly.q(me.getClass("inner"),me.$dialog);
				cnt.html(txt);
			},
			show : function() {
				var me = this;
				me.mask.show();
				me.$dialog.show();
				me.showState = 1;
				//让最后一个按钮选中
				if(me.buttons.length > 0){
					fly.q(me.getClass("buttons_wrap",me.$dialog)).find("a:last").focus();
				}
			},
			hide : function() {
				var me = this;
				me.showState = 0;
				if(me.fire("onclose") !== false){
					me.mask.hide();
					me.$dialog.stop().fadeOut(500,function() {
						if(me.once) {
							me.mask.close();
							me.$dialog.remove();
							me.fire("dispose");
						}
					});
					window.clearInterval(me.iframeTimer);
				}
			},
			close : function() {
				var me = this;
				me.once = true;
				me.hide();
			}
		});
		/**
		 * 模拟alert
 	     * @param {Object} opts
 	     * opts.msg,opts.type,opts.callback
		 */
		m.ui.alert = function(msg,type,callback,opts) {
			var type = type || "INFO";
			var opts = opts || {};
			var callback = callback || new Function;
			type = type.toUpperCase();
			if(type == "CONFIRM"){
				opts.buttons = [{
					text:"确定",
					onclick:"ok"
				},{
					text:"取消",
					onclick:"hide",
					clazz:"btn04"
				}];
				opts.ok = function(){
					this.hide();
					callback();
				};
			}else{
				opts.buttons = [{
					text:"确定",
					onclick:"hide"
				}];
				opts.onclose = callback;
			}
			
			var width = opts.width || 250;
			var dialog = new m.ui.Dialog($.extend({
				title:"消息提示",
				escClose:false,
				content:"<div style='width:"+width+"px;padding:10px;overflow:hidden;'><div style='width:50px;height:40px;float:left;display:inline;' class='alert-"+type.toLowerCase()+"'></div><div style='margin-left:55px;'>"+msg+"</div></div>",
				_setTopPx : function(callback) {
					var me = this;
					var windowHeight, scrollTop, dialogHeight;
					windowHeight = $(window).height();
					windowWidth = $(window).width();
					scrollTop = $(window).scrollTop();
					dialogHeight = me.$dialog.height();
					dialogWidth = me.$dialog.width();
					me.$dialog.css({
						top : windowHeight / 2 + scrollTop - dialogHeight / 2,
						left : (windowWidth - dialogWidth) / 2
					});
					if( typeof callback == "function") {
						callback();
					}
				}
			},opts));
			m.g(dialog.getId()).addClass(dialog.getClass("alert"));
			return dialog;
		};

		m.ui.msgBox = function(msg,delay,callback) {
			var dialog = new m.ui.Dialog({
				content:"<div style='padding:20px 30px;'>"+msg+"</div>",
				_setTopPx : function(callback) {
					var me = this;
					var windowHeight, scrollTop, dialogHeight;
					windowHeight = $(window).height();
					windowWidth = $(window).width();
					scrollTop = $(window).scrollTop();
					dialogHeight = me.$dialog.height();
					dialogWidth = me.$dialog.width();
					me.$dialog.css({
						top : windowHeight / 2 + scrollTop - dialogHeight / 2,
						left : (windowWidth - dialogWidth) / 2
					});
					if( typeof callback == "function") {
						callback();
					}
				}
			});
			if(delay){
				setTimeout(function(){
					dialog.hide();
					if( typeof callback == "function") {
						callback();
					}
				},delay);
			}
			return dialog;
		};
		/**
		 * 行为提示
		 * @date 2011-12-19
		 * @author lifayu@baidu.com
		 * 参数
		 * @param {String}	opts.content	显示的内容
		 * @param {int}		opts.delay		延时关闭时间，单位ms (可选)
		 * @param {jQuery}	opts.target		位置目标，优先级高于opts.position
		 * @param {Object}	opts.position	位置 left,top
		 * 事件
		 * @event oninit
		 * @event afterclose
		 * @event beforeclose
		 * 方法
		 * @method close 移除dom
		 */
		m.ui.ActionTips = m.View.createClass(function() {
		}, {
			uiType : "actiontips",
			tplString : '<div style="position:absolute;z-index:9999;border:1px solid #bbb;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;box-shadow:1px 1px 2px #bbb;padding:5px 10px;line-height:20px;background:#f2f2f2;display:none;font-size:12px;opacity:0.7;filter:alpha(opacity=70);" id="#{id}" class="#{clazz}"><div class="#{content}">#{content_html}</div><div style="color:#f2f2f2;font-size:20px;text-shadow:0px 2px 1px #bbb;position:absolute;bottom:-7px;" class="#{arrow}">♦</div></div>',
			getString : function() {
				var me = this;
				return m.format(me.tplString, {
					id : me.getId(),
					clazz : me.getClass(),
					content : me.getClass("content"),
					arrow : me.getClass("arrow"),
					content_html : me.content
				});
			},
			init : function() {
				var me = this;
				me.element = $(me.getString());
				me.element.appendTo($("body"));
				var eh = me.element.outerHeight();
				var ew = me.element.outerWidth();
				//me.element.fadeIn();
				me.fire("oninit");
				if(me.target) {
					var pos = me.target.offset();
					var left = pos.left + me.target.outerWidth() / 2 - ew / 2;
					var top = pos.top - eh - 5;
					var win_w = $(window).width();
					var doc_st = $(document).scrollTop();
					if(left < 0)
						left = 5;
					if(doc_st > top)
						top = pos.top + me.target.outerHeight() + 5;
					if(left + ew > win_w)
						left = win_w - ew - 5;
					me.element.css({
						left : left,
						top : top + eh
					});
					me.element.find("." + me.getClass("arrow")).css({
						"margin-left" :3 +  pos.left + me.target.outerWidth() / 2 - left - parseInt(me.element.css("padding-left")) * 2
					});
					me.element.animate({
						opacity : 'toggle',
						left : left,
						top : top
					}, 400);
				} else if(me.position) {
					me.element.css({
						left : me.position.left,
						top : me.position.top
					}).fadeIn();
					me.element.find("." + me.getClass("arrow")).hide();
				}
				if(me.delay) {
					setTimeout(function() {
						me.close();
					}, me.delay);
				}
			},
			close : function() {
				var me = this;
				if(me.fire("beforeclose") === false) {
					return false;
				}
				me.element.animate({
					opacity : 'toggle'
					//,top : -1000
				}, 400, function() {
					me.element.remove();
					me.fire("dispose");
					me.fire("afterclose");
				});
			}
		});
	})(fly);
	
	return fly;
});

