package com.softb.system.security.web;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.transaction.Transactional;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softb.system.Application;
import com.softb.system.security.web.resource.UserResource;
import com.softb.system.security.web.resource.RegisterResource;
import com.softb.system.web.config.WebMvcConfig;


@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringApplicationConfiguration(classes = {Application.class, WebMvcConfig.class} )
public class AccountViewTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
    }
    
    @Test
    @Transactional
    public void giveUserNotLogged_whenGetCurrentUser_thenReturnError() throws Exception {
        ResultActions actions = this.mockMvc.perform(get("/public/user/current").accept(MediaType.APPLICATION_JSON));
        actions.andDo(print()); // action is logged into the console
        actions.andExpect(content().contentType("application/json;charset=UTF-8"));
        actions.andExpect(status().isOk());
        actions.andExpect(jsonPath("$.authenticated", is(false)));
    }    
    
    @Test
    @Transactional
    public void whenPostValidUser_thenReturnUserAuthenticated() throws Exception {

    	RegisterResource resource = new RegisterResource();
    	resource.setDisplayName("Teste User");
    	resource.setEmail("teste@dominio.com");
    	resource.setPassword("teste");
    	
    	ObjectMapper mapper = new ObjectMapper();
    	String postContent = mapper.writeValueAsString(resource);
    	
    	ResultActions actions = this.mockMvc.perform( post("/public/user/register")
    			.contentType(MediaType.APPLICATION_JSON)
    			.content(postContent)
    			.accept(MediaType.APPLICATION_JSON) );
    	
    	actions.andDo(print()); // action is logged into the console
    	actions.andExpect(status().isOk());
    	
    	String responseGroup = actions.andReturn().getResponse().getContentAsString();
    	UserResource readValue = mapper.readValue(responseGroup, UserResource.class);
    	
    	Assert.assertNotNull(readValue);
    	Assert.assertTrue(readValue.isAuthenticated());
    	Assert.assertTrue(!readValue.isAdmin());
    }
    
    @Test
    @Transactional
    public void whenPostInvalidUser_thenReturnError() throws Exception {

    	RegisterResource resource = new RegisterResource();
    	resource.setDisplayName("Teste asdkjasdkhlakshdlajhsdahsdkd;ajksd");  // validation @Length(max=20)
    	resource.setEmail("teste@dominio.com");
    	resource.setPassword("teste"); 
    	
    	ObjectMapper mapper = new ObjectMapper();
    	String postContent = mapper.writeValueAsString(resource);
    	
    	ResultActions actions = this.mockMvc.perform( post("/public/user/register")
    			.contentType(MediaType.APPLICATION_JSON)
    			.content(postContent)
    			.accept(MediaType.APPLICATION_JSON) );
    	
    	actions.andDo(print()); // action is logged into the console
    	actions.andExpect(status().isBadRequest());
        actions.andExpect(jsonPath("$.fieldErrors").exists());
    }    
    
}
