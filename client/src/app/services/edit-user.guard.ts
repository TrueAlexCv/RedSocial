import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditUserComponent } from '../components/edit-user/edit-user.component';

@Injectable({
  providedIn: 'root'
})

export class EditUserGuard implements CanDeactivate<EditUserComponent> {
  canDeactivate(component: EditUserComponent): boolean {
    if (component.isDirty) {
      const title = component.title || 'Cambios';
      return confirm('Abandonar la página te hará perder los cambios realizados, ¿estás seguro?');
    }
    return true;
  }
}
