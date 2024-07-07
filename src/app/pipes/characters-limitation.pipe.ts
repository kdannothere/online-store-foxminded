import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charactersLimitation',
  standalone: true,
})
export class CharactersLimitationPipe implements PipeTransform {
  transform(text: string, limit: number = 35, ellipsis: boolean = true): string {
    if (text.length <= limit) return text;
    let result = text.substring(0, limit);
    if (ellipsis) result += ' ...';
    return result;
  }
}
