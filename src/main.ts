import * as L from "leaflet";
import { StationToMarkerMapper } from "./business-logic/stationToMarkerMapper";
import { Station } from "./models/station";
import { HomeController } from './controllers/homeController';
import { SubmitController } from './controllers/submitController';
import { IController } from './controllers/icontroller';
import { StationsContainer } from "./business-logic/stationsContainer";

(function() {
    const mapboxAccesToken = '<your key here>';
    const mapUrl = `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccesToken}`;
    const mapCopyright = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';

    const mymap = L.map('mapid');
    L.tileLayer(mapUrl, {
        attribution: mapCopyright,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: mapboxAccesToken
    }).addTo(mymap);

    const stationsRequestResolver = (stations: Station[]) => {
        StationsContainer.stations = stations;
        stations.map((station: Station) => {
            const mapper = new StationToMarkerMapper(station);
            mapper.map()
                .addTo(mymap);
        })
    }

    fetch('http://localhost:8888/stations')
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error();
        }
    })
    .then(stationsRequestResolver)
    .catch(() => {
        alert("smth wrong with backend");
    });

    let currentController : IController = new HomeController(mymap);
    currentController.go();

    document.getElementsByTagName('nav')[0]
    .addEventListener('click', (e : MouseEvent) => {
        const eventTarget = e.target as HTMLElement;
        let newController : IController;
        switch (eventTarget.dataset.path) {
            case "home":
                newController = new HomeController(mymap);
                break;
            case "submit":
                newController = new SubmitController(mymap);
                break;
            default:
                newController = new HomeController(mymap);
                break;
        }
        if (newController.path !== currentController.path) {
            currentController.clear();
            currentController = newController;
            currentController.go();
        }
    });

})();