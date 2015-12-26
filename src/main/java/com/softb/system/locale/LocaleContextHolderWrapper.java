package com.softb.system.locale;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;

public class LocaleContextHolderWrapper {

    public Locale getCurrentLocale() {
        return LocaleContextHolder.getLocale();
    }
}
