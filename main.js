const chromeRuntime = chrome.runtime;


chromeRuntime.onInstalled.addListener(()=>{
    chrome.tabs.executeScript({
        file: "content.js"
    });
});

const port = chromeRuntime.connect({name: "background"});

chromeRuntime.onConnect.addListener((incomingPort)=>{
    chrome.storage.sync.set({form:""});
    if (incomingPort.name == "form"){
        incomingPort.onMessage.addListener((message)=>{
            console.log(message);
            chrome.storage.sync.set({form: message});
        });
    }
});

chrome.storage.onChanged.addListener((changes, areaName)=>{
    console.log(changes);
    if (areaName == "sync" && changes.confirm && changes.formID){
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, changes, (response)=>{
                console.log("Message sent");
                chrome.storage.sync.delete(["confirm", "formID"]);
            });
        });
    }
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