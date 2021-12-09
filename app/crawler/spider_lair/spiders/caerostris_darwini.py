"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""

    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.bbc.com/', 'https://www.espn.com/', 'https://www.ign.com',
                  'https://www.nih.gov', 'https://thebulletin.org/', 'https://en.m.wikipedia.org']

    def parse(self, response):
        """Follow links."""
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        """Process data from followed links."""
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if (self.query in text.get()):
                    yield { 'url': response.request.url, 'text': text.get() }
        except:
            print('End of the line error.')