import { HomeController } from './homeController';
import { Route } from './../models/route';
import { IController } from "./icontroller";
import { RouteDrawer } from "../business-logic/routeDrawer";

export class SubmitController implements IController {
    constructor(private mymap: L.Map) {}

    path = "submit";

    private submitModalId : string = "submit-modal";
    private submitModalFormId : string = "submit-modal-form";
    private routeNameInputId : string = "route-name";
    private submitButtonId : string = "route-submit-button";
    private submitSuccessNotificationContainerId : string = "submit-modal-success";
    private gotoHomeButtonId : string = "route-submit-goto-home";

    private routeToSubmit : Route;

    private controllerTemplate : string =
    `<div id="${this.submitModalId}" class="submit-modal">
        <div id="${this.submitModalFormId}">
            <div class="submit-modal-content">
                <div>
                    <label for="${this.routeNameInputId}">Name</label>
                    <input type="text" id="${this.routeNameInputId}" placeholder="Enter route name...">
                </div>
                <button id="${this.submitButtonId}">Submit</button>
            </div>
        </div>
        <div id="${this.submitSuccessNotificationContainerId}" style="display: none;">
            Your route submitted successfully
            <button id="${this.gotoHomeButtonId}">Go to home page</button>
        </div>
    </div>`

    private addSubmitFormEventListeners() {
        let submitButton = document.getElementById(this.submitButtonId);
        if (submitButton != null)
            submitButton.addEventListener('click', this.submit);

        let goToHomeButton  = document.getElementById(this.gotoHomeButtonId);
        if (goToHomeButton != null)
            goToHomeButton.addEventListener('click', this.goToHome);
    }

    private showSubmitModal = (e: CustomEvent) => {
        let modal = document.getElementById(this.submitModalId);
        if (modal) {
            modal.style.display = 'block';
            this.routeToSubmit = e.detail;
        }
    }

    private goToHome = () => {
        this.clear();
        const homeController = new HomeController(this.mymap);
        homeController.go();
    }

    private addDrawingSubmittedEventListener() {
        document.addEventListener('drawingSubmitted', this.showSubmitModal);
    }

    private addHypotheticalPoint = (e: L.LeafletEvent) => {
        const mouseEvent = e as L.LeafletMouseEvent;
        const routeDrawer = RouteDrawer.drawer;
        routeDrawer.addHypotheticalPoint(this.mymap, mouseEvent.latlng);
    }

    private addPoint = (e: L.LeafletEvent) => {
        const mouseEvent = e as L.LeafletMouseEvent;
        const routeDrawer = RouteDrawer.drawer;
        routeDrawer.addPoint(this.mymap, mouseEvent.latlng);
    }

    private addMapEventListeners() {
        this.mymap.addEventListener('mousemove', this.addHypotheticalPoint);
        this.mymap.addEventListener('click', this.addPoint);
    }

    go(): void {
        this.addControllerTemplate();
        this.addMapEventListeners();
        this.addDrawingSubmittedEventListener();
        this.addSubmitFormEventListeners();
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
        let controllerTemplateContainer = document.getElementById(this.submitModalId);
        if (controllerTemplateContainer != null) {
            var container = controllerTemplateContainer as HTMLElement;
            container.remove();
        }
    }

    private removeSubmitFormEventListeners() {
        let submitButton = document.getElementById(this.submitButtonId);
        if (submitButton != null)
            submitButton.removeEventListener('click', this.submit);

        let goToHomeButton  = document.getElementById(this.gotoHomeButtonId);
        if (goToHomeButton != null)
            goToHomeButton.addEventListener('click', this.goToHome);
    }

    private removeMapEventListeners() {
        this.mymap.removeEventListener('mousemove', this.addHypotheticalPoint);
        this.mymap.removeEventListener('click', this.addPoint);
    }

    private removeDrawingSubmittedeventListener() {
        document.removeEventListener('click', this.showSubmitModal);
    }

    clear(): void {
        this.removeMapEventListeners();
        this.removeSubmitFormEventListeners();
        this.removeDrawingSubmittedeventListener();
        this.removeControllerTemplate();
    }

    private showSuccessNotification = () => {
        let submitSuccessNotificationContrainer = document.getElementById(this.submitSuccessNotificationContainerId);
        let submitFormContainer = document.getElementById(this.submitModalFormId);

        if (!submitFormContainer || !submitSuccessNotificationContrainer) {
            throw new Error("Invalid markup. Expected to have form container and successfull notification container");
        }

        (submitFormContainer as HTMLElement).style.display = 'none';
        (submitSuccessNotificationContrainer as HTMLElement).style.display = 'block';
    }

    private submit = () : void => {
        let nameInput = document.getElementById(this.routeNameInputId) as HTMLInputElement;
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
        .then(() => {
            this.showSuccessNotification();
        });
    }
}
