export class Address {
  constructor(
    public id?: number,
    public home?: string,
    public createdDate?: any,
    public createdBy?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public geoLong?: number,
    public geoLat?: number,
    public observation?: any,
    public departementId?: number,
    public communeId?: number,
    public arrondissementId?: number,
    public districtId?: number,
    public clientId?: number
  ) {}
}
