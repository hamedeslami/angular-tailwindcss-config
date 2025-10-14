import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingLabel } from './floating-label';

describe('Input', () => {
  let component: FloatingLabel;
  let fixture: ComponentFixture<FloatingLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
