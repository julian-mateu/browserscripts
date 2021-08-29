/**
 * Contains utility functions to automate clicks in the Facebook UI for the
 * {@link https://www.facebook.com/friends/list | FriendsList } by using query
 * selectors.
 * 
 * Note that the functions assume certain UI elements are present in the <code>document</code>, so 
 * timeouts are used to allow for loeading. This is very hacky.
 * 
 * Also note that there are assumptions over the names, classes and properties of UI elements, which are not
 * guaranteed to stay constant over time, so this might not work as is and might need some tunning.
 * 
 * @module RestrictFacebookFriends
 * @author Julian Mateu
 */

/**
 * Restricts all friends between start (inclusive) and end (exclusive).
 * Indices in the friendsList start from 3, because 0 to 2 inclusive are
 * other UI components. To be sure which ones to use it's recommended to run:
 * 
 * <pre><code>
 *     var friendsList = document.querySelectorAll('[aria-label="All Friends"]')[0]
 *         .getElementsByClassName("sxpk6l6v")[0];
 * </code></pre>
 * 
 * Then the index can be previewed by using <code>friendsList.childNodes[index]</code>
 * with different index values.
 * 
 * @param start start index (inclusive). The first friend in the list has index 3
 * @param end ed index (exclusive).
 */
function restrictFriendsFromTo(start, end) {
    const timeoutInterval = 5000;
    setTimeout(() => {
        if (start < end) {
            restrictFriendAtIndex(start);
            restrictFriendsFromTo(start + 1, end)
        }
    }, timeoutInterval);
}

/**
 * Restricts the friend at the given index, where the first friend in the list has index 3.
 * 
 * @param {number} index the index of the friend to restrict
 */
function restrictFriendAtIndex(index) {

    const timeoutInterval = 1000;

    selectFriendAtIndex(index);
    setTimeout(restrictSelectedFriend, timeoutInterval);
}

/**
 * Selects the friend at the given index by clicking it, where the first friend in the list has index 3.
 * 
 * @param {number} index the index of the friend to restrict
 */
function selectFriendAtIndex(index) {
    var friendsList = document.querySelectorAll('[aria-label="All Friends"]')[0]
        .getElementsByClassName("sxpk6l6v")[0];

    var friend = friendsList.childNodes[index];

    friend.childNodes[0]
        .click();
}

/**
 * Restricts the selected friend by cligking the correpsonding buttons, asuiming the detail page for that
 * friend is open.
 * 
 * @see {@linkcode selectFriendAtIndex}
 */
function restrictSelectedFriend() {
    toggleRestrictionForSelectedFriendIfCheckboxIs(false)
}

/**
 * Unrestricts the selected friend by cligking the correpsonding buttons, asuiming the detail page for that
 * friend is open.
 * 
 * @see {@linkcode selectFriendAtIndex}
 */
function unrestrictSelectedFriend() {
    toggleRestrictionForSelectedFriendIfCheckboxIs(true)
}

/**
 * Toggles the "restricted" status for the selected friend only if the "restricted" checkbox status is equal
 * to the given parameter. For example, if status is <code>true</code> the friend will be unrsetricted if it
 * was restricted, and no action will take place otherwise.
 * 
 * @param {boolean} status the desired status that the "restricted" checkbox needs to have for a toggle to
 * happen.
 */
function toggleRestrictionForSelectedFriendIfCheckboxIs(status) {
    const timeoutInterval = 1000;

    openFriendsMenuForSelectedFriend();
    setTimeout(() => selectEditFromMenuAndClickRestrictedIfCheckboxIs(status), timeoutInterval);
}

/**
 * Clicks on the "Friends" button for the selected profile, to open the corresponding menu.
 */
function openFriendsMenuForSelectedFriend() {
    document.querySelectorAll('div[aria-label="Friends"]')[0]
        .click();
}

/**
 * Assuming the "Friends" menu is already open, toggles the "restricted" status for the selected friend only
 * if the "restricted" checkbox status is equal to the given parameter. For example, if status is
 * <code>true</code> the friend will be unrsetricted if it was restricted, and no action will take place
 * otherwise.
 * 
 * @param {boolean} status the desired status that the "restricted" checkbox needs to have for a toggle to
 * happen.
 * @see {@linkcode openFriendsMenuForSelectedFriend}
 */
function selectEditFromMenuAndClickRestrictedIfCheckboxIs(status) {
    const timeoutInterval = 1000;
    selectEditFriendsListFromOpenMenu();
    setTimeout(() => clickRestrictedCheckboxifChequedIs(status), timeoutInterval);
}

/**
 * Opens the "Edit Friends List" by clicking on it, assuming the "Friends" menu is already open.
 * @see {@linkcode openFriendsMenuForSelectedFriend}
 */
function selectEditFriendsListFromOpenMenu() {
    var menu = document.querySelectorAll('[role="menu"]')[0];
    Array.from(menu.querySelectorAll('span'))
        .find(el => el.textContent === 'Edit Friend List')
        .click();
}

/**
 * Assuming the "Edit Friends List" menu is already open, toggles the "restricted" status for the selected
 * friend only if the "restricted" checkbox status is equal to the given parameter. For example, if status is
 * <code>true</code> the friend will be unrsetricted if it was restricted, and no action will take place
 * otherwise.
 * 
 * @param {boolean} status the desired status that the "restricted" checkbox needs to have for a toggle to
 * happen.
 * @see {@linkcode selectEditFriendsListFromOpenMenu}
 */
function clickRestrictedCheckboxifChequedIs(status) {
    var restrictedCheckbox = document.querySelectorAll('div[aria-label="Edit Friend List"]')[0]
        .childNodes[2].childNodes[1]
        .querySelector('input');
    if (restrictedCheckbox.checked === status) {
        restrictedCheckbox.click();
    }
}
