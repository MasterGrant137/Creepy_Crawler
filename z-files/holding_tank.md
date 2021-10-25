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

```
fonts: https://www.tutorialbrain.com/css_tutorial/css_font_family_list/
```

```javascript
 {function () {
                    const abbrevTZ = entry.tz.replace(dateRegex, '$1').replace(abbrevTZRegex, '$1');
                    return !natoTZ.test(abbrevTZ) ? abbrevTZ : abbrevTZ[0];
                }()}
```