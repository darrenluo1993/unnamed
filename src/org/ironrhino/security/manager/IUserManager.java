package org.ironrhino.security.manager;

import java.util.List;

import org.ironrhino.core.service.BaseManager;
import org.ironrhino.security.model.User;

public interface IUserManager extends BaseManager<User> {

	User getUserByUsername(String username);

	List<User> getUserBySysId(String sysId, int startIndex, int pageSize);

	int getUserCountBySysId(String sysId);
}
