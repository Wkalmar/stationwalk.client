import { Station } from './../models/station';
import { StationsContainer } from './stationsContainer';
import { Distance } from "../utils/distance";
import * as L from "leaflet";

export class RouteDrawer {
    private neglectibleDistance: number = 0.0003;
    private startStation : Station;
    private endStation: Station;

    private isDrawingInProgress : boolean = false;
    private points: [number, number][] = [];
    private hypotheticalRoute: L.Polyline = L.polyline([]);
    private initDrawingIfNeeded = (map : L.Map, point: [number, number]) => {
        if (!this.isDrawingInProgress) {
            this.isDrawingInProgress = true;
            map.setView(point, 14);
        }
    }
    private mapLatLngToExpression = (point : L.LatLng) : [number, number] => {
        return [point.lat, point.lng];
    }

    private submitDrawingIfNeeded = (point : [number, number]) => {
        if (this.points.length > 0) {
            let head = this.points[this.points.length - 1];
            this.isDrawingInProgress =
                new Distance(point, head).euclidean() > this.neglectibleDistance;
        }
    }

    private getClosestStation = (latLngPoint : [number, number]) => {
        return StationsContainer.stations.sort((a,b) => {
            const distanceA = new Distance([a.location.lattitude, a.location.longitude], latLngPoint).euclidean();
            const distanceB = new Distance([b.location.lattitude, b.location.longitude], latLngPoint).euclidean();
            if (distanceA < distanceB)
                return -1;
            if (distanceA > distanceB)
                return 1;
            return 0;
        })[0];
    }

    private drawPointIfNeeded = (map : L.Map, latLngPoint : [number, number]) => {
        if (this.isDrawingInProgress) {
            if (this.points.length === 0) {
                this.startStation = this.getClosestStation(latLngPoint);
                latLngPoint = [this.startStation.location.lattitude, this.startStation.location.longitude];
            }
        } else {
            this.endStation = this.getClosestStation(latLngPoint);
            latLngPoint = [this.endStation.location.lattitude, this.endStation.location.longitude];
            document.dispatchEvent(new Event('drawingSubmitted'));
        }
        this.points.push(latLngPoint);
        L.polyline(this.points).addTo(map);
    }

    addPoint = (map : L.Map, point : L.LatLng) => {
        let latLngPoint = this.mapLatLngToExpression(point);
        this.initDrawingIfNeeded(map, latLngPoint);
        this.submitDrawingIfNeeded(latLngPoint);
        this.drawPointIfNeeded(map, latLngPoint);
        this.hypotheticalRoute.removeFrom(map);
    }

    addHypotheticalPoint = (map : L.Map, point : L.LatLng) => {
        if (this.isDrawingInProgress) {
            let head = this.points[this.points.length - 1];
            let tail = this.mapLatLngToExpression(point);
            this.hypotheticalRoute.removeFrom(map);
            this.hypotheticalRoute = L.polyline([head, tail], {color: 'red'});
            this.hypotheticalRoute.addTo(map);
        }
    }

    static drawer = new RouteDrawer();
}