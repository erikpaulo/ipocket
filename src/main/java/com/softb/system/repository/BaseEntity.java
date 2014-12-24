package com.softb.system.repository;

import java.io.Serializable;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Simple JavaBean domain object with an id property. Used as a base class for objects needing this property.
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@MappedSuperclass
public class BaseEntity<ID extends Serializable> {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected ID id;

	@JsonIgnore
    public boolean isNew() {
        return (this.id == null);
    }

}