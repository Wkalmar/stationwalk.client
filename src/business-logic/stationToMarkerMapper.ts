import * as L from "leaflet";
import { Station } from "../models/station";

export class StationToMarkerMapper {
    constructor(private station : Station) {}

    map = () : L.Marker => {
        return L.marker([this.station.location.lattitude, this.station.location.longitude]);
    }
}