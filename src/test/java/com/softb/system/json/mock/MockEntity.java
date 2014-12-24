package com.softb.system.json.mock;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.softb.system.rest.converter.IgnoreEmptyStringDeserializer;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class MockEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer id;

	@JsonDeserialize(using = IgnoreEmptyStringDeserializer.class)
	private String nome;
}