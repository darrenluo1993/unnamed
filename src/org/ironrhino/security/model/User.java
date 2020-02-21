package org.ironrhino.security.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.ironrhino.core.aop.PublishAware;
import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.Richtable;
import org.ironrhino.core.search.elasticsearch.annotations.Searchable;
import org.springframework.util.CollectionUtils;

/**
 * @author syubun
 */
@PublishAware
@AutoConfig
@Searchable
@Entity
@Table(name = "tb_sys_user")
@Richtable(order = "username asc")
public class User extends BaseUser {

	@Column(name = "sysId")
	private String sysId;// 系统id

	@Column(name = "wechat", length = 50)
	private String weChat;// 微信

	@Column(name = "qq", length = 50)
	private String qq; // qq

	@Column(name = "rtx", length = 50)
	private String rtx; // trx

	public List<String> getSysIdList() {
		List<String> sysIdList = new ArrayList<String>();
		if (StringUtils.isBlank(this.sysId)) {
			return sysIdList;
		}
		String[] sysIdArr = this.sysId.split(",");
		for (String sysId : sysIdArr) {
			if (StringUtils.isNotBlank(sysId)) {
				sysIdList.add(sysId.trim());
			}
		}
		return sysIdList;
	}

	public void setSysIdList(List<String> sysIdList) {
		if (CollectionUtils.isEmpty(sysIdList)) {
			this.sysId = "";
		} else {
			this.sysId = "";
			for (String sysId : sysIdList) {
				this.sysId += sysId + ",";
			}
			if (StringUtils.isNotBlank(this.sysId)) {
				this.sysId = this.sysId.substring(0, this.sysId.length() - 1);
			}
		}
	}

	public String getSysId() {
		return sysId;
	}

	public void setSysId(String sysId) {
		this.sysId = sysId;
	}

	public String getWeChat() {
		return weChat;
	}

	public void setWeChat(String weChat) {
		this.weChat = weChat;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getRtx() {
		return rtx;
	}

	public void setRtx(String rtx) {
		this.rtx = rtx;
	}
}
