const chromeRuntime = chrome.runtime;


chromeRuntime.onInstalled.addListener(()=>{
    chrome.tabs.executeScript({
        file: "content.js"
    });
});

const port = chromeRuntime.connect({name: "background"});

chrome.runtime.onConnect.addListener((port)=>{
    chrome.storage.sync.set({form:""});
    if (port.name == "form"){
        port.onMessage.addListener((message)=>{
            chrome.storage.sync.set({form: message});
        });
    }
});