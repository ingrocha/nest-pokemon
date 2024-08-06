import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { handleExceptions } from 'src/common/functions/handleInsertExceptions.fn';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // private readonly pokemonService = Inject(PokemonService);
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  /**
   * This function executes a seed operation by fetching data from the PokeAPI, processing it, and
   * inserting it into a database using Mongoose.
   * @returns The `executeSeed` function is returning the result of inserting the pokemons into the
   * database using `insertMany` method of `pokemonModel`. This result will contain information about
   * the success or failure of the insertion operation.
   */
  async executeSeed() {
    try {
      /* The line `this.pokemonModel.deleteMany();` is calling the `deleteMany()` method on the
    `pokemonModel` instance. This method is used to delete multiple documents that match a given
    condition from the MongoDB collection associated with the `pokemonModel`. */
      await this.pokemonModel.deleteMany();

      /* This line of code is making an HTTP GET request to the PokeAPI endpoint
    'https://pokeapi.co/api/v2/pokemon?limit=650' using Axios. The response from this request is
    being destructured to extract the `data` property. The `<PokeResponse>` type assertion is used
    to specify the expected shape of the response data, indicating that the response should conform
    to the `PokeResponse` interface defined in the code. */
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      );

      /* This code snippet is mapping over the `results` array in the `data` object obtained from the
    PokeAPI response. For each item in the `results` array, it is extracting the `name` and `url`
    properties. */
      const pokemons: CreatePokemonDto[] = data.results.map(({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        return { name, url, no };
      });

      // Save all the pokemons in the database
      await this.pokemonModel.insertMany(pokemons);
      return `Seed Executed`;
    } catch (error) {
      handleExceptions(error);
    }
  }
}
