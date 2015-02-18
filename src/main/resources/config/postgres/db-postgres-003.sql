/**
* Changeset 003
* Acrescentando conceito de transferência programada (bills).
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-003.sql
*/

ALTER TABLE BILL DROP COLUMN IF EXISTS DESTINY_ACCOUNT_ID;
ALTER TABLE BILL ADD COLUMN DESTINY_ACCOUNT_ID INTEGER REFERENCES ACCOUNT(ID);
/*UPDATE BILL SET DESTINY_ACCOUNT_ID = NULL;
ALTER TABLE ACCOUNT ALTER COLUMN CREATE_DATE SET NOT NULL;*/