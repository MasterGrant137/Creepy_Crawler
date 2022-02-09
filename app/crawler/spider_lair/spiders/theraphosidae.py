"""Theraphosidae Spiders.

Categories:
+ Encyclopedic (text)
+ Videographic (video)
"""

import scrapy
from scrapy.http import FormRequest

class DeepCrawler1(scrapy.Spider):
    """Deep crawling spider."""
    print('we are in business')
    name = 'deep_crawler_1'
    start_urls = ['https://librarytechnology.org/repository/']

    def parse(self, response):
        """Send post request."""
        try:
            print('hitting parse', self.raw_query)
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
        print('hitting forms', len(forms))
        i, res_length = 0, len(forms)
        while 1 < i < (res_length - 2): 
            yield { 'url': response.request.url, 'text': forms[i].get() }
            i += 1