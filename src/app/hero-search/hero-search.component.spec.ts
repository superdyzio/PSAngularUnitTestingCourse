import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchComponent } from './hero-search.component';

describe('HeroSearchComponent', () => {
  let fixture : ComponentFixture<HeroSearchComponent>;
  let component : HeroSearchComponent;
  let heroes : Hero[];
  let mockHeroService;

  beforeEach(async(() => {
    heroes = [
      { id: 1, name: 'SuperDude', strength: 50 },
      { id: 2, name: 'AwesomeDude', strength: 100 },
      { id: 3, name: 'MoreSuperDude', strength: 75 },
    ];

    mockHeroService = jasmine.createSpyObj('HeroService', ['searchHeroes']);
    mockHeroService.searchHeroes.and.callFake((term) => of(heroes.filter(hero => hero.name.includes(term))));

    TestBed.configureTestingModule({
      declarations: [HeroSearchComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
  });

  it('should push new search term to searchTerms stream', (done) => {
    const searchTerm = 'searchTerm';
    const searchTermsObservable = component['searchTerms'].asObservable();

    searchTermsObservable.subscribe(term => {
      expect(term).toEqual(searchTerm);
      done();
    });

    component.search(searchTerm);
  });

  it('should return filtered list of heroes', (done) => {
    const searchTerm = 'SuperDude';
    const filteredHeroes = heroes.filter(hero => hero.name.includes(searchTerm));

    component.heroes$.subscribe(heroes => {
      expect(heroes).toEqual(filteredHeroes);
      expect(mockHeroService.searchHeroes).toHaveBeenCalledTimes(1);
      expect(mockHeroService.searchHeroes).toHaveBeenCalledWith(searchTerm);
      done();
    });

    component.search(searchTerm);
  });

  it('should not call heroService.searchHeroes when search term has not changed', fakeAsync(() => {
    const searchTerm = 'SuperDude';

    component.heroes$.subscribe();

    component.search(searchTerm);
    tick(350);
    component.search(searchTerm);
    tick(350);

    expect(mockHeroService.searchHeroes).toHaveBeenCalledTimes(1);
  }));
});
