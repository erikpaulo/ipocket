pg:psql --app ipocket < /Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-postgres-001.sql

heroku pg:psql —-app ipocket 
TRUNCATE TABLE ACCOUNT_ENTRY RESTART IDENTITY CASCADE;
TRUNCATE TABLE ACCOUNT RESTART IDENTITY CASCADE;
TRUNCATE TABLE CATEGORY RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_role RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_account RESTART IDENTITY CASCADE;

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy user_account FROM '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001-user_account.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy user_role FROM '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001_roles.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy CATEGORY FROM '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001_category.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy ACCOUNT FROM '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001-account.csv' WITH CSV;"

PGPASSWORD=ETs0qOFuauVZUbZ8_ngjD1fG8p psql -h ec2-54-225-157-157.compute-1.amazonaws.com -U czqsxomuaxukrj dd09rdmh53mo52 -c "\copy ACCOUNT_ENTRY FROM '/Users/eriklacerda/Documents/Personal/Projetos/ipocket/src/main/resources/config/postgres/db-initialload-001-account_entry.csv' WITH CSV;"

