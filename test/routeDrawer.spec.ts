import { StationsContainer } from './../src/business-logic/stationsContainer';
import { RouteDrawer } from './../src/business-logic/routeDrawer';
import * as L from "leaflet";

describe("RouteDrawer", () => {
    it("should add hypothetical point if drawing is in progress", () => {
        StationsContainer.stations = [{
            name: "station1",
            location: {
                lattitude: 10,
                longitude: 10
            },
            branch: { Case: "red" }
        }];
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
        StationsContainer.stations = [{
            name: "station1",
            location: {
                lattitude: 10.2,
                longitude: 10.2
            },
            branch: { Case: "red" }
        }];
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
        StationsContainer.stations = [{
            name: "station1",
            location: {
                lattitude: 10,
                longitude: 10
            },
            branch: { Case: "red" }
        }];
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
        expect(L.polyline).toHaveBeenCalledTimes(2); //only points for real route
    });

    it("should set startStation correctly", () => {
        StationsContainer.stations = [{
                name: "station1",
                location: {
                    lattitude: 10,
                    longitude: 10
                },
                branch: { Case: "red" }
            },
            {
                name: "station2",
                location: {
                    lattitude: 11,
                    longitude: 11
                },
                branch: { Case: "green" }
        }];
        const map = L.map(document.createElement("div"));
        const routeDrawer = new RouteDrawer();
        const point = new L.LatLng(9.9, 9.9);
        const point2 = new L.LatLng(11.5, 11.5);
        const point3 = new L.LatLng(12, 12);
        spyOn(L, 'polyline').and.callFake(() =>{
            return {
                addTo: () => {},
                removeFrom: () => {}
            }
        });
        routeDrawer.addPoint(map, point);
        routeDrawer.addPoint(map, point2);
        routeDrawer.addPoint(map, point3);
        expect(L.polyline).toHaveBeenCalledWith([[10, 10], [11.5, 11.5], [12, 12]]);
    });

    it("should set startStation correctly2", () => {
        StationsContainer.stations = [{
                name: "station1",
                location: {
                    lattitude: 10,
                    longitude: 10
                },
                branch: { Case: "red" }
            },
            {
                name: "station2",
                location: {
                    lattitude: 11,
                    longitude: 11
                },
                branch: { Case: "green" }
        }];
        const map = L.map(document.createElement("div"));
        const routeDrawer = new RouteDrawer();
        const point = new L.LatLng(10.9, 10.9);
        const point2 = new L.LatLng(11.5, 11.5);
        const point3 = new L.LatLng(12, 12);
        spyOn(L, 'polyline').and.callFake(() =>{
            return {
                addTo: () => {},
                removeFrom: () => {}
            }
        });
        routeDrawer.addPoint(map, point);
        routeDrawer.addPoint(map, point2);
        routeDrawer.addPoint(map, point3);
        expect(L.polyline).toHaveBeenCalledWith([[11, 11], [11.5, 11.5], [12, 12]]);
    });
});