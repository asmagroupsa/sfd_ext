import { BaseEntity } from '../../shared';

export class ZoneSfd implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public reference?: string,
        public sfds?: BaseEntity[],
    ) {
    }
}
