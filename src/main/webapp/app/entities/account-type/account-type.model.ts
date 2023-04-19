export class AccountType {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public initiale?: string,
    public sfdReference?: string,
    public accountsId?: number,
    public ecritureOperationAccountsId?: number,
    public produitsId?: number,
    public contrainteComptesId?: number
  ) {}
}
