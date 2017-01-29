/**
* Changeset 0.4.0
* Inclusão de gestão de investimentos.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.4.0.sql
* Localhost  -- \i /Users/eriklacerda/Dev-Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.4.0.sql
*/

DROP TABLE IF EXISTS BILL_BASELINE;

CREATE TABLE BILL_BASELINE (
	ID                  SERIAL PRIMARY KEY,
	DATE                TIMESTAMP NOT NULL,
	AMOUNT              DECIMAL NOT NULL,
	ACCOUNT_TO_ID       INTEGER NOT NULL REFERENCES ACCOUNT(ID),
	ACCOUNT_FROM_ID     INTEGER REFERENCES ACCOUNT(ID),
	TRANSFER            BOOLEAN DEFAULT FALSE,
	SUBCATEGORY_ID      INTEGER NOT NULL REFERENCES SUBCATEGORY(ID),
	USER_GROUP_ID       INTEGER NOT NULL REFERENCES USER_GROUP(id)
);

ALTER TABLE BILL ADD COLUMN DONE BOOLEAN NOT NULL DEFAULT FALSE;