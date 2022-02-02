# [Creepy_Crawler](https://creepy-crawler-1.herokuapp.com/)
Creepy Crawler is a full-stack search engine application. It's inspired by popular search engine apps. It allows the user to make queries, see their history, and set their theme.
<div align='center'>
  <img height='32' width='32' alt='Python' title='Python' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png' />
  <img height='32' width='32' alt='SQLAlchemy' title='SQLAlchemy' src='https://avatars.githubusercontent.com/u/6043126?s=200&v=4' />
  <img height='32' width='32' alt='Flask' title='Flask' src='https://miro.medium.com/max/438/1*DGk2fpDud4D7goJxTqZ1pQ.png' />
  <img height='32' width='32' alt='JavaScript' title='JavaScript' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png' />
  <img height='32' width='32' alt='React' title='React' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png' />
  <img height='32' width='32' alt='Redux' title='Redux' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/redux/redux.png' />
  <img height='32' width='32' alt='Scrapy' title='Scrapy' src='https://github.com/scrapy/scrapy/blob/master/artwork/scrapy-logo.jpg?raw=true' />
  <img height='32' width='32' alt='HTML' title='HTML' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png' />
  <img height='32' width='32' alt='CSS' title='CSS' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png' />
  <img height='32' width='32' alt='AWS' title='AWS' src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/aws/aws.png' />
</div>

### Crawl the web 🕷
![search](https://github.com/MasterGrant137/Creepy_Crawler/blob/main/z-files/images/readme_images/readme_2_images/search.gif)
+ Queries from the frontend are received asynchronously by Flask with help from the Crochet library where they are processed and passed to the Scrapy spiders.
  ```py
  import crochet
  crochet.setup()
  @crochet.wait_for(timeout=200.0)
  def scrape_with_crochet(raw_query):
    partitioned_query = ...
    query_regex = re.compile(...)
    dispatcher.connect(_crawler_result, signal=signals.item_scraped)
    spiders = [...]
    if len(partitioned_query):
        for spider in spiders: crawl_runner.crawl(spider, query_regex=query_regex)
        eventual = crawl_runner.join()
        return
  ```
+ Settings are passed from Flask backend to Scrapy framework through configuration object.
  ```py
  ...
  from scrapy.utils.project import get_project_settings
  ...
  settings = get_project_settings()
  settings_dict = json.load(open('app/api/routes/settings.json'))
  settings.update(settings_dict)
  crawl_runner = CrawlerRunner(settings)
  ```
+ Each spider runs a broad crawl through the web, starting from a seed URL.
  ```py
  class BroadCrawler2(scrapy.Spider):
    """Broad crawling spider."""

    name = 'broad_crawler_2'
    start_urls = ['https://example.com/']

    def parse(self, response):
        """Follow links."""
        try:
            all_text = response.css('*:not(script):not(style)::text')
            for text in all_text:
                query_found = bool(re.search(self.query_regex, text.get()))
                if query_found: yield { 'url': response.request.url, 'text': text.get() }
                
        except: print(f'End of the line error for {self.name}.')

        yield from response.follow_all(css='a::attr(href)', callback=self.parse)
  ```

### Create custom themes 🎨
![custom themes](https://github.com/MasterGrant137/Creepy_Crawler/blob/main/z-files/images/readme_images/readme_2_images/custom-themes.gif)

### Look over your search history 🔍
![history](https://github.com/MasterGrant137/Creepy_Crawler/blob/main/z-files/images/readme_images/readme_2_images//history.gif)
+ The user is able to switch between 24 and 12 hour time. Moreover, NATO timezone abbreviations are specially parsed for users with altered native settings.

### Enjoy advanced interactions with your themes 🧮
![theme interaction](https://github.com/MasterGrant137/Creepy_Crawler/blob/main/z-files/images/readme_images/readme_2_images/theme-interaction.gif)
+ AWS integration allows users to add backgrounds and profile images of their choice.

### Contact
+ [LinkedIn](https://www.linkedin.com/in/alejandro-c-grant/)

### Errors I encountered and conquered:
+ https://github.com/MasterGrant137/Creepy_Crawler/wiki/Tasty-Bugs
