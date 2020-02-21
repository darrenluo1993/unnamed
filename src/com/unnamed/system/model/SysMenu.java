package com.unnamed.system.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.metadata.UiConfig;
import org.ironrhino.core.model.BaseTreeableEntity;

/**
 * 系统菜单
 **/
@AutoConfig
@Richtable(celleditable = false, downloadable = false)
@Entity
@Table(name = "tb_sys_menu")
public class SysMenu extends BaseTreeableEntity<SysMenu> {
	@Column(name = "menuurl", length = 200)
	private String menuUrl;//菜单url

	@Column(name = "menuparameter", length = 200)
	private String menuParameter;//菜单参数

	@Column(name = "functioncode", length = 100, nullable = false)
	private String functionCode;//功能编码

	@Column(name = "target", length = 50)
	private String target;//目标

	@Column(name = "image", length = 100)
	@UiConfig(hidden = true)
	private String image;//菜单图片

	@Column(name = "openimage", length = 100)
	@UiConfig(hidden = true)
	private String openImage;//菜单打开时图片

	@Column(name = "closeimage", length = 100)
	@UiConfig(hidden = true)
	private String closeImage;//菜单关闭时图片

	@Column(name = "validstatus", length = 1, nullable = false)
	@UiConfig(type = "dictionary", templateName = "validStatus",alias = "状态")
	private String validStatus;//是否有效

	@Column(name = "flag", length = 10)
	@UiConfig(hidden = true)
	private String flag;//预留标志位


	public String getMenuUrl() {
		return this.menuUrl;
	}

	public void setMenuUrl(String menuUrl) {
		this.menuUrl = menuUrl;
	}

	public String getMenuParameter() {
		return this.menuParameter;
	}

	public void setMenuParameter(String menuParameter) {
		this.menuParameter = menuParameter;
	}

	public String getFunctionCode() {
		return this.functionCode;
	}

	public void setFunctionCode(String functionCode) {
		this.functionCode = functionCode;
	}

	public String getTarget() {
		return this.target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getOpenImage() {
		return this.openImage;
	}

	public void setOpenImage(String openImage) {
		this.openImage = openImage;
	}

	public String getCloseImage() {
		return this.closeImage;
	}

	public void setCloseImage(String closeImage) {
		this.closeImage = closeImage;
	}

	public String getValidStatus() {
		return this.validStatus;
	}

	public void setValidStatus(String validStatus) {
		this.validStatus = validStatus;
	}

	public String getFlag() {
		return this.flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}
}
