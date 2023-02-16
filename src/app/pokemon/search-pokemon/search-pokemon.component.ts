import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-search-pokemon',
  templateUrl: './search-pokemon.component.html',
  styles: [
  ]
})
export class SearchPokemonComponent implements OnInit {
  searchTerms = new Subject<string>(); // Flux de données dans le temps des recherches de l'utilisateur
  pokemon$: Observable<Pokemon[]>

  constructor(private router: Router,
    private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemon$ = this.searchTerms.pipe(
      //  => {..."a"."ab"..."abz"."ab"...."abc".....} . = 100ms
      debounceTime(300),
      //  => {......."ab"........."ab"...."abc".....}
      distinctUntilChanged(),
      //  => {......."ab"................."abc".....}
      switchMap((term) => this.pokemonService.searchPokemonList(term))
    )
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  goToDetail(pokemon: Pokemon) {
    const link = ['/pokemon', pokemon.id];
    this.router.navigate(link);
  }

}
