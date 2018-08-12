import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvoiceApplyComponent } from './my-invoice-apply.component';

describe('MyInvoiceApplyComponent', () => {
  let component: MyInvoiceApplyComponent;
  let fixture: ComponentFixture<MyInvoiceApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInvoiceApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInvoiceApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
