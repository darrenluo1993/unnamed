package org.ironrhino.security.action;

import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.ironrhino.core.event.EventPublisher;
import org.ironrhino.core.hibernate.CriteriaState;
import org.ironrhino.core.hibernate.CriterionUtils;
import org.ironrhino.core.metadata.Authorize;
import org.ironrhino.core.metadata.JsonConfig;
import org.ironrhino.core.metadata.Scope;
import org.ironrhino.core.model.LabelValue;
import org.ironrhino.core.model.Persistable;
import org.ironrhino.core.model.ResultPage;
import org.ironrhino.core.security.event.PasswordChangedEvent;
import org.ironrhino.core.security.event.ProfileEditedEvent;
import org.ironrhino.core.security.role.UserRole;
import org.ironrhino.core.security.role.UserRoleFilter;
import org.ironrhino.core.security.role.UserRoleManager;
import org.ironrhino.core.session.HttpSessionManager;
import org.ironrhino.core.spring.security.password.PasswordStrengthChecker;
import org.ironrhino.core.struts.EntityAction;
import org.ironrhino.core.util.AuthzUtils;
import org.ironrhino.core.util.BeanUtils;
import org.ironrhino.security.manager.IUserManager;
import org.ironrhino.security.model.User;
import org.ironrhino.security.service.UserManager;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.Assert;

import com.opensymphony.xwork2.interceptor.annotations.InputConfig;
import com.opensymphony.xwork2.validator.annotations.EmailValidator;
import com.opensymphony.xwork2.validator.annotations.ExpressionValidator;
import com.opensymphony.xwork2.validator.annotations.FieldExpressionValidator;
import com.opensymphony.xwork2.validator.annotations.RegexFieldValidator;
import com.opensymphony.xwork2.validator.annotations.RequiredStringValidator;
import com.opensymphony.xwork2.validator.annotations.Validations;
import com.opensymphony.xwork2.validator.annotations.ValidatorType;
import com.unnamed.base.service.BaseSystemService;

/**
 * @author syubun
 */
public class UserAction extends EntityAction<User> {
	private static final long serialVersionUID = -79191921685741502L;

	private User user;

	private List<LabelValue> roles;

	private Set<String> hiddenRoles;

	private String password;

	private String confirmPassword;

	@Value("${login.defaultTargetUrl:/}")
	private String defaultTargetUrl;

	@Value("${user.profile.readonly:false}")
	private boolean userProfileReadonly;

	@Value("${user.password.readonly:false}")
	private boolean userPasswordReadonly;

	@Value("${user.password.currentPasswordNeeded:true}")
	private boolean userCurrentPasswordNeeded;

	@Autowired
	private transient UserManager userManager;

	@Autowired
	private transient UserRoleManager userRoleManager;

	@Autowired(required = false)
	private transient UserRoleFilter userRoleFilter;

	@Autowired(required = false)
	private transient PasswordStrengthChecker passwordStrengthChecker;

	@Autowired
	protected transient EventPublisher eventPublisher;
	@Autowired
	private BaseSystemService baseSystemService;
	@Autowired
	private IUserManager iUserManager;

	public List<LabelValue> getRoles() {
		return this.roles;
	}

	public Set<String> getHiddenRoles() {
		return this.hiddenRoles;
	}

	public String getConfirmPassword() {
		return this.confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public boolean isUserProfileReadonly() {
		return this.userProfileReadonly;
	}

	public boolean isUserPasswordReadonly() {
		return this.userPasswordReadonly;
	}

	public boolean isUserCurrentPasswordNeeded() {
		return this.userCurrentPasswordNeeded;
	}

	/**
	 * 正则表达式：验证手机号
	 */
	public static final String REGEX_MOBILE = "^(1[0-9][0-9])\\d{8}$";

	@Override
	protected void prepare(DetachedCriteria dc, CriteriaState criteriaState) {
		String role = ServletActionContext.getRequest().getParameter("role");
		if (StringUtils.isNotBlank(role)) {
			dc.add(CriterionUtils.matchTag("roles", role));
		}

		// String sysId = ServletActionContext.getRequest().getParameter("user.sysId");
		// if (StringUtils.isNotBlank(sysId)) {
		// dc.add(Restrictions.eq("sysId", sysId));
		// } else {
		// dc.add(Restrictions.isNull("sysId"));
		// }
	}

	@Override
	public String execute() throws Exception {
		if (this.resultPage == null) {
			this.resultPage = new ResultPage<User>();
		}
		return LIST;
	}

	public String query() {
		if (this.resultPage == null) {
			this.resultPage = new ResultPage<User>();
		}
		if (null == this.user) {
			this.user = new User();
			this.user.setSysId("");
		}
		if ("default".equals(this.user.getSysId())) {
			this.user.setSysId("");
		}
		int count = this.iUserManager.getUserCountBySysId(this.user.getSysId());
		this.resultPage.setTotalResults(count);
		int startIndex = (this.resultPage.getPageNo() - 1) * this.resultPage.getPageSize();
		List<User> users = this.iUserManager.getUserBySysId(this.user.getSysId(), startIndex, this.resultPage.getPageSize());
		Assert.notNull(users, "查询错误！");
		this.resultPage.setResult(users);
		return LIST;
	}

	@Override
	public String input() {
		String id = this.getUid();
		if (StringUtils.isNotBlank(id)) {
			this.user = this.userManager.get(id);
			if (this.user == null) {
				this.user = this.userManager.findByNaturalId(id);
			}
		}
		if (this.user == null) {
			this.user = new User();
		}
		Map<String, String> map = this.userRoleManager.getAllRoles(true);
		if (this.userRoleFilter != null) {
			Map<String, String> temp = this.userRoleFilter.filter(this.user, map);
			if (temp != null) {
				map = temp;
			}
		}
		this.roles = new ArrayList<>(map.size());
		for (Map.Entry<String, String> entry : map.entrySet()) {
			this.roles.add(new LabelValue(StringUtils.isNotBlank(entry.getValue()) ? entry.getValue() : this.getText(entry.getKey()), entry.getKey()));
		}
		if (!this.user.isNew()) {
			Set<String> userRoles = this.user.getRoles();
			for (String r : userRoles) {
				if (!map.containsKey(r)) {
					if (this.hiddenRoles == null) {
						this.hiddenRoles = new LinkedHashSet<>();
					}
					this.hiddenRoles.add(r);
				}
			}
		}
		return INPUT;
	}

	@Override
	@Validations(requiredStrings = { @RequiredStringValidator(type = ValidatorType.FIELD, fieldName = "user.username", trim = true, key = "validation.required"),
			@RequiredStringValidator(type = ValidatorType.FIELD, fieldName = "user.name", trim = true, key = "validation.required") }, emails = { @EmailValidator(fieldName = "user.email", key = "validation.invalid") }, regexFields = {
					@RegexFieldValidator(type = ValidatorType.FIELD, fieldName = "user.username", regex = User.USERNAME_REGEX, key = "validation.invalid"),
					@RegexFieldValidator(type = ValidatorType.FIELD, fieldName = "user.phone", regex = REGEX_MOBILE, key = "validation.invalid") }, fieldExpressions = {
							@FieldExpressionValidator(expression = "password == confirmPassword", fieldName = "confirmPassword", key = "validation.repeat.not.matched") })
	public String save() {
		if (!this.makeEntityValid()) {
			return INPUT;
		}
		this.userManager.save(this.user);
		this.addActionMessage(this.getText("save.success"));
		return SUCCESS;
	}

	@Override
	@Validations(regexFields = { @RegexFieldValidator(type = ValidatorType.FIELD, fieldName = "user.username", regex = User.USERNAME_REGEX, key = "validation.invalid") })
	public String checkavailable() {
		return this.makeEntityValid() ? NONE : INPUT;
	}

	@Override
	protected boolean makeEntityValid() {
		if (this.user == null) {
			this.addActionError(this.getText("access.denied"));
			return false;
		}
		if (this.user.isNew()) {
			if (StringUtils.isNotBlank(this.user.getUsername())) {
				this.user.setUsername(this.user.getUsername().toLowerCase(Locale.ROOT));
				if (this.userManager.findByNaturalId(this.user.getUsername()) != null) {
					this.addFieldError("user.username", this.getText("validation.already.exists"));
					return false;
				}
			}
			if (StringUtils.isNotBlank(this.user.getEmail()) && this.userManager.findOne("email", this.user.getEmail()) != null) {
				this.addFieldError("user.email", this.getText("validation.already.exists"));
				return false;
			}
			this.user.setLegiblePassword(this.password);
		} else {
			User temp = this.user;
			if (temp.getId() != null) {
				this.user = this.userManager.get(temp.getId());
			}
			if (temp.getUsername() != null) {
				this.user = this.userManager.findByNaturalId(temp.getUsername());
			}
			if (StringUtils.isNotBlank(temp.getEmail()) && !temp.getEmail().equals(this.user.getEmail()) && this.userManager.findOne("email", temp.getEmail()) != null) {
				this.addFieldError("user.email", this.getText("validation.already.exists"));
				return false;
			}
			BeanUtils.copyProperties(temp, this.user);
			if (StringUtils.isNotBlank(this.password)) {
				this.user.setLegiblePassword(this.password);
			}
			this.userManager.evict(this.user);
		}
		try {
			this.userRoleManager.checkMutex(this.user.getRoles());
		} catch (Exception e) {
			this.addFieldError("user.roles", e.getLocalizedMessage());
			return false;
		}
		BeanWrapperImpl bw = new BeanWrapperImpl(this.user);
		PropertyDescriptor[] pds = bw.getPropertyDescriptors();
		for (PropertyDescriptor pd : pds) {
			if (pd.getReadMethod() == null || pd.getWriteMethod() == null) {
				continue;
			}
			String name = pd.getName();
			Object value = bw.getPropertyValue(name);
			if (value instanceof Persistable) {
				if (((Persistable<?>) value).isNew()) {
					bw.setPropertyValue(name, null);
				}
			}
		}
		return true;
	}

	@Override
	public String delete() {
		String[] id = this.getId();
		if (id != null) {
			this.userManager.delete((Serializable[]) id);
			this.addActionMessage(this.getText("delete.success"));
		}
		return SUCCESS;
	}

	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	@InputConfig(resultName = "password")
	@Validations(requiredStrings = { @RequiredStringValidator(type = ValidatorType.FIELD, trim = true, fieldName = "password", key = "validation.required") }, expressions = {
			@ExpressionValidator(expression = "password == confirmPassword", key = "validation.repeat.not.matched") })
	public String password() {
		if (this.userPasswordReadonly) {
			this.addActionError(this.getText("access.denied"));
			return ACCESSDENIED;
		}
		User user = AuthzUtils.getUserDetails();
		if (user != null) {
			if (this.passwordStrengthChecker != null) {
				this.passwordStrengthChecker.check(user, this.password);
			}
			//			if (this.isUserCurrentPasswordNeeded()) {
			//				boolean valid = currentPassword != null && AuthzUtils.isPasswordValid(currentPassword);
			//				if (!valid) {
			//					this.addFieldError("currentPassword", this.getText("currentPassword.error"));
			//					return "password";
			//				}
			//			}
			boolean passwordExpired = !user.isCredentialsNonExpired();
			user.setLegiblePassword(this.password);
			this.userManager.save(user);
			this.addActionMessage(this.getText("save.success"));
			this.eventPublisher.publish(new PasswordChangedEvent(user.getUsername(), ServletActionContext.getRequest().getRemoteAddr()), Scope.LOCAL);
			ServletActionContext.getRequest().setAttribute(HttpSessionManager.REQUEST_ATTRIBUTE_SESSION_MARK_AS_DIRTY, true);
			if (passwordExpired) {
				this.targetUrl = this.defaultTargetUrl;
				return REDIRECT;
			}
		}
		return "password";
	}

	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	@InputConfig(methodName = "inputprofile")
	@Validations(requiredStrings = { @RequiredStringValidator(type = ValidatorType.FIELD, fieldName = "user.name", trim = true, key = "validation.required") }, emails = { @EmailValidator(fieldName = "user.email", key = "validation.invalid") })
	public String profile() {
		if (this.userProfileReadonly) {
			this.addActionError(this.getText("access.denied"));
			return ACCESSDENIED;
		}
		this.user.setId(AuthzUtils.<User>getUserDetails().getId());
		if (!this.makeEntityValid()) {
			return INPUT;
		}
		User userInSession = AuthzUtils.getUserDetails();
		if (userInSession == null || this.user == null) {
			return "profile";
		}
		userInSession.setName(this.user.getName());
		userInSession.setEmail(this.user.getEmail());
		userInSession.setPhone(this.user.getPhone());
		this.userManager.save(userInSession);
		this.addActionMessage(this.getText("save.success"));
		this.eventPublisher.publish(new ProfileEditedEvent(this.user.getUsername(), ServletActionContext.getRequest().getRemoteAddr()), Scope.LOCAL);
		return "profile";
	}

	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	public String inputprofile() {
		this.user = AuthzUtils.getUserDetails();
		return "profile";
	}

	@JsonConfig(root = "user")
	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	public String self() {
		this.user = AuthzUtils.getUserDetails();
		return JSON;
	}

	@JsonConfig(root = "roles")
	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	public String roles() {
		Map<String, String> map = this.userRoleManager.getAllRoles(ServletActionContext.getRequest().getParameter("excludeBuiltin") != null);
		this.roles = new ArrayList<>(map.size());
		for (Map.Entry<String, String> entry : map.entrySet()) {
			this.roles.add(new LabelValue(StringUtils.isNotBlank(entry.getValue()) ? entry.getValue() : this.getText(entry.getKey()), entry.getKey()));
		}
		return JSON;
	}

	@Override
	@Authorize(ifAnyGranted = UserRole.ROLE_BUILTIN_USER)
	public String pick() throws Exception {
		return super.pick();
	}
}
