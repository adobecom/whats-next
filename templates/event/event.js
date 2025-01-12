// eslint-disable-next-line no-unused-vars,no-empty-function

import { getMetadata } from '../../scripts/aem.js';

export default async function init(document) {
    document.querySelector('header').remove();
    document.querySelector('footer').remove();
    document.body.classList.add('event');

  const titleText = getMetadata('featuredtitle');
  document.querySelector('.title').innerHTML = `<h2>${titleText}</h2>`;

  const featuredImage = getMetadata('featuredimage');
  document.querySelector('.image').innerHTML = `<img src="${featuredImage}">`;

  // Configuring a POST Message on scrolling to send the event title to the parent window
  window.onscroll = function funcScroll() {
    if (window.scrollY > 100) {
      // window.top.postMessage({ eventtop: 'off' }, '*');
      if ((window.innerHeight + window.scrollY + 5) >= document.body.scrollHeight) {
        // you're at the bottom of the page
        window.top.postMessage({ eventfooter: 'on', eventtop: 'off' }, '*');
      } else {
        window.top.postMessage({ eventfooter: 'off', eventtop: 'off' }, '*');
      }
    } else {
      window.top.postMessage({ eventtop: 'on' }, '*');
    }
  };
}