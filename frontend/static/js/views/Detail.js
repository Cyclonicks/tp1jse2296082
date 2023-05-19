import AbstractView from "./AbstractView.js";

export default class extends AbstractView{

    constructor(params){

        super(params);
        this.setTitle("détail");
    }

    async getHtml(){

        const num = this.params.id;

        async function getData(url){

            const response = await fetch(url);
            return response.json();
        }

        const data = await getData('/static/js/views/nasa.json');

        let detail = '';

        Object.entries(data.near_earth_objects).forEach(([date, asteroides]) => {

            asteroides.forEach(asteroide => {

                if (asteroide.id === num) {

                    // transformation des valeurs true/false dans la BD pour oui/non
                    const estHasardeux = asteroide.is_potentially_hazardous_asteroid ? 'oui' : 'non';
                    const estSentinelle = asteroide.is_sentry_object ? 'oui' : 'non';

                    detail += `
                            <a href='/list' data-link>Retour à la liste</a>
                            <div class="asteroide-details">
                                <h1 class="asteroide-nom">Nom de l'astéroïde: ${asteroide.name}</h1>
                                <div class="asteroide-info">
                                    <p>ID de référence NEO: ${asteroide.neo_reference_id}</p>
                                    <p>URL NASA JPL: <a href="${asteroide.nasa_jpl_url}">${asteroide.nasa_jpl_url}</a></p>
                                    <p>Magnitude absolue: ${asteroide.absolute_magnitude_h} (unité de mesure: magnitude)</p>
                                </div>
                                <div class="asteroide-diametre">
                                    <h2>Diamètre estimé</h2>
                                    <ul>
                                        <li>Kilomètres: ${asteroide.estimated_diameter.kilometers.estimated_diameter_min} - ${asteroide.estimated_diameter.kilometers.estimated_diameter_max}</li>
                                        <li>Mètres: ${asteroide.estimated_diameter.meters.estimated_diameter_min} - ${asteroide.estimated_diameter.meters.estimated_diameter_max}</li>
                                        <li>Miles: ${asteroide.estimated_diameter.miles.estimated_diameter_min} - ${asteroide.estimated_diameter.miles.estimated_diameter_max}</li>
                                        <li>Pieds: ${asteroide.estimated_diameter.feet.estimated_diameter_min} - ${asteroide.estimated_diameter.feet.estimated_diameter_max}</li>
                                    </ul>
                                </div>
                                <div class="asteroide-info">
                                    <p>Astéroïde potentiellement dangereux: ${estHasardeux}</p>
                                </div>
                                <h2>Passage rapproché</h2>`;

                    asteroide.close_approach_data.forEach(approche => {

                        // transformation de la date pour être lisible de façon normale
                        const DateApproche = new Date(approche.epoch_date_close_approach);
                        const DateApprocheFormat = DateApproche.toLocaleString();
        
                        detail += `
                                <div class="approche-details">
                                    <p>Date du passage: ${approche.close_approach_date}</p>
                                    <p>Date complète du passage: ${approche.close_approach_date_full}</p>
                                    <p>Date Epoch du passage: ${DateApprocheFormat}</p>
                                    <p>Vélocité relative:</p>
                                    <ul>
                                        <li>Kilomètres par seconde: ${approche.relative_velocity.kilometers_per_second} km/s</li>
                                        <li>Kilomètres par heure: ${approche.relative_velocity.kilometers_per_hour} km/h</li>
                                        <li>Miles par heure: ${approche.relative_velocity.miles_per_hour} m/h</li>
                                    </ul>
                                    <p>Distance minimale d'évitement manquée:</p>
                                    <ul>
                                        <li>Astronomique: ${approche.miss_distance.astronomical} AU</li>
                                        <li>Lunaire: ${approche.miss_distance.lunar} LD</li>
                                        <li>Kilomètres: ${approche.miss_distance.kilometers} km</li>
                                        <li>Miles: ${approche.miss_distance.miles} miles</li>
                                    </ul>
                                    <p>Corps en orbite: ${approche.orbiting_body}</p>
                                </div>`;
                });
                
                    detail += `
                                <div class="asteroide-info">
                                    <p>Objet sentinelle: ${estSentinelle}</p>
                                </div>
                            </div>`;
                }
            });
        });

    return detail;
    }
}


