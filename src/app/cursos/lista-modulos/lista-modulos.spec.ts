import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaModulos } from './lista-modulos';

describe('ListaModulos', () => {
  let component: ListaModulos;
  let fixture: ComponentFixture<ListaModulos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaModulos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaModulos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
