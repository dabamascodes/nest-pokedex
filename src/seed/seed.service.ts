// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import axios, { AxiosInstance } from 'axios';

// import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokeResponse } from './interfaces/poke-response.interface';


// @Injectable()
// export class SeedService {
//   private readonly axios: AxiosInstance = axios;

//   constructor(
//     @InjectModel(Pokemon.name)
//     private readonly pokemonModel: Model<Pokemon>,
//   ) {}

//   async executeSeed() {
//     const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
//     data.results.forEach(async ({ name, url }) => {
//       const segments = url.split('/');
//       const no = +segments[segments.length - 2];

//       const pokemon = await this.pokemonModel.create({name, no});
//     });

//     return 'Seed Executed';
//   }
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2 forma

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import axios, { AxiosInstance } from 'axios';

// import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokeResponse } from './interfaces/poke-response.interface';


// @Injectable()
// export class SeedService {
//   private readonly axios: AxiosInstance = axios;

//   constructor(
//     @InjectModel(Pokemon.name)
//     private readonly pokemonModel: Model<Pokemon>,
//   ) {}

//   async executeSeed() {

//     await this.pokemonModel.deleteMany({}); // delete * from pokemons;

//     const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

//     const insertPromisesArray = [];

//     data.results.forEach(({ name, url }) => {
//       const segments = url.split('/');
//       const no = +segments[segments.length - 2];

//       // const pokemon = await this.pokemonModel.create({name, no});

//       insertPromisesArray.push(
//         this.pokemonModel.create({name, no})
//       );

//     });

//     await Promise.all(insertPromisesArray);

//     return 'Seed Executed';
//   }
// }






/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 3 forma 'optima

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokeResponse } from './interfaces/poke-response.interface';
// import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


// @Injectable()
// export class SeedService {
//   constructor(
//     @InjectModel(Pokemon.name)
//     private readonly pokemonModel: Model<Pokemon>,
//     private readonly http: AxiosAdapter,
//   ) {}

//   async executeSeed() {
//     await this.pokemonModel.deleteMany({}); // delete * from pokemons;
//     const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
//     const pokemonToInsert: {name: string, no: number}[] = [];
//     data.results.forEach(({ name, url }) => {
//       const segments = url.split('/');
//       const no = +segments[segments.length - 2];
//       // const pokemon = await this.pokemonModel.create({name, no});
//       pokemonToInsert.push({name, no}); // [{ name: bulbasaur, no: 1 }]
//     });
//     await this.pokemonModel.insertMany(pokemonToInsert);
//     // insert into pokemons (name, no)
//     // (name: bulbasaur, no: 1)
//     // (name: bulbasaur, no: 1)
//     // (name: bulbasaur, no: 1)
//     // (name: bulbasaur, no: 1)
//     // (name: bulbasaur, no: 1)
//     // (name: bulbasaur, no: 1)
//     return 'Seed Executed';
//   }
// }





/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4 forma 'optima con Adapter

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: {name: string, no: number}[] = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({name, no});
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed Executed';
  }
}
