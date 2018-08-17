import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationEditComponent } from './my-organization-edit.component';

describe('MyOrganizationEditComponent', () => {
  let component: MyOrganizationEditComponent;
  let fixture: ComponentFixture<MyOrganizationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
