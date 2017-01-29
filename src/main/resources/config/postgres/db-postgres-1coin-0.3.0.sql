/**
* Changeset 0.3.0
* Inclusão de gestão de investimentos.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.3.0.sql
* Localhost  -- \i /Users/eriklacerda/Dev-Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.3.0.sql
*/

DROP TABLE IF EXISTS INVESTMENT_ENTRY;
DROP TABLE IF EXISTS INDEX;
DROP TABLE IF EXISTS INVESTMENT;

CREATE TABLE INVESTMENT (
    ID              SERIAL PRIMARY KEY,
	NAME            VARCHAR(50),
    TYPE            VARCHAR(3) NOT NULL,
    ADMIN_FEE       DECIMAL NOT NULL,
    CREATE_DATE     TIMESTAMP NOT NULL,
	ACTIVATED       BOOLEAN NOT NULL,
	USER_GROUP_ID   INTEGER REFERENCES USER_GROUP(id),
	LAST_UPDATE     TIMESTAMP NOT NULL,

	CONSTRAINT U_INVESTMENT_01 UNIQUE (USER_GROUP_ID,NAME,TYPE,ACTIVATED)
);

CREATE TABLE INVESTMENT_ENTRY (
    ID              SERIAL PRIMARY KEY,
    INVESTMENT_ID   INTEGER NOT NULL REFERENCES INVESTMENT(ID),
    DATE            TIMESTAMP NOT NULL,
    TYPE            VARCHAR(1) NOT NULL, -- B - BUY / S - SELL
    QTD_QUOTES      DECIMAL NOT NULL,
    AMOUNT          DECIMAL NOT NULL,
    INCOME_TAX      DECIMAL,
    IOF             DECIMAL,
    USER_GROUP_ID   INTEGER REFERENCES USER_GROUP(id)
);

CREATE TABLE INDEX (
    ID              SERIAL PRIMARY KEY,
    INVESTMENT_ID   INTEGER REFERENCES INVESTMENT(ID),
    DATE            TIMESTAMP NOT NULL,
    VALUE           DECIMAL NOT NULL
);