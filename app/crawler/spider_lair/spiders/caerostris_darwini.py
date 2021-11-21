"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import json
import scrapy

# query='football'

with open('app/crawler/query.json', 'r') as query_object:
    query = json.load(query_object)['query']

# results_file = open('app/crawler/caerostris_darwini.json', 'w')
# results_list = []

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""
    print('CD CLASS IS HIT LINE 21')
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/', 'https://www.bbc.com/']

    def parse(self, response):
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if (query in text.get()):
                    yield { 'url': response.request.url, 'text': text.get() }
        except:
            print('End of the line error.')

# newline = ',\n'
# results_file.write(f"[{newline.join([json.dumps(result, indent=4) for result in results_list])}]")
# results_file.close()