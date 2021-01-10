import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {AppConstant as APP} from '../app/app.constant';
import Video from '../models/video.model';
import Comment from '../models/comment.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app/app.state';
import * as RequestAction from '../store/actions/request.action';

@Injectable({ providedIn: 'root' })
export class VideoService {

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public getVideoByUsername(username: string): Observable<Array<Video>> {
    this.store.dispatch(RequestAction.AddRequestAction());
    return this.http.get<Array<Video>>(APP.BASE_URL+`/api/getVideo/${username}`);
  }

  public searchVideo(query: string): Observable<Array<Video>> {
    this.store.dispatch(RequestAction.AddRequestAction());
    return this.http.get<Array<Video>>(APP.BASE_URL+`/api/search?result=${query}`);
  }

  public getVideoById(videoId: string): Observable<Video> {
    this.store.dispatch(RequestAction.AddRequestAction());
    return this.http.get<Video>(APP.BASE_URL+`/api/video/${videoId}`);
  }

  public getComment(videoId: string): Observable<Array<Comment>> {
    return this.http.get<Array<Comment>>(APP.BASE_URL+`/api/getComment/${videoId}`);
  }

  public getVideoStatus(request: any): Observable<any> { 
    return this.http.post<any>(APP.BASE_URL+'/api/videoStatus', request);
  }

  public getNextVideo(request: any): Observable<Array<Video>> { 
    this.store.dispatch(RequestAction.AddRequestAction());
    return this.http.post<Array<Video>>(APP.BASE_URL+'/api/nextVideos', request);
  }

  public addComment(request: any): Observable<any> { 
    return this.http.post<any>(APP.BASE_URL+'/api/addComment', request);
  }

  public deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(APP.BASE_URL+`/api/deleteComment/${commentId}`);
  }

  public likeVideo(request: any): Observable<any> { 
    return this.http.put<any>(APP.BASE_URL+'/api/like', request);
  }


}
