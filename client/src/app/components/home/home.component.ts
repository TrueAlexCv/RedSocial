import {Component, OnInit, DoCheck} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, DoCheck {
  public title: string;
  public identity: any;

  constructor(private userService: UserService) {
    this.title = 'Home';
  }

  ngOnInit(): void {
    console.log('home.component ha sido cargado correctamente');
    this.identity = this.userService.getIdentity();
  }

  ngDoCheck(): void {
    this.identity = this.userService.getIdentity();
  }
}
