import { div, button, label, h3, p, a } from '../../scripts/dom-helpers.js';

export class inputObj {
    constructor(Company_Name, Crawled_URL) {
        this.Company_Name = Company_Name;
        this.Crawled_URL = Crawled_URL;
    }
}

  // Dot Section
  const dotsection = div({ class: 'dotsectionclass' });
  const firstdot = div({ class: 'dot' });
  const seconddot = div({ class: 'dot' });
  const thirddot = div({ class: 'dot' });
  dotsection.appendChild(firstdot);
  dotsection.appendChild(seconddot);
  dotsection.appendChild(thirddot);

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
        // (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : console.log(customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : console.log(customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100) + "%") + "#" + (Math.round(responseDesktop.lighthouseResult.categories.performance.score * 100) + "%"));
        const result = (responseMobile.error) ? ((conditions.some(el => responseMobile.error.message.includes(el))) ? lhsrun(site, customer) : (customer + "#" + site + "#" + " LHS is erroring with " + responseMobile.error.message)) : (customer + "#" + site + "#" + (Math.round(responseMobile.lighthouseResult.categories.performance.score * 100)) + "#" + (Math.round(responseDesktop.lighthouseResult.categories.performance.score * 100)));
        return result;
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

async function displayLHS(data, block){
    console.log(data.Crawled_URL);
    const lhsDiv = div({ class: 'lhsDiv'}, label({ class: 'lhs-label' }, h3(a({ href: `${data.Crawled_URL}`, target: '_blank' }, `${data.Crawled_URL}`))), div({ class: 'lhsDivParent'},dotsection));
    block.appendChild(lhsDiv);
    const result = await lhsrun(data.Crawled_URL,data.Company_Name);
    const targetURL = result.split("#")[1];
    const mobileScore = result.split("#")[2];
    const desktopScore = result.split("#")[3];

    // const lhsDiv = div({ class: 'lhsDivMain'}, label({ class: 'lhs-label' }, h3(a({ href: `${targetURL}`, target: '_blank' }, `${targetURL}`))), div({ class: 'lhsDivRight'},div({ class: 'lhs-mobile' }, `${mobileScore}`), div({ class: 'lhs-desktop' }, `${desktopScore}`)));
    const toBeReplacedDiv = div({ class: 'lhsDivChild'}, div({ class: 'lhs-mobile' }, `${mobileScore}`), div({ class: 'lhs-desktop' }, `${desktopScore}`));
    lhsDiv.querySelector('.lhsDivParent').replaceChildren(toBeReplacedDiv);
    block.appendChild(lhsDiv);
}

async function mainfunction(block) {
    for (let i = 0; i <= (raw_data.length-1); i++) {
        if ((!raw_data[i].Company_Name) && (!raw_data[i].Crawled_URL)) { console.log("\n"); continue; }
        (raw_data[i].Crawled_URL) ? await displayLHS(raw_data[i], block) : console.log(raw_data[i].Company_Name+"##No Crawled_URL");
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
        // console.log(window.placeholders[TRANSLATION_KEY]);
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

        //LHS Tracking
        mainfunction(block);
    });
}