import { BaseEntity } from '../../shared';

export class ElementCondition implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public valeur?: number,
        public description?: string,
        public conditionId?: number,
    ) {
    }
}
