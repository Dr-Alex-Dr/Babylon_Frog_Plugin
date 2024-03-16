import '../styles/popup.scss';
import { fromEvent } from 'rxjs';

fromEvent(document.querySelector('.buttons-shrome'), 'click')
.subscribe(() => {
  chrome.tabs.create({url: "https://www.google.com/"});
})

fromEvent(document.querySelector('.buttons-donate'), 'click')
.subscribe(() => {
  chrome.tabs.create({url: "https://boosty.to/bfrog/donate"});
})

// console.log('popup')
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   document.querySelector('.list-item__text').textContent = message.pageLanguage
//   return true;
// })
