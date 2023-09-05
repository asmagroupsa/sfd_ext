import { TownShip } from '../town-ship/town-ship.model';
export class District {
    constructor(
        public id?: number,
        public name?: string,
        public addresssId?: number,
        public townShipId?: number,
        public townShip?: TownShip,
    ) {
    }
}
