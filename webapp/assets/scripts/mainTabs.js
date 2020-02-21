function openPanel(text,href){
	if ($('#tt').tabs('exists', text)) {
		$('#tt').tabs('select', text);
	} else {
		var content='';
		if(href){
			content='<iframe  name="frame_panle" src="'+href+'" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>';
			
		}else{
			content='未实现';
		}
		$('#tt').tabs('add', {
			title : text,
			//href : href,
			content:content,
			closable:true,
			
			//bodyCls : 'content-doc',
			extractor : function(data) {
				data = $.fn.panel.defaults.extractor(data);
				var tmp = $('<div></div>').html(data);
				data = tmp.find('#content').html();
				tmp.remove();
				return data;
			}
		});
	}	
}
function addPanelItem(text,href){
			if ($('#tt').tabs('exists', text)) {
				$('#tt').tabs('select', text);
				//refreshTab({tabTitle:text,url:href});
			} else {
				$('#tt').tabs('add', {
					title : text,
					href : href,
					closable:true,
					extractor : function(data) {
						data = $.fn.panel.defaults.extractor(data);
						var tmp = $('<div></div>').html(data);
						data = tmp.find('#content').html();
						tmp.remove();
						return data;
					}
				});
			}
}


function addFramePanelItem(text,href){
			if ($('#tt').tabs('exists', text)) {
				$('#tt').tabs('select', text);
				//refreshTab({tabTitle:text,url:href});
			} else {
				var content='';
				if(href){
					content='<iframe  name="task_panle" src="'+href+'" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>';	
				}else{
					content='未实现';
				}
				$('#tt').tabs('add', {
					title : text,
					content:content,
					closable:true,
					//bodyCls : 'content-doc',
					extractor : function(data) {
						data = $.fn.panel.defaults.extractor(data);
						var tmp = $('<div></div>').html(data);
						data = tmp.find('#content').html();
						tmp.remove();
						return data;
					}
				});
			}
}

function setReflushTaskParm(busiType,taskStatus){
	$('#id_reflush_busitype').val(busiType);
	$('#id_reflush_taskStatus').val(taskStatus);
}



function openHisProcess(taskUid,contractNo,processTitle,processHis,taskStatus){
	var text="已办_"+processTitle;
	var href="/cpms/linkus/capital/workflow/historicTaskProcess/show?activityTaskId="+taskUid+"&contractNo="+contractNo+"&processTitle="+processTitle+"&busiType="+processHis+"&taskStatus="+taskStatus+"&isView=true"
	addPanelItem(text,href);
	//	var page=$('.accordion-body ul li a[title="/cpms/linkus/capital/workflow/taskProcess/input"]');
//	page.attr("title","/cpms/linkus/capital/workflow/historicTaskProcess/show?activityTaskId="+taskUid+"&contractNo="+contractNo+"&processTitle="+processTitle+"&busiType="+processHis+"&taskStatus="+taskStatus+"&isView=true");
//	page.text("已办_"+processTitle);
//	page.html("已办_"+processTitle);
//	page.click();
//	page.attr("title","/cpms/linkus/capital/workflow/taskProcess/input");
}
/*function closedProcess(){
	$('#tt').tabs('close','菜单管理');
}*/	

function createFrame(href){
	href=href+'&r='+new Date().getTime();
	return '<iframe  name="frame_panle" src="'+href+'" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>';
}

function showReportDetail(text,href){
			if ($('#tt').tabs('exists', text)) {
				$('#tt').tabs('select', text);
				var tab=$('#tt').tabs('getSelected');
				var index=$('#tt').tabs('getTabIndex',tab)
				$('#tt').tabs('close', index);
			}
				var content='';
				if(href){
					content='<iframe  name="frame_panle" src="'+href+'" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>';
				}else{
					content='未实现';
				}
				$('#tt').tabs('add', {
					title : text,
					content:content,
					closable:true,
					extractor : function(data) {
						data = $.fn.panel.defaults.extractor(data);
						var tmp = $('<div></div>').html(data);
						data = tmp.find('#content').html();
						tmp.remove();
						return data;
					}
				});			
}
$(document).ready(function() {	
	$('#tt').tabs({
		onSelect:function(title){
			if(title=="待办任务"||title.indexOf("市场")>-1){
				var currTab=$('#tt').tabs('getTab',title);
				var iframe=currTab.find('iframe')[0];
				var src=iframe.src;
				iframe.contentWindow.location.href=src;
			}
			
		}
	});
	
	$('#tt').tabs({
		onClose:function(title){
			if(title=="待办任务"){
				$('#id_reflush_busitype').val('');
				$('#id_reflush_taskStatus').val('');
			}
		}
	});
	
	$('#tt').tabs({
		onBeforeClose:function(title,index){
			if(title.split("_")[0]=="待办"){
				var contractNo=window.parent.$(".tabs-panels").children().eq(index).find("input[name='contractNo']").val();
				$.ajax({
					type : "post",
					global : false,
					async : false,
					url : '/cpms/linkus/capital/workflow/taskProcess/unLock?contractNo='+contractNo,
					dataType : "json",
					success : function(data) {
					},
					error:function(){
					}
				});					
			}
		}
	});	

		$("a.view").click(function(){
			var text="";
			if($(this).attr("realtitle")){
				text=$(this).attr("realtitle");
			}else{
				text=$(this).text();
			}
			var href=$(this).attr("title");
			
			
			if ($('#tt').tabs('exists', text)) {
				$('#tt').tabs('select', text);
			} else {
				var content='';
				if(href){
					content='<iframe  name="frame_panle" src="'+href+'" frameborder="0" scrolling="auto" style="height:100%;width:100%;"></iframe>';
					
				}else{
					content='未实现';
				}
				$('#tt').tabs('add', {
					title : text,
					//href : href,
					content:content,
					closable:true,
					//bodyCls : 'content-doc',
					extractor : function(data) {
						data = $.fn.panel.defaults.extractor(data);
						var tmp = $('<div></div>').html(data);
						data = tmp.find('#content').html();
						tmp.remove();
						return data;
					}
				});
			}
		});
		
		//绑定tabs的右键菜单
		$('#tt').tabs({
			onContextMenu:function(e,title){
				e.preventDefault();
				$('#tabsMenu').menu('show',{
					left:e.pageX,
					top:e.pageY
				}).data('tabTitle',title);
			}
		});
		//关闭当前标签页
		$('#closecur').bind('click',function(){
			var tab=$('#tt').tabs('getSelected');
				var index=$('#tt').tabs('getTabIndex',tab);
				if(index != 0){
					$.messager.confirm('确认','确定要关闭当前窗口么？',function(r){
						if(r){
							$('#tt').tabs('close',index);
						}
					});
				}
		});
		
		
		//关闭所有标签页
		$('#closeall').bind('click',function(){
			$.messager.confirm('确认','确定要关闭所有窗口么？',function(r){
				if(r){
					var tablist=$('#tt').tabs('tabs');
					for(var i=tablist.length-1;i>=1;i--){
						$('#tt').tabs('close',i);
					}
				}
			});
		});
		//关闭非当前标签页（先关闭右侧，再关闭左侧）
		$('#closeother').bind('click',function(){
			$.messager.confirm('确认','确定要关闭其他窗口么？',function(r){
				if(r){
					var tablist=$('#tt').tabs('tabs');
					var tab=$('#tt').tabs('getSelected');
					var index=$('#tt').tabs('getTabIndex',tab);
					for(var i=tablist.length-1;i>index;i--){
						$('#tt').tabs('close',i);
					}
					var num=index-1;
					for(var i=num;i>=1;i--){
						$('#tt').tabs('close',1);
					}
				}
				});
		});
		//关闭当前标签右侧标签页
		$('#closeright').bind('click',function(){
			$.messager.confirm('确认','确定要右侧窗口么？',function(r){
				if(r){
					var tablist=$('#tt').tabs('tabs');
					var tab=$('#tt').tabs('getSelected');
					var index=$('#tt').tabs('getTabIndex',tab);
					for(var i=tablist.length-1;i>index;i--){
						$('#tt').tabs('close',i);
					}
				}
			});
		});
		//关闭当前标签左侧标签页
		$('#closeleft').bind('click',function(){
			$.messager.confirm('确认','确定要左侧窗口么？',function(r){
				if(r){
					var tab=$('#tt').tabs('getSelected');
					var index=$('#tt').tabs('getTabIndex',tab);
					var num=index-1;
					for(var i=1;i<=num;i++){
						$('#tt').tabs('close',1);
					}
				}
			});
		});
		//实例化menu的onClick事件
		$('#tabsMenu').menu({
			onClick:function(item){
				CloseTab(this,item.name);
			}
		});
		//几个关闭事件的实现
		function CloseTab(menu,type){
			var curTabTitle = $(menu).data('tabTitle');
			var tabs = $('#tt');
			
			if(type === 'close'){
				tabs.tabs('close',curTabTitle);
				return;
			}
			
			var allTabs = tabs.tabs('tabs');
			var closeTabsTitle = [];
			
			$.each(allTabs,function(){
				var opt = $(this).panel('options');
				if(opt.closable && opt.title != curTabTitle && type === 'Other'){
					closeTabsTitle.push(opt.title);
				}else if(opt.closable && type === 'All'){
					closeTabsTitle.push(opt.title);
				}
			});
			
			for(var i = 0;i<closeTabsTitle.length;i++){
				tabs.tabs('close',closeTabsTitle[i]);
			}
		}
});	