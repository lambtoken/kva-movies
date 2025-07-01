import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'NavbarLink',
  standalone: true,
  imports: [RouterModule],
  template: `<a [routerLink]="path" routerLinkActive="active">{{ name }}</a>`
})
export class NavbarLink {
  @Input() name!: string;
  @Input() path!: string;
}
