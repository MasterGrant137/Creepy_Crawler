```py

# caerostris-darwini
# pip install Requests
# pip install Scrapy

class DesertSun:
    """Desert Sun Scraper."""
    smart_urls = ['https://www.desertsun.com/story/tech/science/energy/2021/02/26/california-technically-and-commercially-feasible-extract-lithium-brine-geothermal-plants-already-pul/6839875002/']

    def parse(self, response):
        """Grab and format the content."""
        for p in response.css('div.qnt_ar_b_p'):
            yield {
                'text': p.css()
            }
```

```
fonts: https://www.tutorialbrain.com/css_tutorial/css_font_family_list/
```

```py
from faker import Faker
import random
import string

password_characters = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

password=''.join(random.choice(password_characters) for i in range(15))
```