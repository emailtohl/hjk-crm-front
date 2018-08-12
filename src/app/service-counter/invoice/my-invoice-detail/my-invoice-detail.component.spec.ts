import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvoiceDetailComponent } from './my-invoice-detail.component';

describe('MyInvoiceDetailComponent', () => {
  let component: MyInvoiceDetailComponent;
  let fixture: ComponentFixture<MyInvoiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInvoiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
