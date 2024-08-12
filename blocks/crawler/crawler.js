import { main } from '../../scripts/crawler/main.js';
import { div, button, label } from '../../scripts/dom-helpers.js';

//Create a scriopt element and append it to the head
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js';
document.head.appendChild(script);

let crawlStatus = {
  crawled: 0,
  rows: [],
  urls: [],
};

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
    const crawlerLabel = label({ class: 'crawl-crawlerLabel' });
    const downloadReport = button('Download Crawl Report');
    downloadSection.appendChild(crawlerLabel);
    downloadSection.appendChild(downloadReport);

    console.log(dotsection.parentNode)
    block.appendChild(crawlerDiv);

    crawlerDiv.querySelector('form').addEventListener('submit', async (web) => {
        
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
        crawlerLabel.innerHTML = `${crawlStatus.urls.length} URLs detected`;
        dotsection.parentNode.replaceChildren(downloadSection);
    });   
    
    //Download Report Button click event
    downloadSection.addEventListener('click', (async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
    
        let headers = ['URL'];
    
        worksheet.addRows([
          headers,
        ].concat(crawlStatus.rows.map(({
          // eslint-disable-next-line max-len
          url,
          status,
          redirect,
          nbLinks,
          nbLinksAlreadyProcessed,
          nbLinksExternalHost,
          nbLinksToFollow,
          linksToFollow,
          nbLinksExcluded,
          linksExcluded,
        }) => {
          return [url];
        })));
        const buffer = await workbook.xlsx.writeBuffer();
        const a = document.createElement('a');
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', 'crawl_report.xlsx');
        a.click();
        downloadSection.parentNode.replaceChildren(crawlerDiv);
    }));
}