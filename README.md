## Get the local database up 
docker-compose -f config/local-db.yml up

## Start the app
yarn install && yarn server
