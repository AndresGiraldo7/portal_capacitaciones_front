import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCursos } from './admin-cursos';

describe('AdminCursos', () => {
  let component: AdminCursos;
  let fixture: ComponentFixture<AdminCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCursos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCursos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
