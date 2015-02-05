/**
* Changeset 001
* Criação da aplicação.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-001.sql
*/

DROP TABLE IF EXISTS BILL_ENTRY;
DROP TABLE IF EXISTS BILL;


CREATE TABLE BILL (
	ID 				SERIAL PRIMARY KEY,
	DESCRIPTION		VARCHAR(255),
	CALC_TYPE		VARCHAR(1), /*F - Valor Fixo, A - Média ultimos lançamentos*/
	AVERAGE_COUNT	INTEGER,
	ACCOUNT_ID 		INTEGER REFERENCES ACCOUNT(ID), 
	CATEGORY_ID 	INTEGER REFERENCES CATEGORY(ID),
	USER_ID 		INTEGER REFERENCES user_account(id)
);

CREATE TABLE BILL_ENTRY (
	ID				SERIAL PRIMARY KEY,
	DATE			DATE,
	AMOUNT			DECIMAL,
	BILL_ID			INTEGER REFERENCES BILL(ID)
);