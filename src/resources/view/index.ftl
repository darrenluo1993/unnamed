<!DOCTYPE html>
<#escape x as x?html>
<html>
<head>
    <title>首页</title>
	<style type="text/css">
		p{
			font-size : 16px;
		}
		b{
			color : red;
		}
	</style>
</head>
<body width="width:100%;height:100%;">
	<div class="easyui-layout" style="overflow-y:scroll;width:100%;height:96%;">
		<p><b>Q:</b>自动化测试平台是做什么的？
		<b>A:</b>自动化测试平台是实现测试接口自动化的平台。</p>
		</br>
		<p><b>Q:</b>系统、环境、协议分别是什么意思？
		<b>A:</b>系统是指将零散的东西进行有序的整理、编排形成的具有整体性的整体。--百度百科
		&nbsp;&nbsp;&nbsp;测试的主要目的是测试接口，接口依附于系统。</br>
		
		&nbsp;&nbsp;&nbsp;环境:指测试环境，例如SIT测试、UAT测试。
		&nbsp;&nbsp;&nbsp;SIT测试:系统集成测试，为系统测试做准备。目的是校验功能、性能和可靠性要求；
		&nbsp;&nbsp;&nbsp;UAT测试:用户验收测试，它让系统用户决定是否接收系统。是一项确定产品是否能够满足合同或用户所规定需求的测试。</br>
		
		&nbsp;&nbsp;&nbsp;协议:指通信协议。通信协议是指双方实体完成通信或服务所必须遵循的规则和约定。--百度百科
		&nbsp;&nbsp;&nbsp;调用接口时必须先配置正确的协议，接口有多种类型，协议也有多种。
		&nbsp;&nbsp;&nbsp;单个系统中包含多个接口，所以一个系统可以指定多个协议。</p>
		</br>
		<p><b>Q:</b>ICOP是什么，ECIF又是什么？
		<b>A:</b>ICOP:渠道整合与运营平台；
		&nbsp;&nbsp;&nbsp;ECIF:企业级客户信息整合系统。系统主要目的是整合银行各个系统的客户信息，比如包括客户基本信息、客户关系。客户产品等。</p>
		</br>
		<p><b>Q:</b>数据字典的作用
		<b>A:</b>数据字典主要用于对测试时使用到的数据进行约束，以此保证测试数据按照正确的格式输入。
		&nbsp;&nbsp;&nbsp; 创建接口之前需要先添加数据字典。</p>
		</br>
		<p><b>Q:</b>数据池的作用
		<b>A:</b>将可重复使用的测试数据按照系统/环境分类保存。</p>
		</br>
		<p><b>Q:</b>XPath是什么？
		<b>A:</b>XPath即为XML路径语言，它是一种用来确定XML文档中某部分位置的语言。--百度百科
		&nbsp;&nbsp;&nbsp; 目的是通过XPath来定位XML文档中的元素和属性信息。</p>
		<p><b>Q:</b>如何定义组合案例中的表达式？
		<b>A:</b>详情请点击：<a target="_blank" href="help/doc.htm#caseGroupExp">组合案例表达式</a></p>
	</div>
</body>
</html></#escape>