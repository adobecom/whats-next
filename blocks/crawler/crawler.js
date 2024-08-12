import { main } from '../../scripts/crawler/main.js';
import { div, button } from '../../scripts/dom-helpers.js';

let crawledURLs = null;

export default function init(block) {
    const crawlerDiv = document.createElement('div');
    crawlerDiv.innerHTML = `
    <form>
        <label for="url">Enter a URL:</label>
        <input type="text" id="url" name="url" placeholder="URL">
        <input type="submit">
    </form>
    `;

    // Dot Section
    const dotsection = div({ class: 'dotsectionclass' });
    const firstdot = div({ class: 'dot' });
    const seconddot = div({ class: 'dot' });
    const thirddot = div({ class: 'dot' });
    dotsection.appendChild(firstdot);
    dotsection.appendChild(seconddot);
    dotsection.appendChild(thirddot);

    //Download Report Button
    const downloadSection = div({ class: 'crawl-downloadCrawlReport' });
    const downloadReport = button('Download Crawl Report');
    downloadSection.appendChild(downloadReport);

    console.log(dotsection.parentNode)
    block.appendChild(crawlerDiv);

    crawlerDiv.querySelector('form').addEventListener('submit', async (web) => {
        let crawlStatus = {
            crawled: 0,
            rows: [],
            urls: [],
          };
        web.preventDefault();
        const url = web.target.url.value;
        crawlerDiv.parentNode.replaceChildren(dotsection);
        crawlStatus.urls = await main(url);
        crawlStatus.urls.forEach((url, index) => {
            const row = {
                url,
              };
                crawlStatus.rows.push(row);
        });
        console.log(crawlStatus.urls);
        dotsection.parentNode.replaceChildren(downloadSection);
    });    
}