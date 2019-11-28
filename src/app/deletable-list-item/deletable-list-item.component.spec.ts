import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletableListItemComponent } from './deletable-list-item.component';

describe('DeletableListItemComponent', () => {
  let component: DeletableListItemComponent;
  let fixture: ComponentFixture<DeletableListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletableListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletableListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
