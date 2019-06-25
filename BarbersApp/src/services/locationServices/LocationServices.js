import HereConfig from "../../providers/HereConfig";

export default class LocationServices {
    constructor() {}

    getLocationOptions = suggestion => {
        //async function for getting the locations (here api)
        return fetch(
            `${HereConfig.BASE_URL_AUTOCOMPLETE}?app_id=${
                HereConfig.APP_ID
            }&app_code=${HereConfig.APP_CODE}&query=${suggestion}&maxresults=10`
        ).then(
            resp => {
                return resp.json();
            },
            err => err
        );
    };

    getLatAndLong = locationId => {
        //get lat and long for a specific address
        return fetch(
            `${HereConfig.BASE_URL_GEOCODE}?app_id=${
                HereConfig.APP_ID
            }&app_code=${HereConfig.APP_CODE}&locationid=${locationId}&gen=8`
        )
            .then(
                resp => {
                    return resp.json();
                },
                err => err
            )
            .then(resp => {
                const {
                    Latitude
                } = resp.Response.View[0].Result[0].Location.DisplayPosition;
                const {
                    Longitude
                } = resp.Response.View[0].Result[0].Location.DisplayPosition;
                return {
                    latitude: Latitude,
                    longitude: Longitude
                };
            });
    };

    getWeatherForecast = (latitude, longitude) => {
        return fetch(
            `${
                HereConfig.BASE_URL_WEATHER
            }?product=forecast_7days&latitude=${latitude}&longitude=${longitude}&oneobservation=true&app_id=${
                HereConfig.APP_ID
            }&app_code=${HereConfig.APP_CODE}`
        )
            .then(
                resp => {
                    return resp.json();
                },
                err => err
            )
            .then(resp => {
                return resp.forecasts.forecastLocation.forecast[0];
            });
    };

    getRoutesForAllBarbers = (
        currentLatitude,
        currentLongitude,
        filteredProfessionals
    ) => {
        const urls = [];
        filteredProfessionals.map(item => {
            urls.push(
                `${
                    HereConfig.BASE_URL_ROUTING
                }?waypoint0=${currentLatitude
                    .toString()
                    .concat(
                        ",",
                        currentLongitude.toString()
                    )}&waypoint1=${item.location.latitude
                    .toString()
                    .concat(
                        ",",
                        item.location.longitude.toString()
                    )}&mode=fastest;car;traffic:disabled&combineChange=false&app_id=${
                    HereConfig.APP_ID
                }&app_code=${HereConfig.APP_CODE}`
            );
        });

        return Promise.all(urls.map(url => fetch(url)))
            .then(
                responses => Promise.all(responses.map(rsp => rsp.json())),
                err => err
            )
            .then(rsp => {
                return rsp.map(item => item.response.route[0].summary);
            });
    };
}
