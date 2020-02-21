<!DOCTYPE html>
<#escape x as x?html><html>
<head>
<title>${action.getText('project.name')}</title>
<script src="<@url value="/assets/scripts/ironrhino.patterninput.js"/>" type="text/javascript"></script>
<script>
$(function(){
		if(window!=top){
        top.location.href=location.href;
        }
		var initName = $('#username').val();
		if(initName == '' || initName == 'admin') {
			$('#smsCode').val('');
			$('#smsCheck').hide();
		}
		$('#username').blur(function(){
			var t = $(this);
			var name = t.val();
			if(name == '' || name == 'admin') {
				$('#smsCode').val('');
				$('#smsCheck').hide();
			} else {
				$('#smsCode').val('');
				$('#smsCheck').show();
			}
		});
		$('#getSmsCode').click(function(){
			var count = 0;
			$.ajax({
				type:'POST',
				url:'${actionBaseUrl}/getSmscode',
				dataType : "json",
				data : {
                	username : $('#username').val()
            	}, 
				success:function(data){
					var retCode = data['retCode'];
					if(retCode != '000') {
						count = 0;
					} else {
						$('#getSmsCode').attr("disabled", "disabled");
						count = data['expired'];
					}
					jAlert(data['retMsg'], '提示框');
				}
			});
			var cDown = setInterval(countDown, 1000);
			function countDown(){
				$('#getSmsCode').text("请" + count + "后重新获取");
				if(count == 0){
					$('#getSmsCode').text("${action.getText('getSmsCode')}").removeAttr("disabled");	
					clearInterval(cDown);
				}
				count --;
			}
		});
});

function loginVery(){
	var username = $("input[name='username']").val();
	var password = $("input[name='password']").val();
	if(username == ""){
		Message.showFieldError($("input[name='username']"), null, '请输入用户名');
	}
	if(password == ""){
		Message.showFieldError($("input[name='password']"), null, '请输入密码');
	}
	if(username == "" || password == ""){
		return false;
	}
}

</script>
<style>
.input-append{display:block;}
</style>

<!-- <@url value=""/> -->
<link href="<@url value="/assets/styles/login.css"/>" media="all" rel="stylesheet" type="text/css" />
<link rel="shortcut icon" href="<@url value="/assets/images/favicon1.ico"/>" />
<meta name="body_class" content="welcome" />
<#assign notlogin = false>
<@authorize ifAllGranted="ROLE_BUILTIN_ANONYMOUS">
<#assign notlogin = true>
</@authorize>
<#if !notlogin>
<meta name="decorator" content="main" />
<meta http-equiv="refresh" content="0; url=<@url value="/"/>" />

</#if>
</head>
<body>
<#if notlogin>
<div class="logo"><img src="<@url value='/assets/images/logo.png'/>" alt="logo"/></div>
<div class="login-container clearfix">
	<div class="login-bg"></div>
	<div class="content">
		<#--class="ajax focus form-horizontal"-->
		<@s.form id="login" action="${actionBaseUrl}" method="post" class="ajax form-vertical login-form">
			<h3 class="form-title">${action.getText('project.name')}<br><span style="font-size:16px;">${action.getText('userLogin')}</span></h3>
		
				<@s.hidden id="targetUrl" name="targetUrl" />
				<div class="control-group">
					<label class="control-label visible-ie8 visible-ie9">用户名：</label>
					<div class="input-icon left">
						<!--<img src="<@url value='/assets/images/user.png'/>"/>-->
						<i class="glyphicon glyphicon-user" style='float:left; padding:0 3px; padding-top:5px;'></i>
						<input type="text" name="username" id="username" class="required m-wrap placeholder-no-fix" placeholder="${action.getText("userPlaceholder")}"/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label visible-ie8 visible-ie9">密码：</label>
					<div class="input-icon left">
						<!--<img src="<@url value='/assets/images/lock.png'/>"/ style="margin-top: -10px;">-->
						<i class="glyphicon glyphicon-lock" style='float:left; padding:0 3px; padding-top:5px;'></i>
						<input type="password" style="display:none"><!--解决自动填充表单问题，加了以后就不自动填充了-->
						<input  type="password" name="password" class="required  input-pattern submit m-wrap placeholder-no-fix" placeholder="${action.getText("pwdPlaceholder")}"  id="id_password" autocomplete="off"/>
			
					</div>
				</div>
			<div class="control-group"><!--<@s.checkbox  name="rememberme" class="custom"/><div style="margin-top: -39px;margin-left: 30px;">记住我</div>--></div>
			<input type="submit" id="id_loginbutton" value="登录" class="btn pull-right" onClick="return loginVery();">
			<#if getSetting??&&'true'==getSetting('signup.enabled')>
				<@s.param name="after"> <a class="btn" href="${getUrl('/signup')}">${action.getText('signup')}</a></@s.param>
			</#if>
		</@s.form>
	</div>
</div>
	<div class="copyright">
<img src="<@url value='/assets/images/copy-icon.png'/>"/>
© 2017   版权所有：长沙银行${action.getText('project.name')}
	</div>
</div>
<#if getSetting??&&'true'==getSetting('signup.enabled')&&'true'==getSetting('oauth.enabled')>
<div class="ajaxpanel" data-url="<@url value="/oauth/connect"/>">
</div>
</#if>
<#else>
<div class="modal">
	<div class="modal-body">
		<div class="progress progress-striped active">
			<div class="bar" style="width: 50%;"></div>
		</div>
	</div>
</div>
</#if>
</body>
</html></#escape>
