package com.unnamed.system.action;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.util.List;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.JsonConfig;
import org.ironrhino.core.sequence.Sequence;
import org.ironrhino.core.struts.EntityAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.unnamed.base.model.ReturnResult;
import com.unnamed.system.manager.IDictionaryManager;
import com.unnamed.system.model.Dictionary;
import com.unnamed.system.model.DictionaryAO;

import lombok.Getter;
import lombok.Setter;

/**
 * 数据字典业务请求控制层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 19, 2019 4:26:23 PM
 */
@AutoConfig
public class DictionaryAction extends EntityAction<Dictionary> {

	private static final long serialVersionUID = 8556802061681214119L;
	/********************** 入参定义区域 **********************/
	@Setter
	private Long dictId;
	@Setter
	private Long supDictId;
	@Getter
	@Setter
	private DictionaryAO args;
	/********************** 出参定义区域 **********************/
	@Getter
	@Setter
	private Dictionary dictionary;
	@Getter
	private List<Dictionary> dictionaryList;
	@Getter
	private ReturnResult<Void> returnResult;
	/********************** 非参定义区域 **********************/
	@Autowired
	@Qualifier("dictionaryIdSeq")
	private Sequence dictionaryIdSeq;
	@Autowired
	private IDictionaryManager dictionaryManager;

	@Override
	public String input() {
		final String id = this.getUid();
		if (isNotBlank(id)) {
			this.dictionary = this.dictionaryManager.get(id);
		}
		if (this.dictionary == null) {
			this.dictionary = new Dictionary();
			final Dictionary supDict = this.dictionaryManager.findByNaturalId(this.supDictId);
			if (supDict != null) {
				this.dictionary.setSupDictId(supDict.getDictId());
				this.dictionary.setSupDictCode(supDict.getDictCode());
			}
		}
		return INPUT;
	}

	@Override
	protected void beforeSave(final Dictionary en) {
		if (en.isNew()) {
			en.setDictId(this.dictionaryIdSeq.nextLongValue());
		}
	}

	/**
	 * 根据父级字典ID获取子级数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:38:03 PM
	 * @return
	 */
	@JsonConfig(root = "dictionaryList")
	public String listDictionaryViaSupId() {
		this.dictionaryList = this.dictionaryManager.listDictionaryViaSupId(this.supDictId);
		return JSON;
	}

	/**
	 * 根据字典ID启用禁用数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 4:32:32 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String switchDictionaryViaDictId() {
		this.returnResult = this.dictionaryManager.switchDictionaryViaDictId(this.args);
		return JSON;
	}

	/**
	 * 根据字典ID删除数据字典
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 2:38:28 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String removeDictionaryViaDictId() {
		this.returnResult = this.dictionaryManager.removeDictionaryViaDictId(this.dictId);
		return JSON;
	}
}