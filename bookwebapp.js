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
    const dropdown_buttons = document.querySelectorAll('.dropdown-btn');

    dropdown_buttons.forEach(dropdown_button => {
        const dropdownElement = dropdown_button.closest('.book');
        const dropdown_list = dropdownElement.querySelector('.dropdown-content');
        const done_button = dropdownElement.querySelector('.done-btn');

        dropdown_button.addEventListener('click', (e) => {
            dropdown_list.classList.toggle('hidden');
            e.stopPropagation();
        });

        done_button.addEventListener('click', (e) => {
            dropdown_list.classList.add('hidden');
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-content')) {
                dropdown_list.classList.add('hidden');
            }
        });
    });
});


// document.addEventListener("DOMContentLoaded", function() {
//     var book1 = document.getElementById('book1');
//     var want_to_read = document.querySelector('.want_to_read');
//     var clicked = document.querySelector('.clicked');

//     book1.addEventListener('click', function() {
//         if (book1.checked) {
//             want_to_read.style.opacity = 0;
//             clicked.style.opacity = 1;
//         } else {
//             want_to_read.style.opacity = 1;
//             clicked.style.opacity = 0;
//         }
//     });
// });


// function getDate() {
//     var today = new Date();
//     var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
//     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     var dateTime = date + ' ' + time;
//     document.getElementById("book1").value = dateTime;
//     return dateTime;
// }


// // Prevents page from scrolling to top after closing popup
// document.addEventListener("DOMContentLoaded", function() {
//     var escape_btns = document.querySelectorAll('.close');

//     escape_btns.forEach(function(escape_btn) {
//         escape_btn.addEventListener('click', function(event) {
//             event.preventDefault();
//         });
//     });
// });


// Add/remove book
document.addEventListener("DOMContentLoaded", function() {
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

        // ellipses dropdown button
        const dot_button = bookElement.querySelector('.dropdown-btn');

        // mini wtr, cr, and rd checkboxes
        const mini_checkboxes = bookElement.querySelectorAll('.mini-status-checkbox');

        // alert('wtr, cr, rd checkboxes found: ' + mini_checkboxes.length);


        // Set initial label based on stored data
        // Check if book already in WTR, CR, or RD dict
        if (wtr[bookKey]) {
            // label.textContent = 'Want to Read';
            label.className = 'status-label want-to-read';
            checkbox.checked = true;
            dot_button.classList.add('want-to-read');
        } else if (cr[bookKey]) {
            label.textContent = 'Currently Reading';
            label.className = 'status-label currently-reading';
            checkbox.checked = true;
            dot_button.classList.add('currently-reading');
        } else if (rd[bookKey]) {
            label.textContent = 'Read';
            label.className = 'status-label read';
            checkbox.checked = true;
            dot_button.classList.add('read');
        }


        mini_checkboxes.forEach(mini_checkbox => {
            const miniStatus = mini_checkbox.getAttribute('data-status');

            if (wtr[bookKey] && miniStatus === 'want-to-read') {
                mini_checkbox.checked = true;
            }
            // } else if (cr[bookKey] && miniStatus === 'currently-reading') {
            //     mini_checkbox.checked = true;
            // } else if (rd[bookKey] && miniStatus === 'read') {
            //     mini_checkbox.checked = true;
            // } else if (miniStatus === 'want-to-read' || miniStatus === 'currently-reading' || miniStatus === 'read') {
            //     mini_checkbox.checked = false;
            // }

            mini_checkbox.addEventListener('change', function() {
                const currentMiniStatus = this.getAttribute('data-status');

                if (currentMiniStatus === 'want-to-read' || currentMiniStatus === 'currently-reading' || currentMiniStatus === 'read') {
                // Uncheck other mini checkboxes if the currently checked mini checkbox is wtr, cr, or rd
                    mini_checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this && otherCheckbox.checked) {

                            const otherStatus = otherCheckbox.getAttribute('data-status');

                            // Remove status from dicts if unchecked
                            if (otherStatus === 'want-to-read' && wtr[bookKey]) {
                                delete wtr[bookKey];
                                dot_button.classList.remove('want-to-read');
                                otherCheckbox.checked = false;
                            } else if (otherStatus === 'currently-reading' && cr[bookKey]) {
                                delete cr[bookKey];
                                dot_button.classList.remove('currently-reading');
                                otherCheckbox.checked = false;
                            } else if (otherStatus === 'read' && rd[bookKey]) {
                                delete rd[bookKey];
                                dot_button.classList.remove('read');
                                otherCheckbox.checked = false;
                            }
                        }
                    });
                }

                // Update status for the currently checked mini checkbox
                if (this.checked) {
                    if (currentMiniStatus === 'want-to-read') {
                        wtr[bookKey] = new Date().toISOString();
                        label.textContent = 'Want to Read';
                        label.className = 'status-label want-to-read';
                        checkbox.checked = true;
                        dot_button.classList.add('want-to-read');
                    } else if (currentMiniStatus === 'currently-reading') {
                        cr[bookKey] = new Date().toISOString();
                        label.textContent = 'Currently Reading';
                        label.className = 'status-label currently-reading';
                        checkbox.checked = true;
                        dot_button.classList.add('currently-reading');
                    } else if (currentMiniStatus === 'read') {
                        rd[bookKey] = new Date().toISOString();
                        label.textContent = 'Read';
                        label.className = 'status-label read';
                        checkbox.checked = true;
                        dot_button.classList.add('read');
                    } else {
                        // this.push(bookKey);
                        // alert("need to add like a tag");
                    }

                    // alert("Added: " + bookKey + " at " + (currentMiniStatus === 'want-to-read' ? wtr[bookKey] : currentMiniStatus === 'currently-reading' ? cr[bookKey] : currentMiniStatus === 'read' ? rd[bookKey] : 0));

                } else if (currentMiniStatus === 'want-to-read' || currentMiniStatus === 'currently-reading' || currentMiniStatus === 'read') {
                    if (confirm("Are you sure you want to remove this book from your lists? Your reading history and any review will be deleted.")) {
                        delete wtr[bookKey];
                        delete cr[bookKey];
                        delete rd[bookKey];
    
                        label.textContent = 'Want to Read';
                        label.className = 'status-label';
                        dot_button.classList.remove('want-to-read', 'currently-reading', 'read');
    
                        // alert(label.textContent);
                        // alert(label.className);
                        // alert('Removed: ' + bookKey);
    
                    } else {
                        // label.textContent = 'Want to Read';
                        // label.className = 'status-label want-to-read';
                        checkbox.checked = true;
                        this.checked = true;
                    }
                }
                // } else {
                //     this.remove(bookKey);
                // }

                // Save updates to localStorage
                localStorage.setItem('wtr', JSON.stringify(wtr));
                localStorage.setItem('cr', JSON.stringify(cr));
                localStorage.setItem('rd', JSON.stringify(rd));

                // alert("Updated wtr: " + JSON.stringify(wtr));
                // alert("Updated cr: " + JSON.stringify(cr));
                // alert("Updated rd: " + JSON.stringify(rd));

            });
        });

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {

                // Add book to WTR dict
                wtr[bookKey] = new Date().toISOString();
                // label.textContent = 'Want to Read';
                label.className = 'status-label want-to-read';

                dot_button.classList.add('want-to-read');

                // alert('Added: ' + bookKey + ' at ' + wtr[bookKey]);

            // Remove book from WTR, CR, or RD dict if already in it
            } else {
                if (confirm("Are you sure you want to remove this book from your lists? Your reading history and any review will be deleted.")) {
                    delete wtr[bookKey];
                    delete cr[bookKey];
                    delete rd[bookKey];

                    label.textContent = 'Want to Read';
                    label.className = 'status-label';
                    dot_button.classList.remove('want-to-read', 'currently-reading', 'read');

                    // alert(label.textContent);
                    // alert(label.className);
                    // alert('Removed: ' + bookKey);

                } else {
                    // label.textContent = 'Want to Read';
                    // label.className = 'status-label want-to-read';
                    checkbox.checked = true;
                }
            }
            localStorage.setItem('wtr', JSON.stringify(wtr));
            localStorage.setItem('cr', JSON.stringify(cr));
            localStorage.setItem('rd', JSON.stringify(rd));

            // alert('Updated wtr: ' + JSON.stringify(wtr));
            // alert('Updated cr: ' + JSON.stringify(cr));
            // alert('Updated rd: ' + JSON.stringify(rd));
        });
    });
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













// // Preserves scroll position when navigating back to page
// document.addEventListener('DOMContentLoaded', function() {
//     var scrollPosition = sessionStorage.getItem('scrollPosition');
//     if (scrollPosition) {
//         window.scrollTo(0, parseInt(scrollPosition, 10));
//     }
//     window.addEventListener('beforeunload', function() {
//         sessionStorage.setItem('scrollPosition', window.scrollY);
//     });
// });


// // Other way
// const recordVerticalOffset = () => {
//     sessionStorage.setItem('pageVerticalPosition', window.scrollY);
// }

// const throttleScroll = (delay) => {
//     let lastCall = 0;
//     return () => {
//         const now = Date.now();
//         if (now - lastCall >= delay) {
//             lastCall = now;
//             recordVerticalOffset();
//         }
//     };
// }

// window.addEventListener('scroll', throttleScroll(1000));

// const repositionPage = () => {
//     let pageVerticalPosition = sessionStorage.getItem('pageVerticalPosition');
//     if (pageVerticalPosition) {
//         window.scrollTo(0, parseInt(pageVerticalPosition, 10));
//     }
// }

// window.addEventListener('load', repositionPage);


// function submitButton() {
//     const mbtiType = {'INFP': 0,'ENFJ': 0, 'ESTP': 0}
//     try {
//         const question1response=document.querySelector('input[name="free_time"]:checked');
//         mbtiType[question1response.value] += 1;
//         const question2response=document.querySelector('input[name="bye"]:checked');
//         mbtiType[question2response.value] += 1;
//         const question3response=document.querySelector('input[name="bye1"]:checked');
//         mbtiType[question3response.value] += 1;
//     } catch (e) {
//         alert("answer all the questions OR ELSE!");
//         return;
//     }
//     alert("Successfully submitted!");
//     alert("Your personality type is: " + findMax(mbtiType));
// }

// addEventListener("submit",
// (event) => {
//     alert("You submitted!)")
// });