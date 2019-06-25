import firebase from "react-native-firebase";

export default class BarberCalendarServices {
    constructor() {}

    //formatting date for tabs list
    datePipeForTabsList = day => {
        const weekday = new Array(7);
        weekday[0] = "sun";
        weekday[1] = "mon";
        weekday[2] = "tue";
        weekday[3] = "wed";
        weekday[4] = "thu";
        weekday[5] = "fri";
        weekday[6] = "sat";

        let monthDay = day.getDate();
        if (day.getDate() < 10) {
            monthDay = "0".concat(monthDay);
        }
        return (formattedDate = weekday[day.getDay()].concat(" ", monthDay));
    };

    datePipeForAppointmentsList = day => {
        let monthDay = day.getDate().toString();
        let month = (day.getMonth() + 1).toString();
        if (day.getDate() < 10) {
            monthDay = "0".concat(monthDay);
        }
        if (day.getMonth() < 10) {
            month = "0".concat(month);
        }
        return monthDay.concat("-", month, "-", day.getFullYear());
    };

    getNextNDays = (n, startDate) => {
        let formattedDates = [];
        for (i = 0; i < n; i++) {
            let increased = new Date(
                startDate.getTime() + 1000 * 60 * 60 * 24 * i
            );
            formattedDates.push({
                tabDate: this.datePipeForTabsList(increased),
                listDate: this.datePipeForAppointmentsList(increased)
            });
        }
        return formattedDates;
    };

    /*
     * if index = 0 means that is the current day
     */

    convertDate = (date, index) => {
        let day = parseInt(date.substring(0, 2));
        let mon = parseInt(date.substring(3, 5));
        let year = parseInt(date.substring(6, 10));

        let convertedDate = new Date(year, mon - 1, day)
            .toString()
            .split(" ", 4);
        if (index === 0) {
            return "Today ".concat(
                convertedDate[0].toUpperCase(),
                " ",
                `${convertedDate[2]}-${convertedDate[1]}`
            );
        }
        if (index === 1) {
            return "Tomorrow ".concat(
                convertedDate[0].toUpperCase(),
                " ",
                `${convertedDate[2]}-${convertedDate[1]}`
            );
        }
        return "".concat(
            convertedDate[0].toUpperCase(),
            " ",
            `${convertedDate[2]}-${convertedDate[1]}`
        );
    };

    getAppointmentsByDay = (barberId, day) => {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref("barbers")
                .child(barberId)
                .child("my_calendar")
                .child(day)
                .on("value", snapshot => {
                    console.log(snapshot.val());
                    if (snapshot.val() !== null) {
                        resolve(this.snapshotToArray(snapshot));
                    } else {
                        reject("empty");
                    }
                });
        });
    };

    snapshotToArray(snapshot) {
        let returnArr = [];

        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            returnArr.push(item);
        });

        return returnArr;
    }
}
