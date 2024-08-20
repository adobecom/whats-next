// const {crawlPage, returnbrokenLinksURLs} = require('./crawl.js');
// const {loadURLsFromRobots} = require('./sitemap.js');
// const { printReport, printBrokenLinks } = require('./report.js');

import { crawlPage, returnbrokenLinksURLs } from './crawl.js';
import { loadURLsFromRobots } from './sitemap.js';
import { printReport, printBrokenLinks } from './report.js';

const crawlStatus = {
    crawled: 0,
    rows: [],
    urls: [],
  };

export async function mainCrawler(baseURL) {
    console.log(`Crawling ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, baseURL, {});
    printReport(pages);
    const brokenLinks = returnbrokenLinksURLs();
    printBrokenLinks(brokenLinks);
}



export async function mainSitemap(url) {
    var resp = null;
    var newBaseURL = null;

    const baseURL = url;

    // await mainCrawler(baseURL);

    //check for robots.txt / sitemap.txt
    try {
        if (baseURL.slice(-1) === '/') {
            if (!baseURL.includes('//www')) {
                newBaseURL = baseURL.slice(0, -1).replace('//', '//www.');
            }
            else {
                newBaseURL = baseURL.slice(0, -1);
            }
          }
          else {
            if (!baseURL.includes('//www')) {
                newBaseURL = baseURL.replace('//', '//www.');
            }
            else {
                newBaseURL = baseURL
            }
          }
        const robotsURL = new URL('/robots.txt', newBaseURL);
        console.log(robotsURL);
        resp = await fetch(robotsURL);
    } catch (err) {
        console.log(`Error fetching ${newBaseURL}/robots.txt: ${err.message}`);
    }
    if (resp.status === 200) {
        console.log(`Found robots.txt for ${baseURL}, hence getting URL's from Sitemap`);
        crawlStatus.urls = await loadURLsFromRobots(newBaseURL, newBaseURL);
        if (crawlStatus.urls.length === 0) {
            console.log("Issue accessing sitemap, hence crawling the base URL");
            await mainCrawler(baseURL);
        }
        return crawlStatus.urls;
    } else {
        await mainCrawler(baseURL);
    }

}