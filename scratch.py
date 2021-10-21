"""Convert js string date to py date."""

import re
from datetime import datetime

js_date = 'Thu Oct 21 2021 00:19:04 GMT-0700 (Pacific Daylight Time)'
parsed_js_date = js_date.split('-')[0] # gives Thu Oct 21 2021 00:19:04 GMT

print(datetime.strptime(parsed_js_date, '%a %b %d %Y %H:%M:%S %Z'))
