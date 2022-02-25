+ random password generator
    ```py
    from faker import Faker
    import random
    import string

    password_characters = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

    password=''.join(random.choice(password_characters) for i in range(15))
    ```
+ loading screen
    ```js
    import loadingSpider from '../images/loading_spider.gif';

    // Component opening...

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // dispatch
        setLoading(false);
    }, [dispatch]);

    //Component closing...

    if (loading) {
        return (<FontAwesomeIcon
            alt='Spinning Loading Compass'
            title='Spinning Loading Compass'
            icon='compass'
            spin
            style={{
                background: 'none',
                boxShadow: 'none',
                height: '50vh',
                left: '25vw',
                outline: 'none',
                position: 'absolute',
                top: '25vh',
                width: '50vw',
            }}
        />);
    }

    // return Component (if loaded)
    ```
+ get stats when spider closes
    ```py
    class CDBroadCrawler1(scrapy.Spider):
        ...
        @classmethod
        def from_crawler(cls, crawler, *args, **kwargs):
            """Catch spider signals for later use."""
            spider = super(CDBroadCrawler1, cls).from_crawler(crawler, *args, **kwargs)
            crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
            return spider

        def spider_closed(self, spider):
            """Convey spider signal information."""
            print(self.crawler.stats.get_stats())
        ...
    ```
