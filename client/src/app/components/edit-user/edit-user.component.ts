import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService]
})

export class EditUserComponent implements OnInit {
  public title: string;

  constructor() {
    this.title = "Editar usuario";
  }

  ngOnInit() {
    console.log('edit-user.component ha sido cargado correctamente');
  }
}
