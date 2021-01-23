import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    public title: string;
    
    constructor() {
        this.title = "Home"
    }
    
    ngOnInit() {
        console.log('home.component ha sido cargado correctamente');
    }
}
