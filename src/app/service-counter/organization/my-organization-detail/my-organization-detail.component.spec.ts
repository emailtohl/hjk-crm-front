import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationDetailComponent } from './my-organization-detail.component';

describe('MyOrganizationDetailComponent', () => {
  let component: MyOrganizationDetailComponent;
  let fixture: ComponentFixture<MyOrganizationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
