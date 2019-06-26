/* globals $*/

+function($) {

	//BINDING CLASS DEFINITION
	var Binding = function(element, options) {
		this.option = $.extend({}, Binding.DEFAULTS, options);
		this.target = $(element);
		this.btnUnbind = $('#btnUnbind');
		this.unbindConfirm = $('#unbindConfirm');
		this.unbindCancel = $('#unbindCancel');
		this.unbindClose = $('#unbindClose');
		this.unbindFailClose = $('#unbindFailClose');
		this.fields = $(".inputMessage");
		this.smsCode = $('#messageCode');
		this.btnAgree = $('#agreeBtn');
		this.btnNotAgree = $('#notAgreeBtn');
		this.btnSubmit = $('#btnSubmit');
		this.btnSendSMS = $('#sendsms');
		this.userAgreement = $('#userAgreement');
		this.validateMsg = $('#errorMessage');
		this.btnNewCustomerSend = $('#sendsmsModal');
		this.btnConfirmModal = $('#confirmModal');
		this.wait = $('#wait');
		this.init();
	}
	Binding.DEFAULTS = {

	};

	Binding.prototype = {
		init : function() {
			var self = this;
			var error = self.validateMsg.data('error');
			if (error) {
				self.validateMsg.html(error);
				// $('#failModal').modal('show');
			}
			if (self.isMicroMessageBrowser()) {
				$('#captcha').captcha();
				self.setupEventListeners();
			}
		},
		setupEventListeners : function() {
			var self = this;
			self.btnAgree.on('click', function() {
				self.userAgreementCheck();
			});
			self.btnNotAgree.on('click', function() {
				self.userAgreementUncheck();
			});
			$('#agreementLabel').on('click', function() {
				if ($('#userAgreement').attr('checked')) {
					self.userAgreementUncheck();
				} else {
					self.userAgreementCheck();
				}
			});
			self.fields.on('blur', function() {
				if (!$(this).val()) {
					$(this).siblings("span").css("display", "block");
				} else {
					$(this).siblings("span").css("display", "none");
				}
			});
			self.btnSendSMS.on('click', performSendSms);
			self.btnNewCustomerSend.on('click', performSendSms);
			self.smsCode.on('keyup', function() {
				if ($(this).val().length > 5 && validate(getFormData())) {
					self.btnSubmit.removeClass('disabled');
				}
			});
			self.btnConfirmModal.on('click', function() {
				var phone = $('#phoneModal').val();
				var smscode = $('#messageCodeModal').val();
				var phoneReg = new RegExp('^1\\d{10}$');
				if(phone && phoneReg.test(phone) && smscode && smscode.length == 6){
					var phoneHtml = $('<input>', {
						name: 'phoneNbr',
						value: phone,
						type: 'hidden',
						readOnly: 'readOnly'
					});
					phoneHtml.appendTo(document.binding);
					$('#messageCode').attr('disabled', false).attr( 'readOnly', false).val(smscode).attr( 'readOnly', true);
					$('#userNotExistsModal').modal('hide');
					self.btnSendSMS.attr('disabled', 'disabled').addClass('disabled').hide();
					self.btnSubmit.removeClass('disabled')
				} else{
					console.log('modal data not valid');
					$('#smscodeErrMsgModal').show();
				}
			});
			self.btnSubmit.on('click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('disabled')) {
					return false;
				}
				if (!$('#userAgreement').attr('checked')) {
					$('.agreementSpan').tooltip('show');
					setTimeout(function(){
						$('.agreementSpan').tooltip('destroy');
						console.log('hiding tooltip...')
					}, 1000);
				}
				if (validate(getFormData(true)) && $('#userAgreement').attr('checked')) {
					if(window.customerType === 1){// 1 indecated that the customer is non-existing customer
						document.binding.action = 'contract-free-binding';
					}
					document.binding.submit();
				}
			});
			self.btnUnbind.on('click', function(event){
				// $('#confirmUnbindModal').modal('show');
			});
			self.unbindConfirm.on('click', function(event){
				var unbindConfirm = $(event.target);
				unbindConfirm.data('disabled','disabled');
				var openId = $('#openId').val();
				$.ajax({
					url : 'api/user-unbind/'+openId,
					method : 'POST',
					success : function(data) {
						if(data=='success'){
							$('#confirmUnbindModal').modal('hide');
							// $('#unbindSucessModal').modal('show');
						}else{
							$('#confirmUnbindModal').modal('hide');
							// $('#unbindFailModal').modal('show');
						}
					},
					error : function(xhr, status, errdata) {
						$('#confirmUnbindModal').modal('hide');
						// $('#unbindFailModal').modal('show');
					}
				});
			});
			self.unbindCancel.on('click', function(){
				$('#confirmUnbindModal').modal('hide');
			});
			self.unbindClose.on('click', function(){
				WeixinJSBridge.call('closeWindow')
			});
			self.unbindFailClose.on('click', function(){
				WeixinJSBridge.call('closeWindow')
			});
		},
		getUserOpenId : function() {
			if ($('#openId').val())
				return;
			var code = getUrlParamter('code');
			if (code) {
				var target = 'api/obtainAccessTokenAndOpenId/TCODE';
				target = target.replace('TCODE', code);
				$.ajax({
					url : target,
					success : function(data) {
						data = JSON.parse(data);
						if (data && data.openid) {
							$('#openId').val(data.openid);
						} else {
							$('#browserErrorTip').text('无法获取您微信账号的基本信息，请返回公众号重试:'
													+ data.errcode ? data.errcode: 'unkonwn');
							// $('#browserModal').modal('show');
							var root = $('html');
							if(root.data('e') !== 'prod' && root.data('mode') === true){
								$('#openId').val('FAKE-OPEN-ID-' + Math.floor(Math.random() * 100000));
							}
						}
					},
					error : function(xhr, status, errdata) {
						$('#browserErrorTip').text( '网络错误，错误码:' + xhr.status ? xhr.status: 'unkonwn');
						// $('#browserModal').modal('show');
					}
				});
			} else {
				$('#browserErrorTip').text('无法获取您微信账号的基本信息，请返回公众号重试');
				// $('#browserModal').modal('show');
			}
		},
		isMicroMessageBrowser : function() {
			var userAgent = window.navigator.userAgent.toLowerCase();
			if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				// $('#browserModal').modal();
				return false;
			}
		},
		userAgreementCheck : function() {
			$('#userAgreement').attr('checked', 'checked');
			$("#agreementLabel").removeClass("notAgreeLabel").addClass("agreeLabel");
		},
		userAgreementUncheck : function() {
			$('#userAgreement').attr('checked', false);
			$("#agreementLabel").removeClass("agreeLabel").addClass("notAgreeLabel");
		}

	}
	var performSendSms = function(event){
		event.preventDefault();
		var sendBtn = $(event.target);
		if(sendBtn.hasClass('disabled')){
			return false;
		}else{
			if(event.target.id == 'sendsms'){
				var formData = getFormData();
				var result = validate(formData);
				if (result) {
					if(sendBtn.data('disabled') == 'disabled'){
						console.log('you perform too much time in few sesonds')
						return false;
					}
					sendBtn.data('disabled','disabled');
					sendSmsTxt(formData);
					$(".inputMessage").attr('readOnly', 'readOnly');
				}
			}else if(event.target.id == 'sendsmsModal'){
				if(sendBtn.data('disabled') == 'disabled'){
					console.log('you perform too much time in few sesonds')
					return false;
				}
				sendBtn.data('disabled','disabled');
				//send SMS only
				sendSmsTxtWithoutVerify($('#phoneModal').val());
			}
		}

	}

	var sendSmsTxt = function(form) {
		$.ajax({
			url : "api/verify.html",
			method : "POST",
			data : form,
			dataType : "json",
			success : function(data, status) {
				if (status == 'success' && data.status == 'success') {
					triggerResendCounter();
					$('#messageCode').attr('disabled', false).attr( 'readOnly', false);
					$('#personId').val(data.person.personId);
					$('.smsCodeSentTip').text( '短信验证码已经发送您的电话号码' + data.person.contact).show();
				} else if (status == 'success' && data.status == 'userNotExists') {
					// $('#userNotExistsModal').modal('show');
					$(".inputMessage").attr('readOnly', false);
				} else if (status == 'success' && data.status == 'robotCheckFail') {
					window.captchaObj.reset();
					setTimeout(function() {
						validate(getFormData());
					}, 500);
				} else if (status == 'success' && data.status == 'fail') {
					$('#errorMessage').html('您输入的姓名、身份号或验证码有误');
					// $('#failModal').modal('show');
					$(".inputMessage").attr('readOnly', false);
				} else if (status == 'success'
						&& data.status == 'smsSendFail') {
					// $('#syserrModal').modal('show');
				}
				$.data($('#sendsms')[0],'disabled','enabled');
			}
		});
	};
	var sendSmsTxtWithoutVerify = function(phone){
		var btnSendModal = $('#sendsmsModal');
		console.log('phone number is ' + phone + ' self = ' + btnSendModal);
		if(!phone){
			btnSendModal.data('disabled', 'enabled');
			$('#phoneErrMsgModal').show();
			return false;
		}

		$.ajax({
			url : "api/sms/send.html",
			method : "POST",
			data : 'phone=' + phone,
			success : function(response, status) {
				if (status === 'success' && response === 'success') {
					triggerResendCounter(btnSendModal);
					$('#phoneErrMsgModal').hide();
					$('#messageCodeModal').attr('disabled', false).attr( 'readOnly', false);
					window.customerType = 1;
				} else if (status === 'success' && response === 'invalid') {
					$('#phoneErrMsgModal').text('您输入的手机号格式不正确').show();
				} else if (status === 'success' && response === 'fail') {
					$('#phoneErrMsgModal').text('系统故障，短信发送失败!').show();
				}
				btnSendModal.data('disabled', 'enabled');
			}
		});
	}
	var counter = 60;
	var triggerResendCounter = function(btnSendSms) {
		btnSendSms = btnSendSms || $('#sendsms');
		btnSendSms.addClass('disabled');
		var timer = setInterval(function() {
			counter--;
			btnSendSms.text(counter + '秒后重新发送');
			if (counter < 0) {
				clearTimeout(timer);
				btnSendSms.removeClass('disabled').text('重新发送');
				counter = 60;
			}
		}, 1000)
	}
	var validate = function(data) {
		var c = 5, result = true;
		for ( var key in data) {
			if (key == 'idCardNumber' && !validateIdCardNumber(data[key])) {
				$('input[name="' + key + '"]').siblings('span').css("display", 'block');
				return false;
			}
			if (data.hasOwnProperty(key) && !data[key]) {
				$('input[name="' + key + '"]').siblings('span').css("display", 'block');
				if (key == 'geetestChallenge') {
					var warner = setInterval(function() {
						c % 2 == 0 ? $('#captcha').css('border', '1px solid red') : $('#captcha').css('border', 'none');
						if (c < 0) {
							clearInterval(warner);
							c = 5;
						}
						c--;
					}, 60);
				}
				result = false;
			}
		}
		return result;
	}
	var getFormData = function(smsInclude) {
		var formData = {};
		formData.geetestChallenge = $('input[name="geetest_challenge"]').val();
		formData.geetestValidate = $('input[name="geetest_validate"]').val();
		formData.geetestSeccode = $('input[name="geetest_seccode"]').val();
		formData.customerName = $('input[name="customerName"]').val();
		formData.idCardNumber = $('input[name="idCardNumber"]').val();
		if (smsInclude) {
			formData.smsCode = $('input[name="smsCode"]').val();
		}
		return formData;
	}

	var getUrlParamter = function(key) {
		var qs = window.location.search.substr(1);
		var result = '';
		if (qs) {
			var pairs = new Array();
			pairs = qs.split('&')
			for ( var i in pairs) {
				var p = pairs[i].split('=');
				if (p[0].toUpperCase() == key.toUpperCase()) {
					result = p[1];
					break;
				}
			}
		}
		return result;
	}
	var validateIdCardNumber = function(value) {
		if(value.length != 18){
			return false;
		}
		var idReg = /^[1-9][0-7]\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((19|20)\d{2}(0[13578]|1[02])31)|((19|20)\d{2}02(0[1-9]|1\d|2[0-8]))|((19|20)([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
		if(!idReg.test(value)){
			return false;
		}
		var result = true;
		var code = value.split('');
		//∑(ai×Wi)(mod 11)//加权因子
		var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
		//校验位
		var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
		var sum = 0;
		var ai = 0;
		var wi = 0;
		for (var i = 0; i < 17; i++) {
			ai = code[i];
			wi = factor[i];
			sum += ai * wi;
		}
		var last = parity[sum % 11];
		if (last != code[17]) {
			result = false;
		}
		console.log('id card check result = ' + result);
		return result;
	}

	//BINDING PLUGIN DEFINITION
	var old = $.fn.binding;
	$.fn.binding = function(options) {
		"use strict";
		return this
				.each(function() {
					var self = $(this);
					var data = self.data('binding.params');
					var option = $.extend({}, Binding.DFAULTS, options);
					if (!data)
						self.data('binding.params', (data = new Binding(this,
								option)));
				})
	}
	$.fn.binding.Constructor = Binding;
	//BINDING NO CONFLICT
	$.fn.binding.noConflict = function() {
		$.fn.binding = old;
		return this;
	}
	//BINDING DATA-API
	$(function() {
		window.binding = new Binding();
	});
}(jQuery)
