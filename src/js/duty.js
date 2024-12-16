const jwt = localStorage.getItem('jwt');
const urlParams = new URLSearchParams(window.location.search);
const questId = urlParams.get('id');
const baseUrl = `http://localhost:8080/quest/${questId}/sub-quest/`;
let addPriceField;

async function loadDuties(subQuest, subQuestCard) {
    const duties = await getDuties(subQuest.id);
    displayDuties(duties, subQuestCard, subQuest);
}

async function getDuties(subQuestId) {
    try {
        const getDutiesUrl = baseUrl + subQuestId + '/duties';

        const response = await fetch(getDutiesUrl, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' :  `Bearer ${jwt}`
            }
        });
        return response.json();
    } catch (error) {
        console.error('Error getting quests: ', error);
    }
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

        const title = document.createElement('p');
        title.textContent = duty.title;

        const price = duty.price > 0
            ? Object.assign(document.createElement('p'), { textContent: `${duty.price} ,-` })
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
                
                <button class="close-button">Close</button>
                <button type="button" id="create-duty-button">Create Duty</button>
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
            appendNewDuty(subQuest.id, dutyData);
            dialog.remove();
        });

    }
}

function appendNewDuty(subQuestId, dutyData) {
    const subQuestCard = document.querySelector(`[data-sub-quest-id="${subQuestId}"]`);
    if (!subQuestCard) {
        console.error('Sub quest card not found for ID:', subQuestId);
        return;
    }

    const dutyCardWrapper = subQuestCard.querySelector('.duty-card-wrapper');
    if (!dutyCardWrapper) {
        console.error('Duty card wrapper not found for sub quest ID:', subQuestId);
        return;
    }

    // Create the new duty card
    const dutyCard = document.createElement('div');
    dutyCard.className = 'duty-card';
    dutyCard.dataset.dutyId = dutyData.id;

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'duty-title-wrapper';

    const title = document.createElement('p');
    title.textContent = dutyData.title;

    const price = dutyData.price > 0
        ? Object.assign(document.createElement('p'), { textContent: `${dutyData.price} ,-` })
        : null;

    titleWrapper.appendChild(title);
    if (price) titleWrapper.appendChild(price);
    dutyCard.appendChild(titleWrapper);

    // Append the new duty card to the wrapper
    dutyCardWrapper.appendChild(dutyCard);
}

function toggleAddPriceCheckbox(e) {
    addPriceField.style.display = e.target.checked ? 'block' : 'none';
}

async function addDuty(subQuest, dutyData) {
    try {
        const postDutyUrl = baseUrl + subQuest.id + '/duty';

        const response = await fetch(postDutyUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(dutyData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response error:', errorText);
            throw new Error(errorText || 'Failed to add duty');
        }
    } catch (error) {
        console.error('Error creating duty:', error);
    }
}

export {loadDuties, createAddDutyCard}