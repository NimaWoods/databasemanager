import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDatabaseComponent } from './create-database.component';

describe('CreateDatabaseComponent', () => {
  let component: CreateDatabaseComponent;
  let fixture: ComponentFixture<CreateDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
