import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {
    constructor(private elementRef: ElementRef) {
    }

    @Output() public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.path'])
    @HostListener('document:touchstart', ['$event.path'])
    public onGlobalClick(targetElementPath: Array<any>) {
        let elementRefInPath = targetElementPath.find(e => e === this.elementRef.nativeElement);
        if (!elementRefInPath) {
            this.clickOutside.emit(true);
        } else {
            this.clickOutside.emit(false);
        }
    }
}
