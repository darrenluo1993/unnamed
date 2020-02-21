package org.ironrhino.security.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.ironrhino.core.service.BaseManagerImpl;
import org.ironrhino.security.manager.IUserManager;
import org.ironrhino.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Component
public class IUserManagerImpl extends BaseManagerImpl<User> implements IUserManager {

	@Autowired
	private NamedParameterJdbcTemplate template;

	@Override
	@Transactional(readOnly = true)
	public User getUserByUsername(String username) {
		if (StringUtils.isBlank(username)) {
			return null;
		}
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT * FROM tb_sys_user WHERE enabled=1 AND username=:username");
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("username", username);
		List<User> users = template.query(sql.toString(), paramMap, new BeanPropertyRowMapper<User>(User.class));
		return CollectionUtils.isEmpty(users) ? null : users.get(0);
	}

	@Override
	public List<User> getUserBySysId(String sysId, int startIndex, int pageSize) {
		List<User> users = new ArrayList<User>();
		if (null == sysId) {
			return users;
		}
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT * FROM tb_sys_user WHERE sysId LIKE:sysId ");
		sql.append(" LIMIT :startIndex,:pageSize ");
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("sysId", "%" + sysId + "%");
		paramMap.put("startIndex", startIndex);
		paramMap.put("pageSize", pageSize);
		users = template.query(sql.toString(), paramMap, new BeanPropertyRowMapper<User>(User.class));
		return users;
	}

	@Override
	public int getUserCountBySysId(String sysId) {
		if (null == sysId) {
			return 0;
		}
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT COUNT(id) FROM tb_sys_user WHERE sysId LIKE:sysId ");
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("sysId", "%" + sysId + "%");
		Integer num = template.queryForObject(sql.toString(), paramMap, Integer.class);
		return null == num ? 0 : num;
	}

}
