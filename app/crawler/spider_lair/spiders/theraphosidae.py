"""Deep Crawling Spiders.

Categories:
+ Encyclopedic (text)
+ Videographic (video)

Class attributes:
- Attributes are passed from Flask *search_routes.py* as kwargs in the `crawl` method inside the
  `scrape_with_crochet` function.
- They are accessed by keying into the self parameter.
"""

import scrapy
from scrapy.http import FormRequest


class DeepCrawlerMonitor():
    """Monitor and regulate deep crawling spiders."""

    trunc_amt_1 = 160
    trunc_amt_2 = 16
    crawl_depths = {}

    def __init__(self, name):
        """Initialize DeepCrawlerMonitor."""
        self.name = name

    def truncate_string(self, string: str, variant: int) -> str:
        """Truncate a string."""
        if variant == 1: return string if len(string) <= self.trunc_amt_1 else f'{string[0:self.trunc_amt_1]}...'
        elif variant == 2: return string if len(string) <= self.trunc_amt_2 else f'{string[0:self.trunc_amt_2]}...'

class DeepCrawler1(scrapy.Spider):
    """Deep crawling spider."""

    name = 'deep_crawler_1'
    start_urls = ['https://librarytechnology.org/repository/']
    deep_crawler_monitor = DeepCrawlerMonitor(name)

    def parse(self, response):
        """Send `POST` request.
        
        This resource repository best handles one word entries,
        so each word present in the raw query is run as a 
        separate `POST` request.
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
                trunc_text = self.deep_crawler_monitor.truncate_string(text, 1)
                trunc_query = self.deep_crawler_monitor.truncate_string(query, 2)
                yield { 'url': url, 'text': f'[deep crawler found: {trunc_query}] {trunc_text}' }
        except: print(f'End of the line error in process_search method for {self.name}.')


class DeepCrawler2(scrapy.Spider):
    """Deep crawling spider."""

    name = 'deep_crawler_2'
    deep_crawler_monitor = DeepCrawlerMonitor(name)

    def start_requests(self):
        """Construct and follow link for each subquery."""
        try:
            for query in self.query_list: 
                yield scrapy.Request(f'https://www.dictionary.com/browse/{query}', meta={'query': query})
        except: print(f'End of the line error in start_requests method for {self.name}.')
    
    def parse(self, response):
        """Process search results.
        
        Parse the first definition if present. It is a
        space-separated list and is thus joined with
        an empty string.
        """
        try:
            content_present = len(response.css("h1[data-first-headword='true']"))
            if content_present:
                query = response.meta['query']
                text = ''.join(response.css("div[value='1'] *::text").getall())
                trunc_text = self.deep_crawler_monitor.truncate_string(text, 1)
                trunc_query = self.deep_crawler_monitor.truncate_string(query, 2)
                yield { 'url': response.request.url, 'text': f'[deep crawler found: {trunc_query}] {trunc_text}' }
        except:  print(f'End of the line error in parse method for {self.name}.')


class DeepCrawler3(scrapy.Spider):
    """Deep crawling spider."""

    name = 'deep_crawler_3'
    deep_crawler_monitor = DeepCrawlerMonitor(name)

    def start_requests(self):
        """Construct and follow link for each query permutation."""
        try:
            for query in self.query_perms:
                yield scrapy.Request(f'https://en.wikipedia.org/wiki/{query}', meta={'query': query})
        except: print(f'End of the line error in start_requests method for {self.name}.')
    
    def parse(self, response):
        """Process search results."""
        try:
            query = response.meta['query']
            text = ''.join(response.css('p::text').getall())
            trunc_text = self.deep_crawler_monitor.truncate_string(text, 1)
            trunc_query = self.deep_crawler_monitor.truncate_string(query, 2)
            yield { 'url': response.request.url, 'text': f'[deep crawler found: {trunc_query}] {trunc_text}' }
        except:  print(f'End of the line error in parse method for {self.name}.')