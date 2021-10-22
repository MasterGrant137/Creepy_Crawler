
**Python string abbreviator.**
```python
js_timezone_long = 'Pacific Daylight Time'
js_timezone_short = ''.join(re.findall(r'([A-Z]){1}\w+', js_timezone_long)) # PDT
```
