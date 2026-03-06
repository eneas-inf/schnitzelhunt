import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BerechtigungenPage } from './berechtigungen.page';

describe('BerechtigungenPage', () => {
  let component: BerechtigungenPage;
  let fixture: ComponentFixture<BerechtigungenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BerechtigungenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
