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
import com.unnamed.system.manager.IResourceManager;
import com.unnamed.system.model.Resource;
import com.unnamed.system.model.ResourceAO;

import lombok.Getter;
import lombok.Setter;

/**
 * 系统资源业务请求控制层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 25, 2019 3:24:33 PM
 */
@AutoConfig
public class ResourceAction extends EntityAction<Resource> {

	private static final long serialVersionUID = -4969070528984805106L;
	/********************** 入参定义区域 **********************/
	@Setter
	private Long resId;
	@Setter
	private Long supResId;
	@Getter
	@Setter
	private ResourceAO args;
	/********************** 出参定义区域 **********************/
	@Getter
	@Setter
	private Resource resource;
	@Getter
	private List<Resource> resourceList;
	@Getter
	private ReturnResult<Void> returnResult;
	/********************** 非参定义区域 **********************/
	@Autowired
	@Qualifier("resourceIdSeq")
	private Sequence resourceIdSeq;
	@Autowired
	private IResourceManager resourceManager;

	@Override
	public String input() {
		final String id = this.getUid();
		if (isNotBlank(id)) {
			this.resource = this.resourceManager.get(id);
		}
		if (this.resource == null) {
			this.resource = new Resource();
			this.resource.setSupResId(this.supResId);
		}
		return INPUT;
	}

	@Override
	protected void beforeSave(final Resource resource) {
		if (resource.isNew()) {
			final Long resId = this.resourceIdSeq.nextLongValue();
			resource.setResId(resId);
			final Long supResId = resource.getSupResId();
			if (supResId != null) {
				final Resource supRes = this.resourceManager.findByNaturalId(supResId);
				if (supRes != null) {
					resource.setHierarchy(supRes.getHierarchy() + 1);
					resource.setResIdPath(supRes.getResIdPath() + resId + DOT);
					resource.setResIden(supRes.getResIden() + DOT + resource.getResIden());
					resource.setResFullName(supRes.getResFullName() + DOT + resource.getResName());
					return;
				}
			}
			resource.setHierarchy(1);
			resource.setResIdPath(resId + DOT);
			resource.setResFullName(resource.getResName());
		}
	}

	@Override
	public String save() throws Exception {
		if (!super.makeEntityValid()) {
			return INPUT;
		}
		this.beforeSave(super.getEntity());
		this.resourceManager.save(super.getEntity());

		super.notify("save.success");
		return SUCCESS;
	}

	/**
	 * 根据父级资源ID获取子级系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:38:03 PM
	 * @return
	 */
	@JsonConfig(root = "resourceList")
	public String listResourceViaSupId() {
		this.resourceList = this.resourceManager.listResourceViaSupId(this.supResId);
		return JSON;
	}

	/**
	 * 根据资源ID启用禁用系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 4:32:32 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String switchResourceViaResId() {
		this.returnResult = this.resourceManager.switchResourceViaResId(this.args);
		return JSON;
	}

	/**
	 * 根据资源ID删除系统资源
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 2:38:28 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String removeResourceViaResId() {
		this.returnResult = this.resourceManager.removeResourceViaResId(this.resId);
		return JSON;
	}

	private static final String DOT = ".";
}