/**
 * @author Darren Luo
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展tree，使其支持平滑数据格式
 * 
 */

$.fn.tree.defaults.loadFilter = function(data, parent) {
	var opt = $(this).data().tree.options;
	if (opt.parentField) {
		var idField = opt.idField || "id";
		var parentField = opt.parentField || "parentId";

		var i, l, treeData = [], tmpMap = [];
		for (i = 0, l = data.length; i < l; i++) {
			tmpMap[data[i][idField]] = data[i];
		}

		for (i = 0, l = data.length; i < l; i++) {
			if (tmpMap[data[i][parentField]]
					&& data[i][idField] != data[i][parentField]) {
				if (!tmpMap[data[i][parentField]]["children"]) {
					tmpMap[data[i][parentField]]["children"] = [];
				}
				tmpMap[data[i][parentField]]["children"].push(data[i]);
			} else {
				treeData.push(data[i]);
			}
		}
		return treeData;
	}
	return data;
};

/**
 * @author Darren Luo
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展treegrid，使其支持平滑数据格式
 */
$.fn.treegrid.defaults.loadFilter = function(data, parentId) {
	var opt = $(this).data().treegrid.options;
	if (opt.parentField) {
		var idField = opt.idField || "id";
		var parentField = opt.parentField || "parentId";

		var i, l, treegridData = [], tmpMap = [];
		for (i = 0, l = data.length; i < l; i++) {
			tmpMap[data[i][idField]] = data[i];
		}

		for (i = 0, l = data.length; i < l; i++) {
			if (tmpMap[data[i][parentField]]
					&& data[i][idField] != data[i][parentField]) {
				if (!tmpMap[data[i][parentField]]["children"]) {
					tmpMap[data[i][parentField]]["children"] = [];
				}
				tmpMap[data[i][parentField]]["children"].push(data[i]);
			} else {
				treegridData.push(data[i]);
			}
		}
		return treegridData;
	}
	return data;
};

/**
 * @author Darren Luo
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展combotree，使其支持平滑数据格式："{id:id,text:text,parentId:parentId}"
 * 
 */
$.fn.combotree.defaults.loadFilter = function(data, parent) {
	var opt = $(this).data().tree.options;
	if (opt.parentField) {
		var idField = opt.idField || "id";
		var parentField = opt.parentField || "parentId";

		var i, l, treeData = [], tmpMap = [];
		for (i = 0, l = data.length; i < l; i++) {
			tmpMap[data[i][idField]] = data[i];
		}

		for (i = 0, l = data.length; i < l; i++) {
			if (tmpMap[data[i][parentField]]
					&& data[i][idField] != data[i][parentField]) {
				if (!tmpMap[data[i][parentField]]["children"]) {
					tmpMap[data[i][parentField]]["children"] = [];
				}
				tmpMap[data[i][parentField]]["children"].push(data[i]);
			} else {
				treeData.push(data[i]);
			}
		}
		return treeData;
	}
	return data;
};

/**
 * tree方法扩展
 */
$.extend($.fn.tree.methods, {
	/**
	 * 取消所有已选中
	 */
	uncheckAll: function(jqTree) {
		var that = this;
		var nodes = that.getChecked(jqTree);
		$(nodes).each(function(i, node) {
			that.uncheck(jqTree, node.target);
		});
	}
});