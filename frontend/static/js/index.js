import Dashboard from "./views/Dashboard.js";
import Detail from "./views/Detail.js";
import List from "./views/List.js";


// l'expression régulière qui traite les informations de la route pour envoyer les bonnes données pour les pages d'informations spécifiques, sera utilisé par le routeur
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

// l'extraction des paramètres de la route pour envoyer vers la vue, utilisé par le routeur
const getParams = match => {

    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    const values = match.result.slice(1);

    return Object.fromEntries(keys.map((key, i) =>{

        return [key, values[i]];
    }))

}

// le routeur pour la page
const routeur = async () => {

    // la liste des routes possibles
    const routes = [
        {path : "/", view : Dashboard},
        {path : "/list", view : List},
        {path : "/detail/:id", view : Detail}
    ]

    // vérification de la route reçue avec la liste des routes possibles
    const potentialMatches = routes.map( route => {

        return {
            route : route,
            result : location.pathname.match(pathToRegex(route.path))
        }
    })

    // association de la route reçue ou définition de la route par défaut, le cas échéant
    let match = potentialMatches.find( potentialMatch => potentialMatch.result !== null);

    if(!match) {

        match = {
            route : routes[0],
            result : [location.pathname]
        }
    }

    // définition de la vue à afficher
    const view = new match.route.view(getParams(match));

    // insertion de la vue associée au chemin envoyé
    document.querySelector("#app").innerHTML = await view.getHtml();
}

// écouteur d'événement pour bloquer le rechargement de la page et envoyer la route associée au lien cliqué, ou activer le routeur pour afficher la vue par défaut.
document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", e => {

        if(e.target.matches("[data-link]")) {

            e.preventDefault();

            // fetch sur une route dans le serveur afin d'obtenir les données pour la nouvelle semaine séletionnée.
            if (e.target.id === "suivante" || e.target.id === "precedente") {

                // on désactive les liens pendant le chargement des données
                let bloqueLien = document.querySelectorAll('.infos>a');
                bloqueLien.forEach(lien => lien.classList.add('liensDesactives'));

                // on affiche un message informatif de chargement de données
                let chargement = document.getElementById('chargement');
                chargement.classList.add('charger');

                // on fetch sur la route save-data
                fetch(e.target.href)
                .then(response => {

                    if (!response.ok) {

                        throw new Error("Erreur: " + response.status);
                    }

                    // retrait du blocage des liens et du message
                    chargement.classList.remove('charger');
                    bloqueLien.forEach(lien => lien.classList.remove('liensDesactives'));

                    // on affiche la liste avec les nouvelles données
                    navigateTo("/list");
                })
                .catch(error => {

                    console.error("Erreur lors de la mise à jour des données:", error);
                });
            }

            else {

                // les autres liens passent par ici
                navigateTo(e.target.href);
            }
        }
    })

    routeur();
})

// Pour changer le lien affiché dans la barre d'historique du fureteur et activer le routeur par la suite
const navigateTo = url => {

    history.pushState(null, null, url);
    routeur();
}

// pour permettre l'utilisation du bouton retour sans recharger la page
window.addEventListener("popstate", routeur);