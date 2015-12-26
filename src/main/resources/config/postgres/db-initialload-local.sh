TRUNCATE TABLE user_role CASCADE;
TRUNCATE TABLE user_account CASCADE;

copy "user_account" from '/Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-load-1coin-user_account.csv' WITH DELIMITER ',';
copy "user_role" from '/Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/db-postgres-load-1coin-roles.csv' WITH DELIMITER ',';