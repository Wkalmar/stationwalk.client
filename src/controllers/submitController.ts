import { Route } from './../models/route';
import { IController } from "./icontroller";
import { RouteDrawer } from "../business-logic/routeDrawer";

export class SubmitController implements IController {
    constructor(private mymap: L.Map) {}

    path = "submit";

    private routeToSubmit : Route;

    private controllerTemplate : string =
    `<div id="submit-modal" class="submit-modal">
        <div class="submit-modal-content">
        <span class="submit-modal"></span>
        <div>
            <label for="route-name">Name</label>
            <input type="text" id="route-name" placeholder="Enter route name...">
        </div>
        <button id="route-submit-button">Submit</button>
        </div>
    </div>`

    private addFormSubmittedEventListener() {
        let submitButton = document.getElementById('route-submit-button');
        if (submitButton != null)
            submitButton.addEventListener('click', this.submit);
    }

    private showSubmitModal = (e: CustomEvent) => {
        let modal = document.getElementById("submit-modal");
        if (modal) {
            modal.style.display = 'block';
            this.routeToSubmit = e.detail;
        }
    }

    private addDrawingSubmittedEventListener() {
        document.addEventListener('drawingSubmitted', this.showSubmitModal);
    }

    private addMapEventListeners() {
        this.mymap.addEventListener('mousemove', (e: L.LeafletEvent) => {
            const mouseEvent = e as L.LeafletMouseEvent;
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addHypotheticalPoint(this.mymap, mouseEvent.latlng);
        });
        this.mymap.addEventListener('click', (e: L.LeafletEvent) => {
            const mouseEvent = e as L.LeafletMouseEvent;
            const routeDrawer = RouteDrawer.drawer;
            routeDrawer.addPoint(this.mymap, mouseEvent.latlng);
        });
    }

    go(): void {
        this.addControllerTemplate();
        this.addMapEventListeners();
        this.addDrawingSubmittedEventListener();
        this.addFormSubmittedEventListener();
    }
    private addControllerTemplate() {
        let controllerTemplateContainer = document.getElementById('controller-template-container');
        if (controllerTemplateContainer == null) {
            throw new Error('Invalid html. Page should contain element with id controller-template-container');
        }
        let container = controllerTemplateContainer as HTMLElement;
        container.insertAdjacentHTML('beforebegin', this.controllerTemplate);
    }

    private removeControllerTemplate() {
        let controllerTemplateContainer = document.getElementById('submit-modal');
        if (controllerTemplateContainer != null) {
            var container = controllerTemplateContainer as HTMLElement;
            container.remove();
        }
    }

    private removeSubmitEventListeners() {
        let submitButton = document.getElementById('route-submit-button');
        if (submitButton != null)
            submitButton.removeEventListener('click', this.submit);
    }

    private removeMapEventListeners() {
        this.mymap.clearAllEventListeners();
    }

    private removeFormSubmittedEventListeners() {
        document.removeEventListener('click', this.showSubmitModal);
    }

    clear(): void {
        this.removeMapEventListeners();
        this.removeSubmitEventListeners();
        this.removeFormSubmittedEventListeners();
        this.removeControllerTemplate();
    }

    private submit = () : void => {
        let nameInput = document.getElementById('route-name') as HTMLInputElement;
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
