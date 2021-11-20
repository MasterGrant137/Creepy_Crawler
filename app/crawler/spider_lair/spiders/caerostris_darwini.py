"""Caerostris Darwini Spiders.

Categories:
    + Commentarial (image/text)
    + Commercial (image)
    + Encyclopedic (text)
    + Videographic (video)
"""

import json
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings


with open('app/crawler/query.json', 'r') as query_object:
    query = json.load(query_object)['query']

class CDCommentarial(scrapy.Spider):
    """Commentarial spider."""
    
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/', 'https://www.bbc.com/']

    def parse(self, response):
        yield from response.follow_all(css='a::attr(href)', callback=self.parse_data)
        
    def parse_data(self, response):
        all_text = response.css('*:not(script):not(style)::text')
        try:
            for text in all_text:
                if (query in text.get()):
                    yield {
                        'url': f'{response.request.url}: {text.get()}',
                    }
        except:
            print('End of the line error.')

process = CrawlerProcess(get_project_settings())

process.crawl(CDCommentarial)
process.start()




#* follows and grabs info on traversed links and compares to target text
# query = 'ESPN'

# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']

#     def parse(self, response):
#         for link in response.css('a::attr(href)'):
#             yield response.follow(link.get(), callback=self.parse_data)
        
#     def parse_data(self, response):
#         all_text = response.css('*::text')
#         try:
#             for text in all_text:
#                 if (query in text.get()):
#                     yield {
#                         'url': f'{response.request.url}: {text.get()}',
#                     }
#         except:
#             print('End of the line error.')





#* Matches key word for a given element and displays which element matches that text
# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']

#     def parse(self, response):
#         targ_string = 'consequential conference'
#         for div in response.css('div'):
#             try:
#                 if (targ_string in div.css('a::text').get()):
#                     yield {
#                         'a': div.css('a::text').get()
#                     }

#                 if (targ_string in div.css('p::text').get()):
#                     yield {
#                         'p': div.css('p::text').get()
#                     }

#                 if (targ_string in div.css('span::text').get()):
#                     yield {
#                         'span': div.css('span::text').get()
#                     }
#             except:
#                 pass