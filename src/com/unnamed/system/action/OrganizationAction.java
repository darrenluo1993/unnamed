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
import com.unnamed.system.manager.IOrganizationManager;
import com.unnamed.system.model.Organization;
import com.unnamed.system.model.OrganizationAO;

import lombok.Getter;
import lombok.Setter;

/**
 * 组织机构业务请求控制层
 *
 * @CreatedBy Darren Luo
 * @CreatedTime Sep 25, 2019 3:27:35 PM
 */
@AutoConfig
public class OrganizationAction extends EntityAction<Organization> {

	private static final long serialVersionUID = -7957503030641450983L;
	/********************** 入参定义区域 **********************/
	@Setter
	private Long orgId;
	@Setter
	private Long supOrgId;
	@Getter
	@Setter
	private OrganizationAO args;
	/********************** 出参定义区域 **********************/
	@Getter
	@Setter
	private Organization organization;
	@Getter
	private List<Organization> organizationList;
	@Getter
	private ReturnResult<Void> returnResult;
	/********************** 非参定义区域 **********************/
	@Autowired
	@Qualifier("organizationIdSeq")
	private Sequence organizationIdSeq;
	@Autowired
	private IOrganizationManager organizationManager;

	@Override
	public String input() {
		final String id = this.getUid();
		if (isNotBlank(id)) {
			this.organization = this.organizationManager.get(id);
		}
		if (this.organization == null) {
			this.organization = new Organization();
			this.organization.setSupOrgId(this.supOrgId);
		}
		return INPUT;
	}

	@Override
	protected void beforeSave(final Organization organization) {
		if (organization.isNew()) {
			final Long orgId = this.organizationIdSeq.nextLongValue();
			organization.setOrgId(orgId);
			final Long supOrgId = organization.getSupOrgId();
			if (supOrgId != null) {
				final Organization supOrg = this.organizationManager.findByNaturalId(supOrgId);
				if (supOrg != null) {
					organization.setHierarchy(supOrg.getHierarchy() + 1);
					organization.setOrgIdPath(supOrg.getOrgIdPath() + orgId + DOT);
					organization.setOrgFullName(supOrg.getOrgFullName() + DOT + organization.getOrgName());
					return;
				}
			}
			organization.setHierarchy(1);
			organization.setOrgIdPath(orgId + DOT);
			organization.setOrgFullName(organization.getOrgName());
		}
	}

	@Override
	public String save() throws Exception {
		if (!super.makeEntityValid()) {
			return INPUT;
		}
		this.beforeSave(super.getEntity());
		this.organizationManager.save(super.getEntity());

		super.notify("save.success");
		return SUCCESS;
	}

	/**
	 * 根据父级组织ID获取子级组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 3:38:03 PM
	 * @return
	 */
	@JsonConfig(root = "organizationList")
	public String listOrganizationViaSupId() {
		this.organizationList = this.organizationManager.listOrganizationViaSupId(this.supOrgId);
		return JSON;
	}

	/**
	 * 根据组织ID启用禁用组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 4:32:32 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String switchOrganizationViaOrgId() {
		this.returnResult = this.organizationManager.switchOrganizationViaOrgId(this.args);
		return JSON;
	}

	/**
	 * 根据组织ID删除组织机构
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 23, 2019 2:38:28 PM
	 * @return
	 */
	@JsonConfig(root = "returnResult")
	public String removeOrganizationViaOrgId() {
		this.returnResult = this.organizationManager.removeOrganizationViaOrgId(this.orgId);
		return JSON;
	}

	private static final String DOT = ".";
}