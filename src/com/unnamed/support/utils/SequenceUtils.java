package com.unnamed.support.utils;

import static org.springframework.beans.factory.annotation.Autowire.BY_NAME;

import javax.sql.DataSource;

import org.apache.commons.lang3.ArrayUtils;
import org.ironrhino.core.sequence.CyclicSequence;
import org.ironrhino.core.sequence.SimpleSequence;
import org.ironrhino.core.sequence.cyclic.DatabaseCyclicSequenceDelegate;
import org.ironrhino.core.sequence.simple.DatabaseSimpleSequenceDelegate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SequenceUtils {

	/**
	 * 生成节点ID
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence treeNodeIdSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * 生成短信推送ID
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence pushMsgIdSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * 发送邮件序列
	 *
	 * @return 简单序列
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence emailSequence() {
		final DatabaseSimpleSequenceDelegate dc = new DatabaseSimpleSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	@Bean(autowire = BY_NAME)
	public CyclicSequence reqsnoSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(11);
		return dc;
	}

	/**
	 * 系统ID序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence sysIdSequence() {
		final DatabaseSimpleSequenceDelegate dc = new DatabaseSimpleSequenceDelegate();
		dc.setPaddingLength(4);
		return dc;
	}

	/**
	 * 系统模块ID序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence moduleIdSequence() {
		final DatabaseSimpleSequenceDelegate dc = new DatabaseSimpleSequenceDelegate();
		dc.setPaddingLength(5);
		return dc;
	}

	/**
	 * 系统子模块功能ID序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence subModuleIdSequence() {
		final DatabaseSimpleSequenceDelegate dc = new DatabaseSimpleSequenceDelegate();
		dc.setPaddingLength(5);
		return dc;
	}

	/**
	 * 系统模块功能ID序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence functionIdSequence() {
		final DatabaseSimpleSequenceDelegate dc = new DatabaseSimpleSequenceDelegate();
		dc.setPaddingLength(5);
		return dc;
	}

	/**
	 * 案例批量导入序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence importSingleTestCaseSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * ehcacheSequence
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence ehcacheSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * 报文模式新增字典id
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence packetCreateBaseFieldSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * 案例预期值序列
	 *
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public CyclicSequence caseManagerDetailExpectedValuesSequence() {
		final DatabaseCyclicSequenceDelegate dc = new DatabaseCyclicSequenceDelegate();
		dc.setPaddingLength(8);
		return dc;
	}

	/**
	 * 生成角色ID
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 19, 2019 10:01:59 AM
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence roleIdSequence() {
		return this.getNewSimpleSequence(10);
	}

	/**
	 * 获取组织机构ID生成序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 19, 2019 9:04:39 AM
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence organizationIdSeq() {
		return this.getNewSimpleSequence(0);
	}

	/**
	 * 获取系统资源ID生成序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 19, 2019 9:04:39 AM
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence resourceIdSeq() {
		return this.getNewSimpleSequence(0);
	}

	/**
	 * 获取数据字典ID生成序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 20, 2019 9:43:32 AM
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence dictionaryIdSeq() {
		return this.getNewSimpleSequence(0);
	}

	/**
	 * 获取系统角色ID生成序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 27, 2019 8:50:39 AM
	 * @return
	 */
	@Bean(autowire = BY_NAME)
	public SimpleSequence roleIdSeq() {
		return this.getNewSimpleSequence(0);
	}

	/**
	 * 获取仅指定追加长度的简单序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 27, 2019 8:48:57 AM
	 * @param paddingLength
	 * @return
	 */
	private final DatabaseSimpleSequenceDelegate getNewSimpleSequence(final int paddingLength) {
		return this.getNewSimpleSequence(null, null, null, paddingLength);
	}

	/**
	 * 获取新的简单序列
	 *
	 * @CreatedBy Darren Luo
	 * @CreatedTime Sep 27, 2019 8:48:43 AM
	 * @param args
	 * @return
	 */
	private final DatabaseSimpleSequenceDelegate getNewSimpleSequence(final Object... args) {
		final DatabaseSimpleSequenceDelegate simpleSequence = new DatabaseSimpleSequenceDelegate();
		if (ArrayUtils.isNotEmpty(args)) {
			Object arg;
			for (int i = 0; i < args.length; i++) {
				arg = args[i];
				if (arg != null) {
					if (i == 0 && arg instanceof String) {
						simpleSequence.setBeanName((String) arg);
					} else if (i == 1 && arg instanceof Integer) {
						simpleSequence.setCacheSize((int) arg);
					} else if (i == 2 && arg instanceof DataSource) {
						simpleSequence.setDataSource((DataSource) arg);
					} else if (i == 3 && arg instanceof Integer) {
						simpleSequence.setPaddingLength((int) arg);
					} else if (i == 4 && arg instanceof String) {
						simpleSequence.setSequenceName((String) arg);
					} else if (i == 5 && arg instanceof String) {
						simpleSequence.setTableName((String) arg);
					}
				}
			}
		}
		return simpleSequence;
	}
}