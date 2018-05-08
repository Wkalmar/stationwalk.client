import * as L from "leaflet";
import { Route } from "../models/route";

export class RouteToCheckPointsMapper {
    constructor(private route : Route) {}

    private mapEndStation = (transformedCheckpoints: L.LatLngExpression[]) => {
        transformedCheckpoints.push([
            this.route.stationEnd.location.longitude,
            this.route.stationEnd.location.lattitude
        ]);
    }
    
    private mapCheckpoints = (transformedCheckpoints: L.LatLngExpression[]) => {
        this.route.checkpoints.map(checkpoint => {
            transformedCheckpoints.push([
                checkpoint.longitude,
                checkpoint.lattitude
            ]);
        });
    }
    
    private mapStartStation = (transformedCheckpoints: L.LatLngExpression[]) => {
        transformedCheckpoints.push([
            this.route.stationStart.location.longitude,
            this.route.stationStart.location.lattitude
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

