## Get the local database up 
docker-compose -f config/local-db.yml up

## Create database
Go to http://localhost:8081 and create a database named `far`

## Start the app
yarn install && yarn server
