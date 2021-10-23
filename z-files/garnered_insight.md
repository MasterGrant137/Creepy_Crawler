+ I've found that JavaScript's regex flavor has a few key differences to Python's. It all revolves around the information packed into the regex string or object vs. the methods surrounding it. Python puts more responsibility on the methods to guide the action of the pattern matching while Javascript embeds all the relevant information in the expression itself. Take the example of making a title abbreviator as I did in this project:
    + Py
        ```python
        long_timezone = 'Pacific Daylight Time'
        short_timezone = ''.join(re.findall(r'([A-Z]){1}\w+',   long_timezone)) # PDT
        ```
    + JS
        ```javascript
        const longTimezone = 'Pacific Daylight Time';
        const shortTimezone = longTimezone.replace(/([A-Z]){1}\w+|(\s)/ g, '$1'); // PDT
        ```
+ JavaScript's emphasis on the expression over the method is elucidated in the previous example. The g flag is offering the expression more specificity in its search in the same way that the findall method is doing for the Python expression. Even the flag placement in the code highlights the different philosophies. JavaScript chooses to keep the flags as close to the expression as possible while Python makes them arguments of the methods:
    + JS
        ```javascript
        const str = 'apple'
        const pattern = /ApPlE/im
        const match =  pattern.test(str); // true
        ```
    + Py
        ```python
        import re

        string = 'apple'
        pattern = r'ApPlE'
        match = re.search(pattern, string, flags=re.I | re.M)
        bool(match) # True
        ```
+ The `RegExp` constructor and `re.compile` pattern object allow for multiline comments to be created in their respective languages (JS and Py). `re.compile` is very useful in regex since one can store a flag on the object and reuse that flag in multiple expressions as opposed to including it in every method. This is not a situation one would encounter in JS's flavor of regex since flags are directly appended to the regular expressions. Here are two examples of multiline regex comments, one in JS and the other in Py, both dealing with dates.
    + JS
        ```javascript
        const dateRegex = new RegExp([
                                '([A-Z]{1}[a-z]{2}),\\s', // day of the week
                                '(\\d{2}\\s[A-Z]{1}[a-z]{2}\\s\\d{4})\\s', // day, month, and year
                                '(\\d{2}:\\d{2}:\\d{2})\\s', //? time
                                '(.*)' // timezone
                                ].join(''), 'g');
        ```
    + Py
        ```python
        js_date_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s # date and time
        ([A-Z]{1,5}[-|+]\d{4})\s # gmt offset
        \((.*)\) # timezone
        ''', re.VERBOSE)
        ```
