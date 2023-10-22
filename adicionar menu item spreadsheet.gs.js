// crear menu de refrescar datos
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Menu')
      .addItem('First item', 'run')
      .addSeparator()
      .addSubMenu(ui.createMenu('Sub-menu')
          .addItem('Second item', 'run'))
      .addToUi();
}

