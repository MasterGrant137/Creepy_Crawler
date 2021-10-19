```sql

Table users {
  id serial [pk, increment]
  email varchar(256)
  media varchar(1000)
  hashedPassword bytea
  created_at timestamp
  updated_at timestamp
}

Table themes {
  id serial [pk, increment]
  userID int [ref: < users.id]
  backgroundColor varchar(7)
  backgroundImage varchar(1000)
  fontColor varchar(7)
  fontFamily varchar(50)
  fontSize int
  active boolean
  createdAt timestamp
  updatedAt timestamp
}

Table histories {
  id serial [pk, increment]
  userID int [ref: < users.id]
  search varchar(1000)
  visit varchar(1000)
  createdAt timestamp
  updatedAt timestamp
}
```


```python

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

`fonts: https://www.tutorialbrain.com/css_tutorial/css_font_family_list/
`
