"""Theraphosidae Spiders.

Categories:
+ Library
"""

import scrapy
from scrapy.http import FormRequest

class DeepCrawler1(scrapy.Spider):
    """Deep crawling spider."""

    name = 'deep_crawler_1'
    start_urls = ['https://librarytechnology.org/repository/']

    def parse(self, response):
        """Send post request."""
        try:
            data = { 'q': self.raw_query }
            request = FormRequest.from_response(
                                response,
                                method='POST', 
                                formdata=data, 
                                headers={ 'Content-Type': 'application/x-www-form-urlencoded' },
                                callback=self.process_search
                            )
            yield request
        except: print(f'End of the line error for {self.name}.')
    def process_search(self, response):
        """Process search results."""
        all_results = response.css('input::attr(value)')
        print('DISCOVERED', len(all_results), all_results)
        # for text in all_text:
        #     query_found = bool(re.search(self.query_regex, text.get()))
        #     if query_found: yield { 'url': response.request.url, 'text': text.get() }
        yield { 'url': response.request.url, 'text': f'Deep search results: {len(all_results)}' }