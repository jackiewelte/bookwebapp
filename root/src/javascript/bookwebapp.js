// Remember scroll and page positions before navigating away from the page
window.addEventListener('beforeunload', function() {
    var loc = window.location.pathname;
    var folder = loc.split('/')[1];
    const pagePosition = JSON.parse(localStorage.getItem('pagePosition')) || {};
    const lastPageVisited = JSON.parse(localStorage.getItem('lastPageVisited')) || {};

    if (folder === 'index' || folder === 'discover' || folder === 'my_books' || folder === 'profile') {
        pagePosition[folder] = loc
    }
    if (folder === '' || folder === 'index' || folder === 'discover' || folder === 'my_books' || folder === 'profile') {
        if (folder === '') {
            folder = 'index'
        }
        lastPageVisited["lastFolder"] = folder
    }
    lastPageVisited["lastURL"] = loc;

    localStorage.setItem('scrollPosition', window.scrollY);
    localStorage.setItem('lastPageVisited', JSON.stringify(lastPageVisited));
    localStorage.setItem('pagePosition', JSON.stringify(pagePosition));
    console.log(localStorage);
});

// Recall scroll and page positions when the page loads
window.addEventListener("DOMContentLoaded", function() {
    const scrollPosition = localStorage.getItem('scrollPosition') || {};
    const lastPageVisited = JSON.parse(localStorage.getItem('lastPageVisited')) || {};
    const pagePosition = JSON.parse(localStorage.getItem('pagePosition')) || {};
    var loc = window.location.pathname;
    var folder = loc.split('/')[1];
    if (folder === '') {
        folder = 'index'
    }

    if (scrollPosition) {
      window.scrollTo(0, scrollPosition)
      localStorage.removeItem('scrollPosition') // Optional: Remove after use
    }

    if (lastPageVisited.lastFolder != folder) {
        for (let i = 0; i < Object.keys(pagePosition).length; i++) {
            if (Object.keys(pagePosition)[i] === folder) {
                window.location.href = pagePosition[folder]
                localStorage.removeItem('pagePosition') // Optional: Remove after use
            }
        }
    } else {
        delete pagePosition[folder]
    }
    localStorage.setItem('pagePosition', JSON.stringify(pagePosition));
    console.log(localStorage);
});


document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const results = document.getElementById('results');

    if (searchInput && results) {
        let debounceTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimeout);

            const searchTerm = searchInput.value.trim();
            console.log("searched: ", searchTerm);

            if (searchTerm) {
                results.classList.remove('hide');
                debounceTimeout = setTimeout(() => {
                    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`;

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            displayResults(data.docs);
                        })
                        .catch(error => console.error('Error fetching data:', error));
                }, 300);
            } else {
                results.classList.add('hide');
                results.innerHTML = '';
            }
        });
    } else {
        console.error("Search input or results element not found in the DOM");
    }

    function displayResults(docs) {
        results.innerHTML = '';

        const uniqueWorks = new Set();
        const books = docs || [];

        if (books.length === 0) {
            results.innerHTML = '<p>No books found. Please try another search term.</p>';
            return;
        }
    
        books.forEach(book => {
            const workKey = book.key;

            if (!uniqueWorks.has(workKey)) {
                uniqueWorks.add(workKey);

                const title = book.title || 'No title available';
                const author = book.author_name ? book.author_name.join(', ') : 'No author available';
                const bookCover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'default-cover.jpg';

                // const bookItem = document.createElement('div');
                const bookItem = document.createElement('button');
                bookItem.className = 'book';
                bookItem.style.backgroundColor = 'transparent';
                bookItem.style.border = 'none';

                // bookItem.innerHTML = `
                //     <a class="mini-book-thumbnail" href="https://openlibrary.org${workKey}" target="_blank">
                //         <img src="${bookCover}" alt="Cover image of ${title}">
                //     </a>
                //     <div class="book-info">
                //         <a class="book-title" href="https://openlibrary.org${workKey}" target="_blank">${title}</a>
                //         <a class="author" href="https://openlibrary.org/authors/${book.author_key ? book.author_key[0] : ''}" target="_blank">by ${author}</a>
                //     </div>
                // `;

                bookItem.innerHTML = `
                    <div class="mini-book-thumbnail">
                        <img src="${bookCover}" alt="Cover image of ${title}">
                    </div>
                    <div class="book-info">
                        <div class="book-title">${title}</div>
                        <div class="author">by ${author}</div>
                    </div>
                `;

                results.appendChild(bookItem);
            }
        });
    }
});

// Add checked attribute to clicked radio input and remove checked attribute from other radio inputs in HTML
function addChecked(button) {
    document.querySelectorAll('input[type=radio]').forEach(elem => {
        elem.removeAttribute('checked');
    });
    button.setAttribute('checked', 'true');
}




// HOME -> BOOKS
const thumbnailLinks = {
    "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
    "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
    "Babel by R.F. Kuang": "https://m.media-amazon.com/images/I/A1lv97-jJoL._AC_UF894,1000_QL80_.jpg",
    "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
    "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
    "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
    "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",
    "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
    "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
    "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
    "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg",
    "The Message by Ta-Nehisi Coates": "https://thumbs.readings.com.au/9MgE_kL8FCYJ6UqqXq23vAjZi7g=/0x500/https://readings-v4-production.s3.amazonaws.com/assets/a99/1b2/241/a991b224198ef094a0147fcf3a67750a94432d8d/978024172419420240807-2-9mxn52.jpg",
    "One Hundred Years of Solitude by Gabriel Garcia Marquez": "https://m.media-amazon.com/images/I/81dy4cfPGuL._AC_UF1000,1000_QL80_.jpg",
    "East of Eden by John Steinbeck": "https://m.media-amazon.com/images/I/61MVUsltpoL._AC_UF1000,1000_QL80_.jpg",
    "Never Let Me Go by Kazuo Ishiguro": "https://m.media-amazon.com/images/I/71cyDfU78hL._AC_UF894,1000_QL80_.jpg",
    "Slow Days, Fast Company by Eve Babitz": "https://www.nyrb.com/cdn/shop/products/babitz.Slow_Days_hi-res.jpg?v=1528394272",
    "Spring Snow by Yukio Mishima": "https://m.media-amazon.com/images/I/91W6-67zqqL._AC_UF894,1000_QL80_.jpg",
    "Madonna in a Fur Coat by Sabanhattin Ali": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1447193500i/27793819.jpg",
    "Blue Note: Uncompromising Expression by Richard Havers": "https://prodimage.images-bn.com/pimages/9780500296516_p0_v1_s600x595.jpg",
    "But Beautiful by Geoff Dyer": "https://m.media-amazon.com/images/I/71fSu5vb8KL._AC_UF1000,1000_QL80_.jpg"
};

// Populate popular and friends activity book rows
document.addEventListener("DOMContentLoaded", function() {
    var popularBooks = JSON.parse(localStorage.getItem('popularBooks')) || {};
    var friendsBookActivity = JSON.parse(localStorage.getItem('friendsBookActivity')) || {};
    var recForYou = JSON.parse(localStorage.getItem('recForYou')) || {};

    popularBooks = {
        "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
        "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
        "Babel by R.F. Kuang": "https://m.media-amazon.com/images/I/A1lv97-jJoL._AC_UF894,1000_QL80_.jpg",
        "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
        "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
        "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
        "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",

        "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
        "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
        "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
        "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg",
        "The Message by Ta-Nehisi Coates": "https://thumbs.readings.com.au/9MgE_kL8FCYJ6UqqXq23vAjZi7g=/0x500/https://readings-v4-production.s3.amazonaws.com/assets/a99/1b2/241/a991b224198ef094a0147fcf3a67750a94432d8d/978024172419420240807-2-9mxn52.jpg",
        "One Hundred Years of Solitude by Gabriel Garcia Marquez": "https://m.media-amazon.com/images/I/81dy4cfPGuL._AC_UF1000,1000_QL80_.jpg",

        "Never Let Me Go by Kazuo Ishiguro": "https://m.media-amazon.com/images/I/71cyDfU78hL._AC_UF894,1000_QL80_.jpg",
        "Slow Days, Fast Company by Eve Babitz": "https://www.nyrb.com/cdn/shop/products/babitz.Slow_Days_hi-res.jpg?v=1528394272",
        "Spring Snow by Yukio Mishima": "https://m.media-amazon.com/images/I/91W6-67zqqL._AC_UF894,1000_QL80_.jpg",
        "Madonna in a Fur Coat by Sabanhattin Ali": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1447193500i/27793819.jpg",
        "Blue Note: Uncompromising Expression by Richard Havers": "https://prodimage.images-bn.com/pimages/9780500296516_p0_v1_s600x595.jpg",
        "But Beautiful by Geoff Dyer": "https://m.media-amazon.com/images/I/71fSu5vb8KL._AC_UF1000,1000_QL80_.jpg"
    };

    friendsBookActivity = {
        "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
        "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
        "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
        "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg",
        "The Message by Ta-Nehisi Coates": "https://thumbs.readings.com.au/9MgE_kL8FCYJ6UqqXq23vAjZi7g=/0x500/https://readings-v4-production.s3.amazonaws.com/assets/a99/1b2/241/a991b224198ef094a0147fcf3a67750a94432d8d/978024172419420240807-2-9mxn52.jpg",
        "One Hundred Years of Solitude by Gabriel Garcia Marquez": "https://m.media-amazon.com/images/I/81dy4cfPGuL._AC_UF1000,1000_QL80_.jpg"
    };

    recForYou = {
        "Never Let Me Go by Kazuo Ishiguro": "https://m.media-amazon.com/images/I/71cyDfU78hL._AC_UF894,1000_QL80_.jpg",
        "Slow Days, Fast Company by Eve Babitz": "https://www.nyrb.com/cdn/shop/products/babitz.Slow_Days_hi-res.jpg?v=1528394272",
        "Spring Snow by Yukio Mishima": "https://m.media-amazon.com/images/I/91W6-67zqqL._AC_UF894,1000_QL80_.jpg",
        "Madonna in a Fur Coat by Sabanhattin Ali": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1447193500i/27793819.jpg",
        "Blue Note: Uncompromising Expression by Richard Havers": "https://prodimage.images-bn.com/pimages/9780500296516_p0_v1_s600x595.jpg",
        "But Beautiful by Geoff Dyer": "https://m.media-amazon.com/images/I/71fSu5vb8KL._AC_UF1000,1000_QL80_.jpg"
    };

    localStorage.setItem('popularBooks', JSON.stringify(popularBooks));
    localStorage.setItem('friendsBookActivity', JSON.stringify(friendsBookActivity));
    localStorage.setItem('recForYou', JSON.stringify(recForYou));


// Populate average book rating
    updateAvgRating();
    function updateAvgRating() {
        const notifs = document.querySelectorAll('.notif');
        notifs.forEach(notif => {
            const greenStars = notif.querySelector('.green-stars');
            const bookAvgRating = notif.querySelector('.book-avg-rating');

            const avgRating = bookAvgRating.textContent;
            const greenStarsWidth = avgRating / 5 * 100;

            greenStars.style.width = `${greenStarsWidth}%`;
            // avgRatingNumber.textContent = `${avgRating}%`;
            console.log(`Updated book rating to ${avgRating}`);
        });
    }


// Open (populate)/close book dropdown menu
    console.log("local storage: ", localStorage);
    updateAllDropdownMenus();
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');

    dropdownButtons.forEach(dropdownButton => {
        const dropdownElement = dropdownButton.closest('.dropdown');
        if (!dropdownElement) return;

        const dropdownContent = dropdownElement.querySelector('.dropdown-content');
        const dropdownOverlay = dropdownElement.querySelector('.dropdown-overlay');
        const showInputButton = dropdownElement.querySelector('.show-input-btn');
        const inputContainer = dropdownElement.querySelector('.input-container');
        // const doneButton = dropdownElement.querySelector('.done-btn');

        if (!dropdownContent || !dropdownOverlay) return;

        dropdownButton.addEventListener('click', function(e) {
            console.log("Dropdown button clicked");
            dropdownContent.classList.toggle('hide');

            if (showInputButton) {
                showInputButton.classList.remove('hide');
                console.log("Show default button");
                inputContainer.classList.remove('show');
                console.log("Hide name button");
            }

            // dropdownOverlay.classList.toggle('show');
            console.log("Dropdown content classes after toggle:", dropdownContent.classList);
            e.stopPropagation();
        });

        // doneButton.addEventListener('click', function(e) {
        //     dropdownContent.classList.add('hide');
            
        //     if (showInputButton) {
        //         showInputButton.classList.remove('hide');
        //         console.log("Show default button");
        //         inputContainer.classList.remove('show');
        //         console.log("Hide name button");
        //     }

        //     // dropdownOverlay.classList.remove('show');
        //     e.stopPropagation();
        //     console.log("Clicked done button, hiding dropdown");
        // });

        document.addEventListener('click', function(e) {
            if (dropdownContent && !e.target.closest('.dropdown-content')) {
                dropdownContent.classList.add('hide');

                if (showInputButton) {
                    showInputButton.classList.remove('hide');
                    console.log("Show default button");
                    inputContainer.classList.remove('show');
                    console.log("Hide name button");
                }

                // dropdownOverlay.classList.remove('show');
                console.log("Clicked outside, hiding dropdown");
            }
        });
    });

    // name new shelf
    const showInputButtons = document.querySelectorAll('.show-input-btn');
    showInputButtons.forEach(showInputButton => {
        const shelfContainer = showInputButton.closest('.add-shelf-btn');
        const inputContainer = shelfContainer.querySelector('.input-container');

        showInputButton.addEventListener('click', function() {
            showInputButton.classList.toggle('hide');
            inputContainer.classList.toggle('show');
        });

        const createShelfButton = inputContainer.querySelector('.create-shelf-btn');
        createShelfButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Create shelf button clicked");
            const shelfNameInput = inputContainer.querySelector('.create-shelf-name');
            const shelfName = shelfNameInput.value.trim();
            const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
            // customShelves[shelfName] = {};
            // console.log("shelves dict: ", customShelves);
            // console.log("customshelf name: ", shelfName);

            if (isValidShelfName(shelfName)) {
                if (isShelfNameUnique(shelfName, customShelves)) {
                    addCustomShelf(shelfName, customShelves);
                    shelfNameInput.value = '';
                    showInputButton.classList.remove('hide');
                    inputContainer.classList.remove('show');

                    // const dropdown = showInputButton.closest('.dropdown');
                    updateAllDropdownMenus();
                } else {
                    alert("A shelf with this name already exists. Please choose a different name.");
                }
            } else {
                alert("Invalid shelf name. Please use only alphanumeric characters and spaces.");
            }
        });
    });
});

function isShelfNameUnique(shelfName, customShelves) {
    return !(shelfName in customShelves);
}

function isValidShelfName(shelfName) {
    const validNamePattern = /^[a-zA-Z0-9\s]+$/;
    return validNamePattern.test(shelfName) && shelfName.trim().length > 0;
}

// Create new shelf
function addCustomShelf(shelfName, customShelves) {
    console.log("shelfName trim: ", shelfName.trim());

    if(!(shelfName in customShelves)) {
        customShelves[shelfName] = {};
        localStorage.setItem('customShelves', JSON.stringify(customShelves));
        console.log(`New shelf created: ${shelfName}`);

        // create shelf file in bookshelf dir with default heading content and book-page div
        // var f = new File([""], `${shelfName.replace(/\s+/g, '_')}.html`);
        // console.log(`New file ${f} created in ${dir}`);

    } else {
        console.warn(`Shelf "${shelfName}" already exists`);
    }
    // ???
}

// Update dropdown menu
function updateDropdownMenu(shelfName, dropdown) {
    const shelfCheckboxes = dropdown.querySelector('.shelf-checkboxes');

    const bookElement = dropdown.closest('.book');
    const bookTitle = bookElement.getAttribute('data-title');
    const bookAuthor = bookElement.getAttribute('data-author');
    let hyphenShelfName = shelfName.replace(/\s+/g, '-');
    let hyphenBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');
    let hyphenBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');
    const existingShelf = shelfCheckboxes.querySelector(`#${hyphenShelfName}-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`);

    if (existingShelf) {
        return;
    }

    const newShelfCheckbox = document.createElement('input');
    const newShelfLabel = document.createElement('label');

    newShelfCheckbox.type = 'checkbox';
    newShelfCheckbox.className = 'mini-status-checkbox';
    newShelfCheckbox.id = `${hyphenShelfName}-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`;
    newShelfCheckbox.setAttribute('data-status', shelfName);

    newShelfLabel.htmlFor = newShelfCheckbox.id;
    newShelfLabel.className = 'mini-status-label';
    newShelfLabel.textContent = shelfName;

    newShelfCheckbox.addEventListener('change', function() {
        console.log(`Selected shelf: ${shelfName}`);

        const customShelvesString = localStorage.getItem('customShelves');
        const customShelves = customShelvesString ? JSON.parse(customShelvesString) : {};
        const bookKey = `${bookTitle} by ${bookAuthor}`;

        // if (!customShelves[shelfName]) {
        //     customShelves[shelfName] = {};
        // }

        if (this.checked) {
            if (!customShelves[shelfName][bookKey]) {
                customShelves[shelfName][bookKey] = new Date().toISOString();
                console.log('Added ' + bookKey + ' to ' + shelfName + ' at ' + customShelves[shelfName][bookKey]);
            }
        } else {
            delete customShelves[shelfName][bookKey];
        }
        localStorage.setItem('customShelves', JSON.stringify(customShelves));
    });
    shelfCheckboxes.appendChild(newShelfCheckbox);
    shelfCheckboxes.appendChild(newShelfLabel);
}

function updateAllDropdownMenus() {
    const dropdownMenus = document.querySelectorAll('.dropdown-content');
    const customShelvesString = localStorage.getItem('customShelves');
    const customShelves = customShelvesString ? JSON.parse(customShelvesString) : {};

    dropdownMenus.forEach(dropdown => {
        for (const shelfName in customShelves) {
            updateDropdownMenu(shelfName, dropdown);
        }
    });
}

function addBooktoShelf(shelfName, bookKey) {
    let customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
    console.log(`Adding book to shelf: ${shelfName}, book: ${bookKey}`);

    if (!customShelves[shelfName][bookKey]) {
        customShelves[shelfName][bookKey] = new Date().toISOString();
        console.log('Added ' + bookKey + ' to ' + shelfName + ' at ' + customShelves[shelfName][bookKey]);
    }
    localStorage.setItem('customShelves', JSON.stringify(customShelves));
    console.log('Updated customShelves:', JSON.parse(localStorage.getItem('customShelves')));
}

function removeBookFromShelf(shelfName, bookKey) {
    let customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
    console.log(`Removing book from shelf: ${shelfName}, book: ${bookKey}`);
    if (customShelves[shelfName]) {

        delete customShelves[shelfName][bookKey];
        console.log("Removed from custom shelf dict: ", shelfName[bookKey]);

        // if (customShelves[shelfName].length === 0) {
        //     customShelves[shelfName] = {};
        // }
    }
    localStorage.setItem('customShelves', JSON.stringify(customShelves));
    console.log('Updated customShelves:', JSON.parse(localStorage.getItem('customShelves')));
}

// Change book status/shelf labels
document.addEventListener("DOMContentLoaded", function() {
    const shelfCheckboxes = document.querySelector('.shelf-checkboxes');
    if (!shelfCheckboxes) {
        return;
    }
    shelfCheckboxes.innerHTML = '';

    console.log(localStorage.getItem('customShelves'));

    const predefinedStatuses = ['want-to-read', 'currently-reading', 'read'];
    // const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};

    const bookElement = shelfCheckboxes.closest('.book');
    const bookTitle = bookElement.getAttribute('data-title');
    const bookAuthor = bookElement.getAttribute('data-author');
    let hyphenBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');
    let hyphenBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');

    // add predefined statuses
    predefinedStatuses.forEach(status => {
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        let id;

        if (status === 'want-to-read') {
            id = `wtr-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`;
        } else if (status === 'currently-reading') {
            id = `cr-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`;
        } else {
            id = `rd-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`;
        }

        checkbox.type = 'checkbox';
        checkbox.className = 'mini-status-checkbox';
        checkbox.id = id;
        checkbox.setAttribute('data-status', status);

        label.htmlFor = id;
        label.className = 'mini-status-label';
        label.textContent = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        shelfCheckboxes.appendChild(checkbox);
        shelfCheckboxes.appendChild(label);
    });

    // add custom shelves
    for (const [shelfName, books] of Object.entries(customShelves)) {
        let hyphenShelfName = shelfName.replace(/\s+/g, '-');

        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        const id = `${hyphenShelfName}-shelf-${hyphenBookTitle}-${hyphenBookAuthor}`;

        checkbox.type = 'checkbox';
        checkbox.className = 'mini-status-checkbox';
        checkbox.id = id;
        checkbox.setAttribute('data-status', shelfName);

        label.htmlFor = id;
        label.className = 'mini-status-label';
        label.textContent = shelfName;

        shelfCheckboxes.appendChild(checkbox);
        shelfCheckboxes.appendChild(label);

        for (const bookKey in books) {
            const [bookTitle, bookAuthor] = bookKey.split(' by ');
            const bookElement = document.querySelector(`[data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
            if (bookElement) {
                const miniCheckboxes = bookElement.querySelectorAll(`.mini-status-checkbox[data-status="${shelfName}"]`);
                miniCheckboxes.forEach(miniCheckbox => {
                    miniCheckbox.checked = true;
                });
            }
        }
    }

    const checkboxes = document.querySelectorAll('.status-checkbox');
    const bookStatuses = {
        'Want to Read': 'want-to-read',
        'Currently Reading': 'currently-reading',
        'Read': 'read'
    };
    const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
    const cr = JSON.parse(localStorage.getItem('cr')) || {};
    const rd = JSON.parse(localStorage.getItem('rd')) || {};

    checkboxes.forEach(checkbox => {
        const bookElement = checkbox.closest('.book');
        const bookTitle = bookElement.getAttribute('data-title');
        const bookAuthor = bookElement.getAttribute('data-author');
        const bookKey = `${bookTitle} by ${bookAuthor}`;
        const label = bookElement.querySelector('.status-label');
        const labelCheck = bookElement.querySelector('.read-check');

        // ellipses dropdown button
        const dotButton = bookElement.querySelector('.dropdown-btn');

        // mini wtr, cr, and rd checkboxes
        const miniCheckboxes = bookElement.querySelectorAll('.mini-status-checkbox');

        // alert('wtr, cr, rd checkboxes found: ' + miniCheckboxes.length);

        // Set initial label based on stored data
        // Check if book already in WTR, CR, or RD dict
        if (wtr[bookKey]) {
            updateUIElements(bookKey, 'want-to-read', true, dotButton, label, labelCheck);
            checkbox.checked = true;
            console.log("blue", label.className, labelCheck.className);
            console.log("checkbox checked", checkbox);
            console.log("dot btn is blue", dotButton.classList);
        } else if (cr[bookKey]) {
            updateUIElements(bookKey, 'currently-reading', true, dotButton, label, labelCheck);
            checkbox.checked = true;
            console.log("purple", label.className, labelCheck.className);
            console.log("checkbox checked", checkbox);
            console.log("dot btn is purple", dotButton.classList);
        } else if (rd[bookKey]) {
            updateUIElements(bookKey, 'read', true, dotButton, label, labelCheck);
            checkbox.checked = true;
            console.log("red", label.className, labelCheck.className);
            console.log("checkbox checked", checkbox);
            console.log("dot btn is red", dotButton.classList);
        }

        console.log('Mini checkboxes:', miniCheckboxes);

        miniCheckboxes.forEach(miniCheckbox => {
            const miniStatus = miniCheckbox.getAttribute('data-status');

            console.log(`Mini checkbox status: ${miniStatus}`);

            // Set initial mini labels based on stored data
            // Check if book already in WTR, CR, or RD dict
            if ((wtr[bookKey] && miniStatus === 'want-to-read') || 
                (cr[bookKey] && miniStatus === 'currently-reading') || 
                (rd[bookKey] && miniStatus === 'read')) {
                miniCheckbox.checked = true;
                console.log("mini checkbox checked");
            }

            miniCheckbox.addEventListener('change', function() {
                console.log('Mini checkbox changed');
                const currentMiniStatus = this.getAttribute('data-status');
                console.log('Current mini status:', currentMiniStatus);

                const dropdownButtons = document.querySelectorAll('.dropdown-btn');
                dropdownButtons.forEach(dropdownButton => {
                    const dropdownElement = dropdownButton.closest('.dropdown');
                    if (!dropdownElement) return;
                    const dropdownContent = dropdownElement.querySelector('.dropdown-content');
                    dropdownContent.classList.add('hide');
                    console.log("HID DROPDOWN");
                });

                if (['want-to-read', 'currently-reading', 'read'].includes(currentMiniStatus)) {
                    // Uncheck other mini checkboxes if the currently checked mini checkbox is wtr, cr, or rd
                    miniCheckboxes.forEach(otherCheckbox => {

                        if (otherCheckbox !== this && otherCheckbox.checked) {

                            console.log("this checkbox: ", currentMiniStatus, " other checkbox: ", otherCheckbox.getAttribute('data-status'));

                            const otherStatus = otherCheckbox.getAttribute('data-status');

                            // Remove status from dicts if unchecked
                            if (otherStatus === 'want-to-read') {
                                delete wtr[bookKey];
                                dotButton.classList.remove('want-to-read');
                                console.log("dot btn not blue anymore", dotButton.classList);
                                otherCheckbox.checked = false;
                            console.log("mini not checked", otherCheckbox);
                            } else if (otherStatus === 'currently-reading') {
                                delete cr[bookKey];
                                dotButton.classList.remove('currently-reading');
                                console.log("dot btn not purple anymore", dotButton.classList);
                                otherCheckbox.checked = false;
                            console.log("mini not checked", otherCheckbox);
                            } else if (otherStatus === 'read') {
                                delete rd[bookKey];
                                dotButton.classList.remove('read');
                                console.log("dot btn not red anymore", dotButton.classList);
                                otherCheckbox.checked = false;
                                console.log("mini not checked", otherCheckbox);
                            }
                        }
                    });
                }

                // Update status for the currently checked mini checkbox
                if (this.checked) {
                    updateUIElements(bookKey, currentMiniStatus, true, dotButton, label, labelCheck);

                    if (!['want-to-read', 'currently-reading', 'read'].includes(currentMiniStatus)) {
                        addBooktoShelf(currentMiniStatus, bookKey);
                        console.log("Book added to: ", currentMiniStatus);
                    }
                } else {
                    if (['want-to-read', 'currently-reading', 'read'].includes(currentMiniStatus)) {
                        if (confirm("Are you sure you want to remove this book from your lists? Your reading history and any review will be deleted.")) {
                            delete wtr[bookKey];
                            delete cr[bookKey];
                            delete rd[bookKey];
                            checkbox.checked = false;
                            console.log("Book removed from: ", currentMiniStatus);
                            updateUIElements(bookKey, currentMiniStatus, false, dotButton, label, labelCheck);
                        } else {
                            this.checked = true;
                        }
                    } else {
                        removeBookFromShelf(currentMiniStatus, bookKey);
                        console.log("Book removed from: ", currentMiniStatus);
                    }
                }
                saveToLocalStorage();
            });
        });

        checkbox.addEventListener('change', function() {
            const bookElement = this.closest('.book');
            const miniCheckboxes = bookElement.querySelectorAll('.mini-status-checkbox');
            let status;
            if (checkbox.checked) {
                status = 'want-to-read';
                updateUIElements(bookKey, status, true, dotButton, label, labelCheck);

                miniCheckboxes.forEach(miniCheckbox => {
                    const miniStatus = miniCheckbox.getAttribute('data-status');
    
                    if (miniStatus === status) {
                        miniCheckbox.checked = true;
                        console.log("Updated mini checkbox color");
                    } else if ((miniStatus === 'currently-reading') || (miniStatus === 'read')) {
                        miniCheckbox.checked = false;
                    }
                });


            } else {
                if (confirm("Are you sure you want to remove this book from your lists? Your reading history and any review will be deleted.")) {
                    delete wtr[bookKey];
                    delete cr[bookKey];
                    delete rd[bookKey];
                    updateUIElements(bookKey, 'want-to-read', false, dotButton, label, labelCheck);

                    miniCheckboxes.forEach(miniCheckbox => {
                        const miniStatus = miniCheckbox.getAttribute('data-status');

                        if (['want-to-read', 'currently-reading', 'read'].includes(miniStatus)) {
                            miniCheckbox.checked = false;
                        }
                    });
                } else {
                    checkbox.checked = true;
                    return;
                }
            }
            saveToLocalStorage();
        });
    });

    function saveToLocalStorage() {
        localStorage.setItem('wtr', JSON.stringify(wtr));
        localStorage.setItem('cr', JSON.stringify(cr));
        localStorage.setItem('rd', JSON.stringify(rd));
    }

    function updateUIElements(bookKey, status, isChecked, dotButton, label, labelCheck) {        
        if (isChecked) {
            if (status === 'want-to-read') {
                wtr[bookKey] = new Date().toISOString();
                label.textContent = 'Want to Read';
                label.className = 'status-label want-to-read';
                dotButton.classList.add('want-to-read');
            } else if (status === 'currently-reading') {
                cr[bookKey] = new Date().toISOString();
                label.textContent = 'Reading';
                label.className = 'status-label currently-reading';
                dotButton.classList.add('currently-reading');
            } else if (status === 'read') {
                rd[bookKey] = new Date().toISOString();
                label.textContent = 'Read';
                label.className = 'status-label read';
                dotButton.classList.add('read');
            }
            labelCheck.className = 'read-check checked';
            console.log("read check checked");
        } else {
            label.textContent = 'Want to Read';
            label.className = 'status-label';
            labelCheck.className = 'read-check';
            dotButton.classList.remove('want-to-read', 'currently-reading', 'read');
        }
    }
});

/* Disable right click book thumbnails on mobile */
document.addEventListener("DOMContentLoaded", function() {
    if (window.innerWidth <= 414) {
        console.log("MOBILE!")
        var bookThumbnail = document.querySelector(".book-thumbnail-img")
        // bookThumbnail.addEventListener('contextmenu', event => event.preventDefault())
        if (bookThumbnail) {
            bookThumbnail.addEventListener('contextmenu', function() {
                console.log("returning false;");
                return false;
            });
        }
    }
});


// Click and hold book thumbnail
var timeout_id = 0;
document.addEventListener("mousedown", function(event) {
    console.log("held down: ", event.target);
    var bookElem = document.querySelector(".book-thumbnail-img");
    if (event.target.classList[0] == bookElem.classList[0]) {
        // var timeout_id = 0;
        hold_time = 500;

        timeout_id = setTimeout(function() {
            console.log("timeout");
        }, hold_time);
    }

    bookElem.addEventListener("mouseup", function() {
        clearTimeout(timeout_id);
        console.log("clear timeout");
    });
});

// var mouseTimer;
// var myVar;
// function mouseDown() { 
//     mouseTimer = window.setTimeout(myFunction, 500); //set timeout to fire in 2 seconds when the user presses mouse button down
// }
// function myFunction() {
//     myVar = true;
// }

// var div = document.querySelector(".book-thumbnail");
// testBtn.addEventListener("mousedown", mouseDown);
// document.body.addEventListener("mouseup", removeTimer);  

// function removeTimer() {
//     if (myVar) {
//         console.log("a")
//     }  
//     if (mouseTimer) {
//         window.clearTimeout(mouseTimer)
//     }
//     myVar = false;
// }



// HOME -> GROUPS
// Populate number of group members
document.addEventListener("DOMContentLoaded", function() {
    updateNumMembers();

    function updateNumMembers() {
        // load dict storing all members (dict with group: usernames)
        const groupMembers = JSON.parse(localStorage.getItem('group-members')) || {};

        const groupElements = document.querySelectorAll('.group-row');

        groupElements.forEach(groupElement => {
            const numMembersLabel = groupElement.querySelector('.num-members');
            console.log("group members: ", Object.keys(groupMembers).length);
            const numMembers = Object.keys(groupMembers).length.toLocaleString();

            if (numMembers === 1) {
                numMembersLabel.textContent = '1 member';
            } else {
                numMembersLabel.textContent = `${numMembers} members`;
            }
        });
    }
});

// Join/leave group
document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.group-status-checkbox');
    const groups = JSON.parse(localStorage.getItem('groups')) || {};
    // alert('Checkboxes found: ' + checkboxes.length);

    checkboxes.forEach(checkbox => {
        const groupElement = checkbox.closest('.group-row');
        const groupName = groupElement.getAttribute('data-name');
        const groupKey = checkbox.id;

        // Check if group already in GROUPS dict
        if (groups[groupKey]) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {

                // Add group to GROUPS dict
                groups[groupKey] = new Date().toISOString();
                // alert('Joined: ' + groupName + ' at ' + groups[groupKey]);

            // Remove group from GROUPS dict if already in it
            } else {
                if (confirm("Are you sure you want to leave this group?")) {
                    delete groups[groupKey];
                    // alert('Left: ' + groupName);

                } else {
                    checkbox.checked = true;
                }
            }
            localStorage.setItem('groups', JSON.stringify(groups));
            // alert('Updated groups: ' + JSON.stringify(groups));
        });
    });
});


// DISCOVER
function toggleSubmenuTab(tab, clickedTab) {
    const tabStates = JSON.parse(localStorage.getItem('tabStates')) || {};

    console.log(`Submenu tab "${tab}" clicked`);
    var visibleTab = document.getElementById(tab);
    const pageMenu = document.querySelector('.page-menu');
    var defaultTab = pageMenu.querySelector('input');
    var hiddenTabs = document.querySelectorAll('.wrap');
    // var tabs = pageMenu.getElementsByTagName('input');

    // Highlight label of clicked tab and unhighlight label of unclicked tabs
    addChecked(clickedTab);

    if (visibleTab) {
        if (visibleTab.classList.contains('hide')) {
            // Hide content of other tabs
            hiddenTabs.forEach(hiddenTab => {
                if (!hiddenTab.classList.contains('hide')) {
                    hiddenTab.classList.add('hide')
                }
            })
            // Show content of current tab
            visibleTab.classList.remove('hide')
        }
    }

    // Remember submenu tab (radio button) selections

    // window.addEventListener("beforeunload", function() {
    var loc = window.location.pathname;
    var folder = loc.split('/')[1];
    if (folder === '') {
        folder = 'index'
    }
    console.log("CURRENT FOLDER: ", folder);
    console.log(defaultTab, clickedTab != defaultTab);
        if (clickedTab != defaultTab) {

            if (!(folder in tabStates)) {
                tabStates[folder] = []
            }
            for (let i = 0; i < hiddenTabs.length; i++) {
                tabStates[folder][i] = {
                    buttons: pageMenu.innerHTML,
                    tabContent: hiddenTabs[i].outerHTML
                }
            }
            localStorage.setItem('tabStates', JSON.stringify(tabStates));
            console.log("tab states: ", localStorage.tabStates);
        } else {
            delete tabStates[folder]
            console.log(tabStates[folder], folder, tabStates)
        }
    // });
}

// Recall submenu tab (radio button) selections
document.addEventListener("DOMContentLoaded", function() {
    const tabStates = JSON.parse(localStorage.getItem('tabStates')) || {};
    const lastPageVisited = JSON.parse(localStorage.getItem('lastPageVisited')) || {};

    var loc = window.location.pathname;
    var folder = loc.split('/')[1];
    if (folder === '') {
        folder = 'index'
    }
    var hiddenTabs = document.querySelectorAll('.wrap')
    const pageMenu = document.querySelector('.page-menu')

    console.log(lastPageVisited.lastFolder);

    if (tabStates.hasOwnProperty(folder) && lastPageVisited.lastFolder != folder) {
        pageMenu.innerHTML = tabStates[folder][0].buttons
        for (let i = 0; i < hiddenTabs.length; i++) {
            hiddenTabs[i].outerHTML = tabStates[folder][i].tabContent;
        }
    }
    // else if (lastPageVisited.lastFolder === folder) {
    //     var clickedTab = pageMenu.querySelector('input')
    //     var tab = document.querySelector('.wrap').id
    //     console.log("TAB: ", tab, "CLICKED TAB: ", clickedTab)
    //     toggleSubmenuTab(tab, clickedTab)
    //     console.log("log: ", tabStates[folder])
    //     delete tabStates[folder]
    // }
});


// MY BOOKS
document.addEventListener("DOMContentLoaded", function() {
    // Populate bookshelf thumbnails
    if (window.location.pathname.endsWith('my_books') || window.location.pathname.endsWith('my_books.html')) {
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};

        console.log("CUSTOM SHELVES: ", customShelves);

        populateBookshelfThumbnails(wtr, 'wtr');
        populateBookshelfThumbnails(rd, 'rd');
        for (const shelfName in customShelves) {
            populateBookshelfThumbnails(customShelves[shelfName], shelfName);
            console.log("Populated thumbnail for: ", shelfName);
        }
        // for (let shelfName in customShelf) {
        //     populateBookshelfThumbnails(customShelf[shelfName], shelfName);
        //     console.log("Populated thumbnail for: ", shelfName);
        // }

        // Populate bookshelf thumbnails
        function populateBookshelfThumbnails(bookshelf, shelfName) {
            console.log(Array.isArray(bookshelf));
            console.log(bookshelf);

            // const wrap = document.getElementById('wrap');
            const wrap = document.querySelector('.wrap');

            const booksShelfName = document.createElement('div');
            let hyphenShelfName = shelfName.replace(/\s+/g, '-');
            booksShelfName.classList.add('section-container');
            if (shelfName === 'wtr') {
                booksShelfName.classList.add('books-want-to-read')
            } else if (shelfName === 'rd') {
                booksShelfName.classList.add('books-read')
            } else {
                booksShelfName.classList.add(`books-${hyphenShelfName}`)
            }
            // booksShelfName.className = shelfName === 'wtr' ? 'books-want-to-read' : shelfName === 'rd' ? 'books-read' : `books-${hyphenShelfName}`;

            const currentOutHeader = document.createElement('div');
            currentOutHeader.className = 'current-out-header';
            currentOutHeader.style.margin = '0 0 5px 0';

            const outHeaderTitle = document.createElement('p');
            outHeaderTitle.className = 'out-header-title';
            outHeaderTitle.textContent = shelfName === 'wtr' ? 'Want to Read' : shelfName === 'rd' ? 'Read' : shelfName;

            currentOutHeader.appendChild(outHeaderTitle);

            const showMore = document.createElement('a');
            showMore.className = 'show-more';
            let underscoreShelfName = shelfName.replace(/\s+/g, '_');
            showMore.href = shelfName === 'wtr' ? 'Want_to_Read.html' : shelfName === 'rd' ? 'Read.html' : `${underscoreShelfName}.html`;

            const numBooks = document.createElement('p');
            numBooks.className = 'num-books';

            showMore.appendChild(numBooks);

            const rightCaret = document.createElement('img');
            rightCaret.src = './assets/images/icons/right_caret_icon.svg';
            rightCaret.className = 'right-caret';

            showMore.appendChild(rightCaret);
            currentOutHeader.appendChild(showMore);
            booksShelfName.appendChild(currentOutHeader);

            const bookRow = document.createElement('div');
            bookRow.className = 'book-row';
            bookRow.style.paddingBottom = '0';
            // bookRow.style.margin = '0 auto 17px auto';
            bookRow.style.overflow = 'clip';

            for (const bookKey in bookshelf) {
                if (bookshelf.hasOwnProperty(bookKey) && bookKey.includes(' by ')) {
                    const [bookTitle, bookAuthor] = bookKey.split(' by ');
                    let underscoreBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                    let underscoreBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                    const thumbnailLink = thumbnailLinks[bookKey];

                    const bookThumbnail = document.createElement('a');
                    bookThumbnail.className = 'book-thumbnail';
                    bookThumbnail.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;

                    const thumbnail = document.createElement('img');
                    thumbnail.classList.add('book-thumbnail-img');
                    thumbnail.src = thumbnailLink;
                    thumbnail.style.width = 'calc(84vw/4)';
                    bookThumbnail.appendChild(thumbnail);
                    bookRow.appendChild(bookThumbnail);
                    // console.log("here we go!", bookshelf, bookThumbnail.href);
                }
            }

            const partialLinebreak = document.createElement('hr');
            partialLinebreak.className = 'partial-linebreak';
            partialLinebreak.textContent = '';

            booksShelfName.appendChild(bookRow);
            wrap.appendChild(booksShelfName);
            // wrap.appendChild(bookRow);
            wrap.appendChild(partialLinebreak);

            updateNumBooks(bookshelf, booksShelfName, shelfName);
        }
    }

    // Update labels of number of books in each shelf
    function updateNumBooks(bookshelf, booksShelfName, shelfName) {
        const numBooks = booksShelfName.querySelector('.num-books');

        if (shelfName !== 'rd') {
            if (Object.keys(bookshelf).length === 1) {
                numBooks.textContent = '1 book';
            } else {
                numBooks.textContent = `${Object.keys(bookshelf).length} books`;
            }
        } else {
            const currentYear = new Date().getFullYear();
            let numReadThisYear = 0;
            for (const bookKey in bookshelf) {
                if (bookshelf[bookKey].includes(currentYear)) {
                    numReadThisYear++;
                }
            }
            numBooks.textContent = `${Object.keys(bookshelf).length} / ${numReadThisYear} this year`;
        }
    }

    // Populate currently reading notifs
    // // let max;
    // if (window.location.pathname.endsWith('my_books.html')) {
    //     // max = false;
    //     populateMiniNotifs();
    // } else if (window.location.pathname.endsWith('Currently_Reading.html')) {
    //     // max = false;
    //     populateMiniNotifs();
    // }

    const booksCurrentlyReading = document.querySelector('.books-currently-reading');
    const contentContainer = booksCurrentlyReading.querySelector('.content-container');
    if (booksCurrentlyReading) {
        populateMiniNotifs();
    }

    // Populate currently reading notifs
    function populateMiniNotifs() {
        const cr = JSON.parse(localStorage.getItem('cr')) || {};
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
        const booksCR = document.querySelector('.books-currently-reading');
        const booksWTR = document.querySelector('.books-want-to-read');
        const booksRD = document.querySelector('.books-read');

        if (window.location.pathname.endsWith('my_books') || window.location.pathname.endsWith('my_books.html')) {
            updateNumBooks(cr, booksCR, 'cr');
            updateNumBooks(wtr, booksWTR, 'wtr');
            updateNumBooks(rd, booksRD, 'rd');
            for (const shelfName in customShelves) {
                let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                const booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                updateNumBooks(customShelves[shelfName], booksShelfName, shelfName);
            }
            // if (!(Object.keys(cr).length < 3)) {
            //     booksCR.style.height = "507px";
            //     booksCR.style.overflowY = "clip";
            //     booksCR.style.overscroll = "contain";
            // }
        }

        const maxMiniNotifs = 3;
        let existingMiniNotifs = booksCurrentlyReading.querySelectorAll('.mini-notifs').length;

        for (const bookKey in cr) {
            if (cr.hasOwnProperty(bookKey)) {
                console.log(bookKey, "in currently reading");

                if ((window.location.pathname.endsWith('my_books') || window.location.pathname.endsWith('my_books.html')) && (existingMiniNotifs >= maxMiniNotifs)) {
                    break;
                }

                const [bookTitle, bookAuthor] = bookKey.split(' by ');
                const bookElement = document.querySelector(`.book[data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
                let underscoreBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                let underscoreBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                let hyphenBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');
                let hyphenBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '-').replace(/\s+/g, '-');

                const thumbnailLink = thumbnailLinks[bookKey];

                if (!bookElement) {
                    const miniNotif = document.createElement('div');
                    miniNotif.className = 'mini-notif';

                    const book = document.createElement('div');
                    book.className = 'book';
                    book.setAttribute('data-title', bookTitle);
                    book.setAttribute('data-author', bookAuthor);

                    const miniBookThumbnail = document.createElement('a');
                    miniBookThumbnail.className = 'mini-book-thumbnail';
                    miniBookThumbnail.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;

                    const thumbnail = document.createElement('img');
                    thumbnail.classList.add('book-thumbnail-img');
                    thumbnail.src = thumbnailLink;
                    miniBookThumbnail.appendChild(thumbnail);

                    book.appendChild(miniBookThumbnail);

                    const bookInfo = document.createElement('div');
                    bookInfo.className = 'book-info';

                    const bookTitleContainer = document.createElement('a');
                    bookTitleContainer.className = 'book-title';
                    bookTitleContainer.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;
                    bookTitleContainer.textContent = bookTitle;

                    const bookAuthorContainer = document.createElement('a');
                    bookAuthorContainer.className = 'author';
                    bookAuthorContainer.href = `author/${underscoreBookAuthor}.html`;
                    bookAuthorContainer.textContent = `by ${bookAuthor}`;

                    bookInfo.appendChild(bookTitleContainer);
                    bookInfo.appendChild(bookAuthorContainer);

                    const progressBarContents = document.createElement('div');
                    progressBarContents.className = 'progress-bar-contents';

                    const progressBarBorder = document.createElement('div');
                    progressBarBorder.className = 'progress-bar-border';

                    const progressBarGrey = document.createElement('div');
                    progressBarGrey.className = 'progress-bar-grey';

                    progressBarBorder.appendChild(progressBarGrey);

                    const percentProgressContainer = document.createElement('p');
                    percentProgressContainer.className = 'percent-progress';
                    const savedProgress = localStorage.getItem(`${bookKey}-progress`);
                    percentProgressContainer.textContent = `${savedProgress || 0}%`;
                    // percentProgressContainer.textContent = `${cr[bookKey].percentProgress || 0}%`;

                    const editProgressButton = document.createElement('button');
                    editProgressButton.className = 'edit-progress-btn';
                    editProgressButton.href = '#';

                    const finishedButton = document.createElement('div');
                    finishedButton.className = 'finished-btn';

                    const finishedCheckbox = document.createElement('input');
                    finishedCheckbox.type = 'checkbox';
                    finishedCheckbox.className = 'finished-checkbox';
                    finishedCheckbox.id = `finished-${hyphenBookTitle}-${hyphenBookAuthor}`;

                    const finishedLabel = document.createElement('label');
                    finishedLabel.htmlFor = `finished-${hyphenBookTitle}-${hyphenBookAuthor}`;
                    finishedLabel.className = 'finished-label';

                    finishedButton.appendChild(finishedCheckbox);
                    finishedButton.appendChild(finishedLabel);

                    progressBarContents.appendChild(progressBarBorder);
                    progressBarContents.appendChild(percentProgressContainer);
                    progressBarContents.appendChild(editProgressButton);
                    progressBarContents.appendChild(finishedButton);
                    bookInfo.appendChild(progressBarContents);


                    book.appendChild(bookInfo);
                    miniNotif.appendChild(book);


                    const crDropdownContent = document.createElement('div');
                    crDropdownContent.className = 'cr-dropdown-content hide';

                    const amountReadUpdateButtons = document.createElement('div');
                    amountReadUpdateButtons.className = 'amount-read-update-btns';

                    const progressTextBox = document.createElement('div');
                    progressTextBox.className = 'progress-text-box';

                    const pageProgressText = document.createElement('input');
                    pageProgressText.type = 'number';
                    pageProgressText.className = 'page-progress-text';
                    pageProgressText.id = `page-number-${hyphenBookTitle}-${hyphenBookAuthor}`;
                    pageProgressText.value = '';
                    pageProgressText.min = '0';
                    pageProgressText.max = '2000';
                    pageProgressText.placeholder = '#';

                    progressTextBox.appendChild(pageProgressText);

                    const percentProgressText = document.createElement('input');
                    percentProgressText.type = 'number';
                    percentProgressText.className = 'percent-progress-text hide';
                    percentProgressText.id = `percent-number-${hyphenBookTitle}-${hyphenBookAuthor}`;
                    percentProgressText.value = '';
                    percentProgressText.min = '0';
                    percentProgressText.max = '100';
                    percentProgressText.placeholder = '#';

                    progressTextBox.appendChild(percentProgressText);
                    amountReadUpdateButtons.appendChild(progressTextBox);

                    const progressUnitButton = document.createElement('button');
                    progressUnitButton.className = 'progress-unit-btn';
                    progressUnitButton.href = '#';
                    progressUnitButton.textContent = 'pages';

                    amountReadUpdateButtons.appendChild(progressUnitButton);

                    const pagePercentDropdown = document.createElement('div');
                    pagePercentDropdown.className = 'unit-dropdown-content hide';

                    const pagesButton = document.createElement('div');
                    pagesButton.className = 'pages-btn';

                    const pagesCheckbox = document.createElement('input');
                    pagesCheckbox.type = 'checkbox';
                    pagesCheckbox.className = 'pages-checkbox';
                    pagesCheckbox.id = `pages-${hyphenBookTitle}-${hyphenBookAuthor}`;

                    const pagesLabel = document.createElement('label');
                    pagesLabel.htmlFor = `pages-${hyphenBookTitle}-${hyphenBookAuthor}`;
                    pagesLabel.className = 'pages-label';
                    pagesLabel.textContent = 'pages';

                    pagesButton.appendChild(pagesCheckbox);
                    pagesButton.appendChild(pagesLabel);
                    pagePercentDropdown.appendChild(pagesButton);

                    const percentButton = document.createElement('div');
                    percentButton.className = 'percent-btn';

                    const percentCheckbox = document.createElement('input');
                    percentCheckbox.type = 'checkbox';
                    percentCheckbox.className = 'percent-checkbox';
                    percentCheckbox.id = `percent-${hyphenBookTitle}-${hyphenBookAuthor}`;

                    const percentLabel = document.createElement('label');
                    percentLabel.htmlFor = `percent-${hyphenBookTitle}-${hyphenBookAuthor}`;
                    percentLabel.className = 'percent-label';
                    percentLabel.textContent = '%';

                    percentButton.appendChild(percentCheckbox);
                    percentButton.appendChild(percentLabel);
                    pagePercentDropdown.appendChild(percentButton);

                    amountReadUpdateButtons.appendChild(pagePercentDropdown);

                    const saveButtonContainer = document.createElement('div');
                    saveButtonContainer.className = 'save-btn-container';

                    const saveButton = document.createElement('button');
                    saveButton.className = 'save-btn';
                    saveButton.href = '#';
                    saveButton.textContent = 'Save';

                    saveButtonContainer.appendChild(saveButton);
                    amountReadUpdateButtons.appendChild(saveButtonContainer);
                    crDropdownContent.appendChild(amountReadUpdateButtons);

                    const progressNoteContainer = document.createElement('div');
                    progressNoteContainer.className = 'progress-note-container';

                    const progressNoteButton = document.createElement('a');
                    progressNoteButton.className = 'progress-note-btn';
                    progressNoteButton.href = 'write_progress_note.html';
                    progressNoteButton.textContent = 'Add note/Edit date';
                    
                    progressNoteContainer.appendChild(progressNoteButton);
                    crDropdownContent.appendChild(progressNoteContainer);

                    const cancelButtonContainer = document.createElement('div');
                    cancelButtonContainer.className = 'cancel-btn-container';

                    const cancelButton = document.createElement('button');
                    cancelButton.className = 'cancel-btn';
                    cancelButton.href = '#';
                    cancelButton.textContent = 'Cancel';

                    cancelButtonContainer.appendChild(cancelButton);
                    crDropdownContent.appendChild(cancelButtonContainer);

                    miniNotif.appendChild(crDropdownContent);

                    if (window.location.pathname.endsWith('my_books') || window.location.pathname.endsWith('my_books.html')) {
                        booksCurrentlyReading.appendChild(miniNotif);
                    } else {
                        contentContainer.appendChild(miniNotif);
                        booksCurrentlyReading.style.borderBottom = 'none';
                    }

                    updateProgressBar(miniNotif, bookKey);

                    existingMiniNotifs++;

                    console.log("mini notif created for: ", bookKey);
                }
            }
        }
    }

    // Update progress bar
    function updateProgressBar(miniNotif, bookKey) {
        const progressBarGrey = miniNotif.querySelector('.progress-bar-grey');
        const percentProgress = miniNotif.querySelector('.percent-progress');
        const savedProgress = localStorage.getItem(`${bookKey}-progress`);

        if (savedProgress !== null) {
            progressBarGrey.style.width = `${savedProgress}%`;
            percentProgress.textContent = `${savedProgress}%`;
            console.log(`Updated progress bar for ${bookKey} to ${savedProgress}%`);
        } else {
            console.warn(`No saved progress found for ${bookKey}`);
        }
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('finished-checkbox')) {
            markFinished(e.target);

            const cr = JSON.parse(localStorage.getItem('cr')) || {};
            const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
            const rd = JSON.parse(localStorage.getItem('rd')) || {};
            const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
            const booksCR = document.querySelector('.books-currently-reading');
            const booksWTR = document.querySelector('.books-want-to-read');
            const booksRD = document.querySelector('.books-read');

            updateNumBooks(cr, booksCR, 'cr');
            updateNumBooks(wtr, booksWTR, 'wtr');
            updateNumBooks(rd, booksRD, 'rd');
            for (const shelfName in customShelves) {
                let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                const booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                updateNumBooks(customShelves[shelfName], booksShelfName, shelfName);
            }


        } else if (e.target.classList.contains('edit-progress-btn')) {
            editProgress(e.target);
        }
    });

    // Mark book finished and remove currently reading notif
    function markFinished(target) {
        console.log("Finished button clicked:", target);

        const cr = JSON.parse(localStorage.getItem('cr')) || {};
        const rd = JSON.parse(localStorage.getItem('rd')) || {};

        const checkbox = target;
        const miniNotif = checkbox.closest('.mini-notif');
        console.log(miniNotif);
        const bookElement = checkbox.closest('.book');
        const bookTitle = bookElement.getAttribute('data-title');
        const bookAuthor = bookElement.getAttribute('data-author');
        const bookKey = `${bookTitle} by ${bookAuthor}`;

        function removeMiniNotif() {
            miniNotif.remove();
        }
        
        // Check if book already in RD dict
        if (rd[bookKey]) {
            checkbox.checked = true
            removeMiniNotif()
            console.log("Removed mini notif 1: ", bookKey, miniNotif)
        }

        if (checkbox.checked) {
            if (confirm("Mark book as read?")) {
                delete cr[bookKey]
                console.log("Removed from currently reading dict")
                // Add group to RD dict
                rd[bookKey] = new Date().toISOString()
                // updateUIElements(bookKey, 'read', true, dotButton, label, labelCheck);
                alert('Finished: ' + bookKey + ' at ' + rd[bookKey])
                console.log("rd: ", rd)
                removeMiniNotif()
                console.log("Removed mini notif 2")
            } else {
                checkbox.checked = false
            }
        }
        saveToLocalStorage();
        console.log("saved to local: ", rd);

        function saveToLocalStorage() {
            localStorage.setItem('cr', JSON.stringify(cr));
            localStorage.setItem('rd', JSON.stringify(rd));
        }
        localStorage.removeItem(`${bookKey}-progress`);
    }

    // Edit progress
    function editProgress(target) {
        console.log("Edit progress button clicked:", target);

        const editProgressButton = target;
        const editProgressElement = editProgressButton.closest('.mini-notif');
        if (!editProgressElement) return;

        const editProgressContent = editProgressElement.querySelector('.cr-dropdown-content');
        const pageProgressText = editProgressElement.querySelector('.page-progress-text');
        const percentProgressText = editProgressElement.querySelector('.percent-progress-text');

        const progressUnitButton = editProgressElement.querySelector('.progress-unit-btn');
        const amountReadUpdateButtons = progressUnitButton.closest('.amount-read-update-btns');
        const pagePercentDropdown = amountReadUpdateButtons.querySelector('.unit-dropdown-content');

        const saveButton = editProgressElement.querySelector('.save-btn');
        const progressNoteButton = editProgressElement.querySelector('.progress-note-btn');
        const cancelButton = editProgressElement.querySelector('.cancel-btn');

        if (!editProgressContent || !saveButton || !progressUnitButton || !pageProgressText || !percentProgressText) return;

        editProgressContent.classList.toggle('hide');
        if (!pagePercentDropdown.classList.contains('hide')) {
            pagePercentDropdown.classList.add('hide');
            console.log("Hide page/percent buttons");
        }
        console.log("Dropdown content classes after toggle:", editProgressContent.classList);

        const pagesCheckbox = pagePercentDropdown.querySelector('.pages-checkbox');
        const percentCheckbox = pagePercentDropdown.querySelector('.percent-checkbox');

        let number;
        let totalPages = 300;

        if (!progressUnitButton.dataset.listenersAdded) {
            progressUnitButton.dataset.listenersAdded = "true";

            percentProgressText.classList.add('hide');

            progressUnitButton.addEventListener('click', function(e) {
                pagePercentDropdown.classList.toggle('hide');
                console.log("show page/percent dropdown");

                pagesCheckbox.addEventListener('change', function(e) {
                    progressUnitButton.textContent = 'pages';
                    pagePercentDropdown.classList.add('hide');
                    if (pageProgressText.classList.contains('hide')) {
                        pageProgressText.classList.remove('hide');
                        percentProgressText.classList.add('hide');
                    }
                });

                percentCheckbox.addEventListener('change', function(e) {
                    progressUnitButton.textContent = '%';
                    pagePercentDropdown.classList.add('hide');
                    if (percentProgressText.classList.contains('hide')) {
                        percentProgressText.classList.remove('hide');
                        pageProgressText.classList.add('hide');
                    }
                });
            });
        }

        pageProgressText.addEventListener('input', function(e) {
            number = Math.floor(e.target.value / totalPages * 100);
            console.log("number: ", number);
        });
        percentProgressText.addEventListener('input', function(e) {
            number = Math.floor(e.target.value);
            console.log("number: ", number);
        });

        saveButton.addEventListener('click', function(e) {
            console.log("save click");
            if (pagePercentDropdown.classList.contains('hide')) {

                if (number === undefined) {
                    console.log("number undefined");
                    return;
                }
                console.log(number);
                editProgressContent.classList.add('hide');
                e.stopPropagation();
                console.log("Clicked save button, saving and hiding dropdown");

                const checkbox = editProgressElement.querySelector('.finished-checkbox');
                if (number < 100) {
                    // update progress bar
                    const progressBarGrey = editProgressElement.querySelector('.progress-bar-grey');
                    const percentProgress = editProgressElement.querySelector('.percent-progress');
                    progressBarGrey.style.width = `${number}%`;
                    percentProgress.textContent = `${number}%`;

                    const bookTitle = editProgressElement.querySelector('.book').getAttribute('data-title');
                    const bookAuthor = editProgressElement.querySelector('.book').getAttribute('data-author');
                    const bookKey = `${bookTitle} by ${bookAuthor}`;

                    localStorage.setItem(`${bookKey}-progress`, number);
                    console.log("saved bar");
                } else {
                    checkbox.checked = true;
                    markFinished(checkbox);
                }

                const cr = JSON.parse(localStorage.getItem('cr')) || {};
                const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
                const rd = JSON.parse(localStorage.getItem('rd')) || {};
                const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};
                const booksCR = document.querySelector('.books-currently-reading');
                const booksWTR = document.querySelector('.books-want-to-read');
                const booksRD = document.querySelector('.books-read');

                updateNumBooks(cr, booksCR, 'cr');
                updateNumBooks(wtr, booksWTR, 'wtr');
                updateNumBooks(rd, booksRD, 'rd');
                for (const shelfName in customShelves) {
                    let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                    booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                    updateNumBooks(customShelves[shelfName], booksShelfName, shelfName);
                }
            }
        });

        progressNoteButton.addEventListener('click', function(e) {
            if (!pagePercentDropdown.classList.contains('hide')) {
                e.preventDefault();
            }
        })

        cancelButton.addEventListener('click', function(e) {
            if (pagePercentDropdown.classList.contains('hide')) {
                editProgressContent.classList.add('hide');
                e.stopPropagation();
                console.log("Clicked cancel button, cancelling and hiding dropdown");
            }
        });

        document.addEventListener('click', function(e) {
            if (!pagePercentDropdown.classList.contains('hide')) {
                if (!e.target.closest('.unit-dropdown-content') && !e.target.closest('.progress-unit-btn')) {
                    pagePercentDropdown.classList.toggle('hide');
                    console.log("hide page/percent dropdown");
                }
            } else if (editProgressContent && !e.target.closest('.cr-dropdown-content') && !e.target.closest('.edit-progress-btn')) {
                editProgressContent.classList.add('hide');
                console.log("Clicked outside, hiding dropdown");
            }
        });
    }
});

// Populate bookshelf page
document.addEventListener("DOMContentLoaded", function() {
    var loc = window.location.pathname;
    var path = loc.substring(0, loc.lastIndexOf('/'));
    directoryName = path.substring(path.lastIndexOf('/') + 1);
    console.log("loc: ", loc);
    console.log("path: ", path);
    console.log("directory: ", directoryName);

    // if (loc.endsWith('Currently_Reading.html') || directoryName !== 'bookshelf') {
    // if (current page is Currently Reading page, or just not a bookshelf page)
    //     return;
    // }
    if (loc.endsWith('want_to_read') || loc.endsWith('Want_to_Read.html')) {
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        populateBookshelf(wtr);
        console.log("Populated wtr shelf");
    } else if (loc.endsWith('read') || loc.endsWith('Read.html')) {
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        populateBookshelf(rd);
        console.log("Populated rd shelf");
    } else if (loc.endsWith('popular_books') || loc.endsWith('popular_books.html')) {
        const popularBooks = JSON.parse(localStorage.getItem('popularBooks')) || {};
        populateBookshelf(popularBooks);
        console.log("Populated popularBooks shelf");
    } else if (loc.endsWith('friends_activity') || loc.endsWith('friends_activity.html')) {
        const friendsBookActivity = JSON.parse(localStorage.getItem('friendsBookActivity')) || {};
        populateBookshelf(friendsBookActivity);
        console.log("Populated friendsBookActivity shelf");
    } else if (loc.endsWith('for_you') || loc.endsWith('for_you.html')) {
        const recForYou = JSON.parse(localStorage.getItem('recForYou')) || {};
        populateBookshelf(recForYou);
        console.log("Populated recForYou shelf");
    } else {
        const customShelves = JSON.parse(localStorage.getItem('customShelves')) || {};

        for (const shelfName in customShelves) {
            console.log("shelfName: ", shelfName);
            let underscoreShelfName = shelfName.replace(/\s+/g, '_');
            if (loc.endsWith(`${underscoreShelfName}`) || loc.endsWith(`${underscoreShelfName}.html`)) {
                populateBookshelf(customShelves[shelfName]);
                console.log("Populated", shelfName);
            }
        }
    }

    // Populate bookshelf page
    function populateBookshelf(bookshelf) {
        console.log(Object.keys(bookshelf).length);
        const bookPage = document.querySelector('.book-page');

        for (const bookKey in bookshelf) {
            if (bookshelf.hasOwnProperty(bookKey)) {
            // if (bookKey in bookshelf) {

                const [bookTitle, bookAuthor] = bookKey.split(' by ');
                const bookElement = document.querySelector(`.book[data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
                let underscoreBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                let underscoreBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
                const thumbnailLink = thumbnailLinks[bookKey];

                if (!bookElement) {
                    const bookThumbnail = document.createElement('a');
                    bookThumbnail.className = 'book-thumbnail';
                    bookThumbnail.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;

                    const thumbnail = document.createElement('img');
                    thumbnail.classList.add('book-thumbnail-img');
                    thumbnail.src = thumbnailLink;

                    const rd = JSON.parse(localStorage.getItem('rd')) || {};
                    if (bookKey in rd) {
                        thumbnail.style.opacity = '30%';
                    }
                    // if (read) {
                    //     thumbnail.style.opacity = '50%';
                    // }
                    bookThumbnail.appendChild(thumbnail);
                    bookPage.appendChild(bookThumbnail);

                    console.log("shelf book thumbnail created for: ", bookKey);
                }
            }
        }
    }
});



// // Delete bookshelf
// document.addEventListener("DOMContentLoaded", function() {
//     // addeventlistener for button only on custom shelves pages
//     // delete shelf
//     // redirect to my books page
// });


// PROFILE

// Expand bio on click
function toggleExpandBio(event) {
    var bio = event.target;
    if (bio.classList.contains("expanded")) {
        bio.classList.toggle("expanded")
    } else {
        bio.classList.toggle("expanded")
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith('profile') || window.location.pathname.endsWith('profile.html')) {

        // Populate stats
        let readingGoal = 20;
        populateReadingChallengeProgressHeader(readingGoal);
        populateYearRecapHeader();
        populateRecentActivityRatings();
        populateAllBooksHeader();
        populateDiaryHeader();

        // Populate reading challenge progress header
        function populateReadingChallengeProgressHeader(readingGoal) {
            const readingChallengeHeader = document.querySelector('.reading-challenge-header');
            const currentYear = new Date().getFullYear();
            readingChallengeHeader.textContent = `${currentYear} Reading Challenge`;

            // let readingGoal = 20;
            const rd = JSON.parse(localStorage.getItem('rd')) || {};
            const readingChallengeProgress = document.querySelector('.reading-challenge-progress');
            console.log("reading challenge progress: ", readingChallengeProgress);

            let numReadThisYear = 0;
            for (const bookKey in rd) {
                if (rd[bookKey].includes(currentYear)) {
                    numReadThisYear++;
                }
            }
            readingChallengeProgress.textContent = `${numReadThisYear}/${readingGoal}`;

            let number = numReadThisYear / readingGoal * 100;
            if (number > 100) {
                number = 100;
            }
            console.log("number: ", number);

            const progressBarGrey = document.querySelector('.reading-challenge-progress-bar-grey');
            progressBarGrey.style.width = `${number}%`;

            localStorage.setItem(`${readingChallengeProgress}-progress`, number);
            console.log("saved bar");
        }

        // Populate past year recap header
        function populateYearRecapHeader() {
            const yearRecapHeader = document.querySelector('.year-recap-header');
            const lastYear = new Date().getFullYear() - 1;
            yearRecapHeader.textContent = `${lastYear} Recap`;

            const rd = JSON.parse(localStorage.getItem('rd')) || {};
            const yearRecapNumBooks = document.querySelector('.year-recap-num-books');
            let numReadLastYear = 0;

            for (const bookKey in rd) {
                if (rd[bookKey].includes(lastYear)) {
                    numReadLastYear++;
                }
            }
            if (numReadLastYear === 1) {
                yearRecapNumBooks.textContent = '1 book';
            } else {
                yearRecapNumBooks.textContent = `${numReadLastYear} books`;
            }
        }

        // Populate recent activity books
        // function populateRecentActivityBooks() {

        // }


        // Populate recent activity ratings/reviews
        function populateRecentActivityRatings() {
            const ratings = document.querySelectorAll('.recent-activity-book-rating');
            ratings.forEach(rating => {
                const greenStars = rating.querySelector('.mini-green-stars');
                let bookRating = 4.5;

                const greenStarsWidth = Math.floor(bookRating) / 5 * 100;
                greenStars.style.width = `${greenStarsWidth}%`;

                const remainder = bookRating - Math.floor(bookRating);
                if (remainder) {
                    const halfStar = rating.querySelector('.half-star');
                    halfStar.innerHTML = '<sup>1</sup>/<sub>2</sub>';
                }
                // avgRatingNumber.textContent = `${avgRating}%`;
                console.log(`Updated book rating to ${bookRating}`);
            });
        }

        // Add favorite
        const addFavoriteButtons = document.querySelectorAll('.add-favorite');
        const slider = document.querySelector('.slider');
        const wrap = document.querySelector('.wrap');
        addFavoriteButtons.forEach(addFavoriteButton => {
            addFavoriteButton.addEventListener('click', function(e) {
                console.log("add favorite button clicked");
                addFavorite(e.target, slider, wrap);
                e.stopPropagation();
            });
        });

        // after choosing book
        const favBtn = document.getElementById('fav-btn');
        favBtn.addEventListener('click', function() {
            console.log("added favorite book");
            populateFav(slider, wrap);
        });

        const favResults = document.querySelectorAll('.book');
        favResults.forEach(favResult => {
            favResult.addEventListener('click', function() {
                console.log("chose favorite book");
                populateFav(slider, wrap);
            });
        });

        // Add favorite
        function addFavorite(addFavoriteButton, slider, wrap) {
            slider.classList.toggle('close');
            wrap.style.height = '80dvh';
            wrap.style.overflow = 'hidden';

            const bookRow = document.querySelector('.book-row');
            const bookKey = 'East of Eden by John Steinbeck';
            const [bookTitle, bookAuthor] = bookKey.split(' by ');
            let underscoreBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
            let underscoreBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
            const thumbnailLink = thumbnailLinks[bookKey];

            const bookThumbnail = document.createElement('a');
            bookThumbnail.className = 'book-thumbnail';
            bookThumbnail.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;

            const thumbnail = document.createElement('img');
            thumbnail.classList.add('book-thumbnail-img');
            thumbnail.src = thumbnailLink;
            bookThumbnail.appendChild(thumbnail);
            addFavoriteButton.classList.add('hide');
            console.log("hid button");
            bookRow.insertBefore(bookThumbnail, addFavoriteButton);
            console.log("added book:", bookKey);
        }

        function populateFav(slider, wrap) {
            slider.classList.toggle('close');
            wrap.style.height = 'auto';
            wrap.style.overflow = 'visible';
        }

        function populateAllBooksHeader() {
            const rd = JSON.parse(localStorage.getItem('rd')) || {};
            const numRead = document.querySelector('.num-read');

            const currentYear = new Date().getFullYear();
            let numReadThisYear = 0;
            for (const bookKey in rd) {
                if (rd[bookKey].includes(currentYear)) {
                    numReadThisYear++;
                }
            }
            numRead.textContent = `${Object.keys(rd).length} / ${numReadThisYear} this year`;
        }

        function populateDiaryHeader() {
            const rd = JSON.parse(localStorage.getItem('rd')) || {};
            const numLogged = document.querySelector('.num-logged');

            const currentYear = new Date().getFullYear();
            let numLoggedThisYear = 0;
            for (const bookKey in rd) {
                if (rd[bookKey].includes(currentYear)) {
                    numLoggedThisYear++;
                }
            }
            numLogged.textContent = `${Object.keys(rd).length} / ${numLoggedThisYear} this year`;
        }
    }
});

function clearStorage() {
    localStorage.clear();
    window.location.reload();
}