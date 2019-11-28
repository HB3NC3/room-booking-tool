import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableRoomFieldComponent } from './editable-room-field.component';

describe('EditableRoomFieldComponent', () => {
  let component: EditableRoomFieldComponent;
  let fixture: ComponentFixture<EditableRoomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableRoomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableRoomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
