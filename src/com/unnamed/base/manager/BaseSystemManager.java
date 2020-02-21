package com.unnamed.base.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;

import com.unnamed.base.model.BaseSystem;

/**
 * @author zhuwen
 * @since 2017/6/27
 */
public interface BaseSystemManager extends BaseManager<BaseSystem> {

	List<BaseSystem> getAllSystem();

	String getSystemName(String id);

	String getSystemCode(String id);

	public BaseSystem getBaseSystemById(String sysId);

	public BaseSystem getBaseSystemBySysCode(String systemCode);
}
