import { Subject, Observable, interval, pipe } from 'rxjs';
import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { takeUntil, tap, filter } from 'rxjs/operators';

@Directive({
  selector: '[appHoldable]'
})
export class HoldableDirective {

  @Output() holdTime: EventEmitter<number> = new EventEmitter();
    
  state: Subject<string> = new Subject();

  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(filter(v => v ==='cancel'), 
    tap(v => {
      console.log('stopped hold time');
      this.holdTime.emit(0);
    })
      )
   }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchmove', ['$event'])
  onExit() {
    this.state.next('cancel')
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onHold(){
    console.log('started hold');
    this.state.next('start');

    const n = 100;

    interval(n)
    .pipe(takeUntil(this.cancel),
    tap(v => {
      this.holdTime.emit(v * n)
    }))
    .subscribe()
  }

}
