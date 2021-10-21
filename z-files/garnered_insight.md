
**Emulating String.split() with regex**
```python
js_date = 'Thu Oct 21 2021 00:19:04 GMT-0700 (Pacific Daylight Time)'
js_date_compiled = re.compile(r'(\w.*)(-)') # re.compile('(\\w.*)(-)')
js_date_parsed = re.search(js_date_compiled, js_date).group(1) # Thu Oct 21 2021 00:19:04 GMT
print(re.search(r'(\w+)-', js_date).group(1)) # GMT
print(datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')) # 2021-10-21 00:19:04
```
