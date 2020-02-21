<#macro checkboxCtrl name="" checked=false disabled=false value="" dynamicAttributes...>
	<label class="checkbox inline"><#t>
	<input id="${name}-0" type="checkbox"<#if name?has_content> name="${name}" value="true"</#if><#if disabled> disabled</#if> class="custom ${dynamicAttributes['class']!}"<#if value?? && value=="1">checked<#else><#if checked> checked</#if></#if><@dynAttrs value=dynamicAttributes exclude='class'/>/><#t>
	</label><#t>
</#macro>

<#macro btnHref id='' name='' class='' label='' href='' windowoptions='80%'>
<button type="button" id="${id}" name="${name}" onclick="window.open('${href}', {width:'${windowoptions}'})" class="btn ${class}"><#if label?? && label != ''>${label}<#else>按钮</#if></button>
</#macro>
<#-- 示例：<@btnHref href="${actionBaseUrl}/openHtml?planId=${entity.id!}" label="测试"/> -->