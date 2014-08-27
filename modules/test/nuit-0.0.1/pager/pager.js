define("nuit/pager/pager", ["jquery", "fly", "./pager.css"],function(require,exports,module){
    var jQuery = require("jquery");
    var fly = require("fly");

	fly.ui = fly.ui || {};
    
	/**
	 * jQuery pager plugin
	 * Version 1.0 (12/22/2008)
	 * @requires jQuery v1.2.6 or later
	 */
	(function($) {
	    $.fn.pager = function(options) {
	        var opts = $.extend({
				noNumber:false,	//是否显示数字
				showTotal:false,	//是否显示总页码数
				pageNumber:1,	//当前页
				pageCount:1,	//总页数
				totalCount:1,
				leftItemCount:4,//显示左边页数
				totalItemCount:9,//显示总共页数
				onItemClick:function(){}
			}, options);
			if(opts.pageNumber>opts.pageCount){
				opts.pageNumber = opts.pageCount;
			}else if(opts.pageNumber < 1){
				opts.pageNumber = 1;
			}
	        return this.each(function() {
	            $(this).empty().append(renderPager(parseInt(opts.pageNumber), parseInt(opts.pageCount),parseInt(opts.totalCount), opts.onItemClick,opts));
			});
	    };
	    // render and return the pager with the supplied options
	    function renderPager(pageNumber, pageCount, totalCount, onItemClick, opts) {
	        // setup $pager to hold render
	        var $pager = $('<ul class="pages"></ul>');
	        // add in the previous and next buttons
	        /*
	        $pager.append(renderButton('first', pageNumber, pageCount, totalCount, onItemClick))
				  .append(renderButton('prev', pageNumber, pageCount, totalCount, onItemClick));
	        */
			$pager.append(renderButton('prev', pageNumber, pageCount, totalCount, onItemClick));
	        // pager currently only handles 10 viewable pages ( could be easily parameterized, maybe in next version ) so handle edge cases
	        var startPoint = 1;
	        var endPoint = opts.totalItemCount;
	        if (pageNumber > opts.leftItemCount) {
	            startPoint = pageNumber - opts.leftItemCount;
	            //endPoint = pageNumber + opts.leftItemCount;
				endPoint = startPoint + opts.totalItemCount - 1;
	        }
	        if (endPoint > pageCount) {
	            startPoint = pageCount - opts.totalItemCount + 1;
	            endPoint = pageCount;
	        }
	        if (startPoint < 1) {
	            startPoint = 1;
	        }
			if(!opts.noNumber){
				// loop thru visible pages and render buttons
				for (var page = startPoint; page <= endPoint; page++) {
					var currentButton = $('<li class="page-number">' + (page) + '</li>');
					page == pageNumber ? currentButton.addClass('pgCurrent') : currentButton.click(function() { onItemClick(this.firstChild.data); });
					currentButton.appendTo($pager);
				}
			}
	        // render in the next and last buttons before returning the whole rendered control back.
	        $pager.append(renderButton('next', pageNumber, pageCount, totalCount, onItemClick));
	              //.append(renderButton('last', pageNumber, pageCount, totalCount, onItemClick));
	
	        opts.showTotal && $pager.append(renderButton('total', pageNumber, pageCount, totalCount, onItemClick));
			$pagerDiv=$("<div class='pagerDiv'></div>");
			$pagerDiv.append($pager);
			//显示跳到某页的按钮
			/**
			$pager.append("<li class='pgTotal'>到 第<input class='page-goto' style='vertical-align:middle;width:20px;height:10px;'>页</li>");
	
			$pager.find(".page-goto").bind("keyup",function(event){
				if(event.keyCode == 13){
					onItemClick($(this).val());
				}
			});
			*/
	        return $pagerDiv;
	    }
	
	    // renders and returns a 'specialized' button, ie 'next', 'previous' etc. rather than a page number button
	    function renderButton(buttonLabel, pagenumber, pagecount, totalcount, buttonClickCallback) {
	        var destPage = 1;
	        // work out destination page for required button type
			//转换button中要显示的文字
			var txtLabel="";
	        switch (buttonLabel) {
	            case "first":
	                destPage = 1;
					txtLabel = "第一页";
	                break;
	            case "prev":
	                destPage = pagenumber - 1;
					txtLabel = "上一页";
	                break;
	            case "next":
	                destPage = pagenumber + 1;
					txtLabel = "下一页";
	                break;
	            case "last":
	                destPage = pagecount;
					txtLabel = "最后页";
	                break;
				case "total":
	                destPage = pagecount;
					txtLabel = pagenumber+"/"+pagecount +" 共"+totalcount+"条";
	                break;
	        }
	        var $Button = $('<li class="pgNext">' + txtLabel + '</li>');
	
	        // disable and 'grey' out buttons if not needed.
	        if (buttonLabel == "first" || buttonLabel == "prev") {
	            pagenumber <= 1 ? $Button.addClass('pgEmpty') : $Button.click(function() { buttonClickCallback(destPage); });
	        }else if(buttonLabel == "total") {
				$Button.addClass('pgTotal');
			}else{
	            pagenumber >= pagecount ? $Button.addClass('pgEmpty') : $Button.click(function() { buttonClickCallback(destPage); });
	        }
	        return $Button;
	    }
	})(jQuery);
	/**
	 * 分页组件 使用fly View进行包装
	 * @param {jQuery} el
	 * @param {Object} options 参考$.fn.pager
	 */
	fly.ui.Pager = fly.View.createClass(new Function,{
		el:null,
		init:function(){
			var me = this;
			me.el.pager(me.options);
		},
		refresh:function(){
			this.el.pager(this.options);
		}
	});
	return fly;
});
