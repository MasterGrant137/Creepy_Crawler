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
        """Send `POST` request.
        
        This resource repository handles one word entries, so
        each word present in the raw query is run as a separate
        `POST` request.
        """
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
        except: print(f'End of the line error in parse method for {self.name}.')

    def process_search(self, response):
        """Process search results."""
        try:
            inputs = response.css('input.SubmitLink')
            resource_indices = inputs.xpath("//input/../../input[@name='RC']/@value").getall()
            for i in range(len(inputs)):
                input = inputs[i]
                base_url = 'https://librarytechnology.org/document/'
                resource_idx = resource_indices[i]
                url = f'{base_url}{resource_idx}'
                text = input.css('::attr(value)').get()
                yield { 'url': url, 'text': text }
        except: print(f'End of the line error in process_search method for {self.name}.')