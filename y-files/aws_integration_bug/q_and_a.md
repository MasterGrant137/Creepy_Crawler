### Questions and Answers

**Q1**: Logging formData directly prints an empty object. How do I check if I appended to formData correctly if it's not serializable?
**A1**: 
```js
for (let key of formData.values()) {
    console.log(key);
}
```

**Q2**: My request is dying between my frontend and backend. How do I rectify the following errors, the latter which shuts down my entire frontend server?
```shell
Could not proxy request /creepycrawler/users/2 from localhost:3000 to http://localhost:5000

Error [ERR_STREAM_WRITE_AFTER_END]: write after end 
```
**A2**:
```js
/* 
Remove this from your requesting thunk.
The form data has its content type
(e.g., image/jpg) so this throws it off.
*/
headers: {
    'Content-Type': 'application/json'
},
```

**Q3**: How do I fix the error `hex attribute doesn't exist on uuid4`?
**A3**: In s3_helpers.py, invoke uuid4 (i.e., `uuid.uuid4().hex`).

**Q4**: How do I fix the following error?
```shell
An error occurred (InvalidAccessKeyId) when calling the PutObject
operation: The AWS Access Key Id you provided does not exist in
our records.
```
**A4**:
+ Change `Block public access (bucket settings)` in `Permissions` section of s3 bucket to the following.
	```
	Block all public access
		Off
	Block public access to buckets and objects granted through new access control lists (ACLs)
		Off
	Block public access to buckets and objects granted through any access control lists (ACLs)
		Off
	Block public access to buckets and objects granted through new public bucket or access point policies
		Off
	Block public and cross-account access to buckets and objects through any public bucket or access point policies
		Off
	```
+ Change `Bucket policy` settings, also located in `Permissions` section of s3 bucket to the following.
	```json
	{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Sid": "Stmt1420751757000",
				"Effect": "Allow",
				"Principal": {
					"AWS": "*"
				},
				"Action": "s3:*",
				"Resource": "arn:aws:s3:::NAME_OF_BUCKET/*"
			}
		]
	}
	```

Useful Tips
+ In order to immediately identify the origin of the bug (ie., aws account settings or my code), I uploaded manually to my bucket on my browser and tried the view the image url. It gave back a concise error telling me I wasn't authorized to view the upload.
	```
	<Error>
	<Code>AccessDenied</Code>
	<Message>Access Denied</Message>
	<RequestId>7WDFCD7875TP6ABH</RequestId>
	<HostId>G9bv6r48cWIZhHj3JL9hozikFIm/V/0q/Z8nqrNNtgnF1jplgIk+KEtcMn9yBJkzQgN1ro99qYw=</HostId>
	</Error>
	```
+ Initially, I wasn't able to have latest credentials recognized

def upload_media(userID)
	import boto3
	client = boto3.client('sts')
	print(client.get_caller_identity())
	print(boto3.set_stream_logger('botocore', level='DEBUG'))

First print: botocore.exceptions.NoCredentialsError: Unable to locate credentials
Second print: long debug report with one line that particularly stood out:


</Message><AWSAccessKeyId>12345EXAMPLE</AWSAccessKeyId>
The access key ID that they were viewing was a bit several characters off of my current access ID. It seemed to be picking up on an older version (I've rotated my keys several times).

AND

'context': {'client_region': 'us-east-1'...}
The region on my account is us-west-1.

I shut down all of my servers and restarted my shell. This stopped the previous error but now the debug statement log was stating `<Message>Access Denied</Message>`. So, I went to my bucket policies and discovered they were blank, despite having thought I configured it before.


After researching, I concluded it must be something with my permissions. Eventually, after extensive searching, it was revealed to me that one could manually upload to an s3 bucket. this would be the ultimate test of permissions since its not derived from my code. Upon uploading a photo, I received this error when I tried to follow the link:


This mirrored the log I had seen while debugging in my code with `boto3.set_stream_logger('botocore', level='DEBUG')`. It became clear to me that there must be something wrong with my bucket/account configuration. Turns out the policy section I had flagged earlier was indeed the source. 