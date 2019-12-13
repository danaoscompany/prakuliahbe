var notifications = [];
var monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei",
    "Juni", "Juli", "Agustus", "September", "Oktober",
    "November", "Desember"
];

$(document).ready(function () {
    $("#menu").load('menu.html', function() {});
    getNotifications();
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey("BMATEC9vSMYogedkzELmghC6cFNSLT3mY7o62m5UllHdB0rkd1S-wpoBNKcpZv20edaVgavEEz7iYLaJyOVSUxI");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    // TODO Remove this line
                    console.log("Current token: "+currentToken);
                    var fd = new FormData();
                    fd.append("token", currentToken);
                    $.ajax({
                        type: 'POST',
                        url: PHP_PATH+'update-admin-fcm-token.php',
                        data: fd,
                        processData: false,
                        contentType: false,
                        cache: false,
                        success: function(a) {
                        }
                    });
                }
            }).catch((err) => {
            });
        }
    });
});

function getNotifications() {
    $("#notifications").find("*").remove();
    showProgress("Memuat notifikasi");
    $.ajax({
        type: 'GET',
        url: PHP_PATH + 'get.php?name=notifications',
        dataType: 'text',
        cache: false,
        success: function (a) {
            notifications = JSON.parse(a);
            for (var i = 0; i < notifications.length; i++) {
                var notification = notifications[i];
                var trial = "Tidak";
                if (parseInt(notification["is_trial"]) == 1) {
                    trial = "Ya";
                }
                var date = new Date(parseInt(notification["date"]));
                var dateText = "";
                dateText += date.getDate();
                dateText += " ";
                dateText += monthNames[date.getMonth()];
                dateText += " ";
                dateText += date.getFullYear();
                var content = notification["content"];
                if (content.length > 30) {
                    content = content.substring(0, 29)+"...";
                }
                $("#notifications").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i+1) + "</div></td>" +
                    "<td>" + notification["title"] + "</td>" +
                    "<td>" + content + "</td>" +
                    "<td>" + dateText + "</td>" +
                    "<td><a class='edit-notification link'>Ubah</a></td>" +
                    "<td><a class='delete-notification link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            hideProgress();
            setNotificationClickListener();
        }
    });
}

function closeEditNotificationDialog() {
    $("#edit-notification-container").hide();
}

function setNotificationClickListener() {
    $(".edit-notification").unbind().on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var notification = notifications[index];
        $("#title").val(notification["title"]);
        $("#content").val(notification["content"]);
        $("#edit-notification-title").html("Ubah Notifikasi");
        $("#edit-notification-ok").html("Ubah").unbind().on("click", function() {
            var title = $("#title").val().trim();
            var content = $("#content").val().trim();
            if (title == "") {
                show("Mohon masukkan judul notifikasi");
                return;
            }
            if (content == "") {
                show("Mohon masukkan isi notifikasi");
                return;
            }
            showProgress("Mengubah notifikasi");
            var fd = new FormData();
            fd.append("id", notification["id"]);
            fd.append("title", title);
            fd.append("content", content);
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'edit-notification.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    $("#edit-notification-container").fadeOut(300);
                    hideProgress();
                    getNotifications();
                }
            });
        });
        $("#edit-notification-container").css("display", "flex").hide().fadeIn(300);
    });
}

function addNotification() {
    $("#title").val("");
    $("#content").val("");
    $("#edit-notification-title").html("Tambah Notifikasi");
    $("#edit-notification-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-notification-ok").html("Tambah").unbind().on("click", function() {
        var title = $("#title").val().trim();
        var content = $("#content").val().trim();
        if (title == "") {
            show("Mohon masukkan judul notifikasi");
            return;
        }
        if (content == "") {
            show("Mohon masukkan isi notifikasi");
            return;
        }
        showProgress("Menambah notifikasi");
        var fd = new FormData();
        fd.append("title", title);
        fd.append("content", content);
        fd.append("date", new Date().getTime());
        $.ajax({
            type: 'POST',
            url: PHP_PATH + 'add-notification.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (a) {
                $("#edit-notification-container").fadeOut(300);
                hideProgress();
                getNotifications();
            }
        });
    });
}