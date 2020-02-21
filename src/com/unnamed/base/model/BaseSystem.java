package com.unnamed.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.model.BaseEntity;

/**
 * 系统管理表
 **/
@AutoConfig
@Richtable
@Entity
@Table(name = "tb_base_system")
public class BaseSystem extends BaseEntity {
	// 系统名称
	@Column(name = "systemName", length = 50, nullable = false)
	private String systemName;
	// 系统编码
	@Column(name = "systemCode", length = 50, nullable = false)
	private String systemCode;
	// 系统内部编码
	@Column(name = "systemId", length = 20, nullable = false)
	private String systemId;
	@Transient
	private String flag;// 预留标志位

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public void setSystemName(String systemName) {
		this.systemName = systemName;
	}

	public String getSystemName() {
		return this.systemName;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}

	public String getSystemCode() {
		return this.systemCode;
	}

	public String getSystemId() {
		return systemId;
	}

	public void setSystemId(String systemId) {
		this.systemId = systemId;
	}
}
