/**
* Changeset 001
* Criação da aplicação.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-clear.sql
*/

DELETE FROM INDEX;
DELETE FROM INVESTMENT_ENTRY;
DELETE FROM INVESTMENT;
DELETE FROM BUDGET_ENTRY;
DELETE FROM BUDGET;
DELETE FROM BILL;
DELETE FROM ACCOUNT_ENTRY;
DELETE FROM ACCOUNT;
DELETE FROM SUBCATEGORY;
DELETE FROM CATEGORY;
DELETE FROM USER_ROLE;
DELETE FROM USER_ACCOUNT;
DELETE FROM USER_GROUP;