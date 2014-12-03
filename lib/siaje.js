/* Dependencies */
var request = require('request');

/* Constants */
var APP_NAME = 'siaje-wrapper';
var BASE_URL = 'https://pro.siaje.com';
var PAGE_INDEX = 'index.php';
var PAGE_CO = 'connexion.php';
var PAGE_STUDIES = 'etudes.php';

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
    this.je = je;
    this.j = request.jar();

    request.post({
        url: BASE_URL + '/' + this.je + '/' + PAGE_CO,
        jar: this.j,
        form: {
            login: login, 
            mot_de_passe: password,
            r: PAGE_INDEX,
            sub_connexion: APP_NAME
        }
    }, function(err, res, body) {
        if (err)
            cb(err);
        else if (res.statusCode != 302)
            cb('Wrong argument number for your form');
        else if (res.headers.location != PAGE_INDEX)
            cb('Wrong username or password');
        else
            cb(null);
    }.bind(this));
}

Siaje.prototype.getStudies = function(cb) {
    request.get({
        url: BASE_URL + '/' + this.je + '/' + PAGE_STUDIES,
        jar: this.j
    }, function(err, res, body) {

        var studies = [];
        var studiesRawFinder = /(<tr class="etude_line((.|\n)*?)<\/tr>)/g;

        var studiesRaw = body.match(studiesRawFinder);
        studiesRaw.forEach(function(studyRaw) {
            var typeFinder = /<small>(.*?)<\/small><\/a><\/td>/g;
            var statusFinder = /statut="(.*?)"/g;
            var nameFinder = /<strong>(.*?)<\/strong>/g;
            var idFinder = /href="etudes\.php\?etude=([0-9]*)"/g;
            var jehFinder = /jeh="([0-9]*)"/g;

            var study = {};
            study.id = (idFinder.exec(studyRaw))[1];
            study.name = (nameFinder.exec(studyRaw))[1];
            study.type = (typeFinder.exec(studyRaw))[1];
            study.status = (statusFinder.exec(studyRaw))[1];
            study.jeh = (jehFinder.exec(studyRaw))[1];

            studies.push(study);

        });
        cb(null,studies);
    });
};

module.exports = Siaje;
