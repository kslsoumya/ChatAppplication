import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-first-char',
  templateUrl: './first-char.component.html',
  styleUrls: ['./first-char.component.css']
})
export class FirstCharComponent implements OnInit {
  @Input() userName: string;
  @Input() userBg: string;
  @Input() userColor: string;

  public _name: string;
  public firstChar: string;

  @Output()
  notify: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this._name = this.userName;
    this.firstChar = this._name[0];
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    const name = changes.userName;
    this._name = name.currentValue;
    this.firstChar = this._name[0];

  }

  public nameClicked() {
    this.notify.emit(this._name);
  }

}
