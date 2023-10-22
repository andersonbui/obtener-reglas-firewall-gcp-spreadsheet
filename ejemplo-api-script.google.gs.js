function callNumbers() {

  // Call the Numbers API for random math fact
  var response = UrlFetchApp.fetch("https://www.googleapis.com/auth/compute.readonly");
  Logger.log(response.getContentText());

  var fact = response.getContentText();
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(sheet.getLastRow() +1,1).setValue([fact]);

  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(['Cotton Sweatshirt XL', 'css004']);


}

function onOpenNumber() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Numbers API Menu')
      .addItem('Display random number fact','callNumbers')
      .addToUi();
}

/**
 * Return the set of folder names contained in the user's root folder as an
 * object (with folder IDs as keys).
 * @return {Object} A set of folder names keyed by folder ID.
 */
function getFoldersUnderRoot() {

  var root = DriveApp.getRootFolder();
  var folders = root.getFolders();
  var folderSet = {};
  while (folders.hasNext()) {
    var folder = folders.next();
    folderSet[folder.getId()] = folder.getName();
  }

  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(sheet.getLastRow() +1,1).setValue([folderSet]);

  return folderSet;
}

function retrieveEntitySentiment (line) {
 var apiKey = "your key here";
 var apiEndpoint = 'https://www.googleapis.com/auth/compute?key=' + apiKey;
 // Create our json request, w/ text, language, type & encoding
  var nlData = {
   document: {
     language: 'en-us',
     type: 'PLAIN_TEXT',
     content: line
   },
   encodingType: 'UTF8'  };
 //  Package all of the options and the data together for the call
 var nlOptions = {
   method : 'post',
   contentType: 'application/json',
   payload : JSON.stringify(nlData)
 };
 //  And make the call
 var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
 return JSON.parse(response);
};



