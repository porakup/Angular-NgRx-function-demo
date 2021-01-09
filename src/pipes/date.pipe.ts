import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datePipe' })
export default class DatePipe implements PipeTransform {

    transform(date: string): string {

        let str = '';

        if(date && (date !== undefined) && (date !== '')){
            let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            let arr = date.split(' ');
            let arrDate = arr[0].split('/');
            str = `${month[parseInt(arrDate[1])-1]} ${arrDate[0]}, ${arrDate[2]}`;
        }

        return str;
    }
}