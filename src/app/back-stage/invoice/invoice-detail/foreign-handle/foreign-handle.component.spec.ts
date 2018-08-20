import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignHandleComponent } from './foreign-handle.component';

describe('ForeignHandleComponent', () => {
  let component: ForeignHandleComponent;
  let fixture: ComponentFixture<ForeignHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
