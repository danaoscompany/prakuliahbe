var messages = [];

$(document).ready(function() {
    console.log("Messages page ready");
    $("#menu").load('menu.html', function() {});
    $("#user").change(function() {
        console.log("User checked");
        $("#employer").prop("checked", false);
    });
    $("#employer").change(function() {
        console.log("Employer checked");
        $("#user").prop("checked", false);
        showProgress("Memuat");
        $("#users").find("*").remove();
        $.ajax({
            type: 'GET',
            url: PHP_PATH+'get-employers.php',
            dataType: 'text',
            cache: false,
            success: function(response) {

                var employers = JSON.parse(response);
                for (var i=0; i<employers.length; i++) {
                    var employer = employers[i];
                    $("#users").append("<a class='dropdown-item' href='#'>"+employer["name"]+"</a>");
                }
                hideProgress();
            }
        });
    });
    getMessages();
});

function getMessages() {
    messages = [];
    $("#messages").find("*").remove();
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-messages.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            messages = JSON.parse(response);
            for (var i=0; i<messages.length; i++) {
                var message = messages[i];
                var date = message["date"];
                var messageText = message["message"];
                if (messageText.length >= 15) {
                    messageText = messageText.substr(0, 15)+"...";
                }
                $("#messages").append(""+
                    "<tr>"+
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td>"+message["title"]+"</td>"+
                    "<td>"+messageText+"</td>"+
                    "<td>"+message["sender_name"]+"</td>"+
                    "<td>"+message["receiver_name"]+"</td>"+
                    "<td>"+moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss')+"</td>"+
                    "<td><a class='view link'>Lihat</a></td>"+
                    "<td><a class='delete link'>Hapus</a></td>"+
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
        var message = messages[index];
        $("#container").css("display", "flex").hide().fadeIn(300);
        $("#message-title").val(message["title"]);
        $("#message").val(message["message"]);
        $("#sender-name").val(message["sender_name"]);
        $("#receiver-name").val(message["receiver_name"]);
        $("#date").val(moment(new Date(message["date"])).format('YYYY-MM-DD HH:mm:ss'));
        $("#ok").html("OK").unbind().on("click", function() {
            closeEditDialog();
        });
    });
    $(".delete").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var message = messages[index];
        $("#confirm-title").html("Hapus Pesan");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pesan berikut?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            $("#loading-blocker").show();
            showProgress("Menghapus pesan");
            var fd = new FormData();
            fd.append("id", message["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-message-by-id.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    getMessages();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").hide();
        });
        $("#confirm-container").css("display", "flex");
    });
}

function closeEditDialog() {
    $("#container").fadeOut(300);
}

function sendMessage() {
}

function closeSendMessageDialog() {
    $("#send-message-container").fadeOut(300);
}