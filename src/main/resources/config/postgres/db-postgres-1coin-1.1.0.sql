/**
* Changeset 1.1.0
* Inclusão de budget em estrutura apartada dos pagamentos.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Dev-Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-1.1.0.sql
* Localhost  -- \i /Users/eriklacerda/Dev-Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-1.1.0.sql
*/

DROP TABLE IF EXISTS BUDGET_ENTRY;
DROP TABLE IF EXISTS BUDGET;

CREATE TABLE BUDGET (
	ID                  SERIAL PRIMARY KEY,
	YEAR                INTEGER NOT NULL,
	USER_GROUP_ID       INTEGER NOT NULL REFERENCES USER_GROUP(id),

	CONSTRAINT U_BUDGET_01 UNIQUE (YEAR, USER_GROUP_ID)
);

CREATE TABLE BUDGET_ENTRY (
	ID              SERIAL PRIMARY KEY,
	SUBCATEGORY_ID  INTEGER NOT NULL REFERENCES SUBCATEGORY(ID),
	BUDGET_ID       INTEGER NOT NULL REFERENCES BUDGET(ID),
	JAN             DECIMAL DEFAULT 0.0,
	FEB             DECIMAL DEFAULT 0.00,
	MAR             DECIMAL DEFAULT 0.00,
	APR             DECIMAL DEFAULT 0.00,
	MAY             DECIMAL DEFAULT 0.00,
	JUN             DECIMAL DEFAULT 0.00,
	JUL             DECIMAL DEFAULT 0.00,
	AUG             DECIMAL DEFAULT 0.00,
	SEP             DECIMAL DEFAULT 0.00,
	OCT             DECIMAL DEFAULT 0.00,
	NOV             DECIMAL DEFAULT 0.00,
	DEC             DECIMAL DEFAULT 0.00,
	POSITIVE        BOOLEAN DEFAULT TRUE,
    USER_GROUP_ID   INTEGER NOT NULL REFERENCES USER_GROUP(id),

    CONSTRAINT U_BUDGET_ENTRY_01 UNIQUE (SUBCATEGORY_ID, BUDGET_ID)
);