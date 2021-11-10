import re

required_chars_regex = re.compile(r'''
    ([a-z]{1,})| #? lowercase letter
    ([A-Z]{1,})| #? uppercase letter
    ([0-9]{1,})| #? number
    ([\W_]{1,}) #? symbol
    ''', re.VERBOSE)

validation_errors = []

password = 'abc'

lowercase_letter_present = re.search(required_chars_regex, password).group(1)
uppercase_letter_present = re.search(required_chars_regex, password).group(2)
number_present = re.search(required_chars_regex, password).group(3)
symbol_present = re.search(required_chars_regex, password).group(4)

password_proper = re.search(required_chars_regex, password)

# print(lowercase_letter_present)
# print(uppercase_letter_present)
# print(number_present)
# print(symbol_present)

if not lowercase_letter_present: 
    validation_errors.append('Lowercase letter needed in password.')

if not uppercase_letter_present: 
    validation_errors.append('Uppercase letter needed in password.')

if not number_present: 
    validation_errors.append('Number needed in password.')
    
if not symbol_present: 
    validation_errors.append('Symbol needed in password.')

if len(validation_errors):
    print(' '.join(validation_errors))