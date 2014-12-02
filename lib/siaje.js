/* Dependencies */
var request = require('request');

/* Constants */
var APP_NAME = 'siaje-wrapper';
var BASE_URL = 'https://pro.siaje.com';
var PAGE_INDEX = 'index.php';
var PAGE_CO = 'connexion.php';

/**
 * Initialize connection to JE
 *
 * @param {String} je JE slug you find in connection URL
 * @param {String} login Your personnal login
 * @param {String} password Your personnal password
 *
 * @return {String} err  null if everythging is OK
 */
function Siaje(je, login, password, cb) {
    request.post({
        url: BASE_URL + '/' + je + '/' + PAGE_CO, 
        form: {
            login: login, 
            mot_de_passe: password,
            r: PAGE_INDEX,
            sub_connexion: APP_NAME
        }
    }, function(err, res, body) {
        if (res.statusCode != 302)
            cb('Wrong argument number for your form');
        else if (res.headers.location != PAGE_INDEX)
            cb('Wrong username or password');
        else
            cb(null);
    });
}

Siaje.prototype.getStudies = function(cb) {
    cb('Not yet implemented');
}

module.exports = Siaje;
