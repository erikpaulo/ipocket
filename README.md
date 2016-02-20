ipocket
=======

# Tools
Java 1.8
IntelliJ for development with lombok plugin installed. 
Maven for build java backend
Bower for dependency management
Postgres database 


# Install
> open postgres terminal to setup database model running the following commands
\i /Users/marcuslacerda/git/ipocket/src/main/resources/config/postgres/db-postgres-1coin-0.0.1.sql
copy user_account from '/Users/marcuslacerda/git/ipocket/src/main/resources/config/postgres/db-postgres-load-1coin-user_account.csv' DELIMITER ',' CSV;
copy user_role from '/Users/marcuslacerda/git/ipocket/src/main/resources/config/postgres/db-postgres-load-1coin-roles.csv' DELIMITER ',' CSV;

> bower install

> mvn clean package

# Running 
> mvn spring-boot:run

> open http://localhost:8080/ipocket


