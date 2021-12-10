"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy
# from scrapy import signals

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""

    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://bbc.com/', 'https://espn.com/', 'https://ign.com/']

    # def from_crawler(cls, crawler):
        # """Close spider when time conditions are met."""
        # item_count = crawler.settings.getInt('ITEM_COUNT')

        # ext = cls(item_count)
        # crawler.signals.connect(ext.spider_opened, signal=signals.spider_opened)
        # crawler.signals.connect(ext.spider_closed, signal=signals.spider_closed)
        # crawler.signals.connect(ext.spider.timeout, signal=signals.timeout)

    def parse(self, response):
        """Follow links."""
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        """Process data from followed links."""
        # self.items_scraped = 0
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if (self.query in text.get()):
                    yield { 'url': response.request.url, 'text': text.get() }
                    # self.items_scraped += 1
                    # print(self.items_scraped)
        except:
            print('End of the line error.')

class CDEncyclopedic(scrapy.Spider):
    """Encyclopedic spider."""

    name = 'caerostris_darwini_encyclopedic'
    start_urls = ['https://en.m.wikipedia.org/', 'https://nih.gov/', 'https://thebulletin.org/']

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