export class Formation {
  constructor(
    public id?: number,
    public formateur?: string,
    public libelle?: string,
    public avis?: string,
    public nbHour?: number,
    public createdBy?: string,
    public agenceReference?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public lieu?: string,
    public dateFormation?: any,
    public createdDate?: any,
    public matieres?: any[],
    public notificationClientsId?: number
  ) {}
}
