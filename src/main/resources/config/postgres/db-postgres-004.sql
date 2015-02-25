/**
* Changeset 004
* 1)- Correção problema de data + timezone do angular
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-004.sql
*/
ALTER TABLE BILL_ENTRY ALTER COLUMN DATE TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE ACCOUNT ALTER COLUMN CREATE_DATE TYPE TIMESTAMP WITH TIME ZONE;
ALTER TABLE ACCOUNT_ENTRY ALTER COLUMN DATE TYPE TIMESTAMP WITH TIME ZONE;