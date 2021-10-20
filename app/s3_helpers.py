"""aws helper functions."""

import boto3
import botocore
import os
import uuid

S3_BUCKET = os.environ.get('S3_BUCKET')
S3_LOCATION = f"http://{S3_BUCKET}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('S3_SECRET_ACCESS_KEY')
)

def allowed_file(filename):
    """Check if extension is allowed.

    Start from the right, split at the dot.
    Return boolean based on presence of dot
    in filename and whether lowercased string
    matches an allowed extension.
    """
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unique_filename(filename):
    """Generate unique filename."""
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = uuid.uuid4.hex
    return f"{unique_filename}.{ext}"

def upload_file_tos3(file, acl='public-read'):
    """Upload file to s3 object storage."""
    try:
        s3.upload_fileobj(
            file,
            S3_BUCKET,
            file.filename,
            ExtraArgs={
                'ACL': acl,
                'ContentType': file.content_type
            }
        )
    except Exception as e:
        # in case the s3 upload fails
        return {'errors': str(e)}

    return {'url': f"{S3_LOCATION}{file.filename}"}
