"""Convert js string date to py date."""

import re
from datetime import datetime

# js_date = 'Thu Oct 21 2021 00:19:04 GMT-0700 (Pacific Daylight Time)'
# parsed_js_date = js_date.split('-')[0] # gives Thu Oct 21 2021 00:19:04 GMT

# print(datetime.strptime(parsed_js_date, '%a %b %d %Y %H:%M:%S %Z'))

# js_date = 'Thu Oct 21 2021 00:19:04 GMT-0700 (Pacific Daylight Time)'
# parsed_js_date = js_date.split(r'\w+-')[0] # gives Thu Oct 21 2021 00:19:04 GMT

# print(parsed_js_date)
# print(datetime.strptime(parsed_js_date, '%a %b %d %Y %H:%M:%S %Z'))

# js_date = 'Thu Oct 21 2021 00:19:04 GMT-0700 (Pacific Daylight Time)'
# js_date_regex = re.compile(r'([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s([A-Z]{1,5}[-|+]\d{4})\s\((.*)\)')
# js_timezone_long = re.search(js_date_regex, js_date).group(3)
# js_timezone_short = ''.join(re.findall(r'([A-Z]){1}\w+', js_timezone_long))
# js_date_parsed = f"{re.search(js_date_regex, js_date).group(1)}"
# js_date_parsed = f"{re.search(js_date_regex, js_date).group(1)} {re.search(js_date_regex, js_date).group(3)}"
# js_gmt_offset_parsed = re.search(js_date_regex, js_date).group(2)
# js_timezone_parsed = re.search(js_date_regex, js_date).group(3)
js_timezone_long = 'Pacific Daylight Time'
js_timezone_short = ''.join(re.findall(r'([A-Z]){1}\w+', js_timezone_long))
print(js_timezone_long)
print(js_timezone_short)
# print(js_date_parsed)
# print(re.search(r'(\w+)-', js_date).group(1)) # GMT
# print(datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')) # 2021-10-21 00:19:04
