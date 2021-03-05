import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Publication} from '../../models/publication';
import {PublicationService} from '../../services/publication.service';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'makePublication',
  templateUrl: './makePublication.component.html',
  styleUrls: ['./makePublication.component.css'],
  providers: [UserService, PublicationService, UploadService]
})

export class MakePublicationComponent implements OnInit {
  public title: string;
  public url: string;
  public identity: any;
  public token: any;
  public status!: string;
  public publication: Publication;
  public files!: Array<File>;

  @Output() make = new EventEmitter<boolean>();

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private uploadService: UploadService,
    private router: Router,
  ) {
    this.title = 'Publicar un tweet';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.publication = new Publication('', '', '', '', this.identity);
  }

  ngOnInit(): void {
    console.log('makePublication.component ha sido cargado correctamente');
  }

  makePublication(form: any): void {
    this.publicationService.makePublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          this.make.emit(true);
          if (this.files && this.files.length) {
            this.uploadService.makeFileRequest(this.url + 'publication-image/' +
              response.publication._id, [], this.files, this.token, 'image');
          }
          this.status = 'success';
          form.reset();
          this.router.navigate(['/timeline']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  closeMakePublication(): void {
    this.make.emit(true);
  }

  uploadFiles(file: any): void {
    this.files = (file.target.files as Array<File>);
  }
}
