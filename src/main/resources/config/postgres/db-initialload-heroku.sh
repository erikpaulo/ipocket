#!/usr/bin/env bash

heroku pg:psql --app ipocket
TRUNCATE TABLE user_role RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_account RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_group RESTART IDENTITY CASCADE;
\q

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy user_group FROM '/Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/load-data/db-postgres-load-1coin-group.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy user_account FROM '/Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/load-data/db-postgres-load-1coin-user_account.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy user_role FROM '/Users/eriklacerda/Projects/ipocket/src/main/resources/config/postgres/load-data/db-postgres-load-1coin-roles.csv' WITH CSV;"

