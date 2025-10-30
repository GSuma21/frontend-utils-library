import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPanelComponent } from './access-panel.component';

describe('AccessPanelComponent', () => {
  let component: AccessPanelComponent;
  let fixture: ComponentFixture<AccessPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
