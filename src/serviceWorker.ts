import { translate } from '@vitalets/google-translate-api';
import { HttpsProxyAgent } from 'https-proxy-agent';

const agentOption: any = {
  protocol: 'https:',
  host: '38.170.100.64',
  port: '8000',
  auth: 'AtcrR1:77VQNj',
  timeout: 1000
};

// const agent = new HttpsProxyAgent(agentOption);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.translateText) {
    translate(message.translateText, { 
      to: message.language, 
    })
    .then(data => {
      console.log(data.text)
      sendResponse(data.text)
    })
    .catch(err => {
      console.log(err)
    })
  }

  if (message.consoleText) {
    console.log(message.consoleText)
  }

  return true;
});
