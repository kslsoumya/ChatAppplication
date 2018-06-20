
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'removeSpecialCharPipe'
})

export class RemoveSpecialCharacterPipe implements PipeTransform {
    transform(value: string, character: string): string {
        return value.replace(character, '');

    }


}

