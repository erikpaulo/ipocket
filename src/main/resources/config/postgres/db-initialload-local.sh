TRUNCATE TABLE BILL_ENTRY CASCADE;
TRUNCATE TABLE BILL CASCADE; 
TRUNCATE TABLE ACCOUNT_ENTRY ASCADE;
TRUNCATE TABLE ACCOUNT CASCADE;
TRUNCATE TABLE CATEGORY CASCADE;
TRUNCATE TABLE CATEGORY_GROUP CASCADE;
TRUNCATE TABLE user_role CASCADE;
TRUNCATE TABLE user_account CASCADE;

copy "user_account" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001-user_account.csv' WITH DELIMITER ',';
copy "user_role" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001_roles.csv' WITH DELIMITER ',';
copy "category_group" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-category-group.csv' WITH DELIMITER ';';
copy "category" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/dp-initialload-category.csv' WITH DELIMITER ';';
copy "account" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-account.csv' WITH DELIMITER ';';
copy "account_entry" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-account-entry.csv' WITH DELIMITER ';';
copy "bill" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-bill.csv' WITH DELIMITER ';' NULL AS '';
copy "bill_entry" from '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-bill-entry.csv' WITH DELIMITER ';' NULL AS '';
