import * as L from "leaflet";

export class RouteDrawer {
    private neglectibleDistance: number = 0.0001
    
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
                new StationWalk.Distance(point, head).euclidean() > this.neglectibleDistance;
        }       
    }

    addPoint = (map : L.Map, point : L.LatLng) => {
        let latLngPoint = this.mapLatLngToExpression(point);
        this.initDrawingIfNeeded(map, latLngPoint);                       
        this.submitDrawingIfNeeded(latLngPoint);
        if (this.isDrawingInProgress) {
            this.points.push(latLngPoint);
            L.polyline(this.points).addTo(map);
        }            
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