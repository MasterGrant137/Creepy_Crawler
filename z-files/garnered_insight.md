### A Note on my Experience With Different Regex Flavors
+ I've found that JavaScript's regex flavor has a few key differences to Python's. It all revolves around the information packed into the regex string or object vs. the methods surrounding it. Python puts more responsibility on the methods to guide the action of the pattern matching while Javascript embeds all the relevant information in the expression itself. Take the example of making a title abbreviator as I did in this project:
    + Py
        ```python
        long_time_zone = 'Pacific Daylight Time'
        short_time_zone = ''.join(re.findall(r'([A-Z]){1}\w+', long_time_zone)) # PDT
        ```
    + JS
        ```javascript
        const longTimeZone = 'Pacific Daylight Time';
        const shortTimeZone = longTimeZone.replace(/([A-Z]){1}\w+|(\s)/g, '$1'); // PDT
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
                                '(.*)' // time zone
                                ].join(''), 'g');
        ```
    + Py
        ```python
        js_date_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s # date and time
        ([A-Z]{1,5}[-|+]\d{4})\s # gmt offset
        \((.*)\) # time zone
        ''', re.VERBOSE)
        ```

### Unexpected Behaviors
+ Not only does the JavaScript g flag not stop at the first match within a given string, it is will match over subsequent calls. To solve the bug I encountered, I stripped down my surrounding code. This allowed me to isolate and eliminate the behavior. I had multiple test methods being called for debugging purposes but they were ironically perpetuating the bug by summoning the g flag before it was intended. I removed the extra methods along with any unnecessary g flags. This is the behavior reduced to its most bare components:
    ```javascript
        const r = /\w/g;
        const testA = r.test('word'); // true
        const testB = r.test('1');  // false
    ```
+ Originally, I was thinking about resetting state in my create theme component every time the user switched a theme. I came to realize that this isn't a desirable behavior since a user may want to switch themes while continuing to create a theme. The create theme and edit theme components are naturally decoupled since I have them in separate components so it was no issue allowing my create theme component state to be different than that which is stored in the Redux store and present throughout the rest of the document. 
   + However, due to the amount of obstacles I encountered while pursuing that undesirable behavior, I was deeply curious how I would have made the two communicate if I actually wanted them to (i.e. selecting a theme on edit form resets input values on create form). 
        + After ruminating on the subject for some time, I discovered that the create theme component elements are available to the edit theme component on the DOM. This is made evident by using `document.getElementById('my-css-class-name-for-create-theme-ele');`. This was very interesting, and made me think that if I, indeed, sought to change values on my create theme component, I had the access to do so. The issue is that it only works for a fraction of a second for input elements. So, while I could change the style of the theme preview from my edit form, I couldn't change the inputs that governed its style in the create form. 
        + The main crux is that albeit style values are changing for the whole application immediately when the use theme button is pressed in the edit theme component, the state isn't reset in the create theme component because nothing new is dispatched.
        + An alternative could be to have the components merged in some capacity so to share state and the methods that act upon that state.
        + Another possible alternative would be to store create theme's state on the higher order settings page component and pass it to create theme's sibling edit theme.
    + After doing more research, I've discovered that passing props between siblings is not a possibility architecturally in React. So, as I previously thought, passing down props from a parent component or merging components so that state is shared are the viable alternatives. Another approach could be to add a boolean value to the redux store that changes when the use theme button is pressed and then have a function with a conditional in the create theme component that resets the state upon that value being true and then changes that value to false in the store.