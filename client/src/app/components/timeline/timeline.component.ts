import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css'],
    providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit {
    public title: string;
    public status!: string;
    public identity: any;
    public token: any;
    public publications!: any;
    public page: number;
    public pages!: number;
    public total!: number;
    public itemsPerPage!: number;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
        ) {
        this.title = 'Timeline';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.page = 1;
    }
    
    ngOnInit() {
        console.log('timeline.component ha sido cargado correctamente');
       
        this.getTimeline(this.page, false);
    }
    
    getTimeline(page: number, more = false) {
        this._publicationService.getTimeline(this.token, page).subscribe(
        response => {
            if(response.publications) {
                this.total = response.total_items;
                this.pages = response.pages;
                this.itemsPerPage = response.itemsPerPage;
                if(!more) {
                    this.publications = response.publications;
                } else {
                    let arrayA = this.publications;
                    let arrayB = response.publications;
                    this.publications = arrayA.concat(arrayB);
                }
                if(page > this.pages) {
                    this._router.navigate(['/timeline']);
                }
            } else {
                this.status = 'error';
            }
        }, error => {
            console.log(<any>error);
            if(error != null) {
                this.status = 'error';
            }
        });
    }
    
    viewMore() {
        this.page += 1;
        this.getTimeline(this.page, true);
    }
    
    refresh() {
        this.page = 1;
        this.getTimeline(this.page, false);
    }
    
}
