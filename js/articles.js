var articles = [];
var categories = [];
var selectedPictureData = null;
var pictureChanged = false;

$(document).ready(function() {
    $("#menu").load('menu.html', function() {});
    //$("#date").datepicker();
    $("#categories").prop("selectedIndex", 0);
    $("#writer").on("change paste keyup", function() {
        var writerName = $(this).val();
        $.ajax({
            type: 'POST',
            url: PHP_PATH+'get-writers-by-name.php',
            data: constructFormData('name', writerName),
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                var writers = [];
                var writersJSON = JSON.parse(response);
                for (var i=0; i<writersJSON.length; i++) {
                    var writerJSON = writersJSON[i];
                    writers.push(writerJSON["first_name"]+" "+writerJSON["last_name"]);
                }
                autocomplete(document.getElementById("writer"), writers);
            }
        });
    });
    getArticles();
});

function getArticles() {
    $.ajax({
        type: 'GET',
        url: PHP_PATH+'get-articles.php',
        dataType: 'text',
        cache: false,
        success: function(response) {
            articles = JSON.parse(response);
            for (var i=0; i<articles.length; i++) {
                var article = articles[i];
                var title = article["title"];
                if (title.length > 25) {
                    title = title.substr(0, 25)+"...";
                }
                var content = article["content"];
                if (content.length > 25) {
                    content = content.substr(0, 25)+"...";
                }
                var dateString = article["date"];
                var date = moment(dateString, 'YYYY-MM-DD HH:mm:ss');
                $("#articles").append("" +
                    "<tr>" +
                    "<td><div style='background-color: #2f2e4d; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white;'>" + (i + 1) + "</div></td>" +
                    "<td><div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' class='custom-control-input' id='defaultUnchecked"+(i+1)+"'>"+
                    "<label class='custom-control-label' for='defaultUnchecked"+(i+1)+"'></label>"+
                    "</div></td>"+
                    "<td>" + title + "</td>" +
                    "<td>" + article["category"] + "</td>" +
                    "<td>" + content + "</td>" +
                    "<td>" + article["writer"] + "</td>" +
                    "<td>" + date.format('DD MMMM YYYY') + "</td>" +
                    "<td><a class='edit link'>Ubah</a></td>" +
                    "<td><a class='delete link'>Hapus</a></td>" +
                    "</tr>"
                );
            }
            var fd = new FormData();
            fd.append("name", "article_categories");
            $.ajax({
                type: 'POST',
                url: PHP_PATH+'get.php',
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                success: function(response) {
                    categories = JSON.parse(response);
                    for (var i=0; i<categories.length; i++) {
                        var category = categories[i];
                        $("#categories").append("<option selected>"+category["name"]+"</option>");
                    }
                    setClickListener();
                    hideProgress();
                }
            });
        }
    });
}

function setClickListener() {
    $(".edit").unbind().on("click", function() {
        pictureChanged = false;
        var tr = $(this).parent().parent();
        var index = $("#articles").children().index(tr);
        var article = articles[index];
        $("#title").val(article["title"]);
        $("#content").val(article["content"]);
        var category = article["category"];
        for (var i=0; i<categories.length; i++) {
            if (categories[i]["id"] == article["category_id"]) {
                $("#categories").prop("selectedIndex", i+1);
                break;
            }
        }
        $("#img").attr("src", "http://"+HOST+"/userdata/"+article["img_path"]);
        $("#writer").val(article["writer"]);
        $("#edit-article-ok").unbind().on("click", function() {
            var title = $("#title").val().trim();
            var categoryIndex = $("#categories").prop("selectedIndex");
            if (categoryIndex == 0) {
                show("Mohon pilih kategori");
                return;
            }
            var content = $("#content").val().trim();
            if (pictureChanged) {
                var fd = new FormData();

            }
        });
        $("#edit-article-container").css("display", "flex").hide().fadeIn(300);
    });
}

function changePicture() {
    $("#select-picture-file").on("change", function() {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function() {
            var content = reader.result;
            selectedPictureData = content;
            pictureChanged = true;
            $("#picture").attr("src", content);
        };
        reader.readAsDataURL(input.files[0]);
    });
    $("#select-picture-file").click();
}

function closeEditArticleDialog() {
    $("#edit-article-container").fadeOut(300);
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}