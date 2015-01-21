package com.softb.system.web.config;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.servlet.InstrumentedFilter;
import com.codahale.metrics.servlets.MetricsServlet;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softb.system.config.Constants;
import com.softb.system.web.filter.gzip.GZipServletFilter;

@Configuration
//@EnableWebMvc
@ComponentScan(basePackages = { 
		"com.softb.system.rest", 
		"com.softb.system.errorhandler.web",
		"com.softb.ipocket.account.web",
		"com.softb.system.security.service", 
		"com.softb.system.security.web"})
public class WebMvcConfig extends WebMvcConfigurerAdapter implements ServletContextInitializer {

	private final Logger logger = LoggerFactory.getLogger(WebMvcConfig.class);
	
    @Inject
    private MetricRegistry metricRegistry;
    
    @Inject
    private Environment env;
    
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        logger.info("Web application configuration, using profiles: {}", Arrays.toString(env.getActiveProfiles()));
        EnumSet<DispatcherType> disps = EnumSet.of(DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.ASYNC);

//        initMetrics(servletContext, disps);
        if (env.acceptsProfiles(Constants.SPRING_PROFILE_PRODUCTION)) {
//             initStaticResourcesProductionFilter(servletContext, disps);
//             initCachingHttpHeadersFilter(servletContext, disps);
        	initGzipFilter(servletContext, disps);
        }
        
        logger.info("Web application fully configured");
    }
	
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    	registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
    	registry.addResourceHandler("/").addResourceLocations("/app/index.html");
    	registry.addResourceHandler("/index.html").addResourceLocations("/app/index.html");
        registry.addResourceHandler("/**").addResourceLocations("/app/");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
    	super.addViewControllers(registry);
    	registry.addViewController("/").setViewName("/index.html");
    }
    
    /**
     * Initializes the GZip filter.
     */
    private void initGzipFilter(ServletContext servletContext, EnumSet<DispatcherType> disps) {
    	logger.debug("Registering GZip Filter");

        FilterRegistration.Dynamic compressingFilter = servletContext.addFilter("gzipFilter", new GZipServletFilter());
        Map<String, String> parameters = new HashMap<>();

        compressingFilter.setInitParameters(parameters);

        compressingFilter.addMappingForUrlPatterns(disps, true, "*.css");
        compressingFilter.addMappingForUrlPatterns(disps, true, "*.json");
        compressingFilter.addMappingForUrlPatterns(disps, true, "*.html");
        compressingFilter.addMappingForUrlPatterns(disps, true, "*.js");
        compressingFilter.addMappingForUrlPatterns(disps, true, "/app/rest/*");
        compressingFilter.addMappingForUrlPatterns(disps, true, "/metrics/*");

        compressingFilter.setAsyncSupported(true);
    }    
    
    /**
     * Initializes Metrics.
     */
    private void initMetrics(ServletContext servletContext, EnumSet<DispatcherType> disps) {
        logger.debug("Initializing Metrics registries");
        servletContext.setAttribute(InstrumentedFilter.REGISTRY_ATTRIBUTE,
                metricRegistry);
        servletContext.setAttribute(MetricsServlet.METRICS_REGISTRY,
                metricRegistry);

        logger.debug("Registering Metrics Filter");
        FilterRegistration.Dynamic metricsFilter = servletContext.addFilter("webappMetricsFilter",
                new InstrumentedFilter());

        metricsFilter.addMappingForUrlPatterns(disps, true, "/*");
        metricsFilter.setAsyncSupported(true);

        logger.debug("Registering Metrics Servlet");
        ServletRegistration.Dynamic metricsAdminServlet =
                servletContext.addServlet("metricsServlet", new MetricsServlet());

        metricsAdminServlet.addMapping("/metrics/metrics/*");
        metricsAdminServlet.setAsyncSupported(true);
        metricsAdminServlet.setLoadOnStartup(2);
    }    
    
	
	@Override
	public void configureMessageConverters(final List<HttpMessageConverter<?>> converters) {
		converters.add(0, jsonConverter());
	}

	@Bean
	public MappingJackson2HttpMessageConverter jsonConverter() {
		final MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		
		ObjectMapper objectMapper = new CustomObjectMapper();
		converter.setObjectMapper(objectMapper);

		return converter;
	}

	class CustomObjectMapper extends ObjectMapper {

		private static final long serialVersionUID = 1L;

		public CustomObjectMapper() {
			super();
			setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));
		}

	}

}
