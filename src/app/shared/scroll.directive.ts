import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.overflow = 'auto';
    this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight;
  }

}
