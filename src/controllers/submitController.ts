import { Route } from './../models/route';
import { IController } from "./icontroller";
import { RouteDrawer } from "../business-logic/routeDrawer";

export class SubmitController implements IController {
    constructor(private mymap: L.Map) {}

    path = "submit";

    private routeToSubmit : Route;

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

        document.addEventListener('drawingSubmitted', (e: CustomEvent) => {
            let modal = document.getElementById("submitmodal");
            if (modal) {
                modal.style.display = 'block';
                this.routeToSubmit = e.detail;
            }
        });

        let submitButton = document.getElementById('routeSubmitButton');
        if (submitButton != null)
        submitButton.addEventListener('click', this.submit);
    }

    clear(): void {
        this.mymap.clearAllEventListeners();
    }

    submit = () : void => {
        let nameInput = document.getElementById('routeName') as HTMLInputElement;
        let inputText = nameInput && nameInput.value;
        if (!inputText) {
            alert('enter route name');
            return;
        }
        this.routeToSubmit.name = inputText as string;
        fetch('http://localhost:8888/route', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.routeToSubmit)
        })
        .then(() => {});
    }
}
