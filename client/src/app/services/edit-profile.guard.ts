import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditProfileComponent } from '../components/edit-profile/edit-profile.component';

@Injectable({
  providedIn: 'root'
})

export class EditProfileGuard implements CanDeactivate<EditProfileComponent> {
  canDeactivate(component: EditProfileComponent): boolean {
    if (component.isDirty) {
      const title = component.title || 'Cambios';
      return confirm('Abandonar la página te hará perder los cambios realizados, ¿estás seguro?');
    }
    return true;
  }
}
