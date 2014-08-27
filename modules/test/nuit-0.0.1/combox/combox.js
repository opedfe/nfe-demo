/**
 * @author lifayu
 */
define("nuit/combox/combox", ['jquery', 'fly', './combox.css'], function(require,exports,module){
	var $ = require("jquery");

	var fly = require("fly");

	fly.ui = fly.ui || {};

	//require.async("./combox.css", function(){console.log('load css')});

	(function() {

		/**
		 * 模拟select下拉框
		 * 支持选中+输入
		 * 支持下拉列表自定义
		 * @author lifayu@baidu.com
		 * @version 1.0
		 * @param {Object} options
		 * @config {int} 			width 元素宽度
		 * @config {int} 			contentWidth 下拉框宽度，当需要下拉列表自定义的时候有效
		 * @config {String} 		defaultText 默认显示文字，当需要下拉列表自定义的时候有效
		 * @config {String} 		element 目标元素
		 * @config {Boolean} 		autoRender 是否自动渲染
		 * @config {Array/Object} 	data 数据项，支持三种格式：
		 * 							1. ["",""]
		 * 							2. [{text:"xxx",value:"xxx"},{...}]
		 * 							3. {"group":[{text:"xxx",value:"xxx"},{...}]}
		 * @config {String} 		content 自定义下拉列表内容
		 * @config {String} 		type 可选值：panel，当需要下拉列表自定义的时候需要该项，同时需要重写getValue和setValue方法
		 * @config {Boolean} 		editable 是否允许输入
		 * @config {Function} 		onchange 当选中项改变时触发，如果editable为true，或者有自定义下拉列表，该项无效
		 *
		 * @method  				update(Array data)/update(Object data) 更新下拉列表
		 * @method 					getValue()	获取选中值
		 * @method 					setValue(String value) 设置选中值
		 * @method 					showList() 显示下拉框
		 * @method 					hideList() 隐藏下拉框
		 */
		/**
		 * 用法
		 * new fly.ui.Combox({
		 * 		data:[{
		 * 			text:"text",
		 * 			value:1
		 * 		}],
		 * 		width:200,
		 * 		editable:true
		 * });
		 *
		 * new fly.ui.Combox({
		 * 		data:{
		 * 			"FE":[{text:1,value:1},{}]
		 * 			"RD":[{},{}]
		 * 		}
		 * 		......
		 * });
		 *
		 * new fly.ui.Combox({
		 * 		content:"",
		 * 		defaultText:"请选择xxx",
		 * 		width:200,
		 * 		contentWidth:300
		 * });
		 */
		fly.ui.Combox = fly.View.createClass(function() {
			var me = this;
			me.width = 100;
			me.editable = false;
			me.data = [];
		}, {
			uiType : "combox",
			tplString : '<div id="#{id}" class="#{wrapInner}"><div class="#{arrow}"></div><div class="#{text}">#{content}</div></div><div class="#{list}"></div><input type="hidden" id="#{input}" value="#{value}" name="#{name}"/>',
			tplEditableString : '<div id="#{id}" class="#{wrapInner}"><div class="#{arrow}"></div><div class="#{text}"><input type="text" id="#{input}" value="#{value}"/></div></div><div class="#{list}"></div>',
			tplContentString : '<div id="#{id}" class="#{wrapInner}"><div class="#{arrow}"></div><div class="#{text}">#{defaultText}</div></div><div class="#{list}" style="width:#{contentWidth}px;"><div class="#{listInner}">#{content}</div></div><input type="hidden" id="#{input}" value="#{value}"/>',
			getString : function() {
				var me = this;
				var dft = me.getDefaultData();
				//{text:1,value:1};
				var str = me.tplString;
				if(me.editable) {
					str = me.tplEditableString;
				}
				return fly.format(str, {
					id : me.getId(),
					input : me.getId("input"),
					wrapInner : me.getClass("wrap-inner"),
					text : me.getClass("text"),
					arrow : me.getClass("arrow"),
					list : me.getClass("list"),
					content : dft.text,
					value : dft.value,
					name : me.name || ""
				});
			},
			getContentString : function() {
				var me = this;
				me.contentWidth = me.contentWidth || me.width;
				return fly.format(me.tplContentString, {
					id : me.getId(),
					input : me.getId("input"),
					wrapInner : me.getClass("wrap-inner"),
					text : me.getClass("text"),
					arrow : me.getClass("arrow"),
					list : me.getClass("list"),
					listInner : me.getClass("list-inner"),
					content : me.content,
					defaultText : me.defaultText,
					value : "",
					contentWidth : me.contentWidth
				});
			},
			init : function() {
				var me = this;

				me.el.width(me.width).addClass(me.getClass("wrap"));
				if(me.type == "panel") {
					me.el.html(me.getContentString());
				} else {
					me.el.html(me.getString());
				}
				me.list = fly.q(me.getClass("list"), me.el);
				me.input = fly.g(me.getId("input"));
				me.arrow = fly.q(me.getClass("arrow"), me.el);
				me.text = fly.q(me.getClass("text"), me.el);
				if(me.type != "panel") {
					me.update(me.data);
				}
				me.list.css("zIndex", (me.zIndex || 10));
				me._bindEvent();

				me.fire("oninit");
			},
			_fixPosition : function() {
				var me = this;

				var left = me.el.offset().left;
				var width = $(window).width();

				if(left + me.contentWidth > width) {
					me.list.css("left", me.width - me.contentWidth);
				} else {
					me.list.css("left", 0);
				}
			},
			_bindEvent : function() {
				var me = this;
				$(document).bind("click", function(event) {
					me.hideList();
				});
				fly.g(me.getId()).bind("mousedown", function(event) {
					me.fire("onmousedown", event);
				}).bind("mouseup", function(event) {
					me.fire("onmouseup", event);
					if(!me.arrow.hasClass(me.getClass("arrow-open"))) {
						setTimeout(function() {
							me.showList();
						}, 1);
					}
				});
				if(me.type == "panel") {
					me.list.bind("click", function(event) {
						event.stopPropagation();
					});
				}
			}
		}).extend({
			getDefaultData : function() {
				var me = this, ret = {
					text : "data 数据格式不正确",
					value : null
				};
				var data = me.data;
				if(fly.isArray(data)) {
					if(data.length == 0) {
						ret = {
							text : "data为空",
							value : null
						};
					} else {
						var t = data[0];
						if(fly.isObject(t)) {
							ret = t;
						} else {
							ret = {
								text : t,
								value : t
							};
						}
					}
				} else if(fly.isObject(data)) {
					fly.each(data, function(item, i) {
						ret = item[0];
						return false;
					});
				}
				return ret;
			},
			/**
			 * 更新列表
			 */
			update : function(data) {
				var me = this, htm = [];
				me.fire("onupdate");
				me.data = data;
				htm.push("<div class='" + me.getClass("list-inner") + "'>");
				if(fly.isArray(data)) {
					htm.push("<ul>");
					fly.each(data, function(item, i) {
						if(fly.isObject(item)) {
							if(item.text == "-"){
								htm.push("<li class='split'></li>");
							}else{
								htm.push("<li data-value='" + item.value + "'>" + item.text + "</li>");
							}
						} else {
							if(item == "-"){
								htm.push("<li class='split'></li>");
							}else{
								htm.push("<li data-value='" + item + "'>" + item + "</li>");
							}
						}
					});
					htm.push("</ul>");
					htm.push("</div>");
					me.list.html(htm.join(""));
					$("li:not(.split)", me.list).bind("click", function(event) {
						var $el = $(this);
						$el.siblings().removeClass(me.getClass("li-selected"));
						$el.addClass(me.getClass("li-selected"));
						var text = $el[0].innerHTML;
						var value = $el.attr("data-value");
						if(me.editable) {
							me.input.val(value);
						} else {
							me.text.html(text);
							var oldV = me.input.val();
							me.input.val(value);
							if(oldV != value) {
								me.fire("onchange", oldV, value);
							}
						}
					});
				} else {
					fly.each(data, function(group, dt) {
						htm.push("<dl>");
						htm.push("<dt>" + dt + "</dt>");
						fly.each(group, function(item, i) {
							htm.push("<dd data-value='" + item.value + "'>" + item.text + "</dd>");
						});
						htm.push("</dl>");
					});
					htm.push("</div>");
					me.list.html(htm.join(""));
					$("dd", me.list).bind("click", function(event) {
						var d = event.target;
						var text = d.innerHTML;

						var value = $(d).attr("data-value");
						me.text.html(text);
						var oldV = me.input.val();
						me.input.val(value);
						if(oldV != value) {
							me.fire("onchange", oldV, value);
						}
					});
					$("dt", me.list).bind("click", function(event) {
						event.stopPropagation();
						event.preventDefault();
					});
				}
				me.setValue(me.getDefaultData().value);
				me.fire("afterupdate");
			},
			/**
			 * 显示列表
			 */
			showList : function() {
				var me = this;
				me.arrow.addClass(me.getClass("arrow-open"));
				me.list.show();
				if(me.type == "panel") {
					me._fixPosition();
				}
			},
			/**
			 * 隐藏列表
			 */
			hideList : function() {
				var me = this;
				me.arrow.removeClass(me.getClass("arrow-open"));
				me.list.hide();
			},
			/**
			 * 获取选中值
			 */
			getValue : function() {
				return this.input.val();
			},
			/**
			 * 设置选中值
			 */
			setValue : function(value) {
				var me = this;
				var data = me.data;
				var old = me.input.val();
				me.input.val(value);
				if(me.editable)
					return;
				if(fly.isArray(data)) {
					fly.each(data, function(item, i) {
						if(fly.isObject(item)) {
							if(item.value == value) {
								me.text.html(item.text);
								return false;
							}
						} else {
							me.text.html(value);
							return false;
						}
					});
				} else if(fly.isObject(data)) {
					var isFind = false;
					fly.each(data, function(g, key) {
						fly.each(g, function(item, i) {
							if(item.value == value) {
								me.text.html(item.text);
								isFind = true;
								return false;
							}
						});
						if(isFind)
							return false;
					});
				}
				if(old != value) {
					me.fire("onchange", old, value);
				}
			}
		});
	})();

	return fly;
});
