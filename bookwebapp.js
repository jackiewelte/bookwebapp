// function myFunction(page) {
//     alert(page);
// }


// // Show and hide popup
// function getElementById(id) {
//     return document.getElementById(id);
// }

// function show(id) {
//     var element = getElementById(id);
//     if (element) {
//         // element.style.display = 'inline-block';
//         element.style.display = 'block';
//     }
// }

// function hide(id) {
//     var element = getElementById(id);
//     if (element) {
//         element.style.display = 'none';
//     }
// }



// close book dropdown menu
document.addEventListener("DOMContentLoaded", function() {
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');

    dropdownButtons.forEach(dropdownButton => {
        const dropdownElement = dropdownButton.closest('.dropdown');
        if (!dropdownElement) return;

        const dropdownContent = dropdownElement.querySelector('.dropdown-content');
        const dropdownOverlay = dropdownElement.querySelector('.dropdown-overlay');
        const showInputButton = dropdownElement.querySelector('.show-input-btn');
        const inputContainer = dropdownElement.querySelector('.input-container');
        const doneButton = dropdownElement.querySelector('.done-btn');

        if (!dropdownContent || !dropdownOverlay || !doneButton) return;

        dropdownButton.addEventListener('click', function(e) {
            console.log("Dropdown button clicked");
            dropdownContent.classList.toggle('show');
            // dropdownOverlay.classList.toggle('show');
            console.log("Dropdown content classes after toggle:", dropdownContent.classList);
            e.stopPropagation();
        });

        doneButton.addEventListener('click', function(e) {
            dropdownContent.classList.remove('show');
            
            if (showInputButton) {
                showInputButton.classList.remove('hide');
                console.log("Show default button");
                inputContainer.classList.remove('show');
                console.log("Hide name button");
            }

            // dropdownOverlay.classList.remove('show');
            e.stopPropagation();
            console.log("Clicked done button, hiding dropdown");
        });

        document.addEventListener('click', function(e) {
            if (dropdownContent && !e.target.closest('.dropdown-content') && !e.target.closest('.dropdown-btn')) {
                dropdownContent.classList.remove('show');

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

                    const dropdown = showInputButton.closest('.dropdown');
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

// create new shelf
function addCustomShelf(shelfName) {
    const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};
    shelfName = shelfName.trim();

    if(!customShelf.hasOwnProperty(shelfName)) {
        customShelf[shelfName] = [];
        localStorage.setItem('customShelf', JSON.stringify(customShelf));
        console.log(`New shelf created: ${shelfName}`);
    } else {
        console.warn(`Shelf "${shelfName}" already exists`);
    }
}

function updateDropdownMenu(shelfName, dropdown) {
    const shelfCheckboxes = dropdown.querySelector('.shelf-checkboxes');

    const newShelfCheckbox = document.createElement('input');
    const newShelfLabel = document.createElement('label');

    newShelfCheckbox.type = 'checkbox';
    newShelfCheckbox.className = 'mini-status-checkbox';
    newShelfCheckbox.id = `shelf-${shelfName.replace(/\s+/g, '-')}`;
    newShelfCheckbox.setAttribute('data-status', shelfName);

    newShelfLabel.htmlFor = newShelfCheckbox.id;
    newShelfLabel.className = 'mini-status-label';
    newShelfLabel.textContent = shelfName;

    newShelfCheckbox.addEventListener('change', function() {
        console.log(`Selected shelf: ${shelfName}`);

        const customShelfString = localStorage.getItem('customShelf');
        const customShelf = customShelfString ? JSON.parse(customShelfString) : {};

        const bookElement = this.closest('.book');
        const bookTitle = bookElement.getAttribute('data-title');
        const bookAuthor = bookElement.getAttribute('data-author');
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

// change book status/shelf labels
document.addEventListener("DOMContentLoaded", function() {
    const shelfCheckboxes = document.querySelector('.shelf-checkboxes');
    if (!shelfCheckboxes) {
        return;
    }
    shelfCheckboxes.innerHTML = '';

    console.log(localStorage.getItem('customShelf'));

    const predefinedStatuses = ['want-to-read', 'currently-reading', 'read'];
    const customShelf = JSON.parse(localStorage.getItem('customShelf')) || {};

    // add predefined statuses
    predefinedStatuses.forEach(status => {
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        const id = `shelf-${status}`;

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
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        const id = `shelf-${shelfName.replace(/\s+/g, '-')}`;

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
                const bookElement = document.querySelector(` [data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
                if (bookElement) {
                    const miniCheckboxes = bookElement.querySelectorAll(`.mini-status-checkbox[data-status="${shelfName}"]`);
                    miniCheckboxes.forEach(miniCheckbox => {
                        miniCheckbox.checked = true;
                    });

                    // const miniCheckbox = bookElement.querySelector(`.mini-status-checkbox[data-status="${shelfName}"]`);
                    // if (miniCheckbox) {
                    //     miniCheckbox.checked = true;
                    // }
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

    // alert('Checkboxes found: ' + checkboxes.length);

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
            // label.textContent = 'Want to Read';
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



// Edit progress



// Mark book finished and hide currently reading notif
document.addEventListener("DOMContentLoaded", function() {
    const miniNotifs = document.querySelectorAll('.mini-notif');
    // const checkboxes = document.querySelectorAll('.finished-checkbox');
    const cr = JSON.parse(localStorage.getItem('cr')) || {};
    const rd = JSON.parse(localStorage.getItem('rd')) || {};
    // alert('Checkboxes found: ' + checkboxes.length);

    miniNotifs.forEach(miniNotif => {
        const checkbox = miniNotif.querySelector('.finished-checkbox');
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

        checkbox.addEventListener('change', function() {
            console.log("clicked!!!!");
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
        });
    });

    function saveToLocalStorage() {
        localStorage.setItem('cr', JSON.stringify(cr));
        localStorage.setItem('rd', JSON.stringify(rd));
    }
});



// Show currently reading notifs
document.addEventListener("DOMContentLoaded", function() {
    const booksCurrentlyReading = document.querySelector('.books-currently-reading');
    if (!booksCurrentlyReading) {
        return;
    }
    const booksWantToRead = document.querySelector('.books-want-to-read');
    const booksRead = document.querySelector('.books-read');

    const cr = JSON.parse(localStorage.getItem('cr')) || {};
    const wtr = JSON.parse(localStorage.getItem('wtr')) || {};
    const rd = JSON.parse(localStorage.getItem('rd')) || {};

    const numCRBooks = booksCurrentlyReading.querySelector('.num-books');
    if (Object.keys(cr).length === 1) {
        numCRBooks.textContent = `${Object.keys(cr).length} book`;
    } else {
        numCRBooks.textContent = `${Object.keys(cr).length} books`;
    }

    const numWTRBooks = booksWantToRead.querySelector('.num-books');
    if (Object.keys(wtr).length === 1) {
        numWTRBooks.textContent = `${Object.keys(wtr).length} book`;
    } else {
        numWTRBooks.textContent = `${Object.keys(wtr).length} books`;
    }

    const numRDBooks = booksRead.querySelector('.num-books');
    numRDBooks.textContent = `${Object.keys(rd).length} / ${Object.keys(rd).length} this year`;

    maxMiniNotifs = 3;

    let existingMiniNotifs = booksCurrentlyReading.querySelectorAll('.mini-notifs').length;

    for (const bookKey in cr) {
        if (cr.hasOwnProperty(bookKey)) {
            console.log(bookKey, "in currently reading");

            if (existingMiniNotifs >= maxMiniNotifs) {
                break;
            }

            const [bookTitle, bookAuthor] = bookKey.split(' by ');
            const bookElement = document.querySelector(`.book[data-title="${bookTitle}"][data-author="${bookAuthor}"]`);
            console.log(bookElement);
            const thumbnailLink = 'https://m.media-amazon.com/images/I/91KugvH+FwL._AC_UF1000,1000_QL80_.jpg';

            if (!bookElement) {
                const miniNotif = document.createElement('div');
                miniNotif.className = 'mini-notif';

                const book = document.createElement('div');
                book.className = 'book';
                book.setAttribute('data-title', bookTitle);
                book.setAttribute('data-author', bookAuthor);

                const miniBookThumbnail = document.createElement('a');
                miniBookThumbnail.className = 'mini-book-thumbnail';
                miniBookThumbnail.href = `book/${bookTitle}.html`;

                const thumbnail = document.createElement('img');
                thumbnail.src = thumbnailLink;
                miniBookThumbnail.appendChild(thumbnail);

                book.appendChild(miniBookThumbnail);

                const bookInfo = document.createElement('div');
                bookInfo.className = 'book-info';

                const bookTitleContainer = document.createElement('a');
                bookTitleContainer.className = 'book-title';
                bookTitleContainer.href = `book/${bookTitle}.html`;
                bookTitleContainer.textContent = bookTitle;

                const bookAuthorContainer = document.createElement('a');
                bookAuthorContainer.className = 'author';
                bookAuthorContainer.href = `author/${bookAuthor}.html`;
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
                percentProgressContainer.textContent = `${cr[bookKey].percentProgress || 0}%`;

                const editProgressButton = document.createElement('button');
                editProgressButton.className = 'edit-progress-btn';
                editProgressButton.href = '#';

                const finishedButton = document.createElement('div');
                finishedButton.className = 'finished-btn';

                const finishedCheckbox = document.createElement('input');
                finishedCheckbox.type = 'checkbox';
                finishedCheckbox.className = 'finished-checkbox';
                finishedCheckbox.id = `finished-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;

                const finishedLabel = document.createElement('label');
                finishedLabel.htmlFor = `finished-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;
                finishedLabel.className = 'finished-label';

                finishedButton.appendChild(finishedCheckbox);
                finishedButton.appendChild(finishedLabel);

                progressBarContents.appendChild(progressBarBorder);
                progressBarContents.appendChild(percentProgressContainer);
                progressBarContents.appendChild(editProgressButton);
                progressBarContents.appendChild(finishedButton);
                bookInfo.appendChild(progressBarContents);

                const dropdownContent = document.createElement('div');
                dropdownContent.className = 'dropdown-content hidden';

                const amountReadUpdateButtons = document.createElement('div');
                amountReadUpdateButtons.className = 'amount-read-update-btns';

                const progressTextBox = document.createElement('div');
                progressTextBox.className = 'progress-text-box';

                const progressText = document.createElement('input');
                progressText.type = 'text';
                progressText.className = 'progress-text';

                progressTextBox.appendChild(progressText);
                amountReadUpdateButtons.appendChild(progressTextBox);

                const progressUnitButton = document.createElement('button');
                progressUnitButton.className = 'progress-unit-btn';
                progressUnitButton.href = '#';
                progressUnitButton.textContent = 'pages';

                amountReadUpdateButtons.appendChild(progressUnitButton);

                const pagePercentDropdown = document.createElement('div');
                pagePercentDropdown.className = 'dropdown-content hidden';

                const pagesButton = document.createElement('div');
                pagesButton.className = 'pages-btn';

                const pagesCheckbox = document.createElement('input');
                pagesCheckbox.type = 'checkbox';
                pagesCheckbox.className = 'pages-checkbox';
                pagesCheckbox.id = `pages-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;

                const pagesLabel = document.createElement('label');
                pagesLabel.htmlFor = `pages-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;
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
                percentCheckbox.id = `percent-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;

                const percentLabel = document.createElement('label');
                percentLabel.htmlFor = `percent-${bookTitle.replace(/\s+/g, '-')}-${bookAuthor.replace(/\s+/g, '-')}`;
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
                dropdownContent.appendChild(amountReadUpdateButtons);

                const progressNoteContainer = document.createElement('div');
                progressNoteContainer.className = 'progress-note-container';

                const progressNoteButton = document.createElement('a');
                progressNoteButton.className = 'progress-note-btn';
                progressNoteButton.href = 'write_progress_note.html';
                progressNoteButton.textContent = 'Add note/Edit date';
                
                progressNoteContainer.appendChild(progressNoteButton);
                dropdownContent.appendChild(progressNoteContainer);

                const cancelButtonContainer = document.createElement('div');
                cancelButtonContainer.className = 'cancel-btn-container';

                const cancelButton = document.createElement('button');
                cancelButton.className = 'cancel-btn';
                cancelButton.href = '#';

                cancelButtonContainer.appendChild(cancelButton);
                dropdownContent.appendChild(cancelButtonContainer);

                bookInfo.appendChild(dropdownContent);
                book.appendChild(bookInfo);
                miniNotif.appendChild(book);
                booksCurrentlyReading.appendChild(miniNotif);

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
});