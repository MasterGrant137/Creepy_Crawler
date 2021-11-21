"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import json
import scrapy

# with open('app/crawler/query.json', 'r') as query_object:
#     query = json.load(query_object)['query']

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/', 'https://www.bbc.com/']

    def parse(self, response):
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        print('CD CLASS IS HIT LINE 25', self.query)
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if (self.query in text.get()):
                    yield { 'url': response.request.url, 'text': text.get() }
        except:
            print('End of the line error.')