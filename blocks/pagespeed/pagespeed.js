import { div, button, label, h3, p, a } from '../../scripts/dom-helpers.js';

export default async function init(block) {
  const pageSpeedDiv = div();
  pageSpeedDiv.innerHTML = `
    <form>
        <input type="submit" value="Analyse">
    </form>
    `;
    block.appendChild(pageSpeedDiv);


    // window.placeholders = window.placeholders || {};
    // const TRANSLATION_KEY = 'crawlerreport';
  
    // await window.placeholders;
    // console.log(window.placeholders[TRANSLATION_KEY]);
}