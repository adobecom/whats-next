import { main } from '../../scripts/crawler/main.js';

export default function init(block) {
    const crawlerDiv = document.createElement('div');
    crawlerDiv.innerHTML = `
    <form>
        <label for="url">Enter a URL:</label>
        <input type="text" id="url" name="url" placeholder="URL">
        <input type="submit">
    </form>
    `;
    block.appendChild(crawlerDiv);
    crawlerDiv.querySelector('form').addEventListener('submit', async (web) => {
        web.preventDefault();
        const url = web.target.url.value;
        main(url);
    });    
}