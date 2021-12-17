"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy
from scrapy import signals

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

    def parse(self, response):
        """Follow links."""
        try:
            all_text = response.css('*:not(script):not(style)::text')
            for text in all_text:
                if self.query in text.get(): yield { 'url': response.request.url, 'text': text.get() }
        except: print('End of the line error.')

        yield from response.follow_all(css='a::attr(href)', callback=self.parse)