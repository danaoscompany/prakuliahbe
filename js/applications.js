var applications = [];

$(document).ready(function() {
    getApplications();
});

function getApplications() {
    $("#menu").load('menu.html', function() {});
    $("#applications").find("*").remove();
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-all-applications.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            console.log("Applications: "+response);
            applications = JSON.parse(response);
            for (var i=0; i<applications.length; i++) {
                var application = applications[i];
                var salaryPerMonth = parseInt(application["salary_per_month"]);
                $("#applications").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + application["job_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + application["employer_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + application["employee_name"] + "</td>" +
                    "<td style='font-size: 15px;'>Rp" + salaryPerMonth + "/bl</td>" +
                    "<td style='font-size: 15px;'>" + application["date"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='delete-application link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setListener();
        }
    });
}

function setListener() {
    $(".delete-application").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var application = applications[index];
        $("#confirm-title").html("Hapus Lamaran");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus lamaran ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus lamaran");
            var fd = new FormData();
            fd.append("id", application["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-application.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    hideProgress();
                    show("Lamaran berhasil dihapus");
                    getApplications();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}