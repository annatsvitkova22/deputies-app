import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[clickSelect]'
})
export class ClickSelectDirective {
    constructor(private elementRef: ElementRef) {
    }

    @Output() public clickSelect = new EventEmitter();

    @HostListener('document:click', ['$event.path'])
    @HostListener('document:touchstart', ['$event.path'])
    public onGlobalClick(targetElementPath: Array<any>) {
        let elementRefInPath = targetElementPath.find(e => e === this.elementRef.nativeElement);
        if (!elementRefInPath) {
            this.clickSelect.emit(false);
        } else {
            const nodeList = this.elementRef.nativeElement.querySelectorAll('.c-angle-down');
            if (nodeList.length) {
                this.clickSelect.emit(true);
            } else {
                this.clickSelect.emit(false);
            }
        }
    }
}
