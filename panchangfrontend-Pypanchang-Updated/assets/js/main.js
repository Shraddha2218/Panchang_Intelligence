n =  new Date();
            y = n.getFullYear();
            m = n.getMonth() + 1;
            d = n.getDate();
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var hours = n.getHours() > 12 ? n.getHours() - 12 : n.getHours();
            var am_pm = n.getHours() >= 12 ? "PM" : "AM";
            hours = hours < 10 ? "0" + hours : hours;
            var minutes = n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes();
            time = hours + ":" + minutes + " " + am_pm;
            $("#currentDay").append(days[n.getDay()]+","+" "+time);
            var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            $("#currentDay1").append(days[n.getDay()]+" , "+" "+ months[m-1] + " " + d + " , " + y + " , ");
            $("#currentDay0").append(days[n.getDay()]+ ", " + d + " " + months[m-1] +" "+time);