import { main } from '../../scripts/crawler/main.js';
import { div } from '../../scripts/dom-helpers.js';

export default function init(block) {
    const crawlerDiv = document.createElement('div');
    crawlerDiv.innerHTML = `
    <form>
        <label for="url">Enter a URL:</label>
        <input type="text" id="url" name="url" placeholder="URL">
        <input type="submit">
    </form>
    `;

    const dotsection = div({ class: 'dotsectionclass' });
    const firstdot = div({ class: 'dot' });
    const seconddot = div({ class: 'dot' });
    const thirddot = div({ class: 'dot' });
    dotsection.appendChild(firstdot);
    dotsection.appendChild(seconddot);
    dotsection.appendChild(thirddot);
    // crawlerDiv.appendChild(dotsection);
    console.log(dotsection.parentNode)
    block.appendChild(crawlerDiv);

    crawlerDiv.querySelector('form').addEventListener('submit', async (web) => {
        web.preventDefault();
        const url = web.target.url.value;
        crawlerDiv.parentNode.replaceChildren(dotsection);
        await main(url);
    });    
}