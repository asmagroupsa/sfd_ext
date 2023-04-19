export class OperationType {
  constructor(
    public id?: number,
    public name?: string,
    public description?: any,
    public code?: string,
    public operationsId?: number,
    public ecrituresId?: number,
    public ecritureOperationAccountsId?: number,
    public opCompteTrancheTFsId?: number,
    public superTypeOperationId?: number
  ) {}
}
