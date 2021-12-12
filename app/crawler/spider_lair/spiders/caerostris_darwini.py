"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy
# from scrapy.exceptions import CloseSpider

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""

    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://bbc.com/', 'https://espn.com/', 'https://ign.com/']
    COUNT_MAX = 5
    count = 0

    def parse(self, response):
        """Follow links."""
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
        
    def parse_data(self, response):
        """Process data from followed links."""
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                print(response)
                if self.query in text.get():
                    yield { 'url': response.request.url, 'text': text.get() }
                    # CloseSpider()
        except:
            print('End of the line error.')

class CDEncyclopedic(scrapy.Spider):
    """Encyclopedic spider."""

    name = 'caerostris_darwini_encyclopedic'
    start_urls = ['https://en.m.wikipedia.org/', 'https://nih.gov/', 'https://thebulletin.org/']
    COUNT_MAX = 5
    count = 0

    def parse(self, response):
        """Follow links."""
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        """Process data from followed links."""
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if self.query in text.get():
                    yield { 'url': response.request.url, 'text': text.get() }
                    # CloseSpider()
        except:
            print('End of the line error.')