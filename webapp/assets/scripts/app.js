Observation.baseTree_treeview = function(container){
	var obj = $('#baseTree', container);
	obj.each(function() {
		obj.find('a').click(function(e) {
							$('#baseTree').find('li').removeClass('active');
							var li = $(e.target).closest('li');
							li.addClass('active');
						});
	});
}