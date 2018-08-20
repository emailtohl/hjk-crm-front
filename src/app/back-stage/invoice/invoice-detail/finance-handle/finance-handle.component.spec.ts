import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceHandleComponent } from './finance-handle.component';

describe('FinanceHandleComponent', () => {
  let component: FinanceHandleComponent;
  let fixture: ComponentFixture<FinanceHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
