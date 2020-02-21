/**
 * 读取数据字典
 * @param dictionaryName：字符串或者数组，
 * 例：var dictionaryName = ""; 
 * 或者 var dictionaryName = new Array('a1', 'a2');
 * 或者 var dictionaryName = ["a1", "a2"];
 * @return map对象(多个查询Map<String, Map<String, String>>，单个查询Map<String, String>)，
 * 例：{"a1":Map<String, String>, "a2":Map<String, String>}，{"0":"正确", "1":"错误"}
 * @author 陈曦路
 * @example var dictionaryName = "a1";
 * 			var dictionaryMap = createDictionaryMap(dictionaryName);
 */
function createDictionaryMap(dictionaryName){
	var map;
	if(dictionaryName != null && typeof(dictionaryName) != "undefined"){
		// 查询单个数据字典
		if(typeof(dictionaryName) == "string"){
			$.ajax({
				type : "post",
				global : false,
				async : false,
				url : CONTEXT_PATH + '/base/baseDictionary/getDictionaryBySimple',
				data : {
					dictionaryName : dictionaryName
				},
				dataType : "json",
				success : function(data) {
		       		if(data != null && typeof(data) != "undefined"){
			   	  		map = data;
			   	  	}
				},
				error : function(){
					doTheAlert('提示', errorTip);
				}
			});
		}
		// 查询多个数据字段
		if(typeof(dictionaryName) == "object"){
			$.ajax({
				type : "post",
				global : false,
				async : false,
				url : CONTEXT_PATH + '/base/baseDictionary/getDictionaryByMany',
				data : {
					dictionaryNameArray : dictionaryName
				},
				dataType : "json",
				success : function(data) {
		       		if(data != null && typeof(data) != "undefined"){
			   	  		map = data;
			   	  	}
				},
				error : function(){
					doTheAlert('提示', errorTip);
				}
			});
		}
	}
	return map;
}

/**
 * 实例测试
 */
//$(document).ready(function(){
//	var map;
//	console.log(map);
//	var dictionaryName = new Array('fieldType','fieldType2','listValueType');
//	map = createDictionaryMap(dictionaryName);
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	var items = $.map(map, function(value, key){
//		console.log("value:"+value+",key:"+key);
//	});
//	console.log(items);
//	console.log(map['fieldType']);
//	map = createDictionaryMap('fieldType');
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	$.map(map, function(item, index){
//		console.log("item:"+item+",index:"+index);
//	});
//	console.log(map['fieldType']);
//	map = createDictionaryMap([]);
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	$.map(map, function(item, index){
//		console.log("item:"+item+",index:"+index);
//	});
//	console.log(map['fieldType']);
//	map = createDictionaryMap();
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	map = createDictionaryMap('');
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	console.log(map['fieldType']);
//	map = createDictionaryMap(['fieldType']);
//	console.log(map);
//	console.log(map!=null && typeof(map)!="undefined");
//	for(var key in map){
//		console.log("key:"+key+",value:"+map[key]);
//	}
//	console.log(map['fieldType']);
//});
