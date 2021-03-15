sensitivityToClass = {
    1 : "low",
    2 : "medium",
    3 : "high"
};

async function getStorage(fetchValue){
    new Promise((resolve, reject) => {
        chrome.storage.local.get(fetchValue, (value) => {
            resolve(value);
        });
    });
}

document.getElementById("toggle").addEventListener("click", (event) => {
    const tutorial = document.getElementById("explanation");
    const toggle = document.getElementById("toggle");
    if (tutorial.style.display === "none"){
        toggle.innerHTML = "Hide tutorial";
        tutorial.style.display = "inline";
    } else {
        toggle.innerHTML = "Show tutorial";
        tutorial.style.display = "none";
    }
});

window.onload = () => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("explanation").style.display = "none";
    document.getElementById("noChange").style.display = "inline";
    document.getElementById("progressContainer").style.display = "none";
    chrome.storage.local.get("form", async (data) => {
        const id = document.getElementById("id1");
        let maxInputValue = await getStorage("maxInputValue") ? await getStorage("maxInputValue") : 16;
        

        if (data.form.keywords){
            
            if (data.form.keywords.length > maxInputValue){
                maxInputValue = data.form.keywords.length;
                chrome.storage.local.set({"maxInputValue": maxInputValue});
            }
    
            const maxScore = maxInputValue + 3 * maxInputValue;
            let score = data.form.keywords.length;
            for (let i = 0; i < data.form.keywords.length; i++){
                let html = "<div class='bars ";
                const field = data.form.keywords[i];
                score += field.prediction
                html += sensitivityToClass[field.prediction] + "'>";
                html += field.word;
                html += "</div>\n";
                id.innerHTML += html;
            }
            const percentage = Math.round((score/maxScore)*100);
            document.getElementById("sensitivityScore").innerHTML = `Sensitivity Score: ${percentage}%`;
            document.getElementById("progressContainer").style.display = "block";
            const progress = document.getElementById("progress");
            document.getElementById("progressText").innerHTML = `${percentage}%`;
            progress.style.width = `${score}%`;
            document.getElementById("noChange").style.display = "none";
        }
    });
}

/*document.getElementById("submitButton").addEventListener("click", (e) =>{
    chrome.storage.sync.get("form", (data)=>{
        console.log(data);
        chrome.storage.sync.set({confirm: "Send", "formID": data.form.formID});
    });
});*/

chrome.storage.onChanged.addListener((changes, areaName) =>{
    if (areaName === "local" && changes.form){
        chrome.storage.local.get("form", async (data) => {
            const id = document.getElementById("id1");
            let maxInputValue = await getStorage("maxInputValue") ? await getStorage("maxInputValue") : 16;

            if (data.form.keywords) {
                if (data.form.keywords.length > maxInputValue){
                    maxInputValue = data.form.keywords.length;
                    chrome.storage.local.set({"maxInputValue": maxInputValue});
                }
                const maxScore = maxInputValue + 3 * maxInputValue;
                let score = data.form.keywords.length;
                for (let i = 0; i < data.form.keywords.length; i++){
                    let html = "<div class='bars ";
                    const field = data.form.keywords[i];
                    score += field.prediction
                    html += sensitivityToClass[field.prediction] + "'>";
                    html += field.word;
                    html += "</div>\n";
                    id.innerHTML += html;
                }
                const percentage = Math.round((score/maxScore)*100);
                document.getElementById("sensitivityScore").innerHTML = `Sensitivity Score: ${percentage}%`;
                document.getElementById("progressContainer").style.display = "block";
                const progress = document.getElementById("progress");
                document.getElementById("progressText").innerHTML = `${percentage}%`;
                progress.style.width = `${score}%`;
                document.getElementById("noChange").style.display = "none";
            }
        });
    }
    else if (areaName === "local" && changes.cleared){
        console.log("Cleared");
        console.log(changes.cleared);
        document.getElementById("noChange").style.display = "inline";
        document.getElementById("id1").innerHTML = "";
        chrome.storage.local.set({cleared: false});
    } else if (areaName === "local" && changes.loading){
        chrome.storage.local.get("loading", (data) => {
            if (data.loading){
                document.getElementById("loading").style.display = "inline";
            } else {
                document.getElementById("loading").style.display = "none";
            }
        });
    }
});
