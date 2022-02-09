"""Theraphosidae Spiders.

Categories:
+ Encyclopedic (text)
+ Videographic (video)
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
        """Process search results.
        
        First result and last two results are omitted on this scrape.
        Furthermore, results were forms so the link had to be parsed from
        the `action` attribute as opposed to the `href`.
        """
        forms = response.css('form::attr(action)')
        print('hitting forms', type(forms))
        i, res_length = 1, len(forms)
        while i < (res_length - 2): 
            yield { 'url': forms[i].get(), 'text': forms[i].get() }
            i += 1