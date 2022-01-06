provider "aws" {
  region  = var.REGION
  profile = var.PROFILE
}

//create s3 for lambda
resource "aws_s3_bucket" "s3bucket_lambda" {
  bucket = "lambda.${var.PROFILE}.yingyi.me"
  acl    = "private"

  force_destroy = true

  lifecycle_rule {
    enabled = true
    transition {
      days          = var.days
      storage_class = var.storageClass
    }
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = var.s3Algorithm
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "publicAccessBlockS3_lambda" {
  bucket             = aws_s3_bucket.s3bucket_lambda.id
  ignore_public_acls = true
}