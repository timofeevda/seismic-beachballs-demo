import {Component, ViewChild, ElementRef} from '@angular/core'

@Component({
    template: require('./progress.component.html'),
    selector: 'progressbar'
})
export class ProgressComponent {
    @ViewChild('bar') bar: ElementRef
    @ViewChild('progresstext') progressText: ElementRef
    overall: number = 1
    current: number = 0
    constructor() { }
    ngAfterViewInit() {
        this.reset()
    }
    reset() {
        this.setOverall(1)
        this.setProgress(0)
    }
    setOverall(overall: number) {
        if (overall !== 0) {
            this.overall = overall
            this.current = 0
            this.setPercents()
        }
    }
    setProgress(progress: number) {
        this.current = progress
        this.setPercents()
    }
    private setPercents() {
        let percents = Math.round((this.current * 100) / this.overall) + "%"
        this.progressText.nativeElement.innerHTML = percents
        this.bar.nativeElement.style.width = percents
    }
}