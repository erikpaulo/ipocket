package com.softb.ipocket.configuration.model;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Classe que encapsula as naturezas de categorias com seus grupos e categorias.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CategoryKind implements Serializable {

	private static final long serialVersionUID = 1L;
	
	protected String name;
	
	protected String kind;
	
	protected List<CategoryGroup> groups;
}
