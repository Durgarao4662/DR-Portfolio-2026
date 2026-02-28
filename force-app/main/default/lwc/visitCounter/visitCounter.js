import { LightningElement, track } from 'lwc';
import updateAndGetVisitCount from '@salesforce/apex/WebsiteVisitController.updateAndGetVisitCount';

export default class VisitCounter extends LightningElement {

    @track visitCount = 0;

    connectedCallback() {
        this.updateCounter();
    }

    updateCounter() {
        updateAndGetVisitCount()
            .then(result => {
                this.animateCount(result);
            })
            .catch(error => {
                console.error(error);
            });
    }

    animateCount(finalValue) {
        let current = 0;
        const interval = setInterval(() => {
            current += Math.ceil(finalValue / 30);
            if(current >= finalValue){
                current = finalValue;
                clearInterval(interval);
            }
            this.visitCount = current;
        }, 30);
    }
}