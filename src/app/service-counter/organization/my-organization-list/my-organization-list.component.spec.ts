import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationListComponent } from './my-organization-list.component';

describe('MyOrganizationListComponent', () => {
  let component: MyOrganizationListComponent;
  let fixture: ComponentFixture<MyOrganizationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
