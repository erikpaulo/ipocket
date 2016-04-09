/**
* Changeset 0.2.0
* Inclusão de planejamento de despesas e receitas.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.2.0.sql
* Localhost  -- \i /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.2.0.sql
*/

DROP TABLE IF EXISTS BUDGET_ENTRY;
DROP TABLE IF EXISTS BUDGET;

CREATE TABLE BUDGET (
	ID                  SERIAL PRIMARY KEY,
	YEAR                INTEGER NOT NULL,
	ACTIVE              BOOLEAN NOT NULL,
	USER_GROUP_ID       INTEGER NOT NULL REFERENCES USER_GROUP(id)
);

CREATE TABLE BUDGET_ENTRY (
	ID              SERIAL PRIMARY KEY,
	MONTH_PLAN      DECIMAL NOT NULL,
	BUDGET_ID       INTEGER NOT NULL REFERENCES BUDGET(ID),
	SUBCATEGORY_ID  INTEGER NOT NULL REFERENCES SUBCATEGORY(ID),
	USER_GROUP_ID   INTEGER NOT NULL REFERENCES USER_GROUP(ID)
);