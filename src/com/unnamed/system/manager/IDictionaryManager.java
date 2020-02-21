package com.unnamed.system.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.model.Dictionary;
import com.unnamed.system.model.DictionaryAO;

/**
 * 数据字典通用业务处理层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:27 PM
 */
public interface IDictionaryManager extends BaseManager<Dictionary> {
	/**
	 * 根据父级字典ID获取子级数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:36:37 PM
	 * @param supDictId
	 * @return
	 */
	List<Dictionary> listDictionaryViaSupId(Long supDictId);

	/**
	 * 根据字典ID启用禁用数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:01:07 PM
	 * @param args
	 * @return
	 */
	ReturnResult<Void> switchDictionaryViaDictId(DictionaryAO args);

	/**
	 * 根据字典ID删除数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 11:56:06 AM
	 * @param dictId
	 * @return
	 */
	ReturnResult<Void> removeDictionaryViaDictId(Long dictId);

	/**
	 * 根据父级字典编码获取数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 27, 2019 2:56:59 PM
	 * @param supDictCode
	 * @return
	 */
	List<Dictionary> listDictionaryViaSupCode(String supDictCode);

	/**
	 * 根据父级字典编码与字典编码获取字典名称
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 27, 2019 3:39:26 PM
	 * @param supDictCode
	 * @param dictCode
	 * @return
	 */
	String getDictNameViaSupAndCode(String supDictCode, String dictCode);
}