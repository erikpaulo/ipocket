/**
* Changeset 0.0.1
* Criação da aplicação.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-001.sql
* Localhost  -- \i /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.0.1.sql
*/

DROP TABLE IF EXISTS ACCOUNT_ENTRY;
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS SUBCATEGORY;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS USER_GROUP;
DROP TABLE IF EXISTS remember_me_token;

CREATE TABLE remember_me_token (
	id 			SERIAL PRIMARY KEY,
	date 		TIMESTAMP, 
	series 		VARCHAR(255), 
	token_value VARCHAR(255), 
	username 	VARCHAR(255) 
);

CREATE TABLE USER_GROUP (
	ID   SERIAL PRIMARY KEY,
	NAME VARCHAR(255)
);

CREATE TABLE user_account (
	id 				SERIAL PRIMARY KEY,
	account_locked 	BOOLEAN, 
	display_name 	VARCHAR(255), 
	email 			VARCHAR(255) UNIQUE, 
	image_url 		VARCHAR(255), 
	password 		VARCHAR(64), 
	trusted_account BOOLEAN,
	google_id       VARCHAR(255) UNIQUE,
	web_site 		VARCHAR(255),
	GROUP_ID        INTEGER REFERENCES USER_GROUP(ID)
);

CREATE TABLE user_role (
	user_id INTEGER REFERENCES user_account(id),
	role    VARCHAR(255),
	PRIMARY KEY (user_id, role)
);

CREATE TABLE CATEGORY (
	ID      SERIAL PRIMARY KEY,
	NAME    VARCHAR(50),
	TYPE    VARCHAR(3), --EXP - expenses, INC - incomes, INV - investiments
	USER_GROUP_ID INTEGER REFERENCES USER_GROUP(id),

	CONSTRAINT U_CONST_01 UNIQUE (USER_GROUP_ID,NAME,TYPE)
);

CREATE TABLE SUBCATEGORY (
	ID             SERIAL PRIMARY KEY,
	NAME           VARCHAR(50),
	ACTIVATED      BOOLEAN NOT NULL,
	TYPE           VARCHAR(2), --FC - fixed cost, IC - irregular cost, VC - variable cost
	CATEGORY_ID    INTEGER NOT NULL REFERENCES CATEGORY(ID),
	USER_GROUP_ID  INTEGER REFERENCES USER_GROUP(id),

	CONSTRAINT U_CONST_02 UNIQUE (USER_GROUP_ID,CATEGORY_ID,NAME)
);

CREATE TABLE ACCOUNT (
	ID             SERIAL PRIMARY KEY,
	NAME           VARCHAR(50),
	TYPE           VARCHAR(3), --CKA - checking account, SVA - saving account, INV - investment, CCA - credit card account
	ACTIVATED      BOOLEAN NOT NULL,
	START_BALANCE  DECIMAL NOT NULL,
	LAST_UPDATE    TIMESTAMP NOT NULL,
	USER_GROUP_ID  INTEGER REFERENCES USER_GROUP(id),

	CONSTRAINT U_CONST_03 UNIQUE (USER_GROUP_ID,NAME,TYPE,ACTIVATED)
);

CREATE TABLE ACCOUNT_ENTRY (
	ID                  SERIAL PRIMARY KEY,
	DATE                TIMESTAMP NOT NULL,
	AMOUNT              DECIMAL NOT NULL,
	ACCOUNT_ID          INTEGER NOT NULL REFERENCES ACCOUNT(ID),
	ACCOUNT_DESTINY_ID  INTEGER REFERENCES ACCOUNT(ID),
	TWIN_ENTRY_ID       INTEGER,
	TRANSFER            BOOLEAN NOT NULL,
	SUBCATEGORY_ID      INTEGER NOT NULL REFERENCES SUBCATEGORY(ID),
	USER_GROUP_ID       INTEGER REFERENCES USER_GROUP(id)
);