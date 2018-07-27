import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { StrengthPipe } from '../strength/strength.pipe';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture : ComponentFixture<DashboardComponent>;
  let HEROES : Array<Hero>;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'WonderfulWoman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj('HeroService', ['getHeroes']);
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        StrengthPipe,
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('should call getHeroes on component init', () => {
    const spy = spyOn(fixture.componentInstance, 'getHeroes');

    fixture.componentInstance.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should call heroService.getHeroes and set heroes array based on response', () => {
    fixture.componentInstance.getHeroes();

    expect(mockHeroService.getHeroes).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.heroes).toEqual(HEROES.slice(1, 5));
  });
});
