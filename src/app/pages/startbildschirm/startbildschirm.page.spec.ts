import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartbildschirmPage } from './startbildschirm.page';

describe('StartbildschirmPage', () => {
  let component: StartbildschirmPage;
  let fixture: ComponentFixture<StartbildschirmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartbildschirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
