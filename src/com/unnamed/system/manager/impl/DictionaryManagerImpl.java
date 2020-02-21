package com.unnamed.system.manager.impl;

import static com.unnamed.base.model.ReturnResult.FAILURE;
import static com.unnamed.base.model.ReturnResult.OPERATE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.OPERATE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_FAILURE_MSG;
import static com.unnamed.base.model.ReturnResult.REMOVE_SUCCESS_MSG;
import static com.unnamed.base.model.ReturnResult.SUCCESS;
import static java.util.Collections.emptyList;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.hibernate.criterion.Order.asc;
import static org.hibernate.criterion.Restrictions.eq;
import static org.hibernate.criterion.Restrictions.isNull;

import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.ironrhino.core.service.BaseManagerImpl;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.manager.IDictionaryManager;
import com.unnamed.system.model.Dictionary;
import com.unnamed.system.model.DictionaryAO;

import lombok.extern.slf4j.Slf4j;

/**
 * 数据字典通用业务处理层实现
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:22:57 PM
 */
@Slf4j
@Component
public class DictionaryManagerImpl extends BaseManagerImpl<Dictionary> implements IDictionaryManager {

	@Override
	public List<Dictionary> listDictionaryViaSupId(final Long supDictId) {
		DetachedCriteria criteria = super.detachedCriteria();
		criteria.addOrder(asc(SERIAL_NUM));
		criteria.add(supDictId == null ? isNull(SUP_DICT_ID) : eq(SUP_DICT_ID, supDictId));

		final List<Dictionary> dictionaryList = super.findListByCriteria(criteria);
		for (final Dictionary dictionary : dictionaryList) {
			criteria = super.detachedCriteria();
			criteria.add(eq(SUP_DICT_ID, dictionary.getDictId()));
			dictionary.setState(super.countByCriteria(criteria) > 0 ? "closed" : "open");
		}

		return dictionaryList;
	}

	@Override
	@Transactional
	public ReturnResult<Void> switchDictionaryViaDictId(final DictionaryAO args) {
		try {
			this.modifyDictionaryEnabled(args.getDictId(), args.getEnabled());

			return new ReturnResult<>(SUCCESS, OPERATE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, OPERATE_FAILURE_MSG);
	}

	/**
	 * 根据字典ID递归修改数据字典的状态
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 5:22:06 PM
	 * @param dictId
	 * @param enabled
	 */
	private void modifyDictionaryEnabled(final Long dictId, final Boolean enabled) {
		// 根据字典ID查询数据字典并修改状态
		final Dictionary dictionary = super.findByNaturalId(dictId);
		if (dictionary != null) {
			dictionary.setEnabled(enabled);
			super.update(dictionary);

			// 根据字典ID查询子级数据字典并修改状态
			final DetachedCriteria criteria = super.detachedCriteria();
			criteria.add(eq(SUP_DICT_ID, dictId));
			super.findListByCriteria(criteria).forEach(modifyItem -> {
				modifyItem.setEnabled(enabled);
				super.update(modifyItem);

				this.modifyDictionaryEnabled(modifyItem.getDictId(), enabled);
			});
		}
	}

	@Override
	@Transactional
	public ReturnResult<Void> removeDictionaryViaDictId(final Long dictId) {
		try {
			this.recursiveRemoveDictionary(dictId);

			return new ReturnResult<>(SUCCESS, REMOVE_SUCCESS_MSG);
		} catch (final Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ReturnResult<>(FAILURE, REMOVE_FAILURE_MSG);
	}

	/**
	 * 根据字典ID递归删除数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 24, 2019 9:22:30 AM
	 * @param dictId
	 */
	private void recursiveRemoveDictionary(final Long dictId) {
		// 根据字典ID查询数据字典并删除
		final Dictionary dictionary = super.findByNaturalId(dictId);
		if (dictionary != null) {
			super.delete(dictionary);
		}
		// 根据字典ID查询子级数据字典并删除
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(eq(SUP_DICT_ID, dictId));
		super.findListByCriteria(criteria).forEach(removeItem -> {
			super.delete(removeItem);

			this.recursiveRemoveDictionary(removeItem.getDictId());
		});
	}

	@Override
	public List<Dictionary> listDictionaryViaSupCode(final String supDictCode) {
		if (isBlank(supDictCode)) {
			return emptyList();
		}
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.addOrder(asc(SERIAL_NUM));
		criteria.add(eq(ENABLED, true));
		criteria.add(eq(SUP_DICT_CODE, supDictCode));
		return super.findListByCriteria(criteria);
	}

	@Override
	public String getDictNameViaSupAndCode(final String supDictCode, final String dictCode) {
		if (isBlank(supDictCode) || isBlank(dictCode)) {
			return EMPTY;
		}
		final DetachedCriteria criteria = super.detachedCriteria();
		criteria.add(eq(DICT_CODE, dictCode));
		criteria.add(eq(SUP_DICT_CODE, supDictCode));
		final Dictionary dictionary = super.findByCriteria(criteria);

		return dictionary == null ? EMPTY : dictionary.getDictName();
	}

	private static final String ENABLED = "enabled";
	private static final String DICT_CODE = "dictCode";
	private static final String SERIAL_NUM = "serialNum";
	private static final String SUP_DICT_ID = "supDictId";
	private static final String SUP_DICT_CODE = "supDictCode";
}