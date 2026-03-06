import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AufgabeAnzeigenPage } from './aufgabe-anzeigen.page';

describe('AufgabeAnzeigenPage', () => {
  let component: AufgabeAnzeigenPage;
  let fixture: ComponentFixture<AufgabeAnzeigenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AufgabeAnzeigenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
