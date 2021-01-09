import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, Event, NavigationStart } from '@angular/router';

@Component({
  selector: 'input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css']
})
export class InputSearchComponent implements OnInit, OnDestroy {

  @Output() searchText = new EventEmitter<String>();
  public text: String;
  private sub: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.sub = this.router.events
    .subscribe(
      (event: Event) => {
        if(event instanceof NavigationStart) {
          if(event.url !== '/search'){
            this.text = null;
          }
        }
      });
  }

  search() {
    if(this.text) {
      this.searchText.emit(this.text);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
