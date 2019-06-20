import { of } from 'rxjs/observable/of';

import { Hero } from '../hero';

import { HeroesComponent } from './heroes.component';
import { Spied } from '../types/spied.type';
import { HeroService } from '../hero.service';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES: Hero[];
  let mockHeroService: Spied<HeroService>;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'WonderfulWoman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 }
    ];

    mockHeroService = jasmine.createSpyObj('HeroService', [
      'addHero',
      'deleteHero',
      'getHeroes'
    ]);
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    mockHeroService.deleteHero.and.returnValue(of(true));

    component = new HeroesComponent(<HeroService>(<any>mockHeroService));
  });
  describe('ngOnInit', () => {
    it('should call getHeroes method 1 time', () => {
      const spy: jasmine.Spy = spyOn(component, 'getHeroes');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('getHeroes', () => {
    it('should call heroService.getHeroes 1 time', () => {
      component.getHeroes();
      expect(mockHeroService.getHeroes).toHaveBeenCalledTimes(1);
    });
    it('should set component.heroes property to value returns by heroService.getHeroes', () => {
      component.getHeroes();
      expect(component.heroes).toEqual(HEROES);
    });
  });

  describe('add', () => {
    const defaultStrength = 11;
    const newHeroWithDefaultStrengthName = 'Default Dude';
    const expectedAddedHeroWithDefaultStrength: Hero = {
      id: 4,
      name: newHeroWithDefaultStrengthName,
      strength: defaultStrength
    };
    const expectedAddedHeroArgWithDefaultStrength = {
      name: newHeroWithDefaultStrengthName,
      strength: defaultStrength
    };

    const newHeroStrength = 999;
    const newHeroWithProvidedStrengthName = 'New Strongest Dude';
    const expectedAddedHeroWithProvidedStrength: Hero = {
      id: 5,
      name: newHeroWithProvidedStrengthName,
      strength: newHeroStrength
    };
    const expectedAddedHeroArgWithProvidedStrength = {
      name: newHeroWithProvidedStrengthName,
      strength: newHeroStrength
    };
    beforeEach(() => {
      component.heroes = HEROES;
    });

    it('should do nothing when name is undefined', () => {
      const startingHeroesCount = component.heroes.length;
      component.add(undefined);
      expect(component.heroes.length).toBe(startingHeroesCount);
      expect(mockHeroService.addHero).not.toHaveBeenCalled();
    });
    it('should do nothing when name is empty', () => {
      const startingHeroesCount = component.heroes.length;
      component.add('');
      expect(component.heroes.length).toBe(startingHeroesCount);
      expect(mockHeroService.addHero).not.toHaveBeenCalled();
    });
    it('should do nothing when name contain only whitechar', () => {
      const startingHeroesCount = component.heroes.length;
      component.add(' \t');
      expect(component.heroes.length).toBe(startingHeroesCount);
      expect(mockHeroService.addHero).not.toHaveBeenCalled();
    });
    it('should add hero to hereos array with default strength', () => {
      mockHeroService.addHero.and.returnValue(
        of(expectedAddedHeroWithDefaultStrength)
      );
      const startingHeroesCount = component.heroes.length;
      component.add(newHeroWithDefaultStrengthName);
      expect(component.heroes.length).toBe(startingHeroesCount + 1);
      expect(component.heroes).toContain(expectedAddedHeroWithDefaultStrength);
    });
    it('should call HeroService.addHero using default strength when not provided', () => {
      mockHeroService.addHero.and.returnValue(
        of(expectedAddedHeroWithDefaultStrength)
      );
      component.add(newHeroWithDefaultStrengthName);
      expect(mockHeroService.addHero).toHaveBeenCalledWith(
        expectedAddedHeroArgWithDefaultStrength
      );
      expect(mockHeroService.addHero).toHaveBeenCalledTimes(1);
    });
    it('should add hero to hereos array with provide strength', () => {
      mockHeroService.addHero.and.returnValue(
        of(expectedAddedHeroWithProvidedStrength)
      );
      const startingHeroesCount = component.heroes.length;
      component.add(newHeroWithDefaultStrengthName, `${newHeroStrength}`);
      expect(component.heroes.length).toBe(startingHeroesCount + 1);
      expect(component.heroes).toContain(expectedAddedHeroWithProvidedStrength);
    });
    it('should call HeroService.addHero using provide strength', () => {
      mockHeroService.addHero.and.returnValue(
        of(expectedAddedHeroWithProvidedStrength)
      );
      component.add(newHeroWithProvidedStrengthName, `${newHeroStrength}`);
      expect(mockHeroService.addHero).toHaveBeenCalledWith(
        expectedAddedHeroArgWithProvidedStrength
      );
      expect(mockHeroService.addHero).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    let heroToRemove: Hero;

    beforeEach(() => {
      component.heroes = HEROES;
      heroToRemove = HEROES[1];
    });

    it('should call heroService.deleteHero using given object 1 time', () => {
      component.delete(heroToRemove);
      expect(mockHeroService.deleteHero).toHaveBeenCalledTimes(1);
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroToRemove);
    });
    it('should delete with given object from component.heroes array ', () => {
      const startingHeroesLength = component.heroes.length;
      expect(component.heroes).toContain(heroToRemove);
      component.delete(heroToRemove);
      expect(component.heroes.length).toBe(startingHeroesLength - 1);
      expect(component.heroes).not.toContain(heroToRemove);
    });
  });
});
