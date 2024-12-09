import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyInterfaceComponent } from './sticky-interface.component';

describe('StickyInterfaceComponent', () => {
  let component: StickyInterfaceComponent;
  let fixture: ComponentFixture<StickyInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickyInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
