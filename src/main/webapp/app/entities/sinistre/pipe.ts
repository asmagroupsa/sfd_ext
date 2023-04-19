import { Pipe, PipeTransform } from "@angular/core";
import { City } from "../city/city.model";
import { TownShip } from "../town-ship/town-ship.model";
import { District } from "../district/district.model";
@Pipe({ name: "departement" })
export class DepartementPipe implements PipeTransform {
  transform(communes: City[], departementId: number) {
    if (!departementId) return [];
    return communes.filter((commune: City) => {
      return commune.departementId == departementId;
    });
  }
}

@Pipe({ name: "commune" })
export class CommunePipe implements PipeTransform {
  transform(arrondissements: TownShip[], communeId: number) {
    if (!communeId) return [];
    return arrondissements.filter((arrondissement: TownShip) => {
      return arrondissement.cityId == communeId;
    });
  }
}

@Pipe({ name: "arrondissement" })
export class ArrondissementPipe implements PipeTransform {
  transform(districts: District[], arrondissementId: number) {
    if (!arrondissementId) return [];
    return districts.filter((district: District) => {
      return district.townShipId == arrondissementId;
    });
  }
}
