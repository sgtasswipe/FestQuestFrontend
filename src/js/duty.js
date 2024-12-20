import {BASE_URL, DELETE_METHOD, POST_METHOD, PUT_METHOD} from "./api/constants.js";
import {fetchAnyUrl} from "./api/apiservice.js";

const jwt = localStorage.getItem('jwt');
const urlParams = new URLSearchParams(window.location.search);
const questId = urlParams.get('id');
const BASE_REQUEST_MAPPING = `/quest/${questId}/sub-quest/`;
let addPriceField;

async function loadDuties(subQuest, subQuestCard) {
    const duties = await fetchAnyUrl(`${BASE_URL}${BASE_REQUEST_MAPPING}${subQuest.id}/duties`)
    displayDuties(duties, subQuestCard, subQuest);
}

function displayDuties(duties, subQuestCard, subQuest) {
    const dutyCardWrapper = document.createElement('div');
    dutyCardWrapper.className = 'duty-card-wrapper';

    duties.forEach(duty => {
        const dutyCard = document.createElement('div');
        dutyCard.className = 'duty-card';
        dutyCard.dataset.dutyId = duty.id;

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'duty-title-wrapper';
        titleWrapper.addEventListener('mouseenter', () => showDeleteButtonOnHover(subQuest.id, duty, titleWrapper, dutyCard));
        titleWrapper.addEventListener('mouseleave', () => hideDeleteButtonOnHover(titleWrapper));

        titleWrapper.addEventListener('mouseenter', () => showUpdateButtonOnHover(subQuest.id, duty, titleWrapper, dutyCard));
        titleWrapper.addEventListener('mouseleave', () => hideUpdateButtonOnHover(titleWrapper));

        const title = document.createElement('p');
        title.textContent = duty.title;

        const price = duty.price > 0
            ? Object.assign(document.createElement('p'), { textContent: `${duty.price} ,- 💸` })
            : null;

        titleWrapper.appendChild(title);
        if (price) titleWrapper.appendChild(price);
        dutyCard.appendChild(titleWrapper);
        dutyCardWrapper.appendChild(dutyCard);
    });

    subQuestCard.appendChild(dutyCardWrapper);
    subQuestCard.appendChild(createAddDutyCard(subQuest))

}

function createAddDutyCard(subQuest) {
    const addDutyCard = document.createElement('button');
    addDutyCard.id = 'addDutyBtn';
    addDutyCard.className = 'add-duty-card';
    addDutyCard.innerHTML = `Add Duty`

    addDutyCard.addEventListener('click', () => {
        showDutyDialog(subQuest);
    });

    return addDutyCard;
}

function showDutyDialog(subQuest) {
    const dialog = document.createElement('div');

    dialog.className = 'add-duty-dialog';

    const addPriceToggleHTML = subQuest.budget > 0
        ? `
            <div class="add-price-toggle">
                <label class="checkbox-label">
                    <input type="checkbox" id="show-add-price" /> Add Price
                </label>
            </div>
            
            <div id="add-price-field" style="display: none">
                <label for="price">Price</label>
                <input type="number" id="price" name="price" />
            </div>
        `
        : '';

    dialog.innerHTML = `
        <div class="new-duty-content">
            <form id="new-duty-form">
                <h3>Add Duty for ${subQuest.title}</h3>
                <label for="duty-title">Duty Title</label>
                <input type="text" id="duty-title" name="duty-title" required>
                
                ${addPriceToggleHTML}
                
                <button type="button" id="create-duty-button">Create Duty</button>
                <button class="close-button">Close</button>
            </form>
        </div>
    `;
    document.body.appendChild(dialog);

    /////////////////////////////////////////

    const createDutyButton = document.getElementById('create-duty-button');
    let showAddPrice = document.getElementById('show-add-price');
    const closeButton = dialog.querySelector('.close-button');
    addPriceField = document.getElementById('add-price-field');

    /////////////////////////////////////////

    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    if (showAddPrice) {
        showAddPrice.addEventListener('change', toggleAddPriceCheckbox)
    }

    if (createDutyButton) {
        createDutyButton.addEventListener('click', async () => {
            const dutyData = {
                title: document.getElementById('duty-title').value,
                price: showAddPrice && showAddPrice.checked ? `${document.getElementById('price').value}` : '0',
            };

            await addDuty(subQuest, dutyData);
            dialog.remove();
        });

    }
}

function toggleAddPriceCheckbox(e) {
    addPriceField.style.display = e.target.checked ? 'block' : 'none';
}
async function addDuty(subQuest, dutyData) {
    try {
        const postDutyUrl = `${BASE_URL}${BASE_REQUEST_MAPPING}${subQuest.id}/duty`;

        const response = await fetchAnyUrl(postDutyUrl, POST_METHOD, {body: JSON.stringify(dutyData)})

        // Append the new duty with the temporary ID to the UI
        appendNewDuty(subQuest, response.body);
        console.log('Contacted backend successfully: ', response.statusCode);
    } catch (error) {
        console.error('Error creating duty:', error);
    }
}

function updateDutyIdInUI(tempId, realId) {
    const tempDutyCard = document.querySelector(`[data-duty-id="${tempId}"]`);
    if (tempDutyCard) {
        tempDutyCard.dataset.dutyId = realId;
    }
}

function appendNewDuty(subQuest, dutyData) {
    const subQuestCard = document.querySelector(`[data-sub-quest-id="${subQuest.id}"]`);
    if (!subQuestCard) {
        console.error('Sub quest card not found for ID:', subQuest.id);
        return;
    }

    let dutyCardWrapper = subQuestCard.querySelector('.duty-card-wrapper');
    if (!dutyCardWrapper) {
        console.warn('Duty card wrapper not found, creating one.');
        dutyCardWrapper = document.createElement('div');
        dutyCardWrapper.className = 'duty-card-wrapper';
        subQuestCard.appendChild(dutyCardWrapper);
    }

    // Create the new duty card
    const dutyCard = document.createElement('div');
    dutyCard.className = 'duty-card';
    dutyCard.dataset.dutyId = dutyData.id;

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'duty-title-wrapper';
    titleWrapper.addEventListener('mouseenter', () => showDeleteButtonOnHover(subQuest.id, dutyData, titleWrapper, dutyCard));
    titleWrapper.addEventListener('mouseleave', () => hideDeleteButtonOnHover(titleWrapper));
    titleWrapper.addEventListener('mouseenter', () => showUpdateButtonOnHover(subQuest.id, dutyData, titleWrapper, dutyCard));
    titleWrapper.addEventListener('mouseleave', () => hideUpdateButtonOnHover(titleWrapper));

    const title = document.createElement('p');
    title.textContent = dutyData.title;

    const price = dutyData.price > 0
        ? Object.assign(document.createElement('p'), { textContent: `${dutyData.price} ,- 💸` })
        : null;

    titleWrapper.appendChild(title);
    if (price) titleWrapper.appendChild(price);
    dutyCard.appendChild(titleWrapper);

    dutyCardWrapper.appendChild(dutyCard);
}

function generateTemporaryId() {
    return `temp-${Date.now()}`;
}

function showDeleteButtonOnHover(subQuestId, duty, titleWrapper, dutyCard) {
    let deleteButton = titleWrapper.querySelector(".delete-button");
    if (!deleteButton) {
        deleteButton = document.createElement("button")
        deleteButton.className = "delete-button"
        deleteButton.style.background = "red"
        deleteButton.style.display = 'flex';
        deleteButton.innerHTML = "delete";
        deleteButton.position= "absolute"
        deleteButton.style.cursor = "pointer"
        deleteButton.style.top ="3px"
        deleteButton.style.right = "3px"
        titleWrapper.appendChild(deleteButton)
        deleteButton.onclick = () => deleteDuty(subQuestId, duty.id, dutyCard);
    }
}

function hideDeleteButtonOnHover(titleWrapper) {
    const deleteButton = titleWrapper.querySelector(".delete-button")
    titleWrapper.removeChild(deleteButton)
}

function showUpdateButtonOnHover(subQuestId, duty, titleWrapper, dutyCard){
    let updateButton = titleWrapper.querySelector(".update-button");
    if (!updateButton){
        updateButton = document.createElement("button")
        updateButton.className = "update-button"
        updateButton.style.background = "blue"
        updateButton.style.display = 'flex';
        updateButton.innerHTML = "update";
        updateButton.position= "absolute"
        updateButton.style.cursor = "pointer"
        updateButton.style.top ="15px"
        updateButton.style.right = "15px"
        titleWrapper.appendChild(updateButton)
        updateButton.onclick = () => showUpdateDialog(subQuestId, duty, dutyCard);
    }
}

function hideUpdateButtonOnHover(titleWrapper) {
    const updateButton = titleWrapper.querySelector(".update-button")
    titleWrapper.removeChild(updateButton)
}

function showUpdateDialog(subQuestId, duty, dutyCard) {
    const dialog = document.createElement('div');
    dialog.className = 'update-duty-dialog';
    dialog.innerHTML = `
        <div class="new-duty-content">
            <form id="update-duty-form">
                <h3>Update Duty</h3>

                <label for="update-duty-title">New Duty Title</label>
                <input type="text" id="update-duty-title" value="${duty.title}" required>

                <label for="update-duty-price">New Duty Price</label>
                <input type="number" id="update-duty-price" value="${duty.price}" required>

                <div class="button-group">
                    <button type="button" class="close-button">Close</button>
                    <button type="button" id="update-duty-button">Update Duty</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(dialog);

    const closeButton = dialog.querySelector('.close-button');
    const updateButton = dialog.querySelector('#update-duty-button');

    // Close dialog
    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    // Handle update logic
    updateButton.addEventListener('click', async () => {
        const updatedDuty = {
            ...duty,
            title: document.getElementById('update-duty-title').value,
            price: Number(document.getElementById('update-duty-price').value) // Collect updated price
        };

        try {
            // Call API to update the duty
            await updateDuty(subQuestId, updatedDuty);

            // Update the local UI
            updateDutyUI(dutyCard, updatedDuty);

            // Update the local `duty` object with new values
            duty.title = updatedDuty.title;
            duty.price = updatedDuty.price;

            dialog.remove();
        } catch (error) {
            console.error('Failed to update duty:', error);
            alert('Failed to update duty. Please try again.');
        }
    });
}

function updateDutyUI(dutyCard, updatedDuty) {
    const dutyCardElements = dutyCard.querySelectorAll('p')
    const titleElement = dutyCardElements[0];
    const priceElement = dutyCardElements[1];

    // Update title
    titleElement.textContent = updatedDuty.title;

    // Update or add price
    if (priceElement) {
        priceElement.textContent = `${updatedDuty.price} ,- 💸`;
    } else {
        const newPriceElement = document.createElement('p');
        newPriceElement.textContent = `${updatedDuty.price} ,- 💸`;
        dutyCard.querySelector('.duty-title-wrapper').appendChild(newPriceElement);
    }
}


async function deleteDuty(subQuestId, dutyId, dutyCard) {
    try {
        const deleteDutyUrl = `${BASE_URL}${BASE_REQUEST_MAPPING}${subQuestId}/duty/${dutyId}`;
        const response = await fetchAnyUrl(deleteDutyUrl, DELETE_METHOD);

        dutyCard.remove();
        console.log('Contacted backend successfully: ', response.statusCode);
    } catch (error) {
        console.error('Error deleting duty: ', error);
    }
}
async function updateDuty(subQuestId, updatedDuty) {
    try {
        const updateDutyUrl = `${BASE_URL}${BASE_REQUEST_MAPPING}${subQuestId}/duty/${updatedDuty.id}`;

        const response = await fetchAnyUrl(updateDutyUrl, PUT_METHOD, {body: JSON.stringify(updatedDuty)})


        console.log('Contacted backend successfully:', response.statusCode);
    } catch (error) {
        console.error('Error updating duty:', error);
    }
}

export {loadDuties, createAddDutyCard}