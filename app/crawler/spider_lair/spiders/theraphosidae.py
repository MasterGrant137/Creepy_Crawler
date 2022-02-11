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
            for i in range(len(self.query_list)):
                query = self.query_list[i]
                data = { 'q': query }
                request = FormRequest.from_response(
                                    response,
                                    method='POST', 
                                    formdata=data, 
                                    headers={ 'Content-Type': 'application/x-www-form-urlencoded' },
                                    meta={ 'query': query },
                                    callback=self.process_search
                                )
                yield request
        except: print(f'End of the line error in parse method for {self.name}.')

    def process_search(self, response):
        """Process search results.
        
        Grab all the inputs and their parents then
        construct link from parsed data.
        """
        try:
            query = response.meta['query']
            inputs = response.css('input.SubmitLink')
            resource_indices = inputs.xpath("//input/../../input[@name='RC']/@value").getall()
            for i in range(len(inputs)):
                input = inputs[i]
                base_url = 'https://librarytechnology.org/document/'
                resource_idx = resource_indices[i]
                url = f'{base_url}{resource_idx}'
                text = input.css('::attr(value)').get()
                yield { 'url': url, 'text': f'[Deep Crawl Found: {query}] {text}' }
        except: print(f'End of the line error in process_search method for {self.name}.')


class DeepCrawler2(scrapy.Spider):
    """Deep crawling spider."""

    name = 'deep_crawler_2'

    def start_requests(self):
        """Follow links."""
        try:
            for query in self.query_list: 
                yield scrapy.Request(f'https://www.dictionary.com/browse/{query}', meta={'query': query})

        except: print(f'End of the line error in start_requests method for {self.name}.')
    
    def parse(self, response):
        """Process search results.
        
        Check for definition and if present parse
        the first defnition and title.
        """
        try:
            definition = response.css("h1[data-first-headword='true']")
            if len(definition):
                query = response.meta['query']
                first_definition = response.css("div[value='1']")
                yield { 'url': response.request.url, 'text': f'[Deep Crawl Found: {query}] {first_definition.get()}' }
        except:  print(f'End of the line error in parse method for {self.name}.')