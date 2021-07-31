n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var hours = n.getHours() > 12 ? n.getHours() - 12 : n.getHours();
var am_pm = n.getHours() >= 12 ? "PM" : "AM";
hours = hours < 10 ? "0" + hours : hours;
var minutes = n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes();
time = hours + ":" + minutes + " " + am_pm;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date1 = days[n.getDay()] + ", " + d + " " + months[m - 1] + " " + time;
document.getElementById("date").textContent = date1;
document.getElementById("home-mobile-date").textContent = date1;
document.getElementById("home-location-date").textContent = date1;

// document.getElementById("bg_gif").style.background='url(https://giffiles.alphacoders.com/105/105191.gif)';
// document.getElementById("bg_gif").style.backgroundSize= 'cover';


navigator.geolocation.getCurrentPosition(showPosition, askLocation);

function showPosition(position) {
    var lat = position.coords.latitude;                     //store lat position
    var long = position.coords.longitude;                   //store long position
    sessionStorage.setItem("LAT", lat);
    sessionStorage.setItem("LON", long);
    create_map(lat, long);
    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + long;
    fetch(url).then(response => {
        return response.json();
    })
        .then(result => {
            var city_state = result.address.city + ", " + result.address.state;
            document.getElementById("city-state").textContent = city_state;
            getTodaysDate();
            weatherAPIcall();

        })
};


function askLocation(e) {
    window.alert("This site needs your location. Please allow access to location");
    window.location.reload();
}

var map;
var myMarker;

// Add Map
function create_map(lat, long) {
    var startlat = lat;
    var startlon = long;
    var options = { center: [startlat, startlon], zoom: 9 }
    //document.getElementById('lat').value = startlat;
    //document.getElementById('lon').value = startlon;
    map = L.map('mapid', options);
    var nzoom = 9;
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'OSM' }).addTo(map);
    myMarker = L.marker([startlat, startlon], { title: "Coordinates", alt: "Coordinates", draggable: true }).addTo(map).on('dragend', function () {
        var lat = myMarker.getLatLng().lat.toFixed(8);
        var lon = myMarker.getLatLng().lng.toFixed(8);

        var czoom = map.getZoom();
        if (czoom < 18) { nzoom = czoom + 2; }
        if (nzoom > 18) { nzoom = 18; }
        if (czoom != 18) { map.setView([lat, lon], nzoom); } else { map.setView([lat, lon]); }
        // document.getElementById('lat').value = lat;
        // document.getElementById('lon').value = lon;
        myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();

    });

    function myFunction(arr) {
        var out = "<br />";
        var i;
        if (arr.length > 0) {
            out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[0].lat + ", " + arr[0].lon + ");return false;'>" + arr[0].display_name + "</div>";
            /*for(i = 0; i < arr.length; i++) {out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " + arr[i].lon + ");return false;'>" + arr[i].display_name + "</div>";}*/
            document.getElementById('results').innerHTML = out;
        }
        else {
            document.getElementById('results').innerHTML = "Sorry, no results...";
        }
    }
}

function chooseAddr(lat1, lng1) {

    myMarker.closePopup();
    map.setView([lat1, lng1], 9);
    myMarker.setLatLng([lat1, lng1]);
    // localStorage.setItem("lat", lat1);
    // localStorage.setItem("long", lng1);
    myMarker.bindPopup("Lat " + lat1 + "<br />Lon " + lng1).openPopup();
    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat1 + '&lon=' + lng1;
    fetch(url).then(response => {
        return response.json();
    })
        .then(result => {
            var city_state = result.address.city + ", " + result.address.state;
            console.log(city_state);
            document.getElementById("city-state").textContent = city_state;
            sessionStorage.setItem("LAT", lat1)
            sessionStorage.setItem("LON", lng1)
            weatherAPIcall()
        })
}

function addr_search() {
    var inp = document.getElementById("home-input-lat-long");
    var xmlhttp = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText); //myFunction(myArr);
            chooseAddr(myArr[0].lat, myArr[0].lon);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


var start_to_end = [];
var this_week_dates = [];

function getTodaysDate() {

    var someDate = new Date();
    m1 = someDate.getMonth();
    if (m1 != 9 || m1 != 10 || m1 != 11) {
        m1 += 1
        m1 = "0" + m1;
    }
    date_today = someDate.getDate() + '/' + someDate.getMonth() + '/' + someDate.getFullYear();
    var d1 = someDate.getFullYear() + '/' + m1 + '/' + someDate.getDate();
    start_to_end.push(date_today);
    var numberOfDaysToAdd = 6;
    for (let i = 1; i <= numberOfDaysToAdd; i++) {
        someDate.setDate(someDate.getDate() + 1);

        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();

        var someFormattedDate = dd + '/' + mm + '/' + y;
        start_to_end.push(someFormattedDate);

        if (i == 6) {
            var d2 = y + '/' + mm + '/' + dd;
        }
    }

    var raw = JSON.stringify({
        "d1": d1,
        "d2": d2,
        "l1": sessionStorage.getItem("LAT"),
        "l2": sessionStorage.getItem("LON")
    });
    this_week_dates = start_to_end;
    showPanchangResults(start_to_end, raw, 1);

    // var date = new Date(),
    // d1 = date.getDate(),
    // m1 = date.getMonth(),
    // y1 = date.getFullYear();
    // start_to_end=[];
    // if (m1 != 9 || m1 != 10 || m1 != 11){
    //     m1 += 1
    //     m1 = "0"+m1;
    // }
    // curr_d = y1 + "/" + m1 + "/" + d1;
    // d1 += 6;
    // end_d = y1 + "/" + m1 + "/" + d1;
    // createDateArray(showPanchangResults, curr_d, end_d, 1);
}


// createDateArray
function createDateArray(funcCallBack, start, end, flag) {
    // console.log(start, end);
    // start_to_end=[];
    // var someDate = new Date();
    // date_today = someDate.getDate() + '/'+ someDate.getMonth() + '/'+ someDate.getFullYear();
    // start_to_end.push(date_today);
    // var numberOfDaysToAdd = 6;
    // for(let i = 1; i<= numberOfDaysToAdd; i++){
    // someDate.setDate(someDate.getDate() + 1);

    // var dd = someDate.getDate();
    // var mm = someDate.getMonth() + 1;
    // var y = someDate.getFullYear();

    // var someFormattedDate = dd + '/'+ mm + '/'+ y;
    // start_to_end.push(someFormattedDate);
    // }

    // console.log(start_to_end);

    var raw = JSON.stringify({
        "d1": start,
        "d2": end,
        "l1": sessionStorage.getItem("LAT"),
        "l2": sessionStorage.getItem("LON")
    });

    start_to_end = [];

    var start_Date = start;
    var end_Date = end;

    var x = start_Date.split("/");
    var y = end_Date.split("/");

    var current = new Date(x[0], x[1], x[2]);
    var endDate = new Date(y[0], y[1], y[2]);


    while (current <= endDate) {

        c = current.getDate() + "/" + (current.getMonth()) + "/" + current.getFullYear();
        start_to_end.push(c);
        var current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);

    }
    funcCallBack(start_to_end, raw, flag);
}


// showPanchangResults
function showPanchangResults(start_to_end, raw, flag) {

    var my_headers = new Headers();
    my_headers.append("Content-Type", "application/json");

    var request_options = {
        method: "POST",
        headers: my_headers,
        body: raw
    };

    const panchang_url = "http://127.0.0.1:8000/weather/result/";

    fetch(panchang_url, request_options).then(response => {
        return response.json();
    })
        .then(result => {

            result_length = result.length;
            if (flag == 1) {
                document.getElementById("prediction").textContent = result[0];
                document.getElementById("home-mobile-prediction").textContent = result[0];
                if (result[0] == "Scanty") {
                    document.getElementById("bg_gif").style.background = 'url("' + window.scanty_bg_img_path + '")';
                    document.getElementById("bg_gif").style.backgroundSize = 'cover';
                    document.getElementById("random").innerHTML += '<img src = "../static/images/Sun cloud angled rain.png" width = "200px">';
                }
                else if (result[0] == "No rainfall") {
                    document.getElementById("bg_gif").style.background = "url(https://64.media.tumblr.com/c6ceec655068ffbddbbd7dc03d6aec58/tumblr_p6n6auCCPh1wg7k9po1_500.gifv)";
                    document.getElementById("bg_gif").style.backgroundSize = 'cover'
                    document.getElementById("random").innerHTML += '<img src = "../static/images/Moon cloud fast wind.png" width = "200px">';
                }
                else if (result[0] == "Copious") {
                    document.getElementById("bg_gif").style.background = 'url(https://giffiles.alphacoders.com/105/105191.gif)';
                    document.getElementById("bg_gif").style.backgroundSize = 'cover';
                    document.getElementById("random").innerHTML += '<img src = "../static/images/Big rain drops.png" width = "200px">';
                }
            }
            document.getElementById("panchang-prediciton-results").innerHTML = "";

            for (let i = 0; i < result_length; i++) {
                predict = result[i];

                todays_date = start_to_end[i];
                var image_name = "";
                if (predict == "No rainfall") {
                    image_name = "../static/images/01d@2x.png";
                }
                else if (predict == "Scanty") {
                    image_name = "../static/images/Sun cloud angled rain.png";
                }
                else if (predict == "Copious") {
                    image_name = "../static/images/09d@2x.png";
                }

                var prediction_template = '<div class="row"><div class="col-xs-4"><p class = "todays_date">' + todays_date + '</p></div><div class=" col-xs-4"><p><img src="' + image_name + '" alt="" width = "40px"></p></div><div class="col-xs-4"><p class = "todays_date">' + predict + '</p></div></div>';
                document.getElementById("panchang-prediciton-results").innerHTML += prediction_template;
            }
        })
        .catch(e => {
            console.log(e);
        });
}


function onSubmit() {
    start = document.getElementById("home-start-date").value;
    end = document.getElementById("home-end-date").value;
    var lat_long_input = document.getElementById("home-input-lat-long").value;

    if (start == "" && end == "" && lat_long_input == "") {
        window.alert("Enter both dates or location");
        return;
    }


    start_date_array = start.split("-");
    actual_start_date = start_date_array[0] + "/" + start_date_array[1] + "/" + start_date_array[2];

    end_date_array = end.split("-");
    actual_end_date = end_date_array[0] + "/" + end_date_array[1] + "/" + end_date_array[2];
    if (start != "" && end != "") {
        createDateArray(showPanchangResults, actual_start_date, actual_end_date, 0);
    }
    if ((start == "" && end == "") && lat_long_input != "") {
        addr_search()
        return;
    }
    else if ((start == "" || end == "") && lat_long_input != "") {
        window.alert("Enter both dates");
        return;
    }
}


function weatherAPIcall() {
    lat = sessionStorage.getItem("LAT");
    long = sessionStorage.getItem("LON");
    const weather_api_url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly&appid=5bf48301588e662cb1cee7422077ee54";

    fetch(weather_api_url).then(response => {
        return response.json();
    })
        .then(result => {
            // var result_name_list = [];
            // var image_result_list = [];
            document.getElementById("weather-api-results").innerHTML = "";
            for (let i = 0; i < 7; i++) {
                predict = result.daily[i].weather[0].description;
                // var image_name = image_result_list[result_name_list.indexOf(predict)]
                todays_date = this_week_dates[i];

                image_name = ""
                if (predict == "clear sky") {
                    image_name = "../static/images/imgLogo/weather_icons_main/256px/clear_sky_d.png";
                }
                else if (predict == "few clouds") {
                    image_name = "../static/images/imgLogo/weather_icons_main/256px/few_clouds_d.png";
                }
                else if (predict == "moderate rain") {
                    image_name = "../static/images/imgLogo/weather_icons_main/256px/rain_d.png";
                }
                else if (predict == "scattered clouds") {
                    image_name = "../static/images/imgLogo/weather_icons_main/256px/clear_sky_d.png";
                }
                else if (predict == "broken clouds") {
                    image_name = "../static/images/04d@2x.png";
                }
                else if (predict == "shower rain") {
                    image_name = "../static/images/09d@2x.png";
                }
                else if (predict == "rain") {
                    image_name = "../static/images/09d@2x.png";
                }
                else if (predict == "thunderstorm") {
                    image_name = "../static/images/11d@2x.png";
                }
                else if (predict == "snow") {
                    image_name = "../static/images/13d@2x.png";
                }
                else if (predict == "mist") {
                    image_name = "../static/images/50d@2x.png";
                }
                else if (predict == "overcast clouds") {
                    image_name = "../static/images/Moon cloud fast wind.png";
                }
                else if (predict == "light rain") {
                    image_name = "../static/images/Sun cloud angled rain.png";
                }


                var prediction_template = '<div class="row"><div class="col-xs-4"><p class = "todays_date">' + todays_date + '</p></div><div class="col-xs-4"><p><img src="' + image_name + '" alt="" width="40px"></p></div><div class="col-xs-4"><p class = "todays_date">' + predict + '</p></div></div>';
                document.getElementById("weather-api-results").innerHTML += prediction_template;
            }
        })
        .catch(e => {
            console.log(e);
        });

}


// someArray=[];
// var someDate = new Date();
// date_today = someDate.getDate() + '/'+ someDate.getMonth() + '/'+ someDate.getFullYear();
// someArray.push(date_today);
// var numberOfDaysToAdd = 6;
// for(let i = 1; i<= numberOfDaysToAdd; i++){
// someDate.setDate(someDate.getDate() + 1);

// var dd = someDate.getDate();
// var mm = someDate.getMonth() + 1;
// var y = someDate.getFullYear();

// var someFormattedDate = dd + '/'+ mm + '/'+ y;
// someArray.push(someFormattedDate);
// }

// console.log(someArray);