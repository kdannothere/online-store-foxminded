import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charactersLimitation',
	standalone: true,
})
export class CharactersLimitationPipe implements PipeTransform {
  transform(value: string, limit: number = 35): string {
		if (value.length <= limit) return value;
    return value.substring(0, limit) + '...';
  }
}