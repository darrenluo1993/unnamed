<!DOCTYPE html>
<#escape x as x?html><html>
<head>
<title>用户查询</title>
</head>
<body>
<div style="height:95%;width:100%;overflow:auto">
    <div  data-options="region:'center',title:'用户查询'">
         <table  id="id_table_tasklist" class="table table-fixed table-hover table-striped table-bordered richtable sortable resizable" style="width:100%">
         	<thead>
         		<tr>
         			<th style="width:80px" class="nosort">
					<span class="resizeTitle">用户编号</span>
					</th>
					<th style="width:80px" class="nosort">
					<span class="resizeTitle">用户名称</span>
					</th>
					<th style="width:80px" class="nosort">
					<span class="resizeTitle">所属系统</span>
					</th>
         		</tr>
         	</thead>
         	<tbody>
				<#assign size = 0>
				<#if userList?? && userList?size gt 0>
					<#assign size = userList?size-1>
				</#if>
				<#if userList?? && userList?size gt 0>
				<#list 0..size as index>
        		<tr>
				<td><center>${userList[index].username!}</center></td>
				<td><center>${userList[index].name!}</center></td>
				<td><center>${beans['baseSystemManager'].getSystemName(userList[index].sysId)!}</center></td>
				</tr>
				</#list>
				</#if>	
         	</tbody>
         </table>
	</div>
</div>	


</body>
</html></#escape>