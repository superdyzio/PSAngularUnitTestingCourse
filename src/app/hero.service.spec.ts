import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Hero } from './hero';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  let mockMessageService;

  beforeEach(async(() => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ]
    });
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(HeroService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getHeroes', () => {
    let heroes: Hero[];

    beforeEach(() => {
      heroes = [
        { id: 1, name: 'SuperDude', strength: 50 },
        { id: 2, name: 'UltraDude', strength: 80 },
        { id: 3, name: 'AwesomeDude', strength: 100 }
      ];
    });

    it('should return array of heroes and call messageService.add with success message', done => {
      service.getHeroes().subscribe(res => {
        expect(res).toEqual(heroes);
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          'HeroService: fetched heroes'
        );
        done();
      });

      const heroesRequest = httpMock.expectOne('api/heroes');
      heroesRequest.flush(heroes);
    });

    it('should call messageService.add with error message when request fails', done => {
      service.getHeroes().subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          'HeroService: getHeroes failed:'
        );
        done();
      });

      const heroesRequest = httpMock.expectOne('api/heroes');
      heroesRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('getHeroNo404', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 1, name: 'SuperDude', strength: 50 };
    });

    it('should return hero when present and call messageService.add with success message', done => {
      const id = 1;

      service.getHeroNo404(id).subscribe(res => {
        expect(res).toEqual(hero);
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: fetched hero id=${id}`
        );
        done();
      });

      const heroRequest = httpMock.expectOne(`api/heroes/?id=${id}`);
      heroRequest.flush([hero]);
    });

    it('should return undefined when hero not present and call messageService.add with proper message', done => {
      const id = 2;

      service.getHeroNo404(id).subscribe(res => {
        expect(res).toBeUndefined();
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: did not find hero id=${id}`
        );
        done();
      });

      const heroRequest = httpMock.expectOne(`api/heroes/?id=${id}`);
      heroRequest.flush([]);
    });

    it('should call messageService.add with error message when request fails', done => {
      const id = 1;

      service.getHeroNo404(id).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          `HeroService: getHero id=${id}`
        );
        done();
      });

      const heroRequest = httpMock.expectOne(`api/heroes/?id=${id}`);
      heroRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('getHero', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 1, name: 'SuperDude', strength: 50 };
    });

    it('should return hero when present and call messageService.add with success message', done => {
      const id = 1;

      service.getHero(id).subscribe(res => {
        expect(res).toEqual(hero);
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: fetched hero id=${id}`
        );
        done();
      });

      const heroRequest = httpMock.expectOne(`api/heroes/${id}`);
      heroRequest.flush(hero);
    });

    it('should call messageService.add with error message when request fails', done => {
      const id = 2;

      service.getHero(id).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          `HeroService: getHero id=${id}`
        );
        done();
      });

      const heroRequest = httpMock.expectOne(`api/heroes/${id}`);
      heroRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('searchHeroes', () => {
    let heroes: Hero[];

    beforeEach(() => {
      heroes = [
        { id: 1, name: 'SuperDude', strength: 50 },
        { id: 2, name: 'SomeDude', strength: 80 },
        { id: 3, name: 'AwesomeDude', strength: 100 }
      ];
    });

    it('should not sent request and return empty array when search term has no characters in it', done => {
      const searchTerm = ' ';

      service.searchHeroes(searchTerm).subscribe(res => {
        expect(res).toEqual([]);
        expect(mockMessageService.add).not.toHaveBeenCalled();
        done();
      });

      httpMock.expectNone(`api/heroes/?name=${searchTerm}`);
    });

    it('should return matching heroes and call messageService.add with success message', done => {
      const searchTerm = 'Dude';

      service.searchHeroes(searchTerm).subscribe(res => {
        expect(res).toEqual(heroes);
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: found heroes matching "${searchTerm}"`
        );
        done();
      });

      const searchRequest = httpMock.expectOne(
        `api/heroes/?name=${searchTerm}`
      );
      searchRequest.flush(heroes);
    });

    it('should call messageService.add with error message when request fails', done => {
      const searchTerm = 'searchTerm';

      service.searchHeroes(searchTerm).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          'HeroService: searchHeroes'
        );
        done();
      });

      const searchRequest = httpMock.expectOne(
        `api/heroes/?name=${searchTerm}`
      );
      searchRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('addHero', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 4, name: 'NewDude', strength: 30 };
    });

    it('should return new hero and call messageService.add with success message when hero is added', done => {
      service.addHero(hero).subscribe(res => {
        expect(res).toEqual(hero);
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: added hero w/ id=${hero.id}`
        );
        done();
      });

      const addRequest = httpMock.expectOne('api/heroes');
      addRequest.flush(hero);
    });

    it('should call messageService.add with error message when request fails', done => {
      service.addHero(hero).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          'HeroService: addHero'
        );
        done();
      });

      const addRequest = httpMock.expectOne('api/heroes');
      addRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('deleteHero', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 1, name: 'OldDude', strength: 10 };
    });

    it('should delete given hero and call messageService.add with success message', done => {
      service.deleteHero(hero).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: deleted hero id=${hero.id}`
        );
        done();
      });

      const deleteRequest = httpMock.expectOne(`api/heroes/${hero.id}`);
      deleteRequest.flush(null);
    });

    it('should delete hero with given id and call messageService.add with success message', done => {
      service.deleteHero(hero.id).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: deleted hero id=${hero.id}`
        );
        done();
      });

      const deleteRequest = httpMock.expectOne(`api/heroes/${hero.id}`);
      deleteRequest.flush(null);
    });

    it('should call messageService.add with error message when request fails', done => {
      service.deleteHero(hero).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          'HeroService: deleteHero'
        );
        done();
      });

      const deleteRequest = httpMock.expectOne(`api/heroes/${hero.id}`);
      deleteRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });

  describe('updateHero', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 4, name: 'UpdatedDude', strength: 1000 };
    });

    it('should update given hero and call messageService.add with success message', done => {
      service.updateHero(hero).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          `HeroService: updated hero id=${hero.id}`
        );
        done();
      });

      const updateRequest = httpMock.expectOne('api/heroes');
      updateRequest.flush(null);
    });

    it('should call messageService.add with error message when request fails', done => {
      service.updateHero(hero).subscribe(() => {
        expect(mockMessageService.add).toHaveBeenCalledTimes(1);
        expect(mockMessageService.add.calls.argsFor(0)[0]).toContain(
          'HeroService: updateHero'
        );
        done();
      });

      const updateRequest = httpMock.expectOne('api/heroes');
      updateRequest.error(new ErrorEvent('SOME_ERROR'));
    });
  });
});
