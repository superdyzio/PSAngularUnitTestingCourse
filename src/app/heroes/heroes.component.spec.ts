import { of } from 'rxjs/observable/of';
import { Hero } from '../hero';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component : HeroesComponent;
  let HEROES : Array<Hero>;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'WonderfulWoman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj('HeroService', ['addHero', 'deleteHero', 'getHeroes']);
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    mockHeroService.deleteHero.and.returnValue(of(true));

    component = new HeroesComponent(mockHeroService);
  });

  describe('getHeroes', () => {
    it('should call heroService.getHeroes', () => {
      component.getHeroes();

      expect(mockHeroService.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('should set heroes property to getHeroes result', () => {
      component.getHeroes();

      expect(component.heroes).toEqual(HEROES);
    });
  });

  describe('add', () => {
    let newHeroName : string;
    let expectedAddedHero : Hero;

    beforeEach(() => {
      newHeroName = 'NewDude';
      component.heroes = HEROES;
      expectedAddedHero = { id: 4, name: newHeroName, strength: 11 };

      mockHeroService.addHero.and.returnValue(of(expectedAddedHero));
    });

    it('should call heroService.addHero', () => {
      component.add(newHeroName);

      expect(mockHeroService.addHero).toHaveBeenCalledWith({ name: newHeroName, strength: 11 });
      expect(mockHeroService.addHero).toHaveBeenCalledTimes(1);
    });

    it('should add hero to heroes array', () => {
      const startingHeroesCount = HEROES.length;

      component.add(newHeroName);

      expect(component.heroes.length).toEqual(startingHeroesCount + 1);
    });
  });

  describe('deleteHero', () => {
    it('should remove hero from list', () => {
      const heroToRemove = HEROES[1];
      component.heroes = HEROES;

      component.delete(heroToRemove);

      expect(component.heroes).toEqual(HEROES.filter(hero => hero !== heroToRemove));
    });

    it('should call heroService.deleteHero with given hero', () => {
      const heroToRemove = HEROES[1];
      component.heroes = HEROES;

      component.delete(heroToRemove);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroToRemove);
      expect(mockHeroService.deleteHero).toHaveBeenCalledTimes(1);
    });
  });
});
