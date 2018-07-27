import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from '../hero';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture : ComponentFixture<HeroComponent>;
  let hero : Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    hero = { id: 1, name: 'SuperDude', strength: 50 };

    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = hero;

    expect(fixture.componentInstance.hero.name).toEqual(hero.name);
  });

  it('should render hero name in an anchor tag', () => {
    fixture.componentInstance.hero = hero;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a').textContent).toContain(hero.name);
  });

  it('should call onDeleteClick when delete button is clicked', () => {
    const spy = spyOn(fixture.componentInstance, 'onDeleteClick');

    fixture.nativeElement.querySelector('button.delete').click();

    expect(spy).toHaveBeenCalled();
  });

  it('should call delete.next when delete button is clicked', () => {
    fixture.componentInstance.delete = jasmine.createSpyObj('delete', ['next']);

    fixture.nativeElement.querySelector('button.delete').click();

    expect(fixture.componentInstance.delete.next).toHaveBeenCalled();
  });
});
