import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinCodeInput } from './pin-code-input';

describe('PinCodeInput', () => {
  let component: PinCodeInput;
  let fixture: ComponentFixture<PinCodeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinCodeInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinCodeInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
