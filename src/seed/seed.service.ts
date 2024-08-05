import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=2',
    );
    const result = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      return { name, url, no };
    });
    return result;
  }
}
