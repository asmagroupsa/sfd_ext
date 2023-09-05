import { BaseEntity } from '../../shared';

const enum ValidationResult {
  'ACCEPTER',
  'REJETER',
  'ATTENTE'
}

export class Validation implements BaseEntity {
  constructor(
    public id?: number,
    public amount?: number,
    public duration?: number,
    public createdDate?: any,
    public createdBy?: string,
    public agenceReference?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: any,
    public explanation?: string,
    public client?: string,
    public result?: ValidationResult,
    public reference?: string,
    public dossierId?: number,
    public delegatedMemberId?: number
  ) {}
}
