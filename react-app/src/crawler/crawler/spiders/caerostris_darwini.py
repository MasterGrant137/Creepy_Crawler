"""Caerostris Darwini Spiders.

Categories:
    + Commentarial (image/text)
    + Commercial (image)
    + Encyclopedic (text)
    + Videographic (video)
"""

import scrapy

class CDS(scrapy.Spider):
    """Commentarial spider."""
    
    name = 'caerostris_darwini_commentarial'
    start_urls = ['https://www.espn.com/']

    def parse(self, response):
        for div in response.css('div'):
            try:
                if (div.css('p::text').get() == 'Terence Crawford'):
                    pass
                yield {
                    'p': div.css('p::text').get(),
                    'span': div.css('span::text').get()
                }
            except:
                pass

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

# class CaerostrisDarwiniSpiderCommentarial(scrapy.Spider):
#     """Commentarial spider."""
    
#     name = 'caerostris_darwini_commentarial'
#     start_urls = ['https://www.espn.com/', 'https://www.bbc.com/', 'https://www.ign.com/']

#     def parse(self, response):
#         for link in response.css('a'):
#             # yield {
#             link.attrib['href'].get()
#             # }


# class CaerostrisDarwiniSpiderCommercial(scrapy.Spider):
#     """Commercial spider."""

#     name = 'caerostris_darwini_commercial'
#     start_urls = ['https://www.walmart.com/', 'https://m.yelp.com/']

#     def parse(self, response):
#         pass


# class CaerostrisDarwiniSpiderEncyclopedic(scrapy.Spider):
#     """Encyclopedic spider."""

#     name = 'caerostris_darwini_encyclopedic'
#     start_urls = ['https://www.dictionary.com/', 'https://www.nih.gov/', 'https://en.m.wikipedia.org/']

#     def parse(self, response):
#         pass


# class CaerostrisDarwiniSpiderVideographic(scrapy.Spider):
#     """Videographic spider."""

#     name = 'caerostris_darwini_videographic'
#     start_urls = ['https://m.imdb.com/', 'https://m.youtube.com/']

#     def parse(self, response):
#         pass
