import * as L from "leaflet";
import { Route } from "../models/route";

export class RouteToCheckPointsMapper {
    constructor(private route : Route) {}

    private mapEndStation = (transformedCheckpoints: L.LatLngExpression[]) => {
        transformedCheckpoints.push([
            this.route.stationEnd.location.lattitude,
            this.route.stationEnd.location.longitude
        ]);
    }

    private mapCheckpoints = (transformedCheckpoints: L.LatLngExpression[]) => {
        this.route.checkpoints.map(checkpoint => {
            transformedCheckpoints.push([
                checkpoint.lattitude,
                checkpoint.longitude
            ]);
        });
    }

    private mapStartStation = (transformedCheckpoints: L.LatLngExpression[]) => {
        transformedCheckpoints.push([
            this.route.stationStart.location.lattitude,
            this.route.stationStart.location.longitude
        ]);
    }

    map = () : L.Polyline => {
        let transformedCheckpoints : L.LatLngExpression[] = []
        this.mapStartStation(transformedCheckpoints);
        this.mapCheckpoints(transformedCheckpoints);
        this.mapEndStation(transformedCheckpoints);
        return L.polyline(transformedCheckpoints);
    }
}

