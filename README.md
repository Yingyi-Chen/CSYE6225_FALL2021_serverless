# serverless
# assignment 8
# author: Yingyi Chen

## Step 1
1. terraform apply Infrastructure in other repo
2. terraform apply: create a S3 bucket for serverless

## Step 2
1. push this to github
2. code will be deployed automatically in lambda from S3 bucket for serverless

## Code running:
1. lambda will be triggered when a sns notify was sent. Lambda function will trigger ses to send an email with an url to the user, if the username is not found in dynamodb. User will receive an email after they enter their username
2. when user clicks the URL, /verify will be triggered
