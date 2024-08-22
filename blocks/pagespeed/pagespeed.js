import { div, button, label, h3, p, a } from '../../scripts/dom-helpers.js';

export class inputObj {
    constructor(Company_Name, Crawled_URL) {
        this.Company_Name = Company_Name;
        this.Crawled_URL = Crawled_URL;
    }
}

async function lhsrun(site, customer) {
    const terms = [".json", "?", "granite/core", "404.html", "healthcheck", "jpg", "css", "svg", "*"];
    const result1 = terms.some(term => site.includes(term));
    if (result1) { console.log(customer + "#" + site + "#" + "We need a different URL"); }
    else {
        const conditions = ["Unable to process request"];
        const urlMobile = setUpQueryMobile(site);
        const urlDesktop = setUpQueryDesktop(site);
        const responseMobile = await fetchURL(urlMobile);
        const responseDesktop = await fetchURL(urlDesktop);
        (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : console.log(customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : console.log(customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100) + "%") + "#" + (Math.round(responseDesktop.lighthouseResult.categories.performance.score * 100) + "%"));
        // (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : console.log(customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : console.log(customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100) + "%"));
    }
}

async function fetchURL(url) {
    const resp = await fetch(url);
    const response = await resp.json();
    return response;
 }

 function setUpQueryMobile(site) {
    const YOUR_API_KEY = "AIzaSyCwZkCTnraHXOjnCWuq2oxXJOE-ll1hzuI";
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    if (!site.startsWith('http')){ site = "https://" + site; }
    const parameters = {
        url: encodeURIComponent(site)
    };
    let query = `${api}?`;
    for (let key in parameters) {
        query += `${key}=${parameters[key]}`;
    }
    // Add API key at the end of the query
    query += "&strategy=mobile";
    query += `&key=${YOUR_API_KEY}`;
    return query;
}

function setUpQueryDesktop(site) {
    const YOUR_API_KEY = "AIzaSyCwZkCTnraHXOjnCWuq2oxXJOE-ll1hzuI";
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    if (!site.startsWith('http')){ site = "https://" + site; }
    const parameters = {
        url: encodeURIComponent(site)
    };
    let query = `${api}?`;
    for (let key in parameters) {
        query += `${key}=${parameters[key]}`;
    }
    // Add API key at the end of the query
    query += `&key=${YOUR_API_KEY}`;
    return query;
}

async function mainfunction() {
    for (let i = 0; i <= (raw_data.length-1); i++) {
        if ((!raw_data[i].Company_Name) && (!raw_data[i].Crawled_URL)) { console.log("\n"); continue; }
        (raw_data[i].Crawled_URL) ? await lhsrun(raw_data[i].Crawled_URL,raw_data[i].Company_Name) : console.log(raw_data[i].Company_Name+"##No Crawled_URL");
    }
}

let raw_data = [];
let inputObject;

export default async function init(block) {
  const pageSpeedDiv = div();
  pageSpeedDiv.innerHTML = `
    <form>
        <input type="submit" value="Analyse">
    </form>
    `;
    block.appendChild(pageSpeedDiv);

    //Preparing for array of Objects to be fed for LHS tracking
    pageSpeedDiv.querySelector('form').addEventListener('submit', async (web) => {
        web.preventDefault();
        window.placeholders = window.placeholders || {};
        const TRANSLATION_KEY = 'crawlerreport';
        await window.placeholders;
        console.log(window.placeholders[TRANSLATION_KEY]);
        window.placeholders[TRANSLATION_KEY].forEach((element) => {
            element.forEach((url, index) => {
                if (index === 0) {
                    const urlPattern = /^http/;
                    if (!urlPattern.test(url)) {
                        url = 'https://' + url;
                    }
                    inputObject = new inputObj('AMS', url);
                }
            });
            raw_data.push(inputObject);
        });
        console.log(raw_data);

        //LHS Tracking
        mainfunction();
    });
}