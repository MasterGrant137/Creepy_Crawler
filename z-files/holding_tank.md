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
+ time a program
    ```py
    from timeit import default_timer as timer
    from datetime import timedelta

    def iterateInReverse1(list):
        """Iterate backwards with reversed(list)."""
        start = timer()
        for i in reversed(list): continue
        end = timer()
        print(timedelta(seconds=end-start))
        return

    def iterateInReverse2(list):
        """Iterate backwards with while loop."""
        start = timer()
        i = len(list) - 1
        while i >= 0: i -= 1
        end = timer()
        print(timedelta(seconds=end-start))
        return

    iterateInReverse1([i for i in range(10)])
    iterateInReverse1([i for i in range(100)])
    iterateInReverse1([i for i in range(1000)])
    iterateInReverse1([i for i in range(2000)])
    print('---------next---------')
    iterateInReverse2([i for i in range(10)])
    iterateInReverse2([i for i in range(100)])
    iterateInReverse2([i for i in range(1000)])
    iterateInReverse2([i for i in range(2000)])
    ```