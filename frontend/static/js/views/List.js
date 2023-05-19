import AbstractView from "./AbstractView.js";
export default class extends AbstractView{

    constructor(params){

        super(params);
        this.setTitle("Liste Géocroiseurs");
    }

    async getHtml(){

        async function getData(url){

            const response = await fetch(url);
            return response.json();
        }

        const data = await getData('/static/js/views/nasa.json');

        // récupération des URL de changement de semaine
        const prochUrl = new URL(data.links.next);
        const precUrl = new URL(data.links.previous);

        // extraction des valeurs de début et fin de la prochaine semaine
        const debutProch = prochUrl.searchParams.get("start_date");
        const finProch = prochUrl.searchParams.get("end_date");

        // extraction des valeurs de début et fin de la semaine précédente
        const debutPrec = precUrl.searchParams.get("start_date");
        const finPrec = precUrl.searchParams.get("end_date");

        let asteroListe = "<h1>Liste des Objets Géocroiseurs</h1>";

        asteroListe += "<div class='nb'><p><strong>Nombre d'objets pour la semaine :</strong> "+ data.element_count + "</div>";

        let premiereBoucle = true;
        for (let date in data.near_earth_objects) {

            asteroListe += "<div class='infos'>"
            
            if(premiereBoucle){
                asteroListe += "<a href='/save-data?start_date=" + debutPrec + "&end_date=" + finPrec + "' id='precedente' data-link>Semaine précédente</a>";
            }
            
            asteroListe += "<h2>" + date + "</h2>";
            
            if(premiereBoucle){
                asteroListe += "<a href='/save-data?start_date=" + debutProch + "&end_date=" + finProch + "' id='suivante' data-link>Semaine suivante</a>";
                premiereBoucle = false;
            }

            asteroListe += "</div><div id='chargement'>Chargement des données...</div><div class='container'>";
    
            for (let element of data.near_earth_objects[date]) {
                asteroListe += `<div class='astero-card'>
                                    <h3>${element.name}</h3>
                                    <p><strong>Magnitude absolue : </strong>${element.absolute_magnitude_h}</p>
                                    <p><strong>Diamètre estimé : </strong>${element.estimated_diameter.kilometers.estimated_diameter_min} km min, ${element.estimated_diameter.kilometers.estimated_diameter_max} km max.</p>
                                    <p><strong>Astéroïde potentiellement dangereux : </strong>${(element.is_potentially_hazardous_asteroid ? "Oui" : "Non")}</p>`;

                if (element.close_approach_data.length > 0) {
                    const closestApproach = element.close_approach_data[0];
                    asteroListe += `<p><strong>Date de passage rapproché : </strong>${closestApproach.close_approach_date}</p>
                                    <p><strong>Distance d'évitement manquée : </strong>${closestApproach.miss_distance.kilometers} kilomètres</p>`;
                }
    
                asteroListe += `    <p><strong>Objet sentinelle : </strong>${(element.is_sentry_object ? "Oui" : "Non")}</p>
                                    <a href='/detail/${element.id}' class='detail-link' data-link>Plus d'informations</a>
                                </div>`;
            }
            asteroListe += `</div>`;
        }

        return asteroListe
    }
}