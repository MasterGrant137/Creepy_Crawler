"""Caerostris Darwini Spiders.

Categories:
    + Commentarial (image/text)
    + Commercial (image)
    + Encyclopedic (text)
    + Videographic (video)
"""

import scrapy

# targ_text = 'NFL'

# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']

#     def parse(self, response):
#         for link in response.css('a::attr(href)'):
#             yield {
#                 'link': targ_text
#             }

targ_text = 'ESPN'

class CDS(scrapy.Spider):
    """Commentarial spider."""
    
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/']

    def parse(self, response):
        for link in response.css('a::attr(href)'):
            yield response.follow(link.get(), callback=self.parse_data)
        
    def parse_data(self, response):
        # all_text = response.css('*::text')
        all_text = response.css('h1::text')
        try:
            for text in all_text:
                # if (targ_text in all_text):
                yield {
                    'url': f'{response.request.url}: {text.get()}',
                }
        except:
            print('End of the line error.')




# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']

#     def parse(self, response):
#         for link in response.css('a::attr(href)'):
#             yield response.follow(link.get(), callback=self.parse_data)
        
#     def parse_data(self, response):
#         # all_text = response.css('*::text')
#         all_text = response.css('h1::text')
#         try:
#             for text in all_text:
#                 # if (targ_text in all_text):
#                 yield {
#                     'url': response.request.url,
#                 }
#         except:
#             print('End of the line error.')






# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']
#     targ_string = 'NFL'

#     def parse(self, response):
#         for div in response.css('div'):
#             try:
#                 if (targ_string in div.css('*::text').get()):
#                     yield {
#                         'targ': div.css('*::text').get()
#                     }
#             except:
#                 pass
        
#         next_url = response.css('a')

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

        # for p in response.css('p::text'):
        #     yield {
        #         'p': p.get()
        #     }

        # for p in response.css('p::text'):
        #     yield {
        #         'p': p.get()
        #     }

# class CDS(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/']

#     def parse(self, response):
#         for link in response.css('a'):
#             yield {
#                 'link': link.attrib['href']
#             }
