import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvoiceListComponent } from './my-invoice-list.component';

describe('MyInvoiceListComponent', () => {
  let component: MyInvoiceListComponent;
  let fixture: ComponentFixture<MyInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
