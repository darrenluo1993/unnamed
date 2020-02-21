package com.unnamed.base.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.ironrhino.core.util.AuthzUtils;
import org.ironrhino.security.manager.IUserManager;
import org.ironrhino.security.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.unnamed.base.manager.BaseSystemManager;
import com.unnamed.base.model.BaseSystem;
import com.unnamed.base.service.BaseSystemService;

@Service
public class BaseSystemServiceImpl implements BaseSystemService {

	@Autowired
	private BaseSystemManager baseSystemManager;
	@Autowired
	private IUserManager iUserManager;

	@Override
	public List<BaseSystem> getSysListByUsername(String username) {
		List<BaseSystem> baseSystems = new ArrayList<BaseSystem>();
		baseSystems = this.baseSystemManager.getAllSystem();
		if (CollectionUtils.isEmpty(baseSystems)) {
			return baseSystems;
		}
		for (BaseSystem baseSystem : baseSystems) {
			if (null != baseSystem) {
				baseSystem.setFlag("0");
			}
		}
		if (StringUtils.isBlank(username)) {
			return baseSystems;
		}
		if ("admin".equals(username)) {
			for (BaseSystem baseSystem : baseSystems) {
				if (null != baseSystem) {
					baseSystem.setFlag("1");
				}
			}
			return baseSystems;
		}
		User user = this.iUserManager.getUserByUsername(username);
		if (null == user) {
			return baseSystems;
		}
		List<String> sysIds = user.getSysIdList();
		if (CollectionUtils.isEmpty(sysIds)) {
			return baseSystems;
		}
		for (String sysId : sysIds) {
			if (StringUtils.isNotBlank(sysId)) {
				sysId = sysId.trim();
			}
		}
		for (BaseSystem baseSystem : baseSystems) {
			if (null != baseSystem) {
				if (sysIds.contains(baseSystem.getId())) {
					baseSystem.setFlag("1");
				} else {
					baseSystem.setFlag("0");
				}
			}
		}
		return baseSystems;
	}

	@Override
	public String getSysNamesBySysIds(String sysIds) {
		String sysNames = "";
		if (StringUtils.isBlank(sysIds)) {
			return sysNames;
		}
		String[] sysIdArr = sysIds.split(",");
		List<String> sysIdList = CollectionUtils.arrayToList(sysIdArr);
		if (CollectionUtils.isEmpty(sysIdList)) {
			return sysNames;
		}
		for (String sysId : sysIdList) {
			BaseSystem baseSystem = this.baseSystemManager.get(sysId);
			if (null != baseSystem && StringUtils.isNotBlank(baseSystem.getSystemName())) {
				sysNames += baseSystem.getSystemName() + ",";
			}
		}
		if (StringUtils.isNotBlank(sysNames)) {
			sysNames = sysNames.substring(0, sysNames.length() - 1);
		}
		return sysNames;
	}

	@Override
	public List<BaseSystem> getBaseSystemByAuthz() {
		List<BaseSystem> baseSystems = new ArrayList<BaseSystem>();
		String username = AuthzUtils.getUsername();
		if (StringUtils.isBlank(username)) {
			return baseSystems;
		}
		if ("admin".equals(username)) {
			baseSystems = this.baseSystemManager.getAllSystem();
			return baseSystems;
		}
		User user = this.iUserManager.getUserByUsername(username);
		if (null == user) {
			return baseSystems;
		}
		List<String> sysIdList = user.getSysIdList();
		if (CollectionUtils.isEmpty(sysIdList)) {
			return baseSystems;
		}
		List<BaseSystem> systems = new ArrayList<BaseSystem>();
		systems = this.baseSystemManager.getAllSystem();
		for (BaseSystem system : systems) {
			if (null != system && sysIdList.contains(system.getId())) {
				baseSystems.add(system);
			}
		}
		return baseSystems;
	}

	@Override
	public List<BaseSystem> getBaseSystemByAuthz(String username) {
		List<BaseSystem> baseSystems = new ArrayList<BaseSystem>();
		if (StringUtils.isBlank(username)) {
			return baseSystems;
		}
		if ("admin".equals(username)) {
			baseSystems = this.baseSystemManager.getAllSystem();
			return baseSystems;
		}
		User user = this.iUserManager.getUserByUsername(username);
		if (null == user) {
			return baseSystems;
		}
		List<String> sysIdList = user.getSysIdList();
		if (CollectionUtils.isEmpty(sysIdList)) {
			return baseSystems;
		}
		List<BaseSystem> systems = new ArrayList<BaseSystem>();
		systems = this.baseSystemManager.getAllSystem();
		for (BaseSystem system : systems) {
			if (null != system && sysIdList.contains(system.getId())) {
				baseSystems.add(system);
			}
		}
		return baseSystems;
	}

	@Override
	public List<String> getSysIdListByAuthz() {
		List<BaseSystem> baseSystems = this.getBaseSystemByAuthz();
		List<String> sysIdList = new ArrayList<String>();
		if (CollectionUtils.isEmpty(baseSystems)) {
			return sysIdList;
		}
		for (BaseSystem baseSystem : baseSystems) {
			if (null != baseSystem) {
				sysIdList.add(baseSystem.getId());
			}
		}
		return sysIdList;
	}

	@Override
	public List<String> getSysIdListByAuthz(String username) {
		List<BaseSystem> baseSystems = this.getBaseSystemByAuthz(username);
		List<String> sysIdList = new ArrayList<String>();
		if (CollectionUtils.isEmpty(baseSystems)) {
			return sysIdList;
		}
		for (BaseSystem baseSystem : baseSystems) {
			if (null != baseSystem) {
				sysIdList.add(baseSystem.getId());
			}
		}
		return sysIdList;
	}

}
