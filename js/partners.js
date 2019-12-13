var currentMaximumConnections = 1;
var currentProfilePicture = "";
var currentProfilePictureFile = null;
var profilePictureSet = false;
var allPartners;
var checkedUserIDs = [];
var partners;

$(document).ready(function () {
    $("#menu").load('menu.html', function () {
    });
    $("#check-all").change(function () {
        if ($('#check-all-checkbox').prop('checked')) {
            for (let j = 0; j < partners.length; j++) {
                checkedUserIDs.push(partners[j]["id"]);
            }
            for (let i = 0; i < partners.length; i++) {
                $("#partners").find("#defaultUnchecked" + (i + 1)).prop("checked", true);
            }
            setDeleteButtonVisible(true);
        } else {
            checkedUserIDs = [];
            for (let i = 0; i < partners.length; i++) {
                $("#partners").find("#defaultUnchecked" + (i + 1)).prop("checked", false);
            }
            setDeleteButtonVisible(false);
        }
    });
    getPartners();
});

function setDeleteButtonVisible(visible) {
    if (visible) {
        $("#delete").css("display", "visible");
    } else {
        $("#delete").css("display", "none");
    }
}

function getPartners() {
    $("#partners").find("*").remove();
    showProgress("Memuat pengguna");
    $.ajax({
        type: 'GET',
        url: PHP_PATH + 'get-partners.php',
        dataType: 'text',
        cache: false,
        success: function (a) {
            partners = JSON.parse(a);
            allPartners = JSON.parse(a);
            for (var i = 0; i < partners.length; i++) {
                var partner = partners[i];
                var endDate = parseInt(partner["end_date"]);
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
                $("#partners").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 15px;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>" +
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked" + (i + 1) + "'>" +
                    "<label class='custom-control-label' for='defaultUnchecked" + (i + 1) + "'></label>" +
                    "</div></td>" +
                    "<td style='font-size: 15px;'>" + partner["first_name"] + " " + partner["last_name"] + "</td>" +
                    "<td style='font-size: 15px;'>" + partner["email"] + "</td>" +
                    "<td style='font-size: 15px;'>" + partner["phone"] + "</td>" +
                    "<td style='font-size: 15px;'>" + partner["location"] + "</td>" +
                    "<td style='font-size: 15px;'><a class='edit-partner link'>Ubah</a></td>" +
                    "<td style='font-size: 15px;'><a class='delete-partner link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            hideProgress();
            setPartnerClickListener();
        }
    });
}

function deletePartners() {
    $("#confirm-title").html("Hapus Pengguna");
    $("#close-confirm").unbind().on("click", function () {
        $("#confirm-container").fadeOut(300);
    });
    $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna yang dipilih?");
    $("#confirm-cancel").unbind().on("click", function () {
        $("#confirm-container").fadeOut(300);
    });
    $("#confirm-ok").unbind().on("click", function () {
        $("#confirm-container").hide();
        showProgress("Menghapus pengguna yang dipilih");
        var fd = new FormData();
        let ids = [];
        for (let i = 0; i < checkedUserIDs.length; i++) {
            let userID = checkedUserIDs[i];
            ids.push(userID);
        }
        fd.append("id", JSON.stringify(ids));
        $.ajax({
            type: 'POST',
            url: PHP_PATH + 'delete-partners.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                console.log("Response: " + response);
                $("#delete").css("display", "none");
                getPartners();
            }
        });
    });
    $("#confirm-container").css("display", "flex").hide().fadeIn(300);
}

function checkAllChecked() {
    var allChecked = false;
    for (var i = 0; i < partners.length; i++) {
        var checked = $("#partners").find("#defaultUnchecked" + (i + 1)).prop("checked");
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

function setPartnerClickListener() {
    $(".custom-control-input").change(function () {
        checkAllChecked();
        var id = $(this).attr('id');
        var tr = $(this).parent().parent().parent();
        var index = $("#partners").children().index(tr);
        checkedUserIDs.push(partners[index]["id"]);
        if ($(this).prop('checked')) {
            $("#delete").css("display", "block");
        }
    });
    $(".edit-partner").unbind().on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var partner = partners[index];
        $("#title").html("Ubah Pengguna");
        $("#first-name").val(partner["first_name"]);
        $("#last-name").val(partner["last_name"]);
        $("#location").val(partner["location"]);
        $("#about").val(partner["about"]);
        $("#email").val(partner["email"]);
        $("#phone").val(partner["phone"]);
        $("#password").val(partner["password"]);
        $("#address").val(partner["address"]);
        $("#whatsapp-number").val(partner["whatsapp_number"]);
        if (partner["profile_picture"] != "") {
            $("#profile-picture").attr("src", "http://"+HOST+"/userdata/"+partner["profile_picture"]);
        }
        $("#container").css("display", "flex").hide().fadeIn(300);
        $("#ok").html("Ubah").unbind().on("click", function () {
            var name = $("#name").val().trim();
            var phone = $("#phone").val().trim();
            var email = $("#email").val().trim();
            var password = $("#password").val().trim();
            var city = $("#city").val().trim();
            var endTimeString = $("#end-time").val();
            console.log("Time: " + endTimeString);
            var year = parseInt(endTimeString.split("-")[0]);
            var month = parseInt(endTimeString.split("-")[1]);
            var day = parseInt(endTimeString.split("-")[2]);
            var date = new Date();
            date.setFullYear(year);
            date.setMonth(month);
            date.setDate(day);
            var endDate = date.getTime();
            console.log("End date: " + endDate);
            var isTrial = $("#is-trial option:selected").index();
            var confirmed = 0;
            if ($("#confirmed").prop("checked")) {
                confirmed = 1;
            }
            var activeConnections = $("#active-connections").val();
            var maximumConnections = currentMaximumConnections;
            if (email == "") {
                show("Mohon masukkan email");
                return;
            }
            if (password == "") {
                show("Mohon masukkan kata sandi");
                return;
            }
            if (maximumConnections <= 0) {
                show("Mohon masukkan jumlah maksimal koneksi aktif");
                return;
            }
            showProgress("Mengubah pengguna");
            var fd = new FormData();
            fd.append("id", partner["id"]);
            fd.append("name", name);
            fd.append("phone", phone);
            fd.append("password", password);
            fd.append("active_connections", activeConnections);
            fd.append("maximum_connections", maximumConnections);
            fd.append("confirmed", confirmed);
            fd.append("city", city);
            fd.append("trial", isTrial);
            fd.append("end_date", endDate);
            if (currentProfilePicture != "img/profile-picture.jpg") {
                fd.append("profile_picture_set", 1);
            } else {
                fd.append("profile_picture_set", 0);
            }
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'edit-partner.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    hideProgress();
                    var response = a;
                    console.log("Response: " + response);
                    if (response == 0) {
                        $("#container").fadeOut(300);
                        getPartners();
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
    $(".delete-partner").on("click", function () {
        var tr = $(this).parent().parent();
        var index = tr.parent().children().index(tr);
        var partner = partners[index];
        $("#confirm-title").html("Hapus Pengguna");
        $("#close-confirm").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-msg").html("Apakah Anda yakin ingin menghapus pengguna ini?");
        $("#confirm-ok").unbind().on("click", function () {
            $("#confirm-container").hide();
            showProgress("Menghapus pengguna");
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'delete-partner.php',
                data: {'id': partner["id"]},
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    hideProgress();
                    getPartners();
                }
            });
        });
        $("#confirm-cancel").unbind().on("click", function () {
            $("#confirm-container").fadeOut(300);
        });
        $("#confirm-container").css("display", "flex").hide().fadeIn(300);
    });
}

function addPartner() {
    currentMaximumConnections = 1;
    currentProfilePicture = "img/profile-picture.jpg";
    profilePictureSet = false;
    $("#title").html("Tambah Mitra");
    $("#first-name").val("Mitra");
    $("#last-name").val("Satu");
    $("#location").val("Surabaya");
    $("#about").val("Surabaya, Indonesia");
    $("#profile-picture").attr("src", "img/profile-picture.jpg");
    $("#email").val("mitrasatu@gmail.com");
    $("#password").val("abc");
    $("#phone").val("081123456789");
    $("#address").val("Sidoarjo");
    $("#whatsapp-number").val("081987654321");
    $("#container").css("display", "flex").hide().fadeIn(300);
    $("#ok").html("Tambah").unbind().on("click", function () {
        var firstName = $("#first-name").val().trim();
        var lastName = $("#last-name").val().trim();
        var location = $("#location").val().trim();
        var about = $("#about").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        var phone = $("#phone").val().trim();
        var whatsAppNumber = $("#whatsapp-number").val().trim();
        var address = $("#address").val().trim();
        if (email == "") {
            show("Mohon masukkan email");
            return;
        }
        if (password == "") {
            show("Mohon masukkan kata sandi");
            return;
        }
        showProgress("Membuat mitra");
        var fd = new FormData();
        fd.append("first_name", firstName);
        fd.append("last_name", lastName);
        fd.append("location", location);
        fd.append("about", about);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("phone", phone);
        fd.append("address", address);
        fd.append("whatsapp_number", whatsAppNumber);
        fd.append("profile_picture_set", (profilePictureSet == true)?1:0);
        fd.append("latitude", 0);
        fd.append("longitude", 0);
        console.log("profilePictureSet: "+profilePictureSet);
        if (profilePictureSet) {
            let fd2 = new FormData();
            let fileName = generateRandomID(14);
            fd2.append("file", currentProfilePictureFile);
            fd2.append("file_name", fileName);
            console.log("Uploading image...");
            $.ajax({
                type: 'POST',
                url: PHP_PATH + 'upload-profile-picture.php',
                data: fd2,
                processData: false,
                contentType: false,
                cache: false,
                success: function (a) {
                    console.log("Profile picture name: "+fileName);
                    fd.append("profile_picture_url", fileName);
                    createPartner(fd);
                }
            });
        } else {
            fd.append("profile_picture_url", "");
            createPartner(fd);
        }
    });
}

function createPartner(fd) {
    $.ajax({
        type: 'POST',
        url: PHP_PATH + 'create-partner.php',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
            console.log("Response: "+response);
            response = parseInt(response);
            hideProgress();
            if (response == 0) {
                $("#container").fadeOut(300);
                getPartners();
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
}

function closeEditPartnerDialog() {
    $("#container").fadeOut(300);
}

function generateRandomUsername() {
    var userName = generateRandomID(14);
    $("#username").val(userName);
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

function search() {
    var keyword = $("#keyword").val().toLowerCase().trim();
    $("#partners").find("*").remove();
    partners = [];
    if (keyword == "") {
        for (var i = 0; i < allPartners.length; i++) {
            var partner = allPartners[i];
            partners.push(partner);
            displayPartner(partner, i + 1);
        }
    } else {
        for (var i = 0; i < allPartners.length; i++) {
            var partner = allPartners[i];
        }
    }
}

function displayPartner(partner, position) {
    var trial = "Tidak";
    if (parseInt(partner["is_trial"]) == 1) {
        trial = "Ya";
    }
    var endDate = parseInt(partner["end_date"]);
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
    $("#partners").append("" +
        "<tr>" +
        "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + position + "</div></td>" +
        "<td><div class='custom-control custom-checkbox'>" +
        "<input type='checkbox' class='custom-control-input' id='defaultUnchecked" + position + "'>" +
        "<label class='custom-control-label' for='defaultUnchecked" + position + "'></label>" +
        "</div></td>" +
        "<td>" + partner["name"] + "</td>" +
        "<td>" + partner["email"] + "</td>" +
        "<td>" + partner["active_connections"] + "</td>" +
        "<td>" + trial + "</td>" +
        "<td>" + remainingTimeString + "</td>" +
        "<td><a class='edit-partner link'>Ubah</a></td>" +
        "<td><a class='delete-partner link'>Hapus</a></td>" +
        "</tr>"
    );
    setPartnerClickListener();
}