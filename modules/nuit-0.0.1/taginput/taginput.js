/**
 * 标签输入组件
 * @author lifayu@meifuzhi.com
 * @since 2012-09-03
 * @method (void) addTag(name[,value])
 * @method (Array) getValues() 获取所有tag内容
 * @options {int} maxLength 最大输入长度
 * @options {jQuery} el
 * @version 0.1.1
 */
define("nuit/taginput/taginput", ["jquery", "fly", "./taginput.css"], function(require, exports, module) {
	
	var $ = require("jquery"),
		fly = require("fly");
	
	fly.ui = fly.ui || {};

	fly.ui.Taginput = fly.View.createClass(new Function,{
		uiType:"taginput",
		maxLength:8,
		placeholder:"添加标签，以逗号或回车分隔",
		events:{
			"keyup input":"checkInput",
			"keydown input":"checkInput2",
			"click ul li a.remove":"removeTag"
		},
		init:function(){
			var me = this;
			me.render();
			me.wrap = fly.q(me.getClass("wrap"),me.el);
			me.itemsList = fly.q(me.getClass("items"),me.el).children("ul");
			me.input = $("input",me.el);
			me.el.bind("click",function(){
				me.input.focus();
			});
			me.checkInputBox();
			me.input.bind("focus",function(){
				if(me.input.val() == me.placeholder){
					me.input.css("color","#6f6f6f");
					me.input.val("");
				}
			}).bind("blur",function(){
				if(me.input.val() == ""){
					me.input.css("color","#999");
					me.input.val(me.placeholder);
				}else if(me.input.val() != me.placeholder){
					me.addTag(me.filterTag(me.input.val()));
					me.input.val("").blur();
				}
			});
			me.fire("oninit");
		},
		checkInputBox:function(){
			var me = this;
			if(me.input.val() == me.placeholder){
				me.input.css("color","#999");
			}else{
				me.input.css("color","#6f6f6f");
			}
		},
		checkInput2:function(event){
			var me = this;
			var keyCode = event.keyCode;
			if(keyCode == 8 && me.input.val()==""){
				me.itemsList.find("li:last").children("a").click();
			}
		},
		checkInput:function(event){
			var me = this;
			var keyCode = event.keyCode;
			setTimeout(function(){
				var val = me.input.val();
				if((keyCode == 188 && !event.shiftKey) || keyCode == 13 || val.charCodeAt(val.length-1) == 32){
					val!="" && me.addTag(me.filterTag(val));
					me.input.val("");
				}
			},0);
		},
		filterTag:function(tag){
			return tag.replace(/[,\uff0c\s]/g,"");
		},
		/**
		changeLabelState:function(){
			var me = this;
			var val = me.input.val().replace(/[,\uff0c\s]/g,"");
			if(val == "" && me.itemsList.find("li").length == 0){
				me.tiplabel.show();
			}else{
				me.tiplabel.hide();
			}
			me.input.val(val);
		},
		*/
		tplString:'<div class="taginput #{wrap}"><div class="#{items}"><ul></ul></div><div class="#{inputWrap}"><input autocomplete="off" spellcheck="false" width="100%" id="#{inputId}" maxlength="#{maxlength}" value="#{placeholder}" type="text"/></div></div>',
		tplItemString:'<li class="#{item}"><span val="#{value}">#{name}</span><a href="javascript:void(0);" class="remove" title="移除">×</a></li>',
		_getString:function(){
			var me = this;
			return fly.format(me.tplString,{
				wrap:me.getClass("wrap"),
				inputId:me.getId("inputId"),
				items:me.getClass("items"),
				label:me.getClass("label"),
				inputWrap:me.getClass("input-wrap"),
				maxlength:me.maxLength,
				placeholder:me.placeholder
			});
		},
		_getItemString:function(name,value){
			var me = this;
			return fly.format(me.tplItemString,{
				item:me.getClass("item"),
				name:name,
				value:value
			});
		},
		//渲染
		render:function(){
			var me = this;
			me.el.html(me._getString());
		},
		//插入tag
		addTag:function(name,value){
			var me = this;
			if($.trim(name).length == 0) return;
			var name = fly.Template.modifier.escape(String(name),"html");
			if(typeof value == "undefined"){
				value = name;
			}else{
				value = fly.Template.modifier.escape(String(value),"html");
			}
			//if(me.itemsList.find("li span[val="+value+"]").length > 0) return;
			var flag = false;
			me.itemsList.find("li").each(function(){
				var v = $(this).find("span").attr("val");
				if(v == value){
					flag = true;
					return false;
				}
			});
			if(flag) return;
			me.itemsList.append(me._getItemString(name,value));
			fly.q(me.getClass("items"),me.el).show();
		},
		// 移除tag
		removeTag:function(event,target){
			var me = this;
			$(target).closest("li").remove();
			if(me.itemsList.find("li").length == 0){
				fly.q(me.getClass("items"),me.el).hide();
				if(me.input.val == ""){
					me.tiplabel.show();
				}
			}
		},
		/**
		 * 获取所有tag的值
		 * @return Array
		 */
		getValues:function(){
			var me = this;
			var lis = me.itemsList.find("li");
			var ret = [];
			$.each(lis,function(i,item){
				ret.push($(item).children("span").attr("val"));
			});
			return ret;
		}
	});

	return fly;
});
