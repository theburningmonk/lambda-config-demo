# lambda-config-demo

Demo of approaches to config management for AWS Lambda.

### Getting Started

Use the AWS cli to add two parameters to SSM parameter store:

`aws ssm put-parameter --name foo --value foo --type SecureString --key-id <KMS key id> --region us-east-1`

`aws ssm put-parameter --name bar --value bar --type SecureString --key-id <KMS key id> --region us-east-1`

Update the `iamRoleStatements` section of the  `serverless.yml` file with the 
KMS key id you used above.

Deploy with serverless framework and curl the deployed endpoints.