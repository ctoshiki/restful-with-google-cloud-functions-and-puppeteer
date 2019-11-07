#!/usr/bin/bash 

$DEPLOY_DIR=deploy

if [! -e $DEPLOY_DIR ]; then
  mkdir $DEPLOY_DIR
fi

cp index.js package.json $DEPLOY_DIR
cd $DEPLOY_DIR

gcloud beta functions deploy items --entry-point=run --env-vars-file=.env --runtime nodejs10 --trigger-http
