package com.softb.system.json;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softb.system.config.ServiceConfig;
import com.softb.system.json.mock.MockEntity;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ServiceConfig.class)
public class JsonTests {

	@Test
	public void whenUsingIgnoreEmptyString_thenReturnNullField() throws Exception {
		MockEntity mockEntity = new MockEntity(10, "");
    	ObjectMapper mapper = new ObjectMapper();
    	String mockJSon = mapper.writeValueAsString(mockEntity);
    	
    	mockEntity = mapper.readValue(mockJSon, MockEntity.class);
    	Assert.assertTrue(mockEntity.getNome() == null);
	}
	
}
