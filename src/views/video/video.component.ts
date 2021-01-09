import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {AppConstant as APP} from '../../app/app.constant';
import User from 'src/models/user.model';
import Video from 'src/models/video.model';
import { UserService } from 'src/services/user.service';
import { VideoService } from 'src/services/video.service';
import { getUserId } from '../../store/getters/auth.getter';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Title } from '@angular/platform-browser';
import * as RequestAction from '../../store/actions/request.action';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {
  
  private sub1: Subscription;
  private sub2: Subscription;
  private videoId: string;
  public video: Video = {
    videoId: null,
    title: null,
    duration: null,
    createdDate: null,
    thumbnail: null,
    tags: [],
    views: null,
    like: null,
    username: null,
    profile: null
 };
  public videoOwner: User = {
    userId: null,
    username: null,
    profile: null,
    follower: null
 };
  public userId: string;
  public comment: string;
  public commentList: Array<any> = [];
  public nextVideoList: Array<Video> = [];
  public likeAble: boolean = false;
  public followAble: boolean = false;
  private commentBtn: boolean = true;
  private deleteBtn: boolean = true;
  private likeBtn: boolean = true;
  private followBtn: boolean = true;

  private Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(private route:ActivatedRoute,
    private videoService: VideoService,
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router,
    private title: Title
    ) {}

    async ngOnInit() {

        this.sub1 = this.route.paramMap.subscribe( async params => {
        this.videoId = params.get('videoId');
        await this.initData();
        });

    }

    async initData() {

        this.sub2 = this.store.pipe(select(getUserId)).subscribe(resp => {
          if(resp) {
            this.userId = resp;
          }
        });

        await new Promise((resolve, reject) => {this.videoService.getVideoById(this.videoId).toPromise()
            .then(resp => {
              this.video = resp
              this.video.tags.map(t =>{ 
                t.tag = '#'+t.tag;
                return t;
              });
              this.video.thumbnail  = APP.BASE_URL+'/'+this.video.thumbnail
              this.title.setTitle(this.video.title);
              resolve(resp);
          })
          .catch((err) => { 
              this.router.navigateByUrl(`/404`);
              reject(err);
            });
          });

        await new Promise((resolve, reject) => {this.userService.getUser(this.video.username).toPromise()
          .then(resp => {
              this.videoOwner = resp
              this.videoOwner.profile  = APP.BASE_URL+'/'+this.videoOwner.profile
              resolve(resp);
          })
          .catch((err) => { 
              reject(err);
            });
          });

            await this.getCommnet();

            await this.getVideoStatus();


            await new Promise((resolve, reject) => {this.videoService.getNextVideo({currentVideoId: this.videoId}).toPromise()
              .then(resp => {
                if(resp.length){
                  this.nextVideoList = resp.map(v => {
                    v.thumbnail = APP.BASE_URL+'/'+v.thumbnail;
                    return v;
                  });
                }else {
                  this.nextVideoList = [];
                }
                resolve(resp);
                })
                .catch((err) => { 
                    this.nextVideoList = [];
                    reject(err);
                  });
                });
                
                this.store.dispatch(new RequestAction.ClearRequestAction());
    }

    async getCommnet() {

      await new Promise((resolve, reject) => {this.videoService.getComment(this.videoId).toPromise()
        .then(resp => {
          if(resp.length){
            this.commentList = resp.map(c => {
              c.commenterProfile =  APP.BASE_URL+'/'+c.commenterProfile;
              return c;
            });
          }else {
            this.commentList = [];
          }
          resolve(resp);
          })
          .catch((err) => { 
              this.commentList = [];
              reject(err);
            });
          });          
    }

    async getVideoStatus() {

      let request: any = {};
      request.userId = this.userId;
      request.videoId = this.video.videoId;
      await new Promise((resolve, reject) => {this.videoService.getVideoStatus(request).toPromise()
        .then(resp => {
              this.likeAble = resp.liked === 'N'? true: false;
              this.followAble = resp.followed === 'N'? true: false;
          resolve(resp);
          })
          .catch((err) => { 
              this.likeAble = false;
              this.followAble = false;
              reject(err);
            });
          });
    }

    async follow() {
        if(this.followBtn){
          this.followBtn = false;
          let request: any = {};
          request.userId = this.userId;
          request.followingId = this.videoOwner.userId;
          await new Promise((resolve, reject) => {this.userService.follow(request).toPromise()
            .then(async resp => {
              if(resp.status == 'follow'){
                this.videoOwner.follower++;
              }else{
                this.videoOwner.follower--;
              }
              await this.getVideoStatus();
              resolve(resp);
          })
          .catch((err) => { 
              reject(err);
            });
          });
          this.followBtn = true;
      }
    }

    async like() {
      if(this.likeBtn){
        this.likeBtn = false;
        if(this.videoOwner.userId === this.userId) {
          this.likeBtn = true;
          return;
        }

        let request: any = {};
        request.userId = this.userId;
        request.videoId = this.video.videoId;
        await new Promise((resolve, reject) => {this.videoService.likeVideo(request).toPromise()
          .then(async resp => {
            if(resp.status == 'like'){
              this.video.like++;
            }else{
              this.video.like--;
            }
            await this.getVideoStatus();
            resolve(resp);
        })
        .catch((err) => { 
            reject(err);
          });
        });
        this.likeBtn = true;
      }
    }

    async addComment() {

      if(this.commentBtn) {
        this.commentBtn = false;
        if(this.comment) {
              let request: any = {};
              request.userId = this.userId;
              request.videoId = this.video.videoId;
              request.comment = this.comment;
              await new Promise((resolve, reject) => {this.videoService.addComment(request).toPromise()
                .then(async resp => {
                  this.comment = null;
                  await this.getCommnet();
                  resolve(resp);
              })
              .catch((err) => { 
                  reject(err);
                });
              });
        }
        this.commentBtn = true;
      }
    }

    async deleteComment(commentId) {
      if(this.deleteBtn) {
        this.deleteBtn = false;
        if(commentId) {
          Swal.fire({
            title: 'Do you want to delete?',
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#37c005',
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: 'No',
            cancelButtonColor: 'red',
            focusCancel: false,
            allowEnterKey: false,
            allowOutsideClick: false
          }).then(async (result) => {
            if (result.isConfirmed) {
              await this.confirmDelete(commentId)
            }
          })
        }
        this.deleteBtn = true;
      }
    }

    async confirmDelete(commentId) {
      await new Promise((resolve, reject) => {this.videoService.deleteComment(commentId).toPromise()
        .then(async resp => {
          await this.getCommnet();
          resolve(resp);
      })
      .catch((err) => { 
          reject(err);
        });
      });
      this.Toast.fire({
        icon: 'success',
        title: 'Delete success'
      })
    }

    gotoUser(username: string) {
      this.router.navigateByUrl(`/user/${username}`);
    }

    gotoVideo(videoId: string) {
      this.router.navigateByUrl(`/video/${videoId}`);
    }

    ngOnDestroy() {
        if(this.sub1) this.sub1.unsubscribe();
        if(this.sub2) this.sub2.unsubscribe();
    }

}
