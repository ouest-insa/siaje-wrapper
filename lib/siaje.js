/* Dependencies */
var request = require('request');

/* Constants */
var APP_NAME = 'siaje-wrapper';
var PAGE_INDEX = 'index.php';
var PAGE_CO = 'connexion.php';
var PAGE_STUDIES = 'etudes.php';
var RECO = 1000 * 60 * 10; //in milliseconds, now every 10 minutes

/**
 * Initialize connection to JE
 *
 * @param {String} je JE slug you find in connection URL
 * @param {String} login Your personnal login
 * @param {String} password Your personnal password
 *
 * @return {String} err  null if everythging is OK
 */
function Siaje(baseUrl, je, login, password, cb) {
    this.login = login;
    this.baseUrl = baseUrl;
    this.password = password;
    this.je = je;
    this.j = request.jar();

    this.connect(cb);

}

Siaje.prototype.connect = function(cb) {
    request.post({
        url: this.baseUrl + '/' + this.je + '/' + PAGE_CO,
        jar: this.j,
        form: {
            login: this.login, 
            mot_de_passe: this.password,
            r: PAGE_INDEX,
            sub_connexion: APP_NAME
        }
    }, function(err, res, body) {
        if (err) {
            cb(err);
        } else if (res.statusCode !== 302) {
            cb('Wrong argument number for your form');
        } else if (res.headers.location != PAGE_INDEX) {
            cb('Wrong username or password');
        } else {
            cb(null);
        }
    }.bind(this));

    setTimeout(function() {
        this.connect(function() {
        });
    }.bind(this) ,RECO);
}

Siaje.prototype.getStudies = function(cb) {
    request.get({
        url: this.baseUrl + '/' + this.je + '/' + PAGE_STUDIES,
        jar: this.j
    }, function(err, res, body) {

        var studies = [];
        var studiesRawFinder = /(<tr class="etude_line((.|\n)*?)<\/tr>)/g;

        var studiesRaw = body.match(studiesRawFinder);
        studiesRaw.forEach(function(studyRaw) {
            var typeFinder = /<small>([0-9]*) — (.*?)<\/small><\/a><\/td>/g;
            var statusFinder = /statut="(.*?)"/g;
            var domaineFinder = /id_domaine="([0-9]*)"/g;
            var nameFinder = /<strong>(.*?)<\/strong>/g;
            var idFinder = /href="etudes\.php\?etude=([0-9]*)"/g;
            var jehFinder = /jeh="([0-9]*)"/g;

            var study = {};
            var type = typeFinder.exec(studyRaw);

            study.id = (idFinder.exec(studyRaw))[1];
            study.name = (nameFinder.exec(studyRaw))[1];
            study.reference = type[1];
            study.type = type[2];
            study.type_id = (domaineFinder.exec(studyRaw))[1];
            study.status = (statusFinder.exec(studyRaw))[1];
            study.jeh = (jehFinder.exec(studyRaw))[1];
			
			if (status != "avortee" && status != "standby") {
				studies.push(study);
			}

        });
        cb(null,studies);
    });
}

Siaje.prototype.getStudy = function(id, cb) {
    request.get({
        url: this.baseUrl + '/' + this.je + '/' + PAGE_STUDIES + '?etude=' + id,
        jar: this.j
    }, function(err, res, body) {
        var study = {};

        var summaryFinder = /<p>\s*<strong>Résumé : <\/strong>((\s|.)*?)<\/p>/g; 
        var summary = (body.match(summaryFinder));
        if (summary !== null) {
            summary = summary[0].replace(/(<([^>]+)>)/ig,"");
            study.summary = summary
            cb(null,study);
        } else {
            cb("Summary not found", study);
        }       
    });
}

module.exports = Siaje;
