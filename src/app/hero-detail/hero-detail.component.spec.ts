import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { Spied } from '../types/spied.type';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let component: HeroDetailComponent;
  let hero: Hero;
  let thirdHero: Hero;
  let mockHeroService: Spied<HeroService>;
  let mockActivatedRoute: object;
  let mockLocation: Spied<Location>;

  beforeEach(async(() => {
    hero = { id: 1, name: 'SuperDude', strength: 50 };
    thirdHero = { id: 3, name: 'SpiderrDude', strength: 100 };

    mockHeroService = jasmine.createSpyObj('HeroService', [
      'getHero',
      'updateHero'
    ]);
    mockHeroService.getHero.and.callFake((id: number) =>
      id === 3 ? of(thirdHero) : of(hero)
    );
    mockHeroService.updateHero.and.returnValue(of(null));
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '3' } }
    };

    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    component.hero = hero;
    expect(component.hero).toEqual(hero);
  });

  describe('ngOnInit', () => {
    it('should call getHero on component init', () => {
      const spy = spyOn(fixture.componentInstance, 'getHero');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('getHero', () => {
    it('should call heroService.getHero with hero id and set hero property based on response', () => {
      component.getHero();

      expect(mockHeroService.getHero).toHaveBeenCalledTimes(1);
      expect(mockHeroService.getHero).toHaveBeenCalledWith(3);
      expect(component.hero).toEqual(thirdHero);
    });
  });

  describe('goBack', () => {
    it('should call location.back', () => {
      component.goBack();
      expect(mockLocation.back).toHaveBeenCalledTimes(1);
    });
    it('should call location.back with inject', inject([Location], location => {
      component.goBack();
      expect(location.back).toHaveBeenCalledTimes(1);
    }));
    it('should call location.back with TestBed.get', () => {
      const locationSpy: Spied<Location> = TestBed.get(Location);
      component.goBack();
      expect(locationSpy.back).toHaveBeenCalledTimes(1);
    });
    it('should call location.back when user clicks back button', () => {
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('button'))[0]
        .triggerEventHandler('click', {});

      expect(mockLocation.back).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should call heroService.updateHero and then call goBack', () => {
      const goBackSpy: jasmine.Spy = spyOn(component, 'goBack');
      fixture.detectChanges();

      component.save();

      expect(mockHeroService.updateHero).toHaveBeenCalledWith(thirdHero);
      expect(mockHeroService.updateHero).toHaveBeenCalledTimes(1);
      expect(goBackSpy).toHaveBeenCalledTimes(1);
    });
    it('should call heroService.updateHero and then goBack', () => {
      const goBackSpy = spyOn(fixture.componentInstance, 'goBack');
      fixture.detectChanges();

      fixture.debugElement
        .queryAll(By.css('button'))[1]
        .triggerEventHandler('click', {});

      expect(mockHeroService.updateHero).toHaveBeenCalledWith(thirdHero);
      expect(goBackSpy).toHaveBeenCalledTimes(1);
    });
  });
});
