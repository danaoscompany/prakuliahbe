var currentMaximumConnections = 1;
var currentProfilePicture = "";
var allUsers;
var checkedUserIDs = [];
var users;

$(document).ready(function () {
    $("#menu").load('menu.html', function() {});
    $("#check-all").change(function() {
        if ($('#check-all-checkbox').prop('checked')) {
            for (let j=0; j<users.length; j++) {
                checkedUserIDs.push(users[j]["id"]);
            }
            for (let i=0; i<users.length; i++) {
                $("#users").find("#defaultUnchecked"+(i+1)).prop("checked", true);
            }
            setDeleteButtonVisible(true);
        } else {
            checkedUserIDs = [];
            for (let i=0; i<users.length; i++) {
                $("#users").find("#defaultUnchecked"+(i+1)).prop("checked", false);
            }
            setDeleteButtonVisible(false);
        }
    });
    getUsers();
});

function setDeleteButtonVisible(visible) {
    if (visible) {
        $("#delete").css("display", "visible");
    } else {
        $("#delete").css("display", "none");
    }
}

function getUsers() {
    $("#users").find("*").remove();
    showProgress("Memuat pengguna");
    $.ajax({
        type: 'GET',
        url: PHP_PATH + 'get-users.php',
        dataType: 'text',
        cache: false,
        success: function (a) {
            users = JSON.parse(a);
            allUsers = JSON.parse(a);
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var endDate = parseInt(user["end_date"]);
                var currentDate = new Date().getTime();
                var remainingTimeMillis = endDate - currentDate;

                var remainingSeconds = Math.floor((remainingTimeMillis / 1000) % 60);
                var remainingMinutes = Math.floor((remainingTimeMillis / 1000 / 60) % 60);
                var remainingHours = Math.floor((remainingTimeMillis / (1000 * 60 * 60)) % 24);
                var remainingDays = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24));
                var remainingMonths = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24 * 30));
                var remainingYears = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24 * 30 * 12));

                var remainingTimeString = "";
                if (remainingSeconds > 0) {
                    remainingTimeString = (remainingSeconds + " detik ");
                }
                if (remainingMinutes > 0) {
                    remainingTimeString = (remainingMinutes + " menit ");
                }
                if (remainingHours > 0) {
                    remainingTimeString = (remainingHours + " jam ");
                }
                if (remainingDays > 0) {
                    remainingTimeString = (remainingDays + " hari ");
                }
                if (remainingMonths > 0) {
                    remainingTimeString = (remainingMonths + " bulan ");
                }
                if (remainingYears > 0) {
                    remainingTimeString = (remainingYears + " tahun ");
                }
                $("#users").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + user["first_name"] +" " + user["last_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + user["email"] + "</td>" +
                    "<td style='font-size: 15px;'>" + user["phone"] + "</td>" +
                    "<td style='font-size: 15px;'>" + user["nim"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='edit-user link'>Ubah</a></td>" +
                    "<td style='font-size: 15px;'><a class='delete-user link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            hideProgress();
            setUserClickListener();
        }
    });
}

function deleteUsers() {
    $("#confirm-title").html("Hapus Pengguna");
    $("#close-confirm").unbind().on("click", function() {
        $("#confirm-container").fadeOut(300);
    });
    $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna yang dipilih?");
    $("#confirm-cancel").unbind().on("click", function() {
        $("#confirm-container").fadeOut(300);
    });
    $("#confirm-ok").unbind().on("click", function() {
        $("#confirm-container").hide();
        showProgress("Menghapus pengguna yang dipilih");
        var fd = new FormData();
        let ids = [];
        for (let i=0; i<checkedUserIDs.length; i++) {
            let userID = checkedUserIDs[i];
            ids.push(userID);
        }
        fd.append("id", JSON.stringify(ids));
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'delete-users.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                console.log("Response: "+response);
                getUsers();
            }
        });
    });
    $("#confirm-container").css("display", "flex").hide().fadeIn(300);
}

function checkAllChecked() {
    var allChecked = false;
    for (var i=0; i<users.length; i++) {
        var checked = $("#users").find("#defaultUnchecked"+(i+1)).prop("checked");
        if (checked) {
            allChecked = true;
            break;
        }
    }
    if (allChecked) {
        $("#delete").css("display", "block");
    } else {
        $("#delete").css("display", "none");
    }
}

function setUserClickListener() {
    $(".custom-control-input").change(function() {
        checkAllChecked();
        var id = $(this).attr('id');
        var tr = $(this).parent().parent().parent();
        var index = $("#users").children().index(tr);
        checkedUserIDs.push(users[index]["id"]);
        if ($(this).prop('checked')) {
            $("#delete").css("display", "block");
        }
    });
    $(".edit-user").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#edit-user-title").html("Ubah Pengguna");
        $("#edit-user-first-name").val(user["first_name"]);
        $("#edit-user-last-name").val(user["last_name"]);
        $("#edit-user-nim").val(user["nim"]);
        $("#edit-user-va").val(user["va_number"]);
        $("#edit-user-phone").val(user["phone"]);
        $("#edit-user-email").val(user["email"]);
        $("#edit-user-password").val(user["password"]);
        if (user["profile_picture_url"] != "") {
            $("#edit-user-profile-picture").attr("src", user["profile_picture_url"]);
        }
        $("#edit-user-container").css("display", "flex").hide().fadeIn(300);
        $("#edit-user-ok").html("Ubah").unbind().on("click", function () {
            var firstName = $("#edit-user-first-name").val().trim();
            var lastName = $("#edit-user-last-name").val().trim();
            var phone = $("#edit-user-phone").val().trim();
            var email = $("#edit-user-email").val().trim();
            var password = $("#edit-user-password").val().trim();
            var nim = $("#edit-user-nim").val().trim();
            var va = $("#edit-user-va").val().trim();
            if (email == "") {
                show("Mohon masukkan email");
                return;
            }
            if (password == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            showProgress("Mengubah pengguna");
            var fd = new FormData();
            fd.append("id", user["id"]);
            fd.append("first_name", firstName);
            fd.append("last_name", lastName);
            fd.append("email", email);
            fd.append("phone", phone);
            fd.append("password", password);
            fd.append("nim", nim);
            fd.append("va", va);
            if (currentProfilePicture != "img/profile-picture.jpg") {
                fd.append("profile_picture_set", 1);
            } else {
                fd.append("profile_picture_set", 0);
            }
            fd.append("profile_picture_url", currentProfilePicture);
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'edit-user.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    hideProgress();
                    var response = a;
                    console.log("Response: " + response);
                    if (response == 0) {
                        $("#edit-user-container").fadeOut(300);
                        getUsers();
                    } else if (response == -1) {
                        show("Nama pengguna sudah digunakan");
                    } else if (response == -2) {
                        show("Nomor HP sudah digunakan");
                    } else if (response == -3) {
                        show("Email sudah digunakan");
                    } else {
                        show("Kesalahan: " + response);
                    }
                }
            });
        });
    });
    $(".delete-user").on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var user = users[index];
        $("#confirm-title").html("Hapus Pengguna");
        $("#close-confirm").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna ini?");
        $("#confirm-ok").unbind().on("click", function () {
            $("#confirm-container").hide();
            showProgress("Menghapus pengguna");
            $.ajax({
                type: 'GET',
                url: PHP_PATH + 'delete-user.php',
                data: {'id': user["id"]},
                dataType: 'text',
                cache: false,
                success: function (a) {
                    firebase.database().ref("users/" + user["id"]).remove();
                    hideProgress();
                    getUsers();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function addUser() {
    currentMaximumConnections = 1;
    currentProfilePicture = "img/profile-picture.jpg";
    $("#edit-user-title").html("Tambah Pengguna");
    $("#edit-user-first-name").val("");
    $("#edit-user-last-name").val("");
    $("#edit-user-phone").val("");
    $("#edit-user-email").val("");
    $("#edit-user-password").val("");
    $("#edit-user-nim").val("");
    $("#edit-user-va").val("");
    $("#edit-user-profile-picture").attr("src", currentProfilePicture);
    $("#edit-user-container").css("display", "flex").hide().fadeIn(300);
    $("#edit-user-ok").html("Tambah").unbind().on("click", function () {
        var firstName = $("#edit-user-first-name").val().trim();
        var lastName = $("#edit-user-last-name").val().trim();
        var nim = $("#edit-user-nim").val().trim();
        var va = $("#edit-user-va").val().trim();
        var phone = $("#edit-user-phone").val().trim();
        var email = $("#edit-user-email").val().trim();
        var password = $("#edit-user-password").val().trim();
        if (email == "") {
            show("Mohon masukkan email");
            return;
        }
        if (password == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        showProgress("Membuat pengguna");
        var fd = new FormData();
        fd.append("first_name", firstName);
        fd.append("last_name", lastName);
        fd.append("phone", phone);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("nim", nim);
        fd.append("va", va);
        if (currentProfilePicture != "img/profile-picture.jpg") {
            fd.append("profile_picture_set", 1);
        } else {
            fd.append("profile_picture_set", 0);
        }
        fd.append("profile_picture_url", currentProfilePicture);
        var userId = uuidv4();
        if (userId) {
            fd.append("user_id", userId);
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'create-user.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (response) {
                    console.log("Response: "+response);
                    hideProgress();
                    if (response == "0") {
                        $("#edit-user-container").fadeOut(300);
                        getUsers();
                    } else if (response == "-1") {
                        show("Nama pengguna sudah digunakan");
                    } else if (response == "-2") {
                        show("Nomor HP sudah digunakan");
                    } else if (response == "-3") {
                        show("Email sudah digunakan");
                    } else {
                        show("Kesalahan: " + response);
                    }
                }
            });
        }
    });
}

function closeEditUserDialog() {
    $("#edit-user-container").fadeOut(300);
}

function generateRandomUsername() {
    var userName = generateRandomID(14);
    $("#edit-user-username").val(userName);
}

function increaseMaxConn() {
    currentMaximumConnections++;
    $("#maximum-connections").val(currentMaximumConnections);
}

function decreaseMaxConn() {
    if (currentMaximumConnections > 1) {
        currentMaximumConnections--;
    }
    $("#maximum-connections").val(currentMaximumConnections);
}

function selectProfilePicture() {
    $("#edit-user-select-profile-picture").on("change", function () {
        var fr = new FileReader();
        fr.onload = function () {
            $("#edit-user-profile-picture").attr("src", fr.result);
        };
        fr.readAsDataURL($(this).prop("files")[0]);
    });
    $("#edit-user-select-profile-picture").click();
}

function search() {
    var keyword = $("#keyword").val().toLowerCase().trim();
    $("#users").find("*").remove();
    users = [];
    if (keyword == "") {
        for (var i = 0; i < allUsers.length; i++) {
            var user = allUsers[i];
            users.push(user);
            displayUser(user, i+1);
        }
    } else {
        for (var i = 0; i < allUsers.length; i++) {
            var user = allUsers[i];
        }
    }
}

function displayUser(user, position) {
    var trial = "Tidak";
    if (parseInt(user["is_trial"]) == 1) {
        trial = "Ya";
    }
    var endDate = parseInt(user["end_date"]);
    var currentDate = new Date().getTime();
    var remainingTimeMillis = endDate - currentDate;

    var remainingSeconds = Math.floor((remainingTimeMillis / 1000) % 60);
    var remainingMinutes = Math.floor((remainingTimeMillis / 1000 / 60) % 60);
    var remainingHours = Math.floor((remainingTimeMillis / (1000 * 60 * 60)) % 24);
    var remainingDays = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24));
    var remainingMonths = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24 * 30));
    var remainingYears = Math.floor(remainingTimeMillis / (1000 * 60 * 60 * 24 * 30 * 12));

    var remainingTimeString = "";
    if (remainingSeconds > 0) {
        remainingTimeString = (remainingSeconds + " detik ");
    }
    if (remainingMinutes > 0) {
        remainingTimeString = (remainingMinutes + " menit ");
    }
    if (remainingHours > 0) {
        remainingTimeString = (remainingHours + " jam ");
    }
    if (remainingDays > 0) {
        remainingTimeString = (remainingDays + " hari ");
    }
    if (remainingMonths > 0) {
        remainingTimeString = (remainingMonths + " bulan ");
    }
    if (remainingYears > 0) {
        remainingTimeString = (remainingYears + " tahun ");
    }
    $("#users").append("" +
        "<tr>" +
        "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + position + "</div></td>" +
        "<td><div class='custom-control custom-checkbox'>"+
        "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+position+"'>"+
        "<label class='custom-control-label' for='defaultUnchecked"+position+"'></label>"+
        "</div></td>"+
        "<td>" + user["first_name"] + " " + user["last_name"] + "</td>" +
        "<td>" + user["email"] + "</td>" +
        "<td>" + user["active_connections"] + "</td>" +
        "<td>" + trial + "</td>" +
        "<td>" + remainingTimeString + "</td>" +
        "<td><a class='edit-user link'>Ubah</a></td>" +
        "<td><a class='delete-user link'>Hapus</a></td>" +
        "</tr>"
    );
    setUserClickListener();
}