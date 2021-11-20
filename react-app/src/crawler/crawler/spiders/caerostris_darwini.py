"""Caerostris Darwini Spiders.

Categories:
    + Commentarial (image/text)
    + Commercial (image)
    + Encyclopedic (text)
    + Videographic (video)
"""

import scrapy

targ_text = 'San Diego'

class CDS(scrapy.Spider):
    """Commentarial spider."""
    
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/']

    def parse(self, response):
        for link in response.css('a::attr(href)'):
            yield response.follow(link.get(), callback=self.parse_data)
        
    def parse_data(self, response):
        all_text = response.css('*:not(script)::text')
        try:
            for text in all_text:
                if (targ_text in text.get()):
                    yield {
                        'url': f'{response.request.url}: {text.get()}',
                    }
        except:
            print('End of the line error.')








# * follows and grabs info on traversed links and compares to target text
# targ_text = 'ESPN'

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
#                 if (targ_text in text.get()):
#                     yield {
#                         'url': f'{response.request.url}: {text.get()}',
#                     }
#         except:
#             print('End of the line error.')





# * Matches key word for a given element and displays which element matches that text
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