function makePage() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            alert("webpage " + xmlhttp.responseText + " was successfully created!")

            var createA = document.createElement('a')
            var createAText = document.createTextNode(xmlhttp.responseText) // or whatever name you need
            createA.setAttribute('href', xmlhttp.responseText)
            createA.appendChild(createAText)
            document.body.appendChild(createA) // or you can create some <div> or whatever and append it to that
        }
    }
    // var content = "<html><head><meta charset=\"utf-8\" /> </head><body>new website<script>alert(\"test\")</script></body></html>";
    var content = "<!DOCTYPE html><html lang=\"en\" dir=\"ltr\">" +
    "<head><meta charset=\"utf-8\" name=\"viewport\" content=\"width=device-width\" initial-scale=\"1\"></meta><title>Book Webapp</title>" +
    "<link rel=\"stylesheet\" type=\"text/css\" href=\"../src/css/style.css\">" +
    "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">" +
    "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>" +
    "<link href=\"https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap\" rel=\"stylesheet\">" +
    "<script src=\"../src/javascript/bookwebapp.js\"></script></head>" +

    "<body>" +
        "<div id=\"menu\">" +
            "<a class=\"current-page\" href=\"../index.html\">" +
                "<img src=\"../assets/images/icons/blue_home_icon.svg\">" +
            "</a>" +
            "<a class=\"other-pages\" href=\"../discover.html\">" +
                "<img src=\"../assets/images/icons/white_compass_icon.svg\">" +
            "</a>" +
            "<a class=\"other-pages\" href=\"../my_books.html\">" +
                "<img src=\"../assets/images/icons/white_book_icon.svg\">" +
            "</a>" +
            "<a class=\"other-pages\" href=\"../stats.html\">" +
                "<img src=\"../assets/images/icons/white_bar_graph_icon.svg\">" +
            "</a>" +
            "<a class=\"other-pages\" href=\"../profile.html\">" +
                "<img src=\"../assets/images/icons/white_profile_icon.svg\">" +
            "</a>" +
        "</div>"

        "<div id=\"top-nav\">" +
            "<div id=\"search-bar\">" +
                "<button class=\"add-bookshelf-btn\" href=\"#\"></button>" +
                "<input type=\"text\" id=\"search-input\" style=\"padding: 8px 45px 8px 20px !important;\" placeholder=\"Find books, reviews, shelves, people...\">" +
                "<button id=\"search-btn\" style=\"position: absolute; right: 8.5vw;\"></button>" +
            "</div>" +
            "<div id=\"results\" class=\"hide\" style=\"overscroll-behavior: contain;\"></div>" +
        "</div>" +

        "<div class=\"wrap\">" +
            "<div class=\"container books-want-to-read\">" +
                "<div class=\"current-in-header\">" +
                    "<div class=\"in-header-wrapper\">" +
                        "<a class=\"page-back\" href=\"../my_books.html\">" +
                            "<img src=\"../assets/images/icons/left_caret_icon.svg\" class=\"left-caret\">" +
                        "</a>" +
                        "<p class=\"in-header-title\">Want to Read</p>" +
                    "</div>" +
                "</div>" +

                "<div class=\"content-container\">" +
                    "<div class=\"book-page\"></div>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</body></html>"

    console.log(content);

    xmlhttp.open("GET", "makePage.php?content=" + content, true);
    xmlhttp.send();
}