var employers = [];
var profilePicture = "";
var profilePictureChanged = false;
var currentProfilePictureFile = null;

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    getEmployers();
});

function getEmployers() {
    showProgress("Memuat");
    $("#employers").find("*").remove();
    var fd = new FormData();
    fd.append("name", "employers");
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'get.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            employers = JSON.parse(response);
            for (var i=0; i<employers.length; i++) {
                var employer = employers[i];
                $("#employers").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td style='font-size: 15px;'>" + employer["full_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + employer["email"] + "</td>" +
                    "<td style='font-size: 15px;'>" + employer["phone"] + "</td>" +
                    "<td style='font-size: 15px;'>" + employer["company_name"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='edit-employer link'>Ubah</a></td>" +
                    "<td style='font-size: 15px;'><a class='delete-employer link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            hideProgress();
            setEmployerListener();
        }
    });
}

function setEmployerListener() {
    $(".edit-employer").unbind().on("click", function() {
        profilePictureChanged = false;
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var employer = employers[index];
        $("#full-name").val(employer["full_name"]);
        $("#email").val(employer["email"]);
        $("#password").val(employer["password"]);
        $("#phone").val(employer["phone"]);
        $("#company").val(employer["company_name"]);
        $("#website").val(employer["website"]);
        $("#biodata").val(employer["biodata"]);
        profilePicture = employer["card_picture"];
        $("#profile-picture").attr("src", "http://"+HOST+"/userdata/"+profilePicture);
        $("#container").css("display", "flex").hide().fadeIn(300);
        $("#ok").html("Ubah").unbind().on("click", function() {
            var fullName = $("#full-name").val().trim();
            var email = $("#email").val().trim();
            var password = $("#password").val().trim();
            var phone = $("#phone").val().trim();
            var company = $("#company").val().trim();
            var website = $("#website").val().trim();
            var biodata = $("#biodata").val().trim();
            if (fullName == "" || email == "" || password == "" || phone == "" || company == "" || website == "" || biodata == "") {
                show("Mohon masukkan data dengan lengkap");
                return;
            }
            showProgress("Mengubah info employer");
            var fd = new FormData();
            fd.append("id", employer["id"]);
            fd.append("full_name", fullName);
            fd.append("email", email);
            fd.append("password", password);
            fd.append("phone", phone);
            fd.append("company", company);
            fd.append("website", website);
            fd.append("biodata", biodata);
            fd.append("profile_picture", profilePicture);
            if (profilePictureChanged) {
                let fd2 = new FormData();
                let fileName = generateRandomID(14);
                fd2.append("file", currentProfilePictureFile);
                fd2.append("file_name", fileName);
                $.ajax({
                    type: 'POST',
                    url: PHP_PATH + 'upload-profile-picture.php',
                    data: fd2,
                    processData: false,
                    contentType: false,
                    cache: false,
                    success: function (a) {
                        fd.append("profile_picture", "profile_pictures/"+fileName);
                        editEmployerInfo(fd);
                    }
                });
            } else {
                fd.append("profile_picture", profilePicture);
                editEmployerInfo(fd);
            }
        });
    });
    $(".delete-employer").unbind().on("click", function() {
        profilePictureChanged = false;
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var employer = employers[index];
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
        $("#confirm-title").html("Hapus Employer");
        $("#close-confirm").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus employer ini?");
        $("#confirm-cancel").unbind().on("click", function() {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-ok").unbind().on("click", function() {
            showProgress("Menghapus employer");
            var fd = new FormData();
            fd.append("id", employer["id"]);
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'delete-employer.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    console.log("Response: "+response);
                    hideProgress();
                    $("#confirm-container").fadeOut(300);
                    getEmployers();
                }
            });
        });

    });
}

function editEmployerInfo(fd) {
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'edit-employer.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            console.log("Response: "+response);
            hideProgress();
            show("Info employer diubah");
            $("#container").fadeOut(300);
            getEmployers();
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
        profilePictureChanged = true;
    });
    $("#select-profile-picture").click();
}

function closeEditEmployerDialog() {
    $("#container").fadeOut(300);
}

function addEmployer() {
    $("#full-name").val("Employer 2");
    $("#email").val("employertwo@gmail.com");
    $("#password").val("HaloDunia123");
    $("#phone").val("+6281912340909");
    $("#company").val("Employer Two");
    $("#website").val("http://danaos.xyz");
    $("#biodata").val("This is my biodata.");
    $("#ok").unbind().on("click", function() {
        var fullName = $("#full-name").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        var phone = $("#phone").val().trim();
        var company = $("#company").val().trim();
        var website = $("#website").val().trim();
        var biodata = $("#biodata").val().trim();
        if (fullName == "" || email == "" || password == "" || phone == "" || company == "" || website == "" || biodata == "") {
            show("Mohon masukkan data dengan lengkap");
            return;
        }
        showProgress("Menambah employer");
        var fd = new FormData();
        fd.append("full_name", fullName);
        fd.append("company_name", company);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("phone", phone);
        fd.append("website", website);
        fd.append("biodata", biodata);
        fd.append("latitude", "0");
        fd.append("longitude", "0");
        fd.append("google_user_id", "");
        fd.append("facebook_user_id", "");
        fd.append("last_ip", "");
        fd.append("device_name", "");
        if (profilePictureChanged) {
            let fd2 = new FormData();
            let fileName = generateRandomID(14);
            fd2.append("file", currentProfilePictureFile);
            fd2.append("file_name", fileName);
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'upload-profile-picture.php',
                data: fd2,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    fd.append("card_picture", fileName);
                    createEmployer(fd);
                }
            });
        } else {
            fd.append("card_picture", "");
            createEmployer(fd);
        }
    });
    $("#container").css("display", "flex").hide().fadeIn(300);
}

function createEmployer(fd) {
    $.ajax({
        type: 'POST',
        url: PHP_PATH+'create-employer.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            hideProgress();
            show("Employer ditambahkan");
            $("#container").fadeOut(300);
            getEmployers();
        }
    });
}