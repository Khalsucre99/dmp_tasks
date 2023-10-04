// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

const targetURL = {
    url: 'https://www.dmpublishing.cz/en/references?p.Page=1',
    userData: {
        label: 'start',
    },
}

const startUrls = [targetURL];

const crawler = new PlaywrightCrawler({
    headless: false,
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
});

await crawler.run(startUrls);
