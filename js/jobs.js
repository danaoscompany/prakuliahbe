var jobs = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getJobs();
});

function getJobs() {
    jobs = [];
    $("#jobs").find("*").remove();
    showProgress("Memuat pekerjaan");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-jobs.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            jobs = JSON.parse(response);
            for (var i=0; i<jobs.length; i++) {
                var job = jobs[i];
                var startWorkDate = moment(new Date(job["start_work_date"])).format('DD MMMM YYYY');
                var endWorkDate = moment(new Date(job["end_work_date"])).format('DD MMMM YYYY');
                var available = parseInt(job["available"]);
                var row = "" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + job["title"] + "</td>" +
                    "<td style='font-size: 15px;'>" + job["employer"] + "</td>" +
                    "<td style='font-size: 15px;'>Rp" + job["salary"] + "</td>" +
                    "<td style='font-size: 15px;'>" + startWorkDate + "</td>" +
                    "<td style='font-size: 15px;'>" + endWorkDate + "</td>" +
                    "<td style='font-size: 15px;'><a class='view link'>Lihat</a></td>";
                if (available == 0) {
                    row += "<td style='font-size: 15px; color: red;'>Tidak tersedia</td>";
                } else if (available == 1) {
                    row += "<td style='font-size: 15px; color: red;'>Terverifikasi</td>";
                } else if (available == 2) {
                    row += "<td style='font-size: 15px; color: red;'>Draft</td>";
                } else if (available == 3) {
                    row += "<td style='font-size: 15px;'><a class='approve link'>Approve</a></td>";
                }
                row += "" +
                    "<td style='font-size: 15px;'><a class='delete link'>Hapus</a></td>" +
                    "</tr>";
                $("#jobs").append(row);
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
        var job = jobs[index];
        $("#confirm-title").html("Hapus Pekerjaan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pekerjaan ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus pekerjaan");
            var fd = new FormData();
            fd.append("id", job["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-job-by-id.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    show("Pekerjaan dihapus");
                    getJobs();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
    $(".view").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var job = jobs[index];
        $("#container").css("display", "flex").hide().fadeIn(300);
        $('#category').val(job["category"]);
        $("#job-title").val(job["title"]);
        $("#employer").val(job["employer"]);
        $("#benefits").val(job["benefits"]);
        $("#description").val(job["description"]);
        $("#working-hours").val(job["working_hours"]+" jam");
        $("#other-description").val(job["other_description"]);
        $("#location").val(job["location_name"]);
        $("#city").val(job["city"]);
        $("#salary").val("Rp"+job["salary"]);
        $("#salary-negotiation").val((parseInt(job["salary_negotiable"])==1)?"Ya":"Tidak");
        var available = parseInt(job["available"]);
        if (available == 0) {
            $("#status").val("Tidak tersedia");
        } else if (available == 1) {
            $("#status").val("Tersedia");
        } else if (available == 2) {
            $("#status").val("Draft");
        } else if (available == 3) {
            $("#status").val("Menunggu persetujuan");
        }
        $("#start-work-date").val(moment(new Date(job["start_work_date"])).format("DD MMMM YYYY"));
        $("#end-work-date").val(moment(new Date(job["end_work_date"])).format("DD MMMM YYYY"));
        $("#capacity").val(parseInt(job["capacity"]));
        $("#min-age").val(parseInt(job["minimum_age"]));
        $("#date-posted").val(moment(new Date(job["date_posted"])).format('DD MMMM YYYY'));
        $("#ok").html("OK").unbind().on("click", function() {
            closeEditDialog();
        });
    });
    $(".approve").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var job = jobs[index];
        if (parseInt(job["available"]) == 1) {
            show("Pekerjaan sudah disetujui");
            return;
        }
        $("#confirm-title").html("Setujui Pekerjaan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menyetujui pekerjaan ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menyetujui pekerjaan");
            var fd = new FormData();
            fd.append("admin_id", localStorage.getItem("user_id"));
            fd.append("id", job["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'approve-job.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    if (response == "0") {
                        show("Pekerjaan disetujui");
                    } else if (response == "-1") {
                        show("Pekerjaan sudah disetujui");
                    } else if (response == "-2") {
                        show("Anda tidak memiliki hak akses untuk menyetujui pekerjaan");
                    }
                    getJobs();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeEditDialog() {
    $("#container").fadeOut(300);
}