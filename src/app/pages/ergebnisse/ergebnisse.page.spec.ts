import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErgebnissePage } from './ergebnisse.page';

describe('ErgebnissePage', () => {
  let component: ErgebnissePage;
  let fixture: ComponentFixture<ErgebnissePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErgebnissePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
