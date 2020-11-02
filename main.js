const chromeRuntime = chrome.runtime.onInstalled;

chromeRuntime.addListener(()=>{
    chrome.tabs.executeScript({
        file: "content.js"
    });
});
