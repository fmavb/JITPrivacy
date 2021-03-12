const chromeRuntime = chrome.runtime;
const localhost = "http://localhost:8000/";
const prod = "https://ontologyclassifierapi.azurewebsites.net"

chromeRuntime.onInstalled.addListener(()=>{
    chrome.tabs.executeScript({
        file: "content.js"
    });
});

const background = {
    1: {19:"iconGreen-19.png", 38: "iconGreen-38.png"},
    2: {19: "iconYellow-19.png", 38: "iconYellow-38.png"},
    3: {19: "iconRed-19.png", 38: "iconRed-38.png"}
};

const port = chromeRuntime.connect({name: "background"});

chromeRuntime.onConnect.addListener((incomingPort) => {
    chrome.storage.sync.set({form:""});
    if (incomingPort.name == "form"){
        incomingPort.onMessage.addListener( async (message)=>{
            chrome.storage.sync.set({loading: true});
            const response = await fetch(prod+"search/", {
                method: "POST",
                body: JSON.stringify(message),
            });
            chrome.storage.sync.set({loading: false});
            message["keywords"] = await response.json();
            let max = 1;
            for (let i = 0; i < message.keywords.length; i++){
                max = message.keywords[i].prediction > max ? message.keywords[i].prediction : max;
            }
            chrome.browserAction.setIcon({path: background[max]});

            chrome.storage.sync.set({form: message});
            
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    chrome.browserAction.setIcon({path: {19: "icon-19.png", 38:"icon-38.png"}});
    chrome.storage.sync.set({cleared: true});
});