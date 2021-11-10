import re

required_chars_regex = re.compile(r'''
    ([a-z])| #? lowercase letter
    ([A-Z])| #? uppercase letter
    ([0-9])| #? number
    ([\W_]) #? symbol
    ''', re.VERBOSE)

password = 'abc'

password_proper = re.search(required_chars_regex, password)

print(password_proper)