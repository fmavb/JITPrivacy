
const port = chrome.runtime.connect({ name: "form" });

const forms = document.getElementsByTagName("form");

document.addEventListener("DOMNodeInserted", (e) => {
    for (let i = 0; i < forms.length; i++) {
        const inputs = forms[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].oninput = async (e) => {
                console.log("Event triggered");
                const labels = forms[i].getElementsByTagName("label");
                const toPredict = { "keywords": [] };
                if (inputs[j].type != "hidden") {
                    let foundLabel = false;
                    for (let k = 0; k < labels.length; k++) {
                        const label = labels[k];
                        const strippedString = label.innerHTML.replace(/(<([^>]+)>)/gi, "");
                        !toPredict.keywords.includes(strippedString) ? toPredict.keywords.push(strippedString) : false;
                        foundLabel = true;
                    }
                    if (!foundLabel) {
                        for (let l = 0; l < inputs.length; l++) {
                            !toPredict.keywords.includes(inputs[l].placeholder) ? toPredict.keywords.push(inputs[l].placeholder) : false;
                        }
                    }
                    if (toPredict.keywords.length !== 0) {
                        console.log(toPredict);
                        toPredict["formID"] = i;
                        await port.postMessage(toPredict);
                    }
                }
            };
        }
    }
});


