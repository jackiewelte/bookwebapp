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

                const bookItem = document.createElement('div');
                bookItem.className = 'book';

                bookItem.innerHTML = `
                    <a class="mini-book-thumbnail" href="https://openlibrary.org${workKey}" target="_blank">
                        <img src="${bookCover}" alt="Cover image of ${title}">
                    </a>
                    <div class="book-info">
                        <a class="book-title" href="https://openlibrary.org${workKey}" target="_blank">${title}</a>
                        <a class="author" href="https://openlibrary.org/authors/${book.author_key ? book.author_key[0] : ''}" target="_blank">by ${author}</a>
                    </div>
                `;

                results.appendChild(bookItem);
            }
        });
    }
});




// HOME -> BOOKS
// Populate average book rating
document.addEventListener("DOMContentLoaded", function() {
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
});

// Open (populate)/close book dropdown menu
document.addEventListener("DOMContentLoaded", function() {
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

            if (isValidShelfName(shelfName)) {
                if (isShelfNameUnique(shelfName)) {
                    addCustomShelf(shelfName);
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

function isShelfNameUnique(shelfName) {
    const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    return !customShelf.hasOwnProperty(shelfName);
}

function isValidShelfName(shelfName) {
    const validNamePattern = /^[a-zA-Z0-9\s]+$/;
    return validNamePattern.test(shelfName) && shelfName.trim().length > 0;
}

// Create new shelf
function addCustomShelf(shelfName) {
    const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    shelfName = shelfName.trim();

    if(!customShelf.hasOwnProperty(shelfName)) {
        customShelf[shelfName] = [];
        localStorage.setItem('customShelf', JSON.stringify(customShelf));
        console.log(`New shelf created: ${shelfName}`);

        // create shelf file in bookshelf dir with default heading content and book-page div
        // var f = new File([""], `bookshelf/${shelfName.replace(/\s+/g, '_')}.html`);
        // console.log(`New file ${f} created in ${dir}`);

    } else {
        console.warn(`Shelf "${shelfName}" already exists`);
    }
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

        const customShelfString = localStorage.getItem('customShelf');
        const customShelf = customShelfString ? JSON.parse(customShelfString) : {};

        // const bookElement = this.closest('.book');
        // const bookTitle = bookElement.getAttribute('data-title');
        // const bookAuthor = bookElement.getAttribute('data-author');
        const bookKey = `${bookTitle} by ${bookAuthor}`;

        if (!customShelf[shelfName]) {
            customShelf[shelfName] = [];
        }

        if (this.checked) {
            if (!customShelf[shelfName].includes(bookKey)) {
                customShelf[shelfName].push(bookKey);
                console.log(`Added to: ${shelfName}`);
            }
        } else {
            customShelf[shelfName] = customShelf[shelfName].filter(key => key !== bookKey);
        }
        localStorage.setItem('customShelf', JSON.stringify(customShelf));
    });
    shelfCheckboxes.appendChild(newShelfCheckbox);
    shelfCheckboxes.appendChild(newShelfLabel);
}

function updateAllDropdownMenus() {
    const dropdownMenus = document.querySelectorAll('.dropdown-content');
    const customShelfString = localStorage.getItem('customShelf');
    const customShelf = customShelfString ? JSON.parse(customShelfString) : {};

    dropdownMenus.forEach(dropdown => {
        for (const shelfName in customShelf) {
            updateDropdownMenu(shelfName, dropdown);
        }
    });
}

function addBooktoShelf(shelfName, bookKey) {
    let customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    console.log(`Adding book to shelf: ${shelfName}, book: ${bookKey}`);
    if (!customShelf[shelfName]) {
        customShelf[shelfName] = [];
    }
    if (!customShelf[shelfName].includes(bookKey)) {
        customShelf[shelfName].push(bookKey);
    }
    localStorage.setItem('customShelf', JSON.stringify(customShelf));
    console.log('Updated customShelf:', JSON.parse(localStorage.getItem('customShelf')));
}

function removeBookFromShelf(shelfName, bookKey) {
    let customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    console.log(`Removing book from shelf: ${shelfName}, book: ${bookKey}`);
    if (customShelf[shelfName]) {
        customShelf[shelfName] = customShelf[shelfName].filter(key => key !== bookKey);
        if (customShelf[shelfName].length === 0) {
            customShelf[shelfName] = [];
        }
    }
    localStorage.setItem('customShelf', JSON.stringify(customShelf));
    console.log('Updated customShelf:', JSON.parse(localStorage.getItem('customShelf')));
}

// Change book status/shelf labels
document.addEventListener("DOMContentLoaded", function() {
    const shelfCheckboxes = document.querySelector('.shelf-checkboxes');
    if (!shelfCheckboxes) {
        return;
    }
    shelfCheckboxes.innerHTML = '';

    console.log(localStorage.getItem('customShelf'));

    const predefinedStatuses = ['want-to-read', 'currently-reading', 'read'];
    const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};

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
    for (const [shelfName, books] of Object.entries(customShelf)) {
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
    }

    for (const shelfName in customShelf) {
        if (Array.isArray(customShelf[shelfName])) {
            customShelf[shelfName].forEach(bookKey => {
                const [bookTitle, bookAuthor] = bookKey.split(' by ');
                const bookElement = document.querySelector(`[data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
                if (bookElement) {
                    const miniCheckboxes = bookElement.querySelectorAll(`.mini-status-checkbox[data-status="${shelfName}"]`);
                    miniCheckboxes.forEach(miniCheckbox => {
                        miniCheckbox.checked = true;
                    });
                }
            });
        } else {
            console.error(`Expected an array for shelf "${shelfName}", but found:`, customShelf[shelfName]);
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
                label.textContent = 'Currently Reading';
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
            const numMembers = groupMembers.length.toLocaleString();

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

// MY BOOKS
document.addEventListener("DOMContentLoaded", function() {
    // Populate bookshelf thumbnails
    if (window.location.pathname.endsWith('my_books.html')) {
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};

        populateBookshelfThumbnails(wtr, 'wtr');
        populateBookshelfThumbnails(rd, 'rd');
        for (let shelfName in customShelf) {
            populateBookshelfThumbnails(customShelf[shelfName], shelfName);
            console.log("Populated thumbnail for: ", shelfName);
        }
        const emptyFooter = document.createElement('div');
        emptyFooter.className = 'empty-footer';
        const emptyFooterSpace = document.createElement('p');
        emptyFooterSpace.textContent = '';

        emptyFooter.appendChild(emptyFooterSpace);
        document.body.appendChild(emptyFooter);

        // Populate bookshelf thumbnails
        function populateBookshelfThumbnails(bookshelf, shelfName) {
            const thumbnailLinks = {
                "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
                "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
                "Sapiens: A Brief History of Humankind by Yuval Noah Harari": "https://m.media-amazon.com/images/I/716E6dQ4BXL._AC_UF1000,1000_QL80_.jpg",
                "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
                "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
                "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
                "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",
                "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
                "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
                "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
                "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg"
            };

            const topEmpty20Row = document.createElement('div');
            topEmpty20Row.className = 'empty-20-row';
            topEmpty20Row.textContent = '';

            const booksShelfName = document.createElement('div');
            let hyphenShelfName = shelfName.replace(/\s+/g, '-');
            booksShelfName.className = shelfName === 'wtr' ? 'books-want-to-read' : shelfName === 'rd' ? 'books-read' : `books-${hyphenShelfName}`;

            const currentOutHeader = document.createElement('div');
            currentOutHeader.className = 'current-out-header';

            const outHeaderTitle = document.createElement('p');
            outHeaderTitle.className = 'out-header-title';
            outHeaderTitle.textContent = shelfName === 'wtr' ? 'Want to Read' : shelfName === 'rd' ? 'Read' : shelfName;

            currentOutHeader.appendChild(outHeaderTitle);

            const showMore = document.createElement('a');
            showMore.className = 'show-more';
            let underscoreShelfName = shelfName.replace(/\s+/g, '_');
            showMore.href = shelfName === 'wtr' ? 'bookshelf/Want_to_Read.html' : shelfName === 'rd' ? 'bookshelf/Read.html' : `bookshelf/${underscoreShelfName}.html`;

            const numBooks = document.createElement('p');
            numBooks.className = 'num-books';

            showMore.appendChild(numBooks);

            const rightCaret = document.createElement('img');
            rightCaret.src = './right_caret_icon.svg';
            rightCaret.className = 'right-caret';

            showMore.appendChild(rightCaret);
            currentOutHeader.appendChild(showMore);
            booksShelfName.appendChild(currentOutHeader);

            const bookRow = document.createElement('div');
            bookRow.className = 'book-row';

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
                    thumbnail.src = thumbnailLink;
                    bookThumbnail.appendChild(thumbnail);
                    bookRow.appendChild(bookThumbnail);
                }
            }

            const bottomEmpty20Row = document.createElement('div');
            bottomEmpty20Row.className = 'empty-20-row';
            bottomEmpty20Row.textContent = '';

            const partialLinebreak = document.createElement('hr');
            partialLinebreak.className = 'partial-linebreak';
            partialLinebreak.textContent = '';

            document.body.appendChild(topEmpty20Row);
            document.body.appendChild(booksShelfName);
            document.body.appendChild(bookRow);
            document.body.appendChild(bottomEmpty20Row);
            document.body.appendChild(partialLinebreak);

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
    let max;
    if (window.location.pathname.endsWith('my_books.html')) {
        max = true;
    } else if (window.location.pathname.endsWith('Currently_Reading.html')) {
        max = false;
    }

    populateMiniNotifs(max);

    document.body.addEventListener('click', function(e) {
        populateMiniNotifs(max);
    });

    // Populate currently reading notifs
    function populateMiniNotifs(max) {
        const booksCurrentlyReading = document.querySelector('.books-currently-reading');
        if (!booksCurrentlyReading) {
            return;
        }

        const cr = JSON.parse(localStorage.getItem('cr')) || {};
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
        const booksCR = document.querySelector('.books-currently-reading');
        const booksWTR = document.querySelector('.books-want-to-read');
        const booksRD = document.querySelector('.books-read');

        if (max) {
            updateNumBooks(cr, booksCR, 'cr');
            updateNumBooks(wtr, booksWTR, 'wtr');
            updateNumBooks(rd, booksRD, 'rd');
            for (shelfName in customShelf) {
                let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                const booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                updateNumBooks(customShelf[shelfName], booksShelfName, shelfName);
            }
        }

        const maxMiniNotifs = 3;
        let existingMiniNotifs = booksCurrentlyReading.querySelectorAll('.mini-notifs').length;

        const thumbnailLinks = {
            "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
            "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
            "Sapiens: A Brief History of Humankind by Yuval Noah Harari": "https://m.media-amazon.com/images/I/716E6dQ4BXL._AC_UF1000,1000_QL80_.jpg",
            "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
            "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
            "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
            "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",
            "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
            "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
            "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
            "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg"
        };

        for (const bookKey in cr) {
            if (cr.hasOwnProperty(bookKey)) {
                console.log(bookKey, "in currently reading");

                if (max) {
                    if (existingMiniNotifs >= maxMiniNotifs) {
                        break;
                    }
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
                    booksCurrentlyReading.appendChild(miniNotif);

                    updateProgressBar(miniNotif, bookKey);

                    const empty20Row = document.createElement('div');
                    empty20Row.className = 'empty-20-row';

                    const empty20RowSpace = document.createElement('p');
                    empty20RowSpace.textContent = '';

                    empty20Row.appendChild(empty20RowSpace);
                    booksCurrentlyReading.appendChild(empty20Row);

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
            const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
            const booksCR = document.querySelector('.books-currently-reading');
            const booksWTR = document.querySelector('.books-want-to-read');
            const booksRD = document.querySelector('.books-read');

            updateNumBooks(cr, booksCR, 'cr');
            updateNumBooks(wtr, booksWTR, 'wtr');
            updateNumBooks(rd, booksRD, 'rd');
            for (shelfName in customShelf) {
                let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                const booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                updateNumBooks(customShelf[shelfName], booksShelfName, shelfName);
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
            checkbox.checked = true;
            removeMiniNotif();
            console.log("Removed mini notif 1: ", bookKey, miniNotif);
        }

        if (checkbox.checked) {
            delete cr[bookKey];
            console.log("Removed from currently reading dict");
            // Add group to RD dict
            rd[bookKey] = new Date().toISOString();
            // updateUIElements(bookKey, 'read', true, dotButton, label, labelCheck);
            alert('Finished: ' + bookKey + ' at ' + rd[bookKey]);
            console.log("rd: ", rd);
            removeMiniNotif();
            console.log("Removed mini notif 2");
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
                const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
                const booksCR = document.querySelector('.books-currently-reading');
                const booksWTR = document.querySelector('.books-want-to-read');
                const booksRD = document.querySelector('.books-read');

                updateNumBooks(cr, booksCR, 'cr');
                updateNumBooks(wtr, booksWTR, 'wtr');
                updateNumBooks(rd, booksRD, 'rd');
                for (shelfName in customShelf) {
                    let hyphenShelfName = shelfName.replace(/\s+/g, '-');
                    booksShelfName = document.querySelector(`.books-${hyphenShelfName}`);
                    updateNumBooks(customShelf[shelfName], booksShelfName, shelfName);
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

    if (loc.endsWith('Currently_Reading.html') || directoryName !== 'bookshelf') {
        return;
    }
    if (loc.endsWith('Want_to_Read.html')) {
        const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
        populateBookshelf(wtr, false);
        console.log("Populated wtr shelf");
    } else if (loc.endsWith('Read.html')) {
        const rd = JSON.parse(localStorage.getItem('rd')) || {};
        populateBookshelf(rd, true);
        console.log("Populated rd shelf");
    } else {
        const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
        let underscoreShelfName = shelfName.replace(/\s+/g, '_');

        for (shelfName in customShelf) {
            console.log("shelfName: ", shelfName);
            if (loc.endsWith(`${underscoreShelfName}.html`)) {
                populateBookshelf(customShelf[shelfName], false);
                console.log("Populated", shelfName);
            }
        }
    }

    // Populate bookshelf page
    function populateBookshelf(bookshelf, read) {
        const bookPage = document.querySelector('.book-page');
        const thumbnailLinks = {
            "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
            "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
            "Sapiens: A Brief History of Humankind by Yuval Noah Harari": "https://m.media-amazon.com/images/I/716E6dQ4BXL._AC_UF1000,1000_QL80_.jpg",
            "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
            "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
            "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
            "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",
            "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
            "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
            "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
            "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg"
        };

        for (const bookKey in bookshelf) {
            if (bookshelf.hasOwnProperty(bookKey)) {

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
                    thumbnail.src = thumbnailLink;
                    if (read) {
                        thumbnail.style.opacity = '30%';
                    }
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
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.endsWith('profile.html')) {
        let readingGoal = 20;
        populateReadingChallengeProgressHeader(readingGoal);
        populateYearRecapHeader();
        populateRecentActivityRatings();
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
        addFavoriteButtons.forEach(addFavoriteButton => {
            addFavoriteButton.addEventListener('click', function(e) {
                console.log("add favorite button clicked");
                addFavorite(e.target);
                e.stopPropagation();
            });
        });

        // Add favorite
        function addFavorite(addFavoriteButton) {
            const thumbnailLinks = {
                "Beach Read by Emily Henry": "https://m.media-amazon.com/images/I/71kdiN5Y1YL._AC_UF1000,1000_QL80_.jpg",
                "Remarkably Bright Creatures by Shelby Van Pelt": "https://m.media-amazon.com/images/I/81X7rAcaQkL._AC_UF1000,1000_QL80_.jpg",
                "Sapiens: A Brief History of Humankind by Yuval Noah Harari": "https://m.media-amazon.com/images/I/716E6dQ4BXL._AC_UF1000,1000_QL80_.jpg",
                "The Secret History by Donna Tartt": "https://m.media-amazon.com/images/I/71HcEbK3pEL._AC_UF1000,1000_QL80_.jpg",
                "Tomorrow and Tomorrow and Tomorrow by Gabrielle Zevin": "https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg",
                "Yellowface by R.F. Kuang": "https://m.media-amazon.com/images/I/61pZ0M900BL._AC_UF1000,1000_QL80_.jpg",
                "Normal People by Sally Rooney": "https://m.media-amazon.com/images/I/71fnqwR0eSL._AC_UF1000,1000_QL80_.jpg",
                "Alice's Adventures in Wonderland by Lewis Carroll": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1683467449i/83345.jpg",
                "The Hunger Games by Suzanne Collins": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327089453i/12885649.jpg",
                "Rebecca by Daphne du Maurier": "https://prodimage.images-bn.com/pimages/9780316575201_p0_v1_s1200x630.jpg",
                "The Hobbit by J.R.R. Tolkien": "https://m.media-amazon.com/images/I/A11+Gq4ebyL._AC_UF1000,1000_QL80_.jpg"
            };

            const bookRow = document.querySelector('.book-row');
            const bookKey = 'Yellowface by R.F. Kuang';
            const [bookTitle, bookAuthor] = bookKey.split(' by ');
            let underscoreBookTitle = bookTitle.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
            let underscoreBookAuthor = bookAuthor.replace(/[^a-zA-Z0-9\s']/g, '').replace(/'/g, '_').replace(/\s+/g, '_');
            const thumbnailLink = thumbnailLinks[bookKey];

            const bookThumbnail = document.createElement('a');
            bookThumbnail.className = 'book-thumbnail';
            bookThumbnail.href = `book/${underscoreBookTitle}_${underscoreBookAuthor}.html`;

            const thumbnail = document.createElement('img');
            thumbnail.src = thumbnailLink;
            bookThumbnail.appendChild(thumbnail);
            addFavoriteButton.classList.add('hide');
            console.log("hid button");
            bookRow.insertBefore(bookThumbnail, addFavoriteButton);
            console.log("added book:", bookKey);
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