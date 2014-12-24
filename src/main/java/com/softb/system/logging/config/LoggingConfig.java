package com.softb.system.logging.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Profile;

import com.softb.system.config.Constants;
import com.softb.system.logging.LoggingAspect;

@Configuration
@ComponentScan(basePackages = {"com.softb.system.logging.web"})
@EnableAspectJAutoProxy
public class LoggingConfig {

    @Bean
    @Profile(Constants.SPRING_PROFILE_DEVELOPMENT)
    public LoggingAspect loggingAspect() {
        return new LoggingAspect();
    }
	
}
