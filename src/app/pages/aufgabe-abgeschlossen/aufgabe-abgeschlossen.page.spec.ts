import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AufgabeAbgeschlossenPage } from './aufgabe-abgeschlossen.page';

describe('AufgabeAbgeschlossenPage', () => {
  let component: AufgabeAbgeschlossenPage;
  let fixture: ComponentFixture<AufgabeAbgeschlossenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AufgabeAbgeschlossenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
