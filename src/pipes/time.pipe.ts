import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs'

@Pipe({ name: 'timePipe' })
export default class timePipe implements PipeTransform {

    transform(strDate: string): string {

        let str = '';

        if(strDate && (strDate !== undefined) && (strDate !== '')) {

            let currentDate = dayjs().format('DD/MM/YYYY HH:mm:ss');
            let cArr = currentDate.split(' ');
            let cArrDate = cArr[0].split('/');
            let cArrTime = cArr[1].split(':');
            let cDate = parseInt(cArrDate[0]);
            let cMonth = parseInt(cArrDate[1]);
            let cYear = parseInt(cArrDate[2]);
            let cHour = parseInt(cArrTime[0]);
            let cMinute = parseInt(cArrTime[1]);

            let arr = strDate.split(' ');
            let arrDate = arr[0].split('/');
            let arrTime = arr[1].split(':');
            let date = parseInt(arrDate[0]);
            let month = parseInt(arrDate[1]);
            let year = parseInt(arrDate[2]);
            let hour = parseInt(arrTime[0]);
            let minute = parseInt(arrTime[1]);

            if((cYear > year)) {
                if((cYear - year === 1)){
                    if(cMonth - month >= 0){
                        str = `${cYear - year} year ago`;
                    }else  {
                        let rMonth = month - cMonth;
                        if(rMonth === 11) {
                            let x = (30 - date) + cDate;
                            if(x >= 30){
                                str = '1 month ago';
                            }else {
                                if(x > 7){
                                    str = `${Math.floor(x/7)} week ago`; 
                                }else {
                                    str = `${x} day ago`;
                                }
                            }
                        }else {
                            str = `${12 - rMonth} month ago`;
                        }
                    }
                }else {
                    str = `${cYear - year} year ago`;
                }
            }else if(cMonth > month) {
                str = `${cMonth - month} month ago`; 
            }else if(cDate - date > 7){
                let week = cDate - date;
                str = `${Math.floor(week/7)} week ago`; 
            }else if(cDate > date) {
                str = `${cDate - date} day ago`; 
            }else if (cHour > hour) {
                str = `${cHour - hour} hour ago`; 
            }else if (cMinute > minute) {
                str = `${cMinute - minute} minute ago`;
            }else {
                str = 'just now';
            }
        }

        return str;
    }
}