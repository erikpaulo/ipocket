package com.softb.system.rest.converter;

import java.io.IOException;

import org.apache.commons.lang.StringUtils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

/**
 * Implementação de Deserializer JSon que ignore um valor vazio (StringUtils.isEmpty). Caso o valor seja vazio, o processo de bind
 * coloca 'null' no campo.
 *  
 * @author marcuslacerda
 */
public class IgnoreEmptyStringDeserializer extends JsonDeserializer<String> {

	@Override
	public String deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {

		ObjectCodec codec = jp.getCodec();
		String fieldStr = codec.readValue(jp, String.class);
		return (StringUtils.isEmpty(fieldStr)) ? null : fieldStr;
	}

}
