export class CaisseNouvelleStatut {
    constructor(
        public id?: number,
        public etat?: string,
        public dateOuverture?: string,
        public dateFermeture?: string,
        public automatique?: boolean,

    ) {
        this.automatique = false;

    }
}
