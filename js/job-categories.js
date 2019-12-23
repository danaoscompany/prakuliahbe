var categories = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getCategories();
});

function getCategories() {
    categories = [];
    $("#categories").find("*").remove();
    showProgress("Memuat");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-job-categories.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            categories = JSON.parse(response);
            for (var i=0; i<categories.length; i++) {
                var category = categories[i];
                $("#categories").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + category["name"] + "</td>" +
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
        var category = categories[index];
        $("#confirm-title").html("Hapus Kategori");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus kategori pekerjaan berikut?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            showProgress("Menghapus kategori pekerjaan");
            var fd = new FormData();
            fd.append("id", category["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-job-category.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    hideProgress();
                    show("Kategori pekerjaan dihapus");
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}