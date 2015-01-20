package com.softb.system.repository.config;

import java.net.URI;
import java.net.URISyntaxException;

import javax.sql.DataSource;

import liquibase.integration.spring.SpringLiquibase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = { 
		"com.softb.system.security.repository", "com.softb.ipocket.account.repository"})
@EntityScan(basePackages = { 
		"com.softb.system.security.model", "com.softb.ipocket.account.model"})
public class RepositoryConfig  {

    private final Logger logger = LoggerFactory.getLogger(RepositoryConfig.class);
    @Autowired
    private Environment environment;
    
    @Bean
    public SpringLiquibase liquibase(DataSource datasource) {
        logger.debug("Configuring Liquibase");
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(datasource);
        liquibase.setChangeLog("classpath:config/liquibase/master.xml");
        liquibase.setContexts("development");
        return liquibase;
    }
    
    @Bean
    public URI buildURIDatabase() throws URISyntaxException {
    	URI herokuURI = new URI(environment.getProperty("DATABASE_URL"));
    	
    	return herokuURI;
    }
}

