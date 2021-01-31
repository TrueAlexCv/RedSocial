import{Component,OnInit} from "@angular/core";
import { Router,ActivatedRoute, Params} from "@angular/router";
import{Publication} from "../../models/publication";
import{PublicationService} from "../../services/publication.service";
import {UserService} from "../../services/user.service";
import {UploadService} from "../../services/upload.service";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'makePublication',
  templateUrl: './makePublication.component.html',
  styleUrls: ['./makePublication.component.css'],
  providers: [UserService, PublicationService, UploadService]
})

export class makePublicationComponent implements OnInit {
  public title: string;
  public url: string;
  public identity: any;
  public token: any;
  public status!: string;
  public publication: Publication;

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = 'Publicar un tweet';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.publication = new Publication("","","","",this.identity);
  }

  ngOnInit() {
    console.log('makePublication.component ha sido cargado correctamente');
  }

  makePublication(form: any) {
    this._publicationService.makePublication(this.token, this.publication).subscribe(
      response => {
        if(response.publication) {
          if(this.files && this.files.length) {
            this._uploadService.makeFileRequest(this.url + 'publication-image/' +
              response.publication._id, [], this.files, this.token, 'image')
          }
          this.status = 'success';
          form.reset();
          this._router.navigate(['/timeline']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
        this.status = 'error';
      });
  }

  public files!: Array<File>;
  uploadFiles(file: any) {
    this.files = <Array<File>>file.target.files;
  }
}
