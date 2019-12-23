var employees = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getEmployees();
});

function getEmployees() {
    employees = [];
    $("#employees").find("*").remove();
    showProgress("Memuat");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-employees.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            employees = JSON.parse(response);
            for (var i=0; i<employees.length; i++) {
                var employee = employees[i];
                var salary = parseInt(employee["salary"]);
                var salaryMonth = parseInt(employee["salary_month"]);
                var salaryPerMonth = salary/salaryMonth;
                $("#employees").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + employee["name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + employee["job_title"] + "</td>" +
                    "<td style='font-size: 15px;'>Rp" + salaryPerMonth + "</td>" +
                    "<td style='font-size: 15px;'>" + employee["employer"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='view link'>Ubah</a></td>" +
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
    $(".view").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var employee = employees[index];
        $("#title").html("Lihat Detail Karyawan");
        $("#ok").html("OK").unbind().on("click", function() {
            closeEditDialog();
        });
        $("#container").css("display", "flex").hide().fadeIn(300);
        $("#name").val(employee["name"]);
        $("#job-title").val(employee["job_title"]);
        $("#salary").val("Rp"+employee["salary"]);
        $("#start-work-date").val(moment(new Date(employee["start_work_date"])).format('DD MMMM YYYY'));
        $("#end-work-date").val(moment(new Date(employee["end_work_date"])).format('DD MMMM YYYY'));
    });
}

function closeEditDialog() {
    $("#container").fadeOut(300);
}