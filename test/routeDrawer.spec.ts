import { RouteDrawer } from './../src/business-logic/routeDrawer';
import * as L from "leaflet";

describe("RouteDrawer", () => {
    it("should add hypothetical point if drawing is in progress", () => {
        const map = L.map(document.createElement("div"));
        const routeDrawer = new RouteDrawer();
        const point = new L.LatLng(10, 10);
        const newPoint = new L.LatLng(11, 11);
        spyOn(L, 'polyline').and.callFake(() =>{
            return {
                addTo: () => {},
                removeFrom: () => {}
            }
        });
        routeDrawer.addPoint(map, point);
        routeDrawer.addHypotheticalPoint(map, newPoint);
        expect(L.polyline).toHaveBeenCalledWith([[10, 10], [11, 11]], {color: 'red'})
    });

    it("should add hypothetical point if drawing is in progress and a couple of points added", () => {
        const map = L.map(document.createElement("div"));
        const routeDrawer = new RouteDrawer();
        const point = new L.LatLng(10, 10);
        const point2 = new L.LatLng(10.1, 10.1);
        const point3 = new L.LatLng(10.2, 10.2);
        const newPoint = new L.LatLng(11, 11);
        spyOn(L, 'polyline').and.callFake(() =>{
            return {
                addTo: () => {},
                removeFrom: () => {}
            }
        });
        routeDrawer.addPoint(map, point);
        routeDrawer.addPoint(map, point2);
        routeDrawer.addPoint(map, point3);
        routeDrawer.addHypotheticalPoint(map, newPoint);
        expect(L.polyline).toHaveBeenCalledWith([[10.2, 10.2], [11, 11]], {color: 'red'})
    });

    it("should not add hypothetical point if drawing is not in progress", () => {
        const map = L.map(document.createElement("div"));
        const routeDrawer = new RouteDrawer();
        const point = new L.LatLng(10, 10);
        const point2 = new L.LatLng(10, 10);
        const newPoint = new L.LatLng(11, 11);
        spyOn(L, 'polyline').and.callFake(() =>{
            return {
                addTo: () => {},
                removeFrom: () => {}
            }
        });
        routeDrawer.addPoint(map, point);
        routeDrawer.addPoint(map, point2);
        routeDrawer.addHypotheticalPoint(map, newPoint);
        expect(L.polyline).toHaveBeenCalledTimes(1); //only points for real route
    });
});