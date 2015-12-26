package com.softb.system.security.web.resource;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTokenResponseResource {

	@JsonProperty(value="iss")
	private String iss;
	@JsonProperty(value="at_hash")
	private String hash;
	@JsonProperty(value="aud")
	private String aud;
	@JsonProperty(value="sub")
	private String sub;
	@JsonProperty(value="email_verified")
	private Boolean emailVerified;
	@JsonProperty(value="azp")
	private String azp;
	@JsonProperty(value="email")
	private String email;
	@JsonProperty(value="iat")
	private String iat;
	@JsonProperty(value="exp")
	private String exp;
	@JsonProperty(value="name")
	private String name;
	@JsonProperty(value="picture")
	private String picture;
	@JsonProperty(value="given_name")
	private String givenName;
	@JsonProperty(value="family_name")
	private String familyName;
	@JsonProperty(value="locale")
	private String locale;
	@JsonProperty(value="alg")
	private String alg;
	@JsonProperty(value="kid")
	private String kid;
}
