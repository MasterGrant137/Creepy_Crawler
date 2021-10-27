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
+ Initially, I wasn't able to have latest credentials recognized. I had changed my credentials several times for various reasons and when I wrote the following debugging code into my program, it evinced that aws wasn't getting my most recent access key ID.
	```py
	def upload_media(userID)
		import boto3
		print(boto3.set_stream_logger('botocore', level='DEBUG'))
	```
	+ The print was a comprehensive debug log with one part that particularly stood out: 
		```shell
		<!-- This did not match my most current access key ID -->
		</Message><AWSAccessKeyId>12345EXAMPLE</AWSAccessKeyId>
		```
	+ I shut down all of my servers and restarted my shell. This addressed the previous error, but that's when I first encountered the `<Message>Access Denied</Message>` error. This would foreshadow what I would later view on my aws account when I uploaded manually. As aforementioned, this was rectified by changing my `Bucket policy` settings.