var universities = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getUniversities();
});

function getUniversities() {
    $("#universities").find("*").remove();
    universities = [];
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-universities.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            universities = JSON.parse(response);
            for (var i=0; i<universities.length; i++) {
                var university = universities[i];
                $("#universities").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + university["name"] + "</td>" +
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
        var university = universities[index];
        $("#confirm-title").html("Hapus Universitas");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus universitas berikut?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            $("#loading-blocker").show();
            showProgress("Menghapus universitas");
            var fd = new FormData();
            fd.append("id", university["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-university-by-id.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    getUniversities();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").hide();
        });
        $("#confirm-container").css("display", "flex");
    });
}

function addUniversity() {
    $("#container").css("display", "flex").hide().fadeIn(300);
    $("#name").val("");
    $("#title").html("Tambah Universitas");
    $("#ok").html("Tambah").unbind().on("click", function() {
        var name = $("#name").val().trim();
        if (name == "") {
            show("Mohon masukkan nama universitas");
            return;
        }
        $("#container").fadeOut(300);
        showProgress("Menambah universitas");
        var fd = new FormData();
        fd.append("name", name);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'add-university.php',
            data: fd,
            processData: false,
            contentType: false,
            success: function(response) {
                hideProgress();
                getUniversities();
            }
        });
    });
}

function closeEditDialog() {
    $("#container").fadeOut(300);
}