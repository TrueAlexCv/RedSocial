import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';

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
  public guardar: any;
  public uploadImage!: Array<File>;
  public uploadBanner!: Array<File>;

  constructor(
    private userService: UserService,
    private uploadService: UploadService,
    private router: Router,
  ) {
    this.title = 'Editar perfil';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.guardar = {
      name: this.identity.name,
      biography: this.identity.biography
    };
  }

  ngOnInit(): void {
    console.log('edit-profile.component ha sido cargado correctamente');
  }

  updateProfile(form: any): void {
    this.userService.updateProfile(this.identity).subscribe(
      response => {
        if (response.user) {
          if (this.uploadImage && this.uploadImage.length) {
            this.uploadService.makeFileRequest(this.url + 'upload-image/' + this.identity._id, [],
              this.uploadImage, this.token, 'image');
          }
          if (this.uploadBanner && this.uploadBanner.length) {
            this.uploadService.makeFileRequest(this.url + 'upload-banner/' + this.identity._id, [],
              this.uploadBanner, this.token, 'banner');
          }
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.identity));
          this.router.navigate(['/profile', this.identity._id]);
        } else {
          this.status = 'error';
        }
      }
      , error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  changeImage(file: any): void {
    this.uploadImage = (file.target.files as Array<File>);
  }

  changeBanner(file: any): void {
    this.uploadBanner = (file.target.files as Array<File>);
  }

  /* Cambios: */
  get isDirty(): boolean {
    const datos = {
      name: this.identity.name,
      biography: this.identity.biography
    };
    return (datos.name !== this.guardar.name) || (datos.biography !== this.guardar.biography);
  }
}
