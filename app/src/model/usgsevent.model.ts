export class USGSEvent {
    error: string
    Mrr: number
    Mtt: number
    Mpp: number
    Mrt: number
    Mrp: number
    Mtp: number
    Mscalar: number
    constructor(public id: string, public place: string, public longitude: number, public latitude: number,
        public detail: string, public fetched: boolean = false) { }
}