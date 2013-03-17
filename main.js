function linkClick(info, tab) {

    try {
        chrome.tabs.sendRequest(tab.id, "getClickedLink", function(clickedEl) {
            if (clickedEl){
             var content = clickedEl.text;
             var name = prompt("Bookmark title", content);
             if (name && name.length > 0) {
                 createBookmark(name, info,  function(id, name, info) {
                    chrome.bookmarks.create(
                        {"parentId":id, 
                        "title": name,
                        "url": info.linkUrl}, function (newLink) {
                            console.log(newLink.title)
                        });
                });
             }
         }});
        
    }
    catch (ex)    {
        var name = prompt("Bookmark title", "bookmark");
        if (name && name.length > 0) {
            createBookmark(name, info,  function(id, name, info) {
                chrome.bookmarks.create(
                    {"parentId":id, 
                    "title": name,
                    "url": info.linkUrl}, function (newLink) {
                        console.log(newLink.title)
                    });
            });
        }
    }
}


function createBookmark(name, info, callback) {
    // get the bookmarks bar then check if whe have our bookmark this folder
    var nodes = chrome.bookmarks.getSubTree("1", function(treeNodes){
        var exists = false;
        var bookmarkThisId  = 0;
        children = treeNodes[0].children;
        for (var i = children.length - 1; i >= 0; i--) {
            if (children[i].title == "Bookmark this")
            {
                bookmarkThisId = children[i].id;
                exists = true;
                callback(bookmarkThisId, name, info);
            }
        };

        if (!exists) {
            bookmarkThisId =  chrome.bookmarks.create(
                {'parentId': "1", 'title': 'Bookmark this'}, function(newFolder) {
                    createBookmark(name, info, callback);
                });
        }

        

    });
}

var contexts = ["link"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Bookmark this";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
   "onclick": linkClick});
  console.log("'" + context + "' item:" + id);
}

