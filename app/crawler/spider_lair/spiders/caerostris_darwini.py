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


class BroadCrawler2(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_2'
    start_urls = ['https://www.nih.gov/news-events/news-releases']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
            match_list = re.findall(self.query_regex, all_text)
            match_str = ''.join(match_list)
            if match_str:
                trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                yield { 'url': response.request.url, 'text': f"[Broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
        yield from response.follow_all(css='a::attr(href)', callback=self.parse)


class BroadCrawler4(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_4'
    start_urls = ['https://www.bbc.com/news']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
            match_list = re.findall(self.query_regex, all_text)
            match_str = ''.join(match_list)
            if match_str:
                trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                yield { 'url': response.request.url, 'text': f"[Broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
        yield from response.follow_all(css='a::attr(href)', callback=self.parse)


class BroadCrawler5(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_5'
    start_urls = ['https://espn.com/']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
            match_list = re.findall(self.query_regex, all_text)
            match_str = ''.join(match_list)
            if match_str:
                trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                yield { 'url': response.request.url, 'text': f"[Broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
        yield from response.follow_all(css='a::attr(href)', callback=self.parse)


class BroadCrawler6(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_6'
    start_urls = ['https://ign.com/']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
            match_list = re.findall(self.query_regex, all_text)
            match_str = ''.join(match_list)
            if match_str:
                trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                yield { 'url': response.request.url, 'text': f"[Broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
        yield from response.follow_all(css='a::attr(href)', callback=self.parse)


class BroadCrawler7(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_7'
    start_urls = ['https://www.imdb.com/feature/genre/']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = ''.join(response.css('*:not(script):not(style)::text').getall())
            match_list = re.findall(self.query_regex, all_text)
            match_str = ''.join(match_list)
            if match_str:
                trunc_match_str = match_str if len(match_str) <= self.trunc_amt_1 else f'{match_str[0:self.trunc_amt_1]}...'
                yield { 'url': response.request.url, 'text': f"[Broad crawler found {len(match_list)} {'matches' if len(match_list) > 1 else 'match'}] {trunc_match_str}" }
        except Exception as e: print(f'Affected Spider: {self.name}. Error: {e}.')
        yield from response.follow_all(css='a::attr(href)', callback=self.parse)