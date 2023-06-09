"""Broad Crawling Spiders.

Categories:
+ Commentarial (image/text)
+ Commercial (image)
+ Encyclopedic (text)
+ Videographic (video)

Class attributes:
- Attributes are passed from Flask *search_routes.py* as kwargs in the `crawl` method inside the
  `scrape_with_crochet` function.
- They are accessed by keying into the self parameter.

Logic:
- `yield from response.follow_all(...)` is what drives the broadness and, in turn, the duration
  of each spider's scrape
- 
"""

import re
import scrapy
from scrapy.exceptions import CloseSpider

class BroadCrawlerMonitor():
    """Monitor and regulate broad crawling spiders."""

    crawl_depths = {}

    def __init__(self, name):
        """Initialize BroadCrawlerMonitor."""
        self.name = name
    
    def increment_crawl_depth(self):
        """Increment the depth a given spider has crawled."""
        if not self.name in self.crawl_depths: self.crawl_depths[self.name] = 0
        self.crawl_depths[self.name] += 1
        # print(f'{self.name}: {self.crawl_depths[self.name]}')
    
    def get_crawl_depth(self) -> int:
        """Return the depth a given spider has crawled."""
        if not self.name in self.crawl_depths: self.crawl_depths[self.name] = 0
        return self.crawl_depths[self.name]
    
    def reset_crawl_depth(self):
        """Reset a given spider's accrued crawl depth to 0."""
        self.crawl_depths[self.name] = 0

class BroadCrawler2(scrapy.Spider):
    """Broad crawling spider."""

    start_urls = ['https://www.nih.gov/news-events/news-releases']
    crawled_urls = set()
    exceptions = []
    name = 'broad_crawler_2'
    broad_crawler_2_monitor = BroadCrawlerMonitor(name)
    max_crawl_depth = 200

    def parse(self, response):
        """Follow links."""
        try:
            urls = response.css('a::attr(href)').getall()

            while self.broad_crawler_2_monitor.get_crawl_depth() <= self.max_crawl_depth:
                url = urls[len(urls)//2]
                print('curr crawl depth', self.broad_crawler_2_monitor.get_crawl_depth())

                all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
                match_list = re.findall(self.query_regex, all_text)
                match_str = ''.join(match_list)

                if match_str and response.request.url not in self.crawled_urls:
                    self.crawled_urls.add(response.request.url)
                    trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                    yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }

                yield response.follow(url, callback=self.parse)
                self.broad_crawler_2_monitor.increment_crawl_depth()
            print(self.crawled_urls)
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')

# class BroadCrawler2(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_2'
#     exceptions = []
#     start_urls = ['https://www.nih.gov/news-events/news-releases']

#     def halt(self, broad_crawler_2_monitor):
#         """Stop crawling."""
#         print('should stop NOW ----------->')
#         # broad_crawler_2_monitor.reset_crawl_depth()
#         raise CloseSpider('Crawl depth reached.')

#     def parse(self, response):
#         """Follow links."""
#         try:
#             broad_crawler_2_monitor = BroadCrawlerMonitor(self.name)
#             crawl_depth = broad_crawler_2_monitor.increment_and_get_crawl_depth()
#             if crawl_depth >= 50: self.halt(broad_crawler_2_monitor)

#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)

#             if match_str:
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
#             yield from response.follow_all(css='a::attr(href)', callback=self.parse)
#         except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')


# class BroadCrawler4(scrapy.Spider):o
#     """Broad crawling spider."""

#     name = 'broad_crawler_4'
#     start_urls = ['https://www.bbc.com/news']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)
#             if match_str:
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
#         except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)


# class BroadCrawler5(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_5'
#     start_urls = ['https://espn.com/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)
#             if match_str:
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
#         except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)


# class BroadCrawler6(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_6'
#     start_urls = ['https://ign.com/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)
#             if match_str:
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
#         except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)


# class BroadCrawler7(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_7'
#     start_urls = ['https://www.imdb.com/feature/genre/']

#     def parse(self, response):
#         """Follow links."""
#         try:
#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)
#             if match_str:
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 yield { 'url': response.request.url, 'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
#         except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
#         yield from response.follow_all(css='a::attr(href)', callback=self.parse)