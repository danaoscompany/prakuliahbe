const HOST = "localhost/prakuliah";
//const HOST = "139.99.22.150/prakuliah";
const PHP_PATH = "http://"+HOST+"/php/";

function show(msg) {
    $("#toast-msg").html(msg);
    $("#toast-container").css("display", "flex").hide().fadeIn(500);
    setTimeout(function() {
        $("#toast-container").fadeOut(500);
    }, 3000);
}

function showProgress(msg) {
    $("#loading-blocker").fadeIn(200);
    $("#loading-msg").html(msg+" . . .");
    $("#loading-container").css("margin-bottom", "0");
    var currentDotCount = 3;
    var progressMsgUpdater = function() {
        if (currentDotCount < 6) {
            currentDotCount++;
        } else {
            currentDotCount = 3;
        }
        var dotMsg = "";
        for (var i=0; i<currentDotCount; i++) {
            dotMsg += " ";
            dotMsg += ".";
        }
        $("#loading-msg").html(msg + dotMsg);
        setTimeout(progressMsgUpdater, 500);
    };
    setTimeout(progressMsgUpdater, 500);
}

function hideProgress() {
    $("#loading-blocker").fadeOut(200);
    $("#loading-container").css("margin-bottom", "-45px");
}

function showAlert(title, msg) {
    $("#alert-title").html(title);
    $("#alert-msg").html(msg);
    $("#alert-container").css("display", "flex").hide().fadeIn(300);
    $("#close-alert").unbind().on("click", function() {
        $("#alert-container").fadeOut(300);
    });
    $("#alert-ok").unbind().on("click", function() {
        $("#alert-container").fadeOut(300);
    });
}

function logout() {
    $("#confirm-title").html("Keluar");
    $("#confirm-msg").html("Apakah Anda yakin ingin keluar?");
    $("#confirm-ok").unbind().on("click", function() {
        $("#confirm-container").hide();
        $("#loading-blocker").show();
        showProgress("Sedang keluar");
        $.ajax({
            type: 'GET',
            url: PHP_PATH+'logout.php',
            dataType: 'text',
            cache: false,
            success: function(a) {
                window.location.href = "login.html";
            }
        });
    });
    $("#confirm-cancel").unbind().on("click", function() {
        $("#confirm-container").hide();
    });
    $("#confirm-container").css("display", "flex");
}

function openAdmins() {
    window.location.href = "admins.html";
}

function openUsers() {
    window.location.href = "users.html";
}

function openPartners() {
    window.location.href = "partners.html";
}

function openEmployers() {
    window.location.href = "employers.html";
}

function openApplications() {
    window.location.href = "applications.html";
}

function openFinances() {
    window.location.href = "finances.html";
}

function openArticles() {
    window.location.href = "articles.html";
}

function openCVs() {
    window.location.href = "cvs.html";
}

function generateRandomID(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function constructFormData(...values) {
    var fd = new FormData();
    for (var i=0; i<values.length; i+=2) {
        fd.append(values[i], values[i+1]);
    }
    return fd;
}

Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}