import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationApplyComponent } from './my-organization-apply.component';

describe('MyOrganizationApplyComponent', () => {
  let component: MyOrganizationApplyComponent;
  let fixture: ComponentFixture<MyOrganizationApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizationApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizationApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
