import { mainSitemap, mainCrawler } from '../../scripts/crawler/main.js';
import { div, button, label, h2 } from '../../scripts/dom-helpers.js';
import { returnbrokenLinksURLs } from '../../scripts/crawler/crawl.js';
import { printBrokenLinks } from '../../scripts/crawler/report.js';


//Create a scriopt element and append it to the head
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js';
document.head.appendChild(script);

let crawlStatus = {
  crawled: 0,
  rows: [],
  urls: [],
};

let targetUrl = '';

export default function init(block) {
  console.log(block);
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

    //Download Report Button for Broken Links
    const downloadSectionBL = div({ class: 'crawl-downloadCrawlReport' });
    const crawlerLabelBL = label({ class: 'crawl-crawlerLabel' });
    const downloadReportBL = button('Download Crawl Report');
    downloadSectionBL.appendChild(crawlerLabelBL);
    downloadSectionBL.appendChild(downloadReportBL);

    //Broken Links Div
    const brokenLinksMainDiv = div({ class: 'brokenLinksMainDiv' });

  console.log(dotsection.parentNode)
  block.appendChild(crawlerDiv);

  crawlerDiv.querySelector('form').addEventListener('submit', async (web) => {

    web.preventDefault();
    const url = web.target.url.value;
    targetUrl = url;
    // crawlerDiv.parentNode.replaceChildren(dotsection);
    if (block.classList.contains('sitemap')) {
      crawlerDiv.parentNode.replaceChildren(dotsection);
      crawlStatus.rows = [];
      crawlStatus.urls = await mainSitemap(url);
      crawlStatus.urls.forEach((url, index) => {
        const row = {
          url,
        };
        crawlStatus.rows.push(row);
      });
      console.log(crawlStatus.urls);
      crawlerLabel.innerHTML = `${crawlStatus.urls.length} URLs detected`;
      dotsection.parentNode.replaceChildren(downloadSection);
    } else if (block.classList.contains('google')) {
      crawlerDiv.parentNode.replaceChildren(dotsection);
      crawlStatus.rows = [];
      crawlStatus.urls = await mainCrawler(url);
      crawlStatus.urls.forEach((url, index) => {
        const row = {
          url,
        };
        crawlStatus.rows.push(row);
      });
      console.log(crawlStatus.urls);
      crawlerLabel.innerHTML = `${crawlStatus.urls.length} URLs detected`;
      dotsection.parentNode.replaceChildren(downloadSection);
    } else if (block.classList.contains('broken-links')) {
      crawlStatus.rows = [];
      crawlStatus.urls = returnbrokenLinksURLs();
      let allBrokenURLs = printBrokenLinks(crawlStatus.urls);
      allBrokenURLs.forEach((url, index) => {
        let parentURL = url.split('#')[0];
        let actualURL = url.split('#')[1];
        let statusCode = url.split('#')[2];
        console.log(parentURL, actualURL, statusCode);

        //Broken Links Div
        const brokenLinksDiv = div({ class: 'brokenLinksDiv' }, label({ class: 'parent-url' }, h2(`Parent URL: ${parentURL}`)), label({ class: 'actual-url' }, h2(`URL: ${actualURL}`)), label({ class: 'status-code' }, h2(`Status Code: ${statusCode}`)));
        brokenLinksMainDiv.appendChild(brokenLinksDiv);
      });
      crawlStatus.urls.forEach((url, index) => {
        const row = {
          url,
        };
        crawlStatus.rows.push(row);
      });
      console.log(crawlStatus.urls);
      crawlerLabel.innerHTML = `${crawlStatus.urls.length} URLs detected`;
      crawlerDiv.parentNode.replaceChildren(downloadSectionBL);
      downloadSectionBL.after(brokenLinksMainDiv);
    }
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
        a.setAttribute('download', `${new URL(targetUrl).hostname}_crawler_report.xlsx`);
        a.click();
        downloadSection.parentNode.replaceChildren(crawlerDiv);
    }));

        //Download Report Button click event for Broken Links
        downloadSectionBL.addEventListener('click', (async () => {
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
          a.setAttribute('download', `${new URL(targetUrl).hostname}_crawler_report.xlsx`);
          a.click();
          downloadSectionBL.parentNode.replaceChildren(crawlerDiv);
      }));
}