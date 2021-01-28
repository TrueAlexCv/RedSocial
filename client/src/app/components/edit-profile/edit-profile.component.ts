import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  providers: [UserService]
})

export class EditProfileComponent implements OnInit {
  public title: string;

  constructor() {
    this.title = "Editar perfil";
  }

  ngOnInit() {
    console.log('edit-profile.component ha sido cargado correctamente');
  }
}
