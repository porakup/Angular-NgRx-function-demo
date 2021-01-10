import { Component, OnDestroy, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import Video from 'src/models/video.model';
import { VideoService } from 'src/services/video.service';
import {AppConstant as APP} from '../../app/app.constant';
import { getQuery } from '../../store/getters/search.getter';
import * as RequestAction from '../../store/actions/request.action';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy { 

  public videoList: Array<Video> = [];
  private sub: Subscription;

  constructor(private videoService: VideoService,
              private store: Store<AppState>,
              private router: Router,
              private title: Title
              ) {}

  async ngOnInit() {
    this.title.setTitle('Search');
    await this.initData()
  }

  async initData() {

    this.sub = this.store.pipe(select(getQuery)).subscribe(async resp => {
      if(resp) {
        await new Promise((resolve, reject) => {this.videoService.searchVideo(resp).toPromise()
          .then(resp => {
            if(resp.length){
            this.videoList = resp.map(v => {
              v.thumbnail = APP.BASE_URL+'/'+v.thumbnail;
              v.profile = APP.BASE_URL+'/'+v.profile;
              return v
            });
            }else{
              this.videoList = [];
            }
            resolve(resp);
        })
        .catch((err) => { 
            this.videoList = [];
            reject(err);
          });
        });
        this.store.dispatch(RequestAction.ClearRequestAction());
      }
    });

  }

  gotoVideo(videoId: string) {
    this.router.navigateByUrl(`/video/${videoId}`);
  }

  gotoUser(username: string) {
    this.router.navigateByUrl(`/user/${username}`);
  }

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe();
  }

}
