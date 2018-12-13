import { IController } from "./icontroller";
import { RouteDrawer } from "../business-logic/routeDrawer";

export class SubmitController implements IController {
    constructor(private mymap: L.Map) {}

    path = "submit";

    go(): void {
        this.mymap.addEventListener('mousemove', (e : L.LeafletEvent) => {
            const mouseEvent = e as L.LeafletMouseEvent
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addHypotheticalPoint(this.mymap, mouseEvent.latlng);
        });

        this.mymap.addEventListener('click', (e : L.LeafletEvent) => {
            const mouseEvent = e as L.LeafletMouseEvent
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addPoint(this.mymap, mouseEvent.latlng);
        });

        document.addEventListener('drawingSubmitted', (e: Event) => {
            let modal = document.getElementById("submitmodal");
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    clear(): void {
        this.mymap.clearAllEventListeners();
    }
}
