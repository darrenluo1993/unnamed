<#assign charset=response.characterEncoding!'utf-8'/>
<#assign requestURI=request.requestURI[request.contextPath?length..]/>
<#assign modernBrowser = true/>
<#assign ua = request.getAttribute('userAgent')!/>
<#if ua?? && ua.name=='msie' && ua.majorVersion lt 9>
<#assign modernBrowser = false/>
</#if>
<#if modernBrowser>
<!DOCTYPE html>
<html>
<#else>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
</#if>
<#compress><#escape x as x?html>
<head>
<title><#noescape>${title}</#noescape></title>
<#if modernBrowser>
<meta charset="${charset}">
<#else>
<meta http-equiv="Content-Type" content="text/html; charset=${charset}"/>
</#if>
<#if request.contextPath!=''>
<meta name="context_path" content="${request.contextPath}" />
</#if>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon" href="<@url value="/assets/images/favicon1.ico"/>" />
<link href="<@url value="/assets/styles/ironrhino-min.css"/>" media="all" rel="stylesheet" type="text/css" />
<script  type="text/javascript" src="<@url value="/assets/scripts/ironrhino.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<@url value="/assets/styles/themes/default/easyui.css"/>">
<link rel="stylesheet" type="text/css" href="<@url value="/assets/styles/themes/icon.css"/>">
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/jquery.easyui.min.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/jquery.easyui.extends.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/easyui/easyui-lang-zh_CN.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/mainTabs.js"/>"></script>
<script type="text/javascript" src="<@url value="/assets/scripts/bootstrap-typeahead.js"/>"></script>

<#include "include/assets.ftl" />
<#noescape>${head}</#noescape>

</head>

<body class="easyui-layout">

<div data-options="region:'north'" style="height:80px;">	

	<div id="header" class="main">
	<span class="main_logo"></span>
	<h2>${action.getText('project.name')}</h2>
	 
	<div class="pull-right">
	<ul class="right-menu clearfix">
	<li><#assign user = authentication("principal")>
	<input type="hidden" id="id_loginUserName" <#if user.username??> value="${user.username!}" </#if> />
	<i class="glyphicon glyphicon-user"></i>你好！</i> <#if user.name??>${user.name}<#elseif user.username??>${user.username}<#else>${(user?string)!}</#if> <!--</a>--></li>
  
  <li><i class="glyphicon glyphicon-question-sign"></i><a href="help/自动化测试用户手册（v4.0）.docx">帮助</a></li>
  
  <@resourcePresentConditional value="resources/view/audit.ftl">
  <li><a href="<@url value="/audit"/>" class="ajax view">${action.getText('auditEvent')}</a></li>
  </@resourcePresentConditional>
  
  <#assign divider=false/>
  <!--<#if user.isNew??>
  <li><a href="<@url value="${ssoServerBase!}/user/profile"/>" class="popmodal nocache"><i class="glyphicon glyphicon-th-list"></i>${action.getText('profile')}</a></li>-->
  <#if !user.getAttribute('oauth_provider')??>
  <li><a href="<@url value="${ssoServerBase!}/user/password"/>" class="popmodal"><i class="glyphicon glyphicon-lock"></i>${action.getText('change')}${action.getText('password')}</a></li>
  </#if>
  <#assign divider=true/>
  <!--</#if>-->
  
    <li id="sysWorkDate_index"></li>
    <li id="userOrg_index"></li>
  	<li><a href="<@url value="/logout"/>"><i class="glyphicon glyphicon-off"></i>${action.getText('logout')}</a></li> 	
</ul>
				</div>	 
<div id="skin">
		<ul>
			<li id="themes0" name="c" class="selected" value="0" title="黑"></li>
			<li id="themes1" name="c" value="1" title="红"></li>
			<li id="themes2" name="c" value="2" title="蓝"></li>
			<li id="themes3" name="c" value="3" title="灰"></li>
		</ul>
	 </div>	
	</div>

</div>
	
     <!--<div data-options="region:'west',iconCls:'icon-sitemap',title:'导航栏管理',split:true" style="width:15%;height:100%;overflow-y:scroll;">-->
 	 <div data-options="region:'west',title:'导航栏管理',split:true" style="width:15%;height:70%;">
	 	 <div class="nav-collapse">
	 	 	<#include "include/nav.ftl" />
	 	 </div>
	</div>   
	<!--<div data-options="region:'center',iconCls:'icon-home',title:'你所在的位置是：'">-->
    <div data-options="region:'center',iconCls:'fa fa-home fa-fw fa-lg',title:''">
   
    <div id="tt" class="easyui-tabs" data-options="fit:true">   
    <div title="首页" >   
        <div  class="main ${(page.properties["meta.body_class"])!}<#if modernBrowser> render-location-qrcode</#if>" 
	<#if !modernBrowser>
	<div class="container">
		<div class="alert">
			<button type="button" class="close" data-dismiss="alert">&times;</button>
			<#noescape>${action.getText('browser.warning')}</#noescape>
		</div>
	</div>
	</#if>
	<div id="content" class="container" '>
	<#if action.hasActionMessages() || action.hasActionErrors()>
		<div id="message">
		<@s.actionerror />
		<@s.actionmessage />
		</div>
	</#if>
		
	<#noescape>${body}</#noescape>
	
	</div>
    </div>   
     
	</div>  
   
</div>
     <#-- 增加tab的右键点击功能内容 -->
    <div id='tabsMenu' class='easyui-menu' style='width:120px;'>
    	<div data-options="iconCls:'icon-cancel'" id='closecur' >关闭</div>
    	<div id='closeall'>关闭全部</div>
    	<div id='closeother'>关闭其他</div>
    	<div class='menu-sep'></div>
    	<div id='closeright'>关闭右侧标签页</div>
    	<div id='closeleft'>关闭左侧标签页</div>
    </div>
    </div> 
    
    <#-- 业务产品设置关闭按钮  -->
    <div id='proInfoReturn' style="display:none;"></div>

 <#--<div data-options="region:'east',iconCls:'icon-reload',title:'这里是右边栏',split:true" style="width:5%;"></div>    -->  
<div data-options="region:'south',split:true">
	<div class="copyright">
		<p><img src="<@url value='/assets/images/copy-icon.png'/>"/>© 2017   版权所有：长沙银行${action.getText('project.name')}&nbsp;&nbsp;&nbsp;当前版本号：${action.getText('project.version')}&nbsp;&nbsp;&nbsp;最佳显示分辨率：1280*1024</p>
	</div>
</div>

</body>
</html></#escape></#compress>
