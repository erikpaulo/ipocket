/**
* Changeset 001
* Criação da aplicação.
* heroku pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-clear.sql
*/

DROP TABLE IF EXISTS BILL_ENTRY;
DROP TABLE IF EXISTS BILL;
DROP TABLE IF EXISTS ACCOUNT_ENTRY;
DROP TABLE IF EXISTS ACCOUNT;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS CATEGORY_GROUP;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS remember_me_token;
DROP TABLE IF EXISTS user_social_connection;
DROP TABLE IF EXISTS user_account;