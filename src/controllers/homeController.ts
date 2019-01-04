import { IController } from "./icontroller";
import { Route } from "../models/route";
import { RouteToCheckPointsMapper } from "../business-logic/routeToCheckpointsMapper";

    export class HomeController implements IController {
        constructor(private mymap: L.Map) {}

        path = "home";

        private checkPointsCollection: L.Polyline[] = [];

        routesRequestResolver = (routesResponse: Route[]) => {
            routesResponse.map((route: Route) => {
                const mapper = new RouteToCheckPointsMapper(route);
                let checkpoints = mapper.map();
                checkpoints.addTo(this.mymap);
                this.checkPointsCollection.push(checkpoints);
            })
        }

        go(): void {
            fetch('http://localhost:8888/routes')
            .then((response) => {
                if (response.ok) {
                    this.mymap.setView([50.415, 30.521], 12);
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(this.routesRequestResolver)
            .catch(() => {
                alert("smth wrong with backend");
            });
        }

        clear(): void {
            this.checkPointsCollection.map(p => p.removeFrom(this.mymap));
            this.checkPointsCollection = [];
        }
    }
