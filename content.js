
const port = chrome.runtime.connect({name: "form"});
    
const forms = document.getElementsByTagName("form");

for (let i = 0; i < forms.length; i++){
    forms[i].addEventListener("input", async (e) => {
        console.log("Event triggered");
        const inputs = forms[i].getElementsByTagName("input");
        const labels = forms[i].getElementsByTagName("label")
        
        const toPredict = {"keywords":[]};
        
        for (let j = 0; j < inputs.length; j++){
            const input = inputs[j];
            if (input.type === "hidden"){
                continue;
            }
            let foundLabel = false;
            for (let k = 0; k < labels.length; k++){
                const label = labels[k];
                if (label.htmlFor === input.id){
                    toPredict.keywords.push(label.innerHTML);
                    foundLabel = true;
                }
            }
            if (!foundLabel){
                toPredict.keywords.push(input.placeholder);
            }
        }

        if (toPredict.keywords.length !== 0)
            console.log(toPredict);
            toPredict["formID"] = i;
            await port.postMessage(toPredict);
        console.log("Await completed")
    });
}

port.onMessage.addListener((message)=>{
    console.log(message);
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    console.log(request);
});

/*
for (let i = 0; i < forms.length; i++){
    const inputs = forms[i].getElementsByTagName("input");
    for (let j = 0; j < inputs.length; j++){
        for (let k = 0; k < privacyFields.fields.length; k++){
            const pattern = new RegExp(privacyFields.fields[k]);
            if (pattern.test(inputs[j].name) || pattern.test(inputs[j].id)){
                fieldsInForm.push(privacyFields.fields[k]);
            }
        }
  }
}*/

/*if (fieldsInForm.length !== 0)
    port.postMessage({forms:fieldsInForm});*/

