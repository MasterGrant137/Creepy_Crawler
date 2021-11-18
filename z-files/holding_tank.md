+ scraping local newspaper
    ```py

    # caerostris-darwini
    # pip install Requests
    # pip install Scrapy

    class DesertSun:
        """Desert Sun Scraper."""
        smart_urls = ['https://www.desertsun.com/story/tech/science/energy/2021/02/26/california-technically-and-commercially-feasible-extract-lithium-brine-geothermal-plants-already-pul/6839875002/']

        def parse(self, response):
            """Grab and format the content."""
            for p in response.css('div.qnt_ar_b_p'):
                yield {
                    'text': p.css()
                }
    ```
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

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // dispatch
        setLoaded(true);
    }, [dispatch]);

    //Component closing...

    if (!loaded) {
       return (<img
            src={loadingSpider}
            style={{
               height: '100vh',
               left: '0',
               padding: '0',
               position: 'absolute',
               top: '0',
               width: '100vw',
            }} />);
    }

    // return Component (if loaded)
    ```

+ for accessing data about client history
    ```js
    const performanceEntries = performance.getEntriesByType('navigation');

    performanceEntries.forEach((entry) => console.log(entry));
    ```