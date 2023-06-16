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

Additional Information:
- The spiders run as long as the settings passed to them allow, particularly:
    - `CLOSESPIDER_TIMEOUT` (after timing out, there's a cool down period as spiders clear their queue)
    - `CLOSESPIDER_PAGECOUNT` (tightly coupled with how long the spiders crawl)
"""

import re
import scrapy

class BroadCrawlerMonitor():
    """Monitor broad crawling spiders."""

    trunc_amt_1 = 160
    trunc_amt_2 = 16

    def __init__(self, name):
        """Initialize BroadCrawlerMonitor."""
        self.name = name

class BroadCrawler1(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_1'
    start_urls = ['https://www.nih.gov/news-events/news-releases']
    crawled_urls = set()

    def parse(self, response):
        """Parse and yield page data."""
        try:
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

            yield from response.follow_all(xpath="//a[starts-with(@href, 'http')]", callback=self.parse)
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


class BroadCrawler2(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_2'
    start_urls = ['https://www.bbc.com/news']
    crawled_urls = set()

    def parse(self, response):
        """Parse and yield page data."""
        try:
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

            yield from response.follow_all(xpath="//a[starts-with(@href, 'http')]", callback=self.parse)
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


class BroadCrawler3(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_3'
    start_urls = ['https://espn.com/']
    crawled_urls = set()

    def parse(self, response):
        """Parse and yield page data."""
        try:
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

            yield from response.follow_all(xpath="//a[starts-with(@href, 'http')]", callback=self.parse)
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


class BroadCrawler4(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_4'
    start_urls = ['https://ign.com/']
    crawled_urls = set()

    def parse(self, response):
        """Parse and yield page data."""
        try:
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

            yield from response.follow_all(xpath="//a[starts-with(@href, 'http')]", callback=self.parse)
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')


class BroadCrawler5(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_5'
    start_urls = ['https://www.imdb.com/feature/genre/']
    crawled_urls = set()

    def parse(self, response):
        """Parse and yield page data."""
        try:
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

            yield from response.follow_all(xpath="//a[starts-with(@href, 'http')]", callback=self.parse)
        except Exception as e: print(f'Affected spider: {self.name}. Error: {e}.')
