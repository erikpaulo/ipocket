/**
* Changeset 0.1.0
* Inclusão de pagamento programado.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.1.0.sql
* Localhost  -- \i /Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.1.0.sql
*/

DROP TABLE IF EXISTS BILL;
ALTER TABLE ACCOUNT DROP COLUMN IF EXISTS CREATE_DATE;

ALTER TABLE ACCOUNT ADD COLUMN CREATE_DATE TIMESTAMP NOT NULL DEFAULT current_date;

CREATE TABLE BILL (
	ID                  SERIAL PRIMARY KEY,
	DATE                TIMESTAMP NOT NULL,
	AMOUNT              DECIMAL NOT NULL,
	ACCOUNT_TO_ID       INTEGER NOT NULL REFERENCES ACCOUNT(ID),
	ACCOUNT_FROM_ID     INTEGER REFERENCES ACCOUNT(ID),
	TRANSFER            BOOLEAN DEFAULT FALSE,
	SUBCATEGORY_ID      INTEGER NOT NULL REFERENCES SUBCATEGORY(ID),
	USER_GROUP_ID       INTEGER NOT NULL REFERENCES USER_GROUP(id)
);