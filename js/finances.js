var finances = [];

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getFinances();
});

function getFinances() {
    $("#finances").find("*").remove();
    var fd = new FormData();
    fd.append("name", "finance");
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'get-finances.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            console.log("Finances: "+response);
            finances = JSON.parse(response);
            for (var i=0; i<finances.length; i++) {
                var finance = finances[i];
                var credit = parseInt(finance["credit"]);
                var amount = finance["amount"];
                var date = finance["date"];
                date = moment(date, 'YYYY-MM-DD HH:mm:ss');
                date = new Date(date).customFormat("#D# #MMMM# #YYYY#");
                $("#finances").append("" +
                    "<tr>"+"<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                        "<td><div class='custom-control custom-checkbox'>"+
                        "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                        "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + finance["full_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + ((credit == 0)?"Kredit":"Debit") + "</td>" +
                    "<td style='font-size: 15px;'>Rp" + amount + ",-</td>" +
                    "<td style='font-size: 15px;'>" + date + "</td>" +
                    "<td style='font-size: 15px;'><a class='delete-finance link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            setListener();
        }
    });
}

function setListener() {
    $(".delete-finance").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var finance = finances[index];
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus informasi keuangan ini?");
        $("#confirm-title").html("Hapus Mutasi");
        $("#confirm-ok").unbind().on("click", function() {
            showProgress("Menghapus informasi keuangan");
            var fd = new FormData();
            fd.append("id", finance["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-finance.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    hideProgress();
                    $("#confirm-container").fadeOut(300);
                    getFinances();
                }
            });
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function closeEditFinanceDialog() {
    $("#container").fadeOut(300);
}