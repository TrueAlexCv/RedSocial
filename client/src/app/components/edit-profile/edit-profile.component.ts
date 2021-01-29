import {Component, OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {UploadService} from "../../services/upload.service";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [UserService, UploadService]
})

export class EditProfileComponent implements OnInit {
  public title: string;
  public url: string;
  public status!: string;
  public identity: any;
  public token: any;

  constructor(
    private _userService: UserService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = "Editar perfil";
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    console.log('edit-profile.component ha sido cargado correctamente');
  }

  updateProfile(form: any) {
    this._userService.updateProfile(this.identity).subscribe(
      response => {
        if(response.user) {
          if(this.uploadImage && this.uploadImage.length) {
            this._uploadService.makeFileRequest(this.url + 'upload-image/' + this.identity._id, [],
              this.uploadImage, this.token, 'image');
          }
          if(this.uploadBanner && this.uploadBanner.length) {
            this._uploadService.makeFileRequest(this.url + 'upload-banner/' + this.identity._id, [],
              this.uploadBanner, this.token, 'banner');
          }
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this._router.navigate(['/profile',this.identity._id]);
        } else {
          this.status = 'error';
        }
      }
      , error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  public uploadImage!: Array<File>;
  changeImage(file: any) {
    this.uploadImage = <Array<File>>file.target.files;
  }

  public uploadBanner!: Array<File>;
  changeBanner(file: any) {
    this.uploadBanner = <Array<File>>file.target.files;
  }
}
