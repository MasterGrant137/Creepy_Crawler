import random
import string

# password_characters = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

# profile_picture = https://randomuser.me/api/portraits/thumb/men/1.jpg

for i in range(50):
    print(f"https://randomuser.me/api/portraits/{'men' if i % 2 == 0 else 'women'}/{i}.jpg")
