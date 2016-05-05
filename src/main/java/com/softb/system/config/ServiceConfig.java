package com.softb.system.config;

import com.softb.system.locale.config.LocaleConfig;
import com.softb.system.repository.config.RepositoryConfig;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
@EnableAutoConfiguration
@EnableConfigurationProperties
@ComponentScan(basePackages = { 
		"com.softb.system.security.service",
        "com.softb.system.security.provider",
        "com.softb.ipocket.investment.service",
        "com.softb.ipocket.account.service",
        "com.softb.ipocket.dashboard.service",
        "com.softb.ipocket.bill.service",
        "com.softb.ipocket.budget.service"})
@Import(value={RepositoryConfig.class, LocaleConfig.class})
public class ServiceConfig {

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
    
}
