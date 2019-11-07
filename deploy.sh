#!/usr/bin/bash 

DEPLOY_DIR=deploy

if [ ! -e $DEPLOY_DIR ]; then
  mkdir $DEPLOY_DIR
fi

cp index.js package.json .env $DEPLOY_DIR
cd $DEPLOY_DIR

gcloud beta functions deploy items --entry-point=run --runtime=nodejs10 --trigger-http
