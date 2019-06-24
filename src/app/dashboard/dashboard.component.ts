import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService
      .getHeroes()
      .pipe(
        map(
          heroes =>
            (this.heroes = heroes.sort((a, b) =>
              a.strength > b.strength ? -1 : a.strength < b.strength ? 1 : 0
            ))
        )
      )
      .subscribe(heroes => (this.heroes = heroes.slice(0, 4)));
  }
}
