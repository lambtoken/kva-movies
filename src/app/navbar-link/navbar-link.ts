import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import './navbar-link.css';

@Component({
  selector: 'NavbarLink',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./navbar-link.css'],
  template: `<a [routerLink]="path" routerLinkActive="active">{{ name }}</a>`
})
export class NavbarLink {
  @Input() name!: string;
  @Input() path!: string;
}
