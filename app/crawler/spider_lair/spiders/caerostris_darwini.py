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
"""

import re
import scrapy

class BroadCrawlerMonitor():
    """Monitor and regulate broad crawling spiders."""

    trunc_amt_1 = 160
    trunc_amt_2 = 16
    crawl_depths = {}

    def __init__(self, name):
        """Initialize BroadCrawlerMonitor."""
        self.name = name
    
    def increment_crawl_depth(self):
        """Increment the depth a given spider has crawled."""
        if not self.name in self.crawl_depths: self.crawl_depths[self.name] = 0
        self.crawl_depths[self.name] += 1
    
    def get_crawl_depth(self) -> int:
        """Return the depth a given spider has crawled."""
        if not self.name in self.crawl_depths: self.crawl_depths[self.name] = 0
        return self.crawl_depths[self.name]
    
    def reset_crawl_depth(self):
        """Reset a given spider's accrued crawl depth to 0."""
        self.crawl_depths[self.name] = 0

class BroadCrawler1(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_1'
    start_urls = ['https://www.nih.gov/news-events/news-releases']
    crawled_urls = set()
    broad_crawler_monitor = BroadCrawlerMonitor(name)
    max_crawl_depth = 3

    def parse(self, response):
        """Parse and yield page data."""
        try:
            if self.broad_crawler_monitor.get_crawl_depth() <= self.max_crawl_depth:
                print(self.broad_crawler_monitor.get_crawl_depth())
                text_list = response.css('*:not(script):not(style)::text').getall()
                match_count, unique_matches, unique_matches_string = 0, set(), ''

                for text_item in text_list:
                    match = re.search(self.query_regex, text_item)
                    add_to_matches_string = len(unique_matches_string) <= self.broad_crawler_monitor.trunc_amt_1
                    if match: match_count += 1
                    if match and add_to_matches_string and match.group(0) not in unique_matches:
                        unique_matches.add(match.group(0))
                        unique_matches_string += match.group(0)

                if match_count and response.request.url not in self.crawled_urls:
                    self.crawled_urls.add(response.request.url)
                    match_count_display_text = f"[broad crawler found {match_count} {'matches' if match_count > 1 else 'match'}]"
                    yield { 
                        'url': response.request.url, 
                        'text': f"{match_count_display_text} {unique_matches_string}" 
                    }

                yield from response.follow_all(xpath="//a[contains(@href, 'http')]", callback=self.parse)
                self.broad_crawler_monitor.increment_crawl_depth()
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


# class BroadCrawler1(scrapy.Spider):
#     """Broad crawling spider."""

#     name = 'broad_crawler_1'
#     start_urls = ['https://www.nih.gov/news-events/news-releases']
#     crawled_urls = set()
#     broad_crawler_monitor = BroadCrawlerMonitor(name)
#     max_crawl_depth = 3
#     accrued_data = []

#     def parse(self, response):
#         """Parse and yield page data."""
#         try:
#             print(self.broad_crawler_monitor.get_crawl_depth())
#             if self.broad_crawler_monitor.get_crawl_depth() >= self.max_crawl_depth:
#                 return self.accrued_data

#             all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
#             match_list = re.findall(self.query_regex, all_text)
#             match_str = ''.join(match_list)

#             if match_str and response.request.url not in self.crawled_urls:
#                 self.crawled_urls.add(response.request.url)
#                 trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
#                 self.accrued_data.append({ 
#                     'url': response.request.url, 
#                     'text': f"[broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" 
#                 })

#             self.broad_crawler_monitor.increment_crawl_depth()
#             return response.follow_all(css='a::attr(href)', callback=self.parse)

#         except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


    # def parse_further(self, response):
    #     """Follow and yield additional links."""
            # if self.broad_crawler_monitor.get_crawl_depth() <= self.max_crawl_depth:
    #     try:
    #         # print(self.broad_crawler_monitor.get_crawl_depth())
            #     hrefs = response.css('a::attr(href)')
            # while self.broad_crawler_monitor.get_crawl_depth() <= self.max_crawl_depth:
            #     href = hrefs[len(hrefs)//2]
            #     yield response.follow(href, callback=self.parse)
            #     self.broad_crawler_monitor.increment_crawl_depth()
    #     except Exception as e:
    #         print(f'Second section. Affected spider: {self.name}. Error: {e}.')
        # try:
        #     hrefs = response.css('a::attr(href)')
        #     for href in hrefs:
        #         print('========= HIT =========')
        #         yield response.follow(href, callback=self.parse)
        # except Exception as e:
        #      print(f'Second section. Affected spider: {self.name}. Error: {e}.')
        # IMPLEMENT A NEW STRATEGY WHERE YOU CALL THIS BLOCK OF CODE IN THE FIRST YIELD, HOPEFULLY THAT SOLVES
        # THE ISSUE OF THE SEARCH ENGINE YIELDING OLD DATA WHEN ONE OSCILLATES BETWEEN a query that will yield no results and a query that will yield results


# class BroadCrawler4(scrapy.Spider):
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