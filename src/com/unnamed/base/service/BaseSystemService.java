package com.unnamed.base.service;

import java.util.List;

import com.unnamed.base.model.BaseSystem;

public interface BaseSystemService {

	List<BaseSystem> getSysListByUsername(String username);

	String getSysNamesBySysIds(String sysIds);

	List<BaseSystem> getBaseSystemByAuthz();

	List<BaseSystem> getBaseSystemByAuthz(String username);

	List<String> getSysIdListByAuthz();

	List<String> getSysIdListByAuthz(String username);
}
