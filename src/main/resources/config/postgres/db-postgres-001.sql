/**
* Changeset 001
* Criação da aplicação.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-001.sql
*/

DROP TABLE IF EXISTS ACCOUNT_ENTRY;
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS remember_me_token;
DROP TABLE IF EXISTS user_social_connection;
DROP TABLE IF EXISTS user_account;

CREATE TABLE remember_me_token (
	id 			SERIAL PRIMARY KEY,
	date 		TIMESTAMP, 
	series 		VARCHAR(255), 
	token_value VARCHAR(255), 
	username 	VARCHAR(255) 
);

CREATE TABLE user_account (
	id 				SERIAL PRIMARY KEY,
	account_locked 	BOOLEAN, 
	display_name 	VARCHAR(255), 
	email 			VARCHAR(255) UNIQUE, 
	image_url 		VARCHAR(255), 
	password 		VARCHAR(64), 
	trusted_account BOOLEAN,  
	web_site 		VARCHAR(255)
);

CREATE TABLE user_social_connection (
	id 					SERIAL PRIMARY KEY, 
	access_token 		VARCHAR(255), 
	display_name 		VARCHAR(255), 
	expire_time 		BIGINT, 
	image_url 			VARCHAR(255), 
	profile_url 		VARCHAR(255), 
	provider_id			VARCHAR(255), 
	provider_user_id	VARCHAR(255), 
	rank 				INTEGER, 
	refresh_token 		VARCHAR(255), 
	secret 				VARCHAR(255), 
	user_id 			VARCHAR(255)
);	

CREATE TABLE user_role (
	user_id	INTEGER REFERENCES user_account(id),
	role	VARCHAR(255),
	PRIMARY KEY (user_id, role)
);

CREATE TABLE ACCOUNT (
	ID				SERIAL PRIMARY KEY,
	NAME			VARCHAR(255),
	TYPE			VARCHAR(255),
	USER_ID			INTEGER REFERENCES user_account(id),
	BRANCH			VARCHAR(255),
	NUMBER			VARCHAR(255),
	START_BALANCE	DECIMAL
);

CREATE TABLE CATEGORY (
	ID					SERIAL PRIMARY KEY,
	NAME				VARCHAR(255),
	SUBCATEGORY_NAME	VARCHAR(255),
	TYPE				VARCHAR(1), /*F - despesa fixa, V - despesa variável, I - despesa irregular, E - entrada */
/*	KIND				VARCHAR(255),*/
	USER_ID				INTEGER REFERENCES user_account(id),
	
	CONSTRAINT U_CONST_01 UNIQUE (USER_ID,NAME,SUBCATEGORY_NAME)
);

CREATE TABLE ACCOUNT_ENTRY (
	ID				SERIAL PRIMARY KEY,
	ACCOUNT_ID		INTEGER REFERENCES ACCOUNT(ID),
	DESCRIPTION		VARCHAR(255),
	CATEGORY_ID		INTEGER REFERENCES CATEGORY(ID),
	DATE			DATE,
	RECONCILED		VARCHAR(1),
	AMOUNT			DECIMAL,
	USER_ID			INTEGER REFERENCES user_account(id)
);