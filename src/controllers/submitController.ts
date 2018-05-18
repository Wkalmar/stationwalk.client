import { IController } from "./icontroller";
import { RouteDrawer } from "../business-logic/routeDrawer";

export class SubmitController implements IController {
    constructor(private mymap: L.Map) {}

    path = "submit";
    
    go(): void {
        this.mymap.addEventListener('mousemove', (e : L.LeafletMouseEvent) => {
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addHypotheticalPoint(this.mymap, e.latlng);
        });
        
        this.mymap.addEventListener('click', (e : L.LeafletMouseEvent) => {
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addPoint(this.mymap, e.latlng);
        });
    }
}
