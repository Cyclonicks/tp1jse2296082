const express = require("express");
const path = require("path");
const app = express();

const fs = require("fs");
const request = require("request");

const {PORT} = require("./config.js");
const {API_KEY} = require("./config.js");
const {START_DATE} = require("./config.js");
const {END_DATE} = require("./config.js");

const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+ START_DATE + '&end_date=' + END_DATE + '&api_key=' + API_KEY;

// on recueille les données avant de démarrer le serveur
request.get({
    url : url,
    json : true,
    headers : {'User-Agent' : 'request'}
}, (err, res, data) => {

    if (err) {

        console.log('Erreur: ', err);
    }

    else if (res.statusCode !== 200){

        console.log('Statut: ', res.statusCode);
    }

    else{

        const newData = JSON.stringify(data);

        fs.writeFile(path.join(__dirname, "frontend", "static", "js", "views", "nasa.json"), newData, err => {

            if (err) throw err;
            console.log("succès");
            app.listen(PORT || 4001, () => console.log("démarrage du serveur sur le port: ", PORT));
        })
    }
})

// utilisation de la route static pour les fichiers tels que css et javascript dans le code html
app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

// route qui met à jour les données à afficher, afin de voir la semaine suivante ou précédente de celle qui est actuellement affichée. On fait un nouveau request vers l'api avec un url construit à même les données envoyées dans les hrefs de navigation
app.get("/save-data", (req, res) => {

    // les dates provenant de la page, en paramètres de la route
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date='+ start_date + '&end_date=' + end_date + '&api_key=' + API_KEY;
    
    request.get({
        url : url,
        json : true,
        headers : {'User-Agent' : 'request'}
    }, (err, response, data) => {
    
        if (err) {
    
            console.log('Erreur: ', err);
        }
    
        else if (res.statusCode !== 200){
    
            console.log('Statut: ', res.statusCode);
        }
    
        else{
    
            const newData = JSON.stringify(data);
    
            fs.writeFile(path.join(__dirname, "frontend", "static", "js", "views", "nasa.json"), newData, err => {
    
                if (err) throw err;
                console.log("succès nouvelle semaine");

                // ce res est le res de l'appel de la route, et non celui de la requete, que j'ai appellé response
                res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
            })
        }
    })
})

// route par défaut ramène toujours à la page "principale" qui est l'affichage de la liste des données
app.get("/*", (req, res) => {

    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
})