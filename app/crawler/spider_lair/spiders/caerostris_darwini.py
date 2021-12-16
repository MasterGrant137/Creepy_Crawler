"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy
from scrapy import signals
from scrapy.exceptions import CloseSpider
from datetime import datetime, timezone
import pytz

# class CDCommentarial(scrapy.Spider):
#     """Commentarial spider."""

#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://bbc.com/', 'https://espn.com/', 'https://ign.com/']
#     COUNT_MAX = 5
#     count = 0

#     def parse(self, response):
#         """Follow links."""
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
        
#     def parse_data(self, response):
#         """Process data from followed links."""
#         try:
    #         all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 print(response)
#                 if self.query in text.get():
#                     yield { 'url': response.request.url, 'text': text.get() }
#                     # CloseSpider()
#         except:
#             print('End of the line error.')

# class CDEncyclopedic(scrapy.Spider):
#     """Encyclopedic spider."""

#     name = 'caerostris_darwini_encyclopedic'
#     start_urls = ['https://en.m.wikipedia.org/', 'https://nih.gov/', 'https://thebulletin.org/']
#     COUNT_MAX = 5
#     count = 0

#     def parse(self, response):
#         """Follow links."""
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
#     def parse_data(self, response):
#         """Process data from followed links."""
#         try:
    #         all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 if self.query in text.get():
#                     yield { 'url': response.request.url, 'text': text.get() }
#                     # CloseSpider()
#         except:
#             print('End of the line error.')

# class CDBroadCrawler(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'caerostris_darwini_broad_crawler'
#     start_urls = ['https://en.m.wikipedia.org/']
#     COUNT_MAX = 5
#     count = 0

#     def parse(self, response):
#         """Follow links."""
#         link_frontier = response.css('a::attr(href)')
#         # print('frontier', link_frontier)
#         for link in link_frontier:
#             print('curr link', link)
#             yield response.follow(link, callback=self.parse)

#         all_text = response.css('*:not(script):not(style)::text')
#         for text in all_text:
#             if self.query in text.get():
#                 yield { 'url': response.request.url, 'text': text.get() }
#                 print({ 'url': response.request.url })

class CDBroadCrawler1(scrapy.Spider):
    """Broad crawling spider."""

    name = 'caerostris_darwini_broad_crawler_1'
    start_urls = ['https://en.m.wikipedia.org/', 'https://nih.gov/', 'https://thebulletin.org/']

    # custom_settings = {
    #     'CLOSESPIDER_TIMEOUT': 10
    # }

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        """Catch spider signals for later use."""
        print('from_crawler is hit')
        spider = super(CDBroadCrawler1, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        """Convey spider signal information."""
        print(self.crawler.stats.get_stats())

    def parse(self, response):
        """Follow links."""
        try:
            all_text = response.css('*:not(script):not(style)::text')
            for text in all_text:
                if self.query in text.get():
                    yield { 'url': response.request.url, 'text': text.get() }

            # start_time = pytz.timezone('UTC').localize(self.crawler.stats.get_value('start_time'))
            # current_time = datetime.now(timezone.utc)
            # diff_in_sec = (current_time - start_time).total_seconds()
            print(self.crawler.settings['USER_AGENT'])
            # print(self.crawler.settings['CLOSESPIDER_TIMEOUT'])
            # print(type(current_time), '-', type(start_time), '=', diff_in_sec, '>=?', self.crawler.settings['CLOSESPIDER_TIMEOUT'])
            # print(current_time, '-', start_time, '>=?', self.crawler.settings['CLOSESPIDER_TIMEOUT'])
            # if diff_in_sec >= 10:
            #     print('this is where its hit')
                # raise CloseSpider(reason='timeout')
        except:
            print('End of the line error.')

        yield from response.follow_all(css='a::attr(href)', callback=self.parse)

    #* For testing
    # def parse(self, response):
    #     """Follow links."""
    #     yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    # def parse_data(self, response):
    #     """Process data from followed links."""
    #     try:
    #         all_text = response.css('*:not(script):not(style)::text')
    #         for text in all_text:
    #             if self.query in text.get():
    #                 yield { 'url': response.request.url, 'text': text.get() }
    #     except:
    #         print('End of the line error.')