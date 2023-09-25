import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangesideComponent } from './exchangeside.component';

describe('ExchangesideComponent', () => {
  let component: ExchangesideComponent;
  let fixture: ComponentFixture<ExchangesideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangesideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangesideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
