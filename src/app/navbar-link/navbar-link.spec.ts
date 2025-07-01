import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLink } from './navbar-link';

describe('NavbarLink', () => {
  let component: NavbarLink;
  let fixture: ComponentFixture<NavbarLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
