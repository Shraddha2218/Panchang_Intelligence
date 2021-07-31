function getcity() {
    console.log("1 Getting Current City ")
    const Http = new XMLHttpRequest();
    var lat=localStorage.getItem("lat");                    //store latitude at local storage
    var long=localStorage.getItem("long");
    const url='https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ lat +'&lon=' + long;
    console.log(url)
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
        console.log(Http.responseText);
        var obj = JSON.parse(Http.responseText);
        var loc = obj.address.city+", "+obj.address.state;
        $('#city').html(loc)
    }
}

function loc(){
    console.log("1 loc function to get openstreetmap ")
    $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=47.217954&lon=-1.552918', function(data){
    console.log('======%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log(data.address.road);
});}

// To get current city and state on webpage, also we can get lat long of current location
function getLocation() {
    console.log("3 at getLocation");
    navigator.geolocation.getCurrentPosition(showPosition); //function to get location
}

// To show current city and state on webpage, also we can get lat long of current location
function showPosition(position) {
    console.log("4 at showPosition");
    var lat = position.coords.latitude;                     //store lat position
    var long = position.coords.longitude;                   //store long position
    console.log(lat);
    console.log(long);
    localStorage.setItem("lat", lat);
    localStorage.setItem("long", long);
    getcity();
    weatherResult()                                         //call weatherResult to get weather api
    panchangResult()                                      //call panchangResult to get panchang api
};

getLocation();                                              //call to get current location

// calling weather api
function weatherResult(){
    console.log("5 at weatherResult");
    var lat=localStorage.getItem("lat");                    //store latitude at local storage
    var long=localStorage.getItem("long");                  //store longitude at local storage
    console.log(lat);                                       //latitude at console
    console.log(long);                                      //longitude at console
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=minutely,hourly&appid=5bf48301588e662cb1cee7422077ee54",
        "method": "GET"
    }
    console.log("url");
    $.ajax(settings).done(function (response) {
        console.log("6 weather result ");
        console.log(settings.url);
        console.log(response);

            var date = new Date(),
            d1 = date.getDate(),
            m1 = date.getMonth(),
            y1 = date.getFullYear();
            date_arr=[];
            curr_d = y1 + "/" + (m1+1) + "/" + d1;
            for(i=0; i < 7; i++){
                var curdate = new Date(y1, m1, d1+i);
                curr= curdate.getDate() + "/" + (curdate.getMonth()+1) + "/" + curdate.getFullYear();
                date_arr.push(curr);
            }
            
           // console.log("_________________________________________________________________")
            //console.log(start_to_end);

        $("#weather0").empty();
        $("#da0").empty();

        $("#weather1").empty();
        $("#da1").empty();

        $("#weather2").empty();
        $("#da2").empty();

        $("#weather3").empty();
        $("#da3").empty();

        $("#weather4").empty();
        $("#da4").empty();

        $("#weather5").empty();
        $("#da5").empty();

        $("#weather6").empty();
        $("#da6").empty();

        var content = response.daily[0].weather[0].description;
        $("#weather0").append(content);
        $("#da0").append(date_arr[0]);
        var content = response.daily[1].weather[0].description;
        $("#weather1").append(content);
        $("#da1").append(date_arr[1]);
        var content = response.daily[2].weather[0].description;
        $("#weather2").append(content);
        $("#da2").append(date_arr[2]);
        var content = response.daily[3].weather[0].description;
        $("#weather3").append(content);
        $("#da3").append(date_arr[3]);
        var content = response.daily[4].weather[0].description;
        $("#weather4").append(content);
        $("#da4").append(date_arr[4]);
        var content = response.daily[5].weather[0].description;
        $("#weather5").append(content);
        $("#da5").append(date_arr[5]);
        var content = response.daily[6].weather[0].description;
        $("#weather6").append(content);
        $("#da6").append(date_arr[6]);

        $("#temp1").empty();
        $("#w1").empty();
        $("#wd1").empty();
        $("#h1").empty();
        $("#temp1").append(Math.round((response.current.temp)-273.15));
        $("#w1").append(response.daily[0].weather[0].description);
        $("#wd1").append(response.daily[0].wind_speed);
        $("#h1").append(response.daily[0].humidity);

        $("#back_video").empty();
        console.log(response.daily[0].weather[0].description)
        w_r = response.daily[0].weather[0].description
        if (w_r == "clear sky"){$("#back_video").append('<source src="{% static "css/clear sky.mp4" %}" type="video/mp4">')}
        else if (w_r == "few clouds" || w_r == "broken clouds"){$("#back_video").append("<source src='{% static 'css/broken clouds.mp4' %}' type='video/mp4'>")}
        else if (w_r == "scattered clouds"){$("#back_video").append("<source src='{% static 'css/scarred clouds.mp4' %}' type='video/mp4'>")}
        else if (w_r == "shower rain"){$("#back_video").append("<source src='{% static 'css/shower rain.mov' %}' type='video/mov'>")}
        else if (w_r == "rain sky"){$("#back_video").append("<source src='{% static 'css/rain.mp4' %}' type='video/mp4'>")}
        else if (w_r == "snow" || "#w1" === "mist"){$("#back_video").append("<source src='{% static 'css/mist.mp4' %}' type='video/mp4'>")}
        else {$("#back_video").append("<source src='{% static 'css/thunderstorm.mp4' %}' type='video/mp4'>")}

        $("#back_img").empty();
        if (w_r == "clear sky"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Sun cloud mid rain.png" %}" class="h_weatherLogo"></div></div></div>')}
        else if (w_r == "few clouds" || w_r == "broken clouds"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Cloud 3 zap.png" %}" class="h_weatherLogo"></div></div></div>')}
        else if (w_r == "scattered clouds"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Moon cloud fast wind.png" %}" class="h_weatherLogo"></div></div></div>')}
        else if (w_r == "shower rain"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Sun cloud angled rain.png" %}" class="h_weatherLogo"></div></div></div>')}
        else if (w_r == "rain sky"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Sun cloud little rain.png" %}" class="h_weatherLogo"></div></div></div>')}
        else if (w_r == "snow" || "#w1" == "mist"){$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Big snow.png" %}" class="h_weatherLogo"></div></div></div>')}
        else {$("#back_img").append('<div class="col-sm-12"><div class="row"><div class="col-sm-4"><img src="{% static "images/logo/Big snow.png" %}" class="h_weatherLogo"></div></div></div>')}
    
        res=[response.daily[0].weather[0].description, response.daily[1].weather[0].description, response.daily[2].weather[0].description, response.daily[3].weather[0].description, response.daily[4].weather[0].description, response.daily[5].weather[0].description, response.daily[6].weather[0].description];
            console.log(res);
             $("#weather_result").empty();
            $.each(res, function(index, value){
            
                if(value=='scattered clouds'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 31px; padding-top="31px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Moon cloud fast wind.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else if(value=='clear sky'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 31px; padding-top="31px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Mid snow fast winds.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else if(value=='few clouds'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top="15px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Moon fast wind.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else if(value=='overcast clouds'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top="15px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Tornado.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else if(value=='broken clouds'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Big snow.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else if(value=='light rain'){
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud little rain.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="200%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                else {
                    console.log(index);
                    $("#weather_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px;"><div class="row"><div class="col-sm-4"><h6 style=" color:white ;margin-left: 0px;" id="da" class="wdate1">'+ date_arr[index] +'</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud mid rain.png" %}" style="margin-left: 25px; height:50px; width:50px;"></div><div class="col-sm-6" id="weather" style="color: white;"><h6 style=" color:white ;margin-left: 45px; width="2S00%" id="weather" class="wd1">'+ value+'</h6></div></div></div>');
                }
                
            });
    });
}
console.log("7 ");
function panchangResult(){
    $("#panch_result div").empty();
    console.log("8 in panchangResult");

    var start_Date=document.getElementById("start").value;
    var start_Date= start_Date.split("-");
    var start_Date=start_Date[0]+"/"+start_Date[1]+"/"+start_Date[2];
    console.log(start_Date)

    var end_Date=document.getElementById("end").value;
    var end_Date= end_Date.split("-");
    var end_Date=end_Date[0]+"/"+end_Date[1]+"/"+end_Date[2];
    console.log(end_Date)

    console.log("if")

    if (start_Date!="/undefined/undefined" && end_Date!="/undefined/undefined"){
        console.log("9 Both start and end date given by user");
        curr_d=start_Date;
        next_d=end_Date;
        console.log("10 undefined")
        console.log(curr_d);
        console.log(next_d);
        var lat=localStorage.getItem("lat");
        var long=localStorage.getItem("long");

        start_to_end=[];

            var x= start_Date.split("/");
            var y= end_Date.split("/");

            var current = new Date(x[0], x[1], x[2]);
            var endDate = new Date(y[0],y[1],y[2]);

             while (current <= endDate) {

                c=current.getDate()+"/"+(current.getMonth())+"/"+current.getFullYear();
                start_to_end.push(c);
                var current = new Date(current.getFullYear(), current.getMonth(),current.getDate()+1);

             }
            console.log("11 ###############################################");
            console.log(start_to_end);
            

        var data ={
            "d1": curr_d,
            "d2": next_d,
            "l1": lat,
            "l2": long
        };
        
        var json = JSON.stringify(data);


        fetch('http://127.0.0.1:8000/weather/result/', {
        method: 'POST',
        body: json, // string or object
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(response=>response.json())
        .then(json=>{
            console.log("@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(json);
                console.log("@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            $.each(json, function(index, value){
                if(value=='No rainfall'){
                    $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px; padding-top: 20px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Cloud 3 zap.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                }
                if(value=='Copious'){
                    $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud angled rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                }
                if(value=='Scanty'){
                    $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud little rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                }
            });
        });
    }
       else{ if (end_Date!="/undefined/undefined"){
            console.log("12 only end date given by user");
            var date = new Date(),
            d1 = date.getDate(),
            m1 = date.getMonth(),
            y1 = date.getFullYear();
            start_to_end=[];
            curr_d = y1 + "/" + (m1+1) + "/" + d1;

            start_to_end=[];

            var x= curr_d.split("/");
            var y= end_Date.split("/");

            var current = new Date(x[0], x[1], x[2]);
            var endDate = new Date(y[0],y[1],y[2]);

             while (current <= endDate) {

                c=current.getDate()+"/"+(current.getMonth())+"/"+current.getFullYear();
                start_to_end.push(c);
                var current = new Date(current.getFullYear(), current.getMonth(),current.getDate()+1);

                }
            //console.log(start_to_end);

            console.log(next_d);
            next_d=end_Date;


            console.log(curr_d);
            console.log(next_d);
            var lat=localStorage.getItem("lat");
            var long=localStorage.getItem("long");
            var data ={
                "d1": curr_d,
                "d2": next_d,
                "l1": lat,
                "l2": long
            };
            var json = JSON.stringify(data);
            console.log(json)
            fetch('http://127.0.0.1:8000/weather/result/', {
                method: 'POST',
                body: json, // string or object
                headers: {
                    'Content-Type': 'application/json'
                }
                }).then(response=>response.json())
                .then(json=>{
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(json);
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


                $.each(json, function(index, value){                           
                    if(value=='No rainfall'){
                        $("#panch_result").append('<div class="col-sm-12" style=" margin-top: 15px; padding-top:15px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Cloud 3 zap.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                    if(value=='Copious'){
                        $("#panch_result").append('<div class="col-sm-12" style=" margin-top: 15px; padding-top:15px;   padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud angled rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                    if(value=='Scanty'){
                        $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px; padding-top: 20px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud little rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                });
            });
        }
        else{
            console.log("13 Both start and end date not given by user");
            var date = new Date(),
            d1 = date.getDate(),
            m1 = date.getMonth(),
            y1 = date.getFullYear();
            start_to_end=[];
            curr_d = y1 + "/" + (m1+1) + "/" + d1;
            for(i=0; i < 7; i++){
                var curdate = new Date(y1, m1, d1+i);
                curr= curdate.getDate() + "/" + (curdate.getMonth()+1) + "/" + curdate.getFullYear();
                start_to_end.push(curr);
            }
           // console.log("_________________________________________________________________")
            console.log(start_to_end);
            //console.log("_________________________________________________________________")
            next_d = curdate.getFullYear() + "/" + (curdate.getMonth()+1) + "/" + curdate.getDate();
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            console.log(curr_d);
            console.log(next_d);
            var lat=localStorage.getItem("lat");
            var long=localStorage.getItem("long");
            console.log(lat);
            console.log(long);
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

            var data ={
                "d1": curr_d,
                "d2": next_d,
                "l1": lat,
                "l2": long
            };
            var json = JSON.stringify(data);
            console.log("_____________________________________________");
            console.log(json)
            console.log("_____________________________________________");

            //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            fetch('http://127.0.0.1:8000/weather/result/', {
                method: 'POST',
                body: json, // string or object
                headers: {
                    'Content-Type': 'application/json'
                }
                }).then(response=>response.json())
                .then(json=>{
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                console.log(json);
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                //console.log(response.json());
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")


                $.each(json, function(index, value){
                    if(value=='No rainfall'){
                        $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px; padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Cloud 3 zap.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                    if(value=='Copious'){
                        $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px;  padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud angled rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:12px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                    if(value=='Scanty'){
                        $("#panch_result").append('<div class="col-sm-12" style="margin-top: 15px; padding-top:15px;  padding-left: 100px;"><div class="row"><div class="col-sm-4"><h6 style="text-align: center; color: #FFFFFF; left: 170px; width: 102px; height: 28px; padding-top:12px; font-weight: bold; font-size: 18px; line-height: 28px; font-family: Overpass; font-style: normal; text-shadow: -2px 3px 1px rgba(0, 0, 0, 0.1);" id="datei">' + start_to_end[index] + '</h6></div><div class="col-sm-2"><img src="{% static "images/logo/Sun cloud little rain.png" %}" style="width:50px; height: 50px; left: 10px; padding-top:6px;"></div><div class="col-sm-3"><h6 style="text-align: center; color: #FFFFFF; left: 65px; width: 103px; height: 25px; padding-top:px;" class="pd1" id="panchang">' + value + '  </h6></div></p></div></div>');
                    }
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                });
            });
        }
    }
}