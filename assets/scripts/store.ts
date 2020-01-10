import { observable } from 'mobx';

class Store {
    @observable
    public array: number[];
    @observable
    public counter: number;
    @observable
    public shadowCounter: number;

    constructor() {
        this.array = [0, 1, 2];
        this.counter = 0;
        this.shadowCounter = this.counter;
    }
}
export const store = new Store();
