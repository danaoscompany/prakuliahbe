var cvs = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getCVs();
});

function getCVs() {
    showProgress("Memuat");
    $("#cvs").find("*").remove();
    cvs = [];
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-cvs.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            cvs = JSON.parse(response);
            for (var i=0; i<cvs.length; i++) {
                var cv = cvs[i];
                $("#cvs").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + cv["first_name"] + " " + cv["last_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + cv["email"] + "</td>" +
                    "<td style='font-size: 15px;'>" + cv["target_savings"] + "</td>" +
                    "<td style='font-size: 15px;'>" + cv["phone"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='view link'>Lihat</a></td>" +
                    "<td style='font-size: 15px;'><a class='delete link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setClickListener();
            hideProgress();
        }
    });
}

function setClickListener() {
    $(".delete").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var cv = cvs[index];
        $("#confirm-title").html("Hapus CV");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus CV berikut?");
        $("#confirm-ok").html("Ya").unbind().on("click", function() {
            showProgress("Menghapus CV");
            var fd = new FormData();
            fd.append("id", cv["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-cv-by-id.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    $("#confirm-container").fadeOut(300);
                    getCVs();
                }
            });
        });
        $("#confirm-cancel").html("Tidak").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".view").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var cv = cvs[index];
        $("#ok").html("OK").unbind().on("click", function() {
            closeEditDialog();
        });
        $("#container").css("display", "flex").hide().fadeIn(300);
        $("#first-name").val(cv["first_name"]);
        $("#last-name").val(cv["last_name"]);
        $("#last-education").val(cv["last_education"]);
        $("#major").val(cv["major"]);
        $("#school-name").val(cv["school_name"]);
        $("#graduation-year").val(cv["graduation_year"]);
        $("#target-univ").val(cv["target_university_name"]);
        $("#univ-major").val(cv["target_university_major"]);
        $("#savings").val(parseInt(cv["target_savings"]));
        $("#description").val(cv["description"]);
        $("#email").val(cv["email"]);
        $("#address").val(cv["address"]);
        $("#phone").val(cv["phone"]);
        $("#whatsapp-number").val(cv["whatsapp_number"]);
        $("#parent-name").val(cv["parent_name"]);
        $("#parent-phone").val(cv["parent_phone"]);
        var certificationsJSON = JSON.parse(cv["certifications"]);
        for (var i=0; i<certificationsJSON.length; i++) {
            var certificationJSON = certificationsJSON[i];
            $("#certifications").append("" +
                "<input value='"+certificationJSON["name"]+"' class='input2' type='text' style='width: 100%;'>"+
                "");
        }
        var experiencesJSON = JSON.parse(cv["experiences"]);
        for (var i=0; i<experiencesJSON.length; i++) {
            var experienceJSON = experiencesJSON[i];
            $("#experiences").append("" +
                "<div style='width: 100%; display: flex; flex-flow: row nowrap;'>"+
                    "<input value='"+experienceJSON["position"]+"' class='input2' type='text' style='width: 150px;'>"+
                "<input value='"+experienceJSON["start_date"]+"' class='input2' type='text' style='margin-left: 5px; width: 100px;'>"+
                "<input value='"+experienceJSON["end_date"]+"' class='input2' type='text' style='margin-left: 5px; width: 100px;'>"+
                "</div>");
        }
        var languagesJSON = JSON.parse(cv["languages"]);
        for (var i=0; i<languagesJSON.length; i++) {
            var languageJSON = languagesJSON[i];
            $("#languages").append("" +
                "<div style='width: 100%; display: flex; flex-flow: row nowrap;'>"+
                "<input value='"+languageJSON["name"]+"' class='input2' type='text' style='width: 150px;'>"+
                "<input value='"+languageJSON["level"]+"' class='input2' type='text' style='margin-left: 5px; width: 100px;'>"+
                "</div>");
        }
        var organizationsJSON = JSON.parse(cv["organizations"]);
        for (var i=0; i<organizationsJSON.length; i++) {
            var organizationJSON = organizationsJSON[i];
            $("#organizations").append("" +
                "<div style='width: 100%; display: flex; flex-flow: row nowrap;'>"+
                "<input value='"+organizationJSON["name"]+"' class='input2' type='text' style='width: 100%;'>"+
                "</div>");
        }
        var skillsJSON = JSON.parse(cv["skills"]);
        for (var i=0; i<skillsJSON.length; i++) {
            var skillJSON = skillsJSON[i];
            $("#skills").append("" +
                "<div style='width: 100%; display: flex; flex-flow: row nowrap;'>"+
                "<input value='"+skillJSON["name"]+"' class='input2' type='text' style='width: 100%;'>"+
                "</div>");
        }
        var imgURL = "http://"+HOST+"/userdata/"+cv["profile_picture"];
        $("#profile-picture").attr("src", imgURL);
    });
}

function closeEditDialog() {
    $("#container").fadeOut(300);
}