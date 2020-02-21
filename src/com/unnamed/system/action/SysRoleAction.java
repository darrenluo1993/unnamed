package com.unnamed.system.action;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.ironrhino.core.hibernate.CriteriaState;
import org.ironrhino.core.metadata.AutoConfig;
import org.ironrhino.core.metadata.JsonConfig;
import org.ironrhino.core.sequence.Sequence;
import org.ironrhino.core.struts.EntityAction;
import org.ironrhino.core.util.JsonUtils;
import org.ironrhino.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.fasterxml.jackson.core.type.TypeReference;
import com.unnamed.system.manager.SysRoleFunctionManager;
import com.unnamed.system.manager.SysRoleManager;
import com.unnamed.system.model.SysRole;
import com.unnamed.system.model.SysRoleFunction;

/**
 * @author zhuwen
 * @since 2017/6/28
 */
@AutoConfig
public class SysRoleAction extends EntityAction<SysRole> {
	private static final long serialVersionUID = 924468721442577261L;

	private String resultStr;//ajax返回字符串
	private String saveJsonStr;//ajax提交到后台json字符串

	private String checkRoleId;//选择的角色id

	private String checkUserName;//选择的用户

	private String roleIdList;
	@Autowired
	private SysRoleFunctionManager sysRoleFunctionManager;

	@Autowired
	private SysRoleManager sysRoleManager;

	private List<User> userList;

	@Autowired
	@Qualifier("roleIdSequence")
	private Sequence roleIdSequence;

	@Override
	public String save() throws Exception {
		if (!this.makeEntityValid()) {
			return INPUT;
		}
		try {
			SysRole sysRole = this.getEntity();
			//如果新增则需要获取一个序列号作为角色编号
			if (sysRole.isNew()) {
				if (StringUtils.isBlank(sysRole.getRoleId())) {
					sysRole.setRoleId(this.roleIdSequence.nextStringValue());
				}
				sysRole.setStatus(true);
			}
			this.sysRoleManager.save(sysRole);
			return SUCCESS;
		} catch (Exception e) {
			e.printStackTrace();
			this.addActionError("添加角色失败！");
			return ERROR;
		}

	}

	@Override
	public String input() throws Exception {
		super.input();
		return INPUT;
	}

	/**
	 * 取消角色
	 *
	 * @return JSON
	 */
	@JsonConfig(root = "resultStr")
	public String deleteRole() {
		try {
			this.sysRoleManager.cancelRole(this.roleIdList);
			this.resultStr = "删除成功";
		} catch (Exception e) {
			e.printStackTrace();
			this.resultStr = "删除失败";
		}
		return JSON;
	}

	/**
	 * 跳转至角色权限页面
	 *
	 * @return 返回页面
	 */
	public String setRolePower() {
		return "authority";
	}

	public String showUserList() {
		SysRole sysRole = this.sysRoleManager.get(this.getUid());
		this.userList = this.sysRoleManager.getUserListByRoleId(sysRole.getRoleId());
		return "userlist";
	}

	/**
	 * 获取角色选择树
	 *
	 * @return 跳转目标页面
	 */
	public String getRoleTree() {
		return "tree";
	}


	/**
	 * 角色功能菜单权限保存方法
	 *
	 * @return JSON
	 */
	@JsonConfig(root = "resultStr")
	public String saveRolefunction() {
		try {
			this.saveJsonStr = this.saveJsonStr.replace("'", "\"");
			List<SysRoleFunction> sysRoleFunctionList = JsonUtils.fromJson(this.saveJsonStr, new TypeReference<List<SysRoleFunction>>() {
			});
			this.sysRoleFunctionManager.saveList(sysRoleFunctionList, this.checkRoleId);
			this.resultStr = "success";
		} catch (Exception e) {
			this.resultStr = "fail";
		} finally {
			return JSON;
		}
	}

	@Override
	public void prepare(DetachedCriteria dc, CriteriaState criteriaState) {
		dc.add(Restrictions.eq("status", true));
		dc.addOrder(Order.desc("createDate"));

	}

	public String getResultStr() {
		return this.resultStr;
	}

	public void setResultStr(String resultStr) {
		this.resultStr = resultStr;
	}

	public String getSaveJsonStr() {
		return this.saveJsonStr;
	}

	public void setSaveJsonStr(String saveJsonStr) {
		this.saveJsonStr = saveJsonStr;
	}

	public String getCheckRoleId() {
		return this.checkRoleId;
	}

	public void setCheckRoleId(String checkRoleId) {
		this.checkRoleId = checkRoleId;
	}

	public List<User> getUserList() {
		return this.userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

	public String getRoleIdList() {
		return this.roleIdList;
	}

	public void setRoleIdList(String roleIdList) {
		this.roleIdList = roleIdList;
	}

	public String getCheckUserName() {
		return this.checkUserName;
	}

	public void setCheckUserName(String checkUserName) {
		this.checkUserName = checkUserName;
	}
}
