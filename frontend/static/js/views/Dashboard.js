import AbstractView from "./AbstractView.js";

export default class extends AbstractView{

    constructor(params){
        super(params);
        this.setTitle("Accueil");
    }

    async getHtml(){
        return `
                <h2>Bienvenue sur le site des objets Géocroiseurs</h2>
                <p>Ce site répertorie les passages rapprochés d'objets céleste. Accédez à la liste avec le bouton LISTE dans la navigation</p>`;
    }
}