
import re

items = ['ayz', 'b', 'c', 1, 2]

matches = [match.group(0) for item in items if (match := re.match(r'[A-Da-d]{1,}',f'{item}'))]

# match_string = ''
# for item in items:
#     match = re.match(r'[A-Da-d]{1,}',f'{item}')
#     if match: match_string += match.group(0)
#     if 

print(matches)

# matches = [match.group(0) for text_item in text_list if (match := re.search(self.query_regex, text_item))]