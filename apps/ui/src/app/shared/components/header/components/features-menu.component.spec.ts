import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesMenuComponent } from './features-menu.component';

describe('FeaturesMenuComponent', () => {
    let component: FeaturesMenuComponent;
    let fixture: ComponentFixture<FeaturesMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeaturesMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
