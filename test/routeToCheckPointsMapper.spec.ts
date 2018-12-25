import { RouteToCheckPointsMapper } from './../src/business-logic/routeToCheckpointsMapper';
import * as L from "leaflet";

describe("RouteToCheckPointsMapper", () => {
    it("Should map DTO to polyline as expected", () => {
        const dto = {
            stationStart: {
                name: "station1",
                location: {
                    lattitude: 11.1,
                    longitude: 10.1
                },
                branch: { Case: "red" }
            },
            stationEnd: {
                name: "station2",
                location: {
                    lattitude: 14.1,
                    longitude: 13.1
                },
                branch: { Case: "red" }
            },
            checkpoints: [{
                lattitude: 12.2,
                longitude: 11.3
            }, {
                lattitude: 13.4,
                longitude: 12.5
            }],
            name: "route1"
        };
        const sut = new RouteToCheckPointsMapper(dto);
        const polyline = sut.map();
        const points = polyline.getLatLngs();
        expect(points).toEqual([new L.LatLng(11.1, 10.1),
            new L.LatLng(12.2, 11.3),
            new L.LatLng(13.4, 12.5),
            new L.LatLng(14.1, 13.1)
        ]);
    });
});