+function($){

	//Captcha CLASS DEFINATION
	var Captcha = function(element, options){
		this.target = $(element);
		this.endpoint = "/approach.html?t=" + (new Date()).getTime();
		this.captchaObj = null;
		this.init();
	}
	Captcha.DEFAULTS = {}
	Captcha.prototype = {
		init: function(){
			register();
		},
		getCaptchaObject: function(){
			return this.captchaObj;
		}

	}
	var register = function(){
		console.log('register medthod has been called');
		$.ajax({
			url: "api/approach.html?t=" + (new Date()).getTime(),
	        type: "get",
	        dataType: "json",
	        success: function (data) {
	            window.initGeetest({
	                gt: data.gt,
	                challenge: data.challenge,
	                offline: !data.success,
	                new_captcha: true,
	                width: "100%"
	            }, initializationHandler);
	        }
		});
	};
	var initializationHandler = function(obj){
		
		obj.onReady(function () {
			$('#wait').hide(200);
			$('#captcha-fake').hide();
			obj.appendTo('#captcha');
			setTimeout(function(){
				$('.geetest_logo').remove();
			}, 200);
			
        });
        obj.onSuccess(function(){
        		window.captchaObj = obj;
        		
        		setTimeout(function(){
        			$('.geetest_success_logo').remove();
        		}, 200);
        });
	};
	//Captcha PLUGIN DEFINATION
	var old = $.fn.captcha;
	function Plugin(options){
	        "use strict";
	        return this.each(function(){
	            var self = $(this);
	            var data = self.data('hc.wx.binding.captcha');
	            var option = $.extend({}, Captcha.DFAULTS, options);
	            if(!data) self.data('hc.wx.binding.captcha', (data = new Captcha(this, option)));
	        })
	    }
	 $.fn.captcha = Plugin;
	 $.fn.captcha.Constructor = Captcha;
	//Captcha No-Conflict
	 $.fn.captcha.noConflict = function(){
	        $.fn.captcha = old;
	        return this;
	    }
}(jQuery)