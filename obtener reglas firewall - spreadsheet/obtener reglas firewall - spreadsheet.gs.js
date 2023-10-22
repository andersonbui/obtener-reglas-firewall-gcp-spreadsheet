/*
 * This sample demonstrates how to configure the library for Google APIs, using
 * domain-wide delegation (Service Account flow).
 * https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
 */

// Private key and client email of the service account.
var PRIVATE_KEY = '';

// Email address of the user to impersonate.
var USER_EMAIL = 'account-service@xxxxxxx.iam.gserviceaccount.com';

/**
 * Authorizes and makes a request to the Google Drive API.
 */
function run() {

  proyectos = ["xxxxxxx","client-services-222720","client-services-222801", "tm-contact-center","temporal-banamex","dev-space-224205","tampamuseum","sreh-222801"];
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  fila = sheet.getLastRow() + 1;
  sheet.getRange(fila,1).setValue(["nombre" ]);
  sheet.getRange(fila,2).setValue(["tipo" ]);
  sheet.getRange(fila,3).setValue(["puertos tcp" ]);
  sheet.getRange(fila,4).setValue(["puertos udp" ]);
  sheet.getRange(fila,5).setValue(["IPs permitidas" ]);
  Logger.log("numero de proyectos:"+proyectos.length)
  for(k = 0; k < proyectos.length; k++){
    fila++;
    sheet.getRange(fila,1).setValue(["proyecto -> " + proyectos[k]]).setBackgroundRGB(2, 255, 2);

    Logger.log("proyecto:"+proyectos[k]);
    imprimirReglasProyecto(proyectos[k],sheet);
  }
}

function imprimirReglasProyecto(proyecto,sheet){
  result = obtenerReglasProyecto(proyecto);
  Logger.log(JSON.stringify(result, null, 2));
  items = result.items;
  var i = 0;
  for(i = 0; i < items.length; i++){
    fila = sheet.getLastRow() + 1;
    columna = 1;
    sheet.getRange(fila,columna++).setValue([items[i].name ]);
    sheet.getRange(fila,columna++).setValue([JSON.stringify( items[i].direction ) ]);
    puertos_tcp = "";
    if(items[i].allowed &&  items[i].allowed[0]){
      puertos_tcp = items[i].allowed[0].ports;
    }
    sheet.getRange(fila,columna++).setValue([JSON.stringify( puertos_tcp ) ]);
    puertos_udp = "";
    if(items[i].allowed && items[i].allowed[1]){
      puertos_udp = items[i].allowed[1].ports;
    }
    sheet.getRange(fila,columna++).setValue([JSON.stringify( puertos_udp ) ]);
    sheet.getRange(fila,columna++).setValue([JSON.stringify( items[i].sourceRanges ) ]);
  }
  return ;
}

function obtenerReglasProyecto(project){
  var service = getService();
  Logger.log(service.hasAccess())
  if (service.hasAccess()) {
    var url = 'https://www.googleapis.com/compute/v1/projects/'+project+'/global/firewalls';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    return result;
  } else {
    Logger.log(service.getLastError());
    return ;
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('Compute:' + USER_EMAIL)
      // Set the endpoint URL.
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the private key and issuer.
      .setPrivateKey(PRIVATE_KEY)
      .setIssuer(USER_EMAIL)

      // Set the name of the user to impersonate. This will only work for
      // Google Apps for Work/EDU accounts whose admin has setup domain-wide
      // delegation:
      // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
      // .setSubject(USER_EMAIL)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope. This must match one of the scopes configured during the
      // setup of domain-wide delegation.
      .setScope('https://www.googleapis.com/auth/compute');
}

// crear menu de refrescar datos
function menu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Refrescar datos firewall')
      .addItem('Refrescar reglas','run')
      .addToUi();
}
