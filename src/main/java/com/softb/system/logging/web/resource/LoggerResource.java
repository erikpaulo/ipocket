package com.softb.system.logging.web.resource;

import lombok.Getter;
import lombok.Setter;
import ch.qos.logback.classic.Logger;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Representação do json para Logger
 * @author marcuslacerda
 *
 */
@Getter
@Setter
public class LoggerResource {

    private String name;

    private String level;

    public LoggerResource(Logger logger) {
        this.name = logger.getName();
        this.level = logger.getEffectiveLevel().toString();
    }

    @JsonCreator
    public LoggerResource() {
    }
}
