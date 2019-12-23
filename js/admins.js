var currentActiveConnections = 0;
var currentMaximumConnections = 1;
var currentProfilePicture = "";
var currentProfilePictureFile = null;
var admins;

$(document).ready(function() {
    getAdmins();
});

function getAdmins() {
    $("#menu").load('menu.html', function() {});
    $("#admins").find("*").remove();
    showProgress("Memuat admin");
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-admins.php',
        dataType: 'text',
        cache: false,
        success: function(a) {
            admins = JSON.parse(a);
            for (var i=0; i<admins.length; i++) {
                var admin = admins[i];
                var trial = "Tidak";
                if (parseInt(admin["is_trial"]) == 1) {
                    trial = "Ya";
                }
                $("#admins").append(""+
                    "<tr>"+
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>"+i+"</div></td>"+
                    "<td>"+admin["first_name"]+" "+admin["last_name"]+"</td>"+
                    "<td>"+admin["phone"]+"</td>"+
                    "<td>"+admin["password"]+"</td>"+
                    "<td>"+admin["email"]+"</td>"+
                    "<td><a class='edit-admin link'>Ubah</a></td>"+
                    "<td><a class='delete-admin link'>Hapus</a></td>"+
                    "</tr>"
                );
            }
            hideProgress();
            setAdminClickListener();
        }
    });
}

function setAdminClickListener() {
    $(".edit-admin").on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var admin = admins[index];
        $("#title").html("Ubah Admin");
        $("#first-name").val(admin["first_name"]);
        $("#last-name").val(admin["last_name"]);
        $("#phone").val(admin["phone"]);
        $("#email").val(admin["email"]);
        $("#password").val(admin["password"]);
        $("#container").css("display", "flex").hide().fadeIn(300);
        showProgress("Memuat");
        var fd = new FormData();
        fd.append("user_id", admin["id"]);
        fd.append("role", "admin");
        $("#role-trusted").prop("checked", false);
        $("#role-job-approval").prop("checked", false);
        $("#role-chat").prop("checked", false);
        $("#role-article").prop("checked", false);
        //$("#role-admin").prop("checked", false);
        $("#role-user").prop("checked", false);
        $("#role-employer").prop("checked", false);
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-roles.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var roles = JSON.parse(response);
                for (var i=0; i<roles.length; i++) {
                    var role = roles[i];
                    var roleID = parseInt(role["role_id"]);
                    var enabled = parseInt(role["enabled"]);
                    if (roleID == 1) {
                        $("#role-trusted").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 2) {
                        $("#role-job-approval").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 3) {
                        $("#role-chat").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 4) {
                        $("#role-article").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 5) {
                        //$("#role-admin").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 6) {
                        $("#role-user").prop("checked", (enabled == 1)?true:false);
                    } else if (roleID == 7) {
                        $("#role-employer").prop("checked", (enabled == 1)?true:false);
                    }
                }
                hideProgress();
            }
        });
        $("#ok").html("Ubah").unbind().on("click", function() {
            var firstName = $("#first-name").val().trim();
            var lastName = $("#last-name").val().trim();
            var phone = $("#phone").val().trim();
            var email = $("#email").val().trim();
            var password = $("#password").val().trim();
            if (firstName == "" || lastName == "") {
                show("Mohon masukkan nama");
                return;
            }
            if (phone == "") {
                show("Mohon masukkan nomor HP");
                return;
            }
            if (password == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            /*if (activeConnections <= 0) {
                show("Mohon masukkan jumlah koneksi aktif minimal 1");
                return;
            }*/
            var rolesJSON = [];
            var userID = admin["id"];
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 1,
                'enabled': ($("#role-trusted").prop("checked")==true)?1:0});
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 2,
                'enabled': ($("#role-job-approval").prop("checked")==true)?1:0});
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 3,
                'enabled': ($("#role-chat").prop("checked")==true)?1:0});
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 4,
                'enabled': ($("#role-article").prop("checked")==true)?1:0});
            /*rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 5,
                'enabled': ($("#role-admin").prop("checked")==true)?1:0});*/
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 6,
                'enabled': ($("#role-user").prop("checked")==true)?1:0});
            rolesJSON.push({'user_id': userID, 'role': 'admin', 'role_id': 7,
                'enabled': ($("#role-employer").prop("checked")==true)?1:0});
            showProgress("Mengubah admin");
            var fd = new FormData();
            fd.append("id", admin["id"]);
            fd.append("first_name", firstName);
            fd.append("last_name", lastName);
            fd.append("email", email);
            fd.append("password", password);
            fd.append("phone", phone);
            fd.append("roles", JSON.stringify(rolesJSON));
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'edit-admin.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(a) {
                    hideProgress();
                    var response = a;
                    if (response == 0) {
                        $("#container").fadeOut(300);
                        getAdmins();
                    } else if (response == -1) {
                        show("Nama admin sudah digunakan");
                    } else if (response == -2) {
                        show("Nomor HP sudah digunakan");
                    } else if (response == -3) {
                        show("Email sudah digunakan");
                    } else {
                        show("Kesalahan: "+response);
                    }
                }
            });
        });
    });
    $(".delete-admin").on("click", function() {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var admin = admins[index];
        $("#confirm-title").html("Hapus Admin");
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus admin ini?");
        $("#confirm-ok").unbind().on("click", function() {
            $("#confirm-container").hide();
            if (admins.length == 1) {
                show("Tidak bisa menghapus admin. Minimal harus ada 1 admin yang terdaftar.");
                return;
            }
            showProgress("Menghapus admin");
            var fd = new FormData();
            fd.append("admin_id", localStorage.getItem("user_id"));
            fd.append("id", admin["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-admin.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    if (response == "0") {
                        hideProgress();
                        show("Anda tidak memiliki hak akses untuk menghapus admin");
                    } else if (response == "1") {
                        show("Admin berhasil dihapus");
                        getAdmins();
                    }
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function addAdmin() {
    currentActiveConnections = 0;
    currentMaximumConnections = 1;
    currentProfilePicture = "img/profile-picture.jpg";
    $("#title").html("Tambah Admin");
    $("#name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#password").val("");
    $("#container").css("display", "flex").hide().fadeIn(300);
    $("#ok").html("Tambah").unbind().on("click", function() {
        var firstName = $("#first-name").val().trim();
        var lastName = $("#last-name").val().trim();
        var phone = $("#phone").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        if (firstName == "" || lastName == "") {
            show("Mohon masukkan nama");
            return;
        }
        if (phone == "") {
            show("Mohon masukkan nomor HP");
            return;
        }
        if (password == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        showProgress("Membuat admin");
        var fd = new FormData();
        fd.append("first_name", firstName);
        fd.append("last_name", lastName);
        fd.append("phone", phone);
        fd.append("password", password);
        fd.append("email", email);
        fd.append("profile_picture", "");
        if (profilePictureSet) {
            let fd2 = new FormData();
            let fileName = generateRandomID(14);
            fd2.append("file", currentProfilePictureFile);
            fd2.append("file_name", fileName);
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'upload-image.php',
                data: fd2,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    fd.append("profile_picture", fileName);
                    createAdmin(fd);
                }
            });
        } else {
            createAdmin(fd);
        }
    });
}

function createAdmin(fd) {
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'create-admin.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(a) {
            hideProgress();
            var response = a;
            if (response == 0) {
                $("#container").fadeOut(300);
                getAdmins();
            } else if (response == -1) {
                show("Nama admin sudah digunakan");
            } else if (response == -2) {
                show("Nomor HP sudah digunakan");
            } else if (response == -3) {
                show("Email sudah digunakan");
            } else {
                show("Kesalahan: "+response);
            }
        }
    });
}

function selectProfilePicture() {
    $("#select-profile-picture").on("change", function () {
        var fr = new FileReader();
        fr.onload = function () {
            $("#profile-picture").attr("src", fr.result);
        };
        currentProfilePictureFile = $(this).prop("files")[0];
        fr.readAsDataURL(currentProfilePictureFile);
        profilePictureSet = true;
    });
    $("#select-profile-picture").click();
}

function closeEditAdminDialog() {
    $("#container").fadeOut(300);
}