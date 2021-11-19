"""Caerostris Darwini Spiders.

Categories:
    + Commentarial (image/text)
    + Commercial (image)
    + Encyclopedic (text)
    + Videographic (video)
"""

import scrapy


class CaerostrisDarwiniSpiderCommentarial(scrapy.Spider):
    """Commentarial spider."""
    
    name = 'caerostris_darwini_commentarial'
    start_urls = ['http://https://www.espn.com/', 'http://https://www.bbc.com/', 'http://https://www.ign.com/']

    def parse(self, response):
        pass


class CaerostrisDarwiniSpiderCommercial(scrapy.Spider):
    """Commercial spider."""

    name = 'caerostris_darwini_commercial'
    start_urls = ['http://https://www.walmart.com/', 'http://https://m.yelp.com/']

    def parse(self, response):
        pass


class CaerostrisDarwiniSpiderEncyclopedic(scrapy.Spider):
    """Encyclopedic spider."""

    name = 'caerostris_darwini_encyclopedic'
    start_urls = ['http://https://www.dictionary.com/', 'http://https://www.nih.gov/', 'http://https://en.m.wikipedia.org/']

    def parse(self, response):
        pass


class CaerostrisDarwiniSpiderVideographic(scrapy.Spider):
    """Videographic spider."""

    name = 'caerostris_darwini_videographic'
    start_urls = ['http://https://m.imdb.com/', 'http://https://m.youtube.com/']

    def parse(self, response):
        pass
