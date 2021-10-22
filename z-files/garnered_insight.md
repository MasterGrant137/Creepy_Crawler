
**Python string abbreviator.**
```python
js_timezone_long = 'Pacific Daylight Time'
js_timezone_short = ''.join(re.findall(r'([A-Z]){1}\w+', js_timezone_long)) # PDT
```

+ I've found that JavaScript's regex flavor has a few key differences to Python's. It all revolves around the information packed into the regex string or object vs. the methods surrounding it. Python puts more responsibility on the methods to guide the action of the pattern matching while Javascript embeds all the relevant information in the expression itself. Take the example of making a title abbreviator as I did in this project:
    ```python
    long_timezone = 'Pacific Daylight Time'
    short_timezone = ''.join(re.findall(r'([A-Z]){1}\w+', long_timezone)) # PDT
    ```
    ```javascript
    const longTimezone = 'Pacific Daylight Time';
    const shortTimezone = longTimezone.replace(/([A-Z]){1}\w+|(\s)/g, '$1'); // PDT
    ```
    + JavaScript's emphasis on the expression over the method is elucidated in the previous example. The g flag is offering the expression more specificity in its search in the same way that the findall method is doing for the Python expression. Even the flag placement in the code highlights the different philosophies. JavaScript chooses to keep the flags as close to the expression as possible while Python makes them arguments of the methods:
        ```javascript
        const str = 'apple'
        const pattern = /ApPlE/im
        const match =  pattern.test(str); // true
        ```
        ```python
        import re

        string = 'apple'
        pattern = r'ApPlE'
        match = re.search(pattern, string, flags=re.I | re.M)
        bool(match) # True
        ```
