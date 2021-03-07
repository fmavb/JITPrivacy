const chromeRuntime = chrome.runtime;
const localhost = "http://localhost:8000/";
const prod = "https://sensitivity-classifier.herokuapp.com/"

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
            const response = await fetch(prod+"search/", {
                method: "POST",
                body: JSON.stringify(message),
            });
            message["keywords"] = await response.json();
            let max = 1;
            for (let i = 0; i < message.keywords.length; i++){
                max = message.keywords[i].prediction > max ? message.keywords[i].prediction : max;
            }
            chrome.browserAction.setIcon({path: background[max]});

            chrome.storage.sync.set({form: message});
            
            /*chrome.storage.onChanged.addListener((changes, areaName)=>{
                console.log("Changes: ", changes);
                if (areaName == "sync" && changes.confirm && changes.formID){
                    /*chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, changes, (response)=>{
                            console.log("Message sent");
                            chrome.storage.sync.delete(["confirm", "formID"]);
                        });
                    });
                    incomingPort.postMessage(changes);
                }
            });*/
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    chrome.browserAction.setIcon({path: {19: "icon-19.png", 38:"icon-38.png"}});
    chrome.storage.sync.set({cleared: true});
});

/*chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    let port;
    for (let i = 0; i < tabs.length; i++){
        if (chrome.tabs.connect(tabs[i].id).name == "form"){
            port = chrome.tabs.connect(tabs[i].id).name;
        }
    }
    chromeRuntime.onMessage.addListener((request, sender, sendResponse)=>{
        console.log(request.confirm);
        if (request.confirm == "Send"){
            port.postMessage(request);
            console.log("Message sent");
        }
    });
    
});*/

/*chromeRuntime.sendMessage({test: "test"});*/