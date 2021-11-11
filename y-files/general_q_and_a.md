+ How do I get ESlint to run in all of my directories? I did the npm install —save-dev eslint and npx eslint —init then configured the eslintrc.json in my root but all I have are the warnings that come with the VSCode ESlint extension. The rules I set up in that eslintrc.json only work in my top-most directory, not my react-app.
  + I deleted all package.json files in my root (they had only been created in an attempt to get it to work and were unnecessary bloat), solely keeping the extension on my IDE (VSCode) and then I made a file in my root called `.eslintrc.js`. Next I place the following code and the linter immediately picked it up and started abiding bt the style guide I picked:
  ```js
  module.exports = {
    extends: 'airbnb-base',
  };
  ```

+ I encountered a situation where Flask-Migrate wasn't updating my tables. I had to and manually set the type of one of the erroring table columns to resolve the issue. This occurred after I had un-seeded, migrated, and upgraded several times for my project. The error would consistently show the wrong data type for one of the columns I had just updated. Later, I discovered that this (along with modifying the Alembic files directly) may have resulted in my database's corruption. I ended up having to drop and recreate my database locally and on Heroku. What I've learned is that individual changes to values and types within a given column don't reliably register in Alembic so it's best to just delete, migrate, upgrade, add the modified column, migrate, and upgrade if you want to see the changes to a section of your column reflected in your database.

+ I encountered an error this error:
    ```
    File "/Users/.../Creepy_Crawler
    /.venv/lib/python3.9/site-packages/flask_login/utils.py", line 272, in decorated_view
    return func(*args, **kwargs)
    TypeError: edit_user_profile() got an unexpected keyword argument 'settingID'
    ```
    + There was no parameter in my function to match the route param. So, albeit the function param
      was not explicitly used within the function, it was still needed for the route.
    ```py
    @user_routes.route('/profile/<int:settingID>', methods=['PATCH'])
    ...
    def edit_user_profile(settingID): 
        ... 
    ```

+ I was encountering this error:
  ```
  werkzeug.exceptions.BadRequestKeyError: 400 Bad Request:
  The browser (or proxy) sent a request that this server
  could not understand. KeyError: 'setting_id'
  ```
    + I discovered that I was using `request.files` for non-file keys of
      the form data. I changed my program to accept the non-file data
      with `request.form` and the file data with `request.files` and everything started coming together.

+ After encountering this error `raise TypeError("Not a boolean value: %r" % value)`, I found that formData.append turns the appended data into a string which I had to account for on the receiving end (my Python routes) since my db was expecting a boolean. Albeit the input data (`checked` attribute of a checkbox) came back as a boolean, it lost that type in the process of appending to form data and had to be type-casted back in my Python routes.