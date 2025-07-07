import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diamonds } from './diamonds';

describe('Diamonds', () => {
  let component: Diamonds;
  let fixture: ComponentFixture<Diamonds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diamonds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diamonds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
