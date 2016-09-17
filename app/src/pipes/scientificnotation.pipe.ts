import {Pipe, PipeTransform } from '@angular/core'

@Pipe({ 
    name: 'scientific' 
})
export class ScientificNotationPipe implements PipeTransform {

    transform(value: number, args: any[]) {
        if (value && !isNaN(value)) {
            return value.toExponential()
        }
    }
    
}