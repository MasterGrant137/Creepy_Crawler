### Questions and Answers

**Q1**: How do I see if the file I'm appending to formData is correct?

First off, I needed to see if the file I was appending to formData was correct. I console.logged the media variable which came back as the desired 

headers removed from thunk which solved nasty frontend, 'Content-Type': 'application/json' was throwing it off, nasty error shut down my entire frontend every time it hit | Could not proxy request /creepycrawler/users/2 from localhost:3000 to http://localhost:5000 | Error [ERR_STREAM_WRITE_AFTER_END]: write after end 

uuid needed to be invoked in the s3helper function for hex attribute doesn't exist on uuid4 issue

changed permissions to allow for public access in buckets on was account | An error occurred (InvalidAccessKeyId) when calling the PutObject operation: The AWS Access Key Id you provided does not exist in our records.




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

<Error>
<Code>AccessDenied</Code>
<Message>Access Denied</Message>
<RequestId>7WDFCD7875TP6ABH</RequestId>
<HostId>G9bv6r48cWIZhHj3JL9hozikFIm/V/0q/Z8nqrNNtgnF1jplgIk+KEtcMn9yBJkzQgN1ro99qYw=</HostId>
</Error>


This mirrored the log I had seen while debugging in my code with `boto3.set_stream_logger('botocore', level='DEBUG')`. It became clear to me that there must be something wrong with my bucket/account configuration. Turns out the policy section I had flagged earlier was indeed the source. 