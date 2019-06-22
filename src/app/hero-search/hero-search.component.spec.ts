import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Spied } from '../types/spied.type';

import { HeroSearchComponent } from './hero-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('HeroSearchComponent', () => {
  let fixture: ComponentFixture<HeroSearchComponent>;
  let component: HeroSearchComponent;
  let heroes: Hero[];
  let mockHeroService: Spied<HeroService>;

  beforeEach(async(() => {
    heroes = [
      { id: 1, name: 'SuperDude', strength: 50 },
      { id: 2, name: 'AwesomeDude', strength: 100 },
      { id: 3, name: 'MoreSuperDude', strength: 75 }
    ];
    mockHeroService = jasmine.createSpyObj('HeroService', ['searchHeroes']);
    mockHeroService.searchHeroes.and.callFake(term =>
      of(heroes.filter(hero => hero.name.includes(term)))
    );
    TestBed.configureTestingModule({
      declarations: [HeroSearchComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should push new search term to searchTerms subject', () => {
    const searchTerm = 'searchTerm';
    component['searchTerms'].subscribe((term: string) => {
      expect(term).toEqual(searchTerm);
    });
    component.search(searchTerm);
  });

  it('should return filtered list of heroes', done => {
    const searchTerm = 'SuperDude';
    const filteredHeroes: Hero[] = heroes.filter(hero =>
      hero.name.includes(searchTerm)
    );
    component.heroes$.subscribe((heroesList: Hero[]) => {
      expect(heroesList).toEqual(filteredHeroes);
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
  it('should call heroService.searchHeroes twice when search term has changed and time between search more than 300 ms', fakeAsync(() => {
    const searchTerm = 'Dude';
    const secondSearchTerm = 'SuperDude';
    component.heroes$.subscribe();
    component.search(searchTerm);
    tick(350);
    component.search(secondSearchTerm);
    tick(350);
    expect(mockHeroService.searchHeroes).toHaveBeenCalledTimes(2);
    expect(mockHeroService.searchHeroes.calls.allArgs()).toEqual([
      [searchTerm],
      [secondSearchTerm]
    ]);
  }));
  it('should call heroService.searchHeroes once with second searchterm when search term has changed but time between search less than 300 ms', fakeAsync(() => {
    const searchTerm = 'Dude';
    const secondSearchTerm = 'SuperDude';
    component.heroes$.subscribe();
    component.search(searchTerm);
    tick(250);
    component.search(secondSearchTerm);
    tick(350);
    expect(mockHeroService.searchHeroes).toHaveBeenCalledTimes(1);
    expect(mockHeroService.searchHeroes).toHaveBeenCalledWith(secondSearchTerm);
  }));
});
