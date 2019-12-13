var id;

$(document).ready(function() {
    $("#password").val("");
    var params = window.location.search;
    if (params.startsWith("?")) {
        params = params.substring(1, params.length);
    }
    id = params.split("&")[0].split("=")[1];
    $("#password").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#reset-password").click();
        }
    });
    $("#password").on("input", function() {
        checkPassword();
    });
});

function resetPassword() {
    if (checkPassword()) {
        $("#loader").css("display", "flex").hide().fadeIn(300);
        var password = $("#password").val();
        var fd = new FormData();
        fd.append("id", id);
        fd.append("password", password);
        $.ajax({
            type: 'POST',
            url: PHP_URL+'reset-password.php',
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                window.location.href = "http://"+HOST+"/password-reset-success.html";
            }
        });
    }
}

function checkPassword() {
    var password = $("#password").val();
    var containsNumber = isStringContainsNumber(password);
    if (!containsNumber) {
        $("#rule-1-check").attr("src", "img/close.png");
    } else {
        $("#rule-1-check").attr("src", "img/check.png");
    }
    var result = validatePassword(password);
    if (!result) {
        $("#rules").css("display", "flex");
        if (password.length < 8) {
            $("#rule-4-check").attr("src", "img/close.png");
        } else {
            $("#rule-4-check").attr("src", "img/check.png");
        }
        if (!isStringContainsLowercase(password)) {
            $("#rule-2-check").attr("src", "img/close.png");
        } else {
            $("#rule-2-check").attr("src", "img/check.png");
        }
        if (!isStringContainsUppercase(password)) {
            $("#rule-3-check").attr("src", "img/close.png");
        } else {
            $("#rule-3-check").attr("src", "img/check.png");
        }
    }
    if (containsNumber && result) {
        return true;
    } else {
        return false;
    }
}