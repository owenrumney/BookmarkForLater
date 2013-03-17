
var clickedEl = null;

document.addEventListener("mousedown", function(event){
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedLink") {
        sendResponse({text: clickedEl.text});
    }
});

