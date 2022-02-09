"""Caerostris Darwini Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)
"""

import json
from scrapy.http import FormRequest

import re
import scrapy

class DeepCrawler1(scrapy.Spider):
    """Broad crawling spider."""

    name = 'deep_crawler_1'

    def start_requests(self):
        """Send request."""
        request = scrapy.Request(f'https://onlinelibrary.wiley.com/action/doSearch?AllField={self.raw_query}', callback=self.parse)
        print('THIS', request)
        yield request

    def parse(self, response):
        """Follow links."""
        try:
            # print('LOOK AT PARSE', response.body)
            all_text = response.css('a::attr(href)')
            yield all_text
        except: print(f'End of the line error for {self.name}.')

# ! EXPERIMENTAL SPIDER
# class DeepCrawler1(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'deep_crawler_1'
#     start_urls = ['https://www.jstor.org/']

#     def request_data(self):
#         data = { 'Query': self.raw_query }
#         yield JsonRequest(url=self.start_urls[0], data=data)
#         print('LOOK AT REQUEST_DATA')

#     def parse(self, response):
#         """Follow links."""
#         try:
# data = { 'Query': self.raw_query }
#         request = FormRequest(
#                         response.url,
#                         # method='POST',
#                         # headers={ 'Content-Type': 'application/json' },
#                         body=json.dumps(data),
#                         callback=self.parse
                    # )
#             all_text = response.css('a::attr(href)')
#             print('LOOK AT PARSE', all_text)
#             yield all_text
#         except: print(f'End of the line error for {self.name}.')

# class BroadCrawler1(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_1'
#     start_urls = ['https://en.m.wikipedia.org/wiki/Wikipedia:Contents/Overviews']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler2(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_2'
#     start_urls = ['https://www.nih.gov/news-events/news-releases']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
                
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler3(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_3'
#     start_urls = ['https://thebulletin.org/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler4(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_4'
#     start_urls = ['https://www.bbc.com/news']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler5(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_5'
#     start_urls = ['https://espn.com/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler6(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_6'
#     start_urls = ['https://ign.com/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler7(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_7'
#     start_urls = ['https://www.imdb.com/feature/genre/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)

# class BroadCrawler8(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_8'
#     start_urls = ['https://www.dictionary.com/list/a']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = response.css('*:not(script):not(style)::text')
#             for text in all_text:
#                 query_found = bool(re.search(self.query_regex, text.get()))
#                 if query_found: yield { 'url': response.request.url, 'text': text.get() }
#         except: print(f'End of the line error for {self.name}.')

#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)