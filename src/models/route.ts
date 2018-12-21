import { Station } from "./station";
import { Location } from './location';

export class Route {
    stationStart: Station
    stationEnd: Station
    checkpoints: Location[]
    name: string
}




