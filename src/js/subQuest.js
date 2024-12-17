import {loadDuties, createAddDutyCard} from "./duty.js";

const jwt = localStorage.getItem('jwt');
const urlParams = new URLSearchParams(window.location.search);
const questId = urlParams.get('id');
const baseUrl = `http://localhost:8080/quest/${questId}`;
let addBudgetField;

function setupSubQuestBtn() {
    const addSubQuestBtn = document.getElementById('addSubquestBtn');

    addSubQuestBtn.addEventListener('click', async ()=> {
        showSubQuestDialog();
    })
}


function showSubQuestDialog() {
    const dialog = document.createElement('div');

    dialog.className = 'add-sub-quest-dialog';
    dialog.innerHTML = `
        <div class="new-sub-quest-content">
            <form id="new-sub-quest-form">
                <h3>Add Sub Quest</h3>
                <label for="sub-quest-title">Sub Quest Title</label>
                <input type="text" id="sub-quest-title" name="sub-quest-title" required>
                
                <div class="add-budget-toggle">
                    <label class="checkbox-label">
                        <input type="checkbox" id="show-add-budget" /> Add Budget
                    </label>
                </div>
                
                <div id="add-budget-field" style="display: none">
                    <label for="budget">Budget</label>
                    <input type="number" id="budget" name="budget" />
                </div>
                <button class="close-button">Close</button>
                <button type="button" id="create-sub-quest-button">Create Sub Quest</button>
            </form>
        </div>
    `;
    document.body.appendChild(dialog);

    /////////////////////////////////////////

    const createQuestButton = document.getElementById('create-sub-quest-button');
    let showAddBudget = document.getElementById('show-add-budget');
    const closeButton = dialog.querySelector('.close-button');
    addBudgetField = document.getElementById('add-budget-field');

    /////////////////////////////////////////

    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    if (showAddBudget) {
        showAddBudget.addEventListener('change', toggleAddBudgetCheckbox)
    }

    if (createQuestButton) {
        createQuestButton.addEventListener('click', async () => {
            const subQuestData = {
                title: document.getElementById('sub-quest-title').value,
                budget: 0,
                dutyList: [] // Optional, if duties are relevant
            };

            await addSubQuest(subQuestData); // Update UI dynamically
            dialog.remove();
        });
    }
}

function toggleAddBudgetCheckbox(e) {
    addBudgetField.style.display = e.target.checked ? 'block' : 'none';
}

async function addSubQuest(subQuestData) {
    try {
        const postQuestUrl = baseUrl + '/sub-quest';

        const response = await fetch(postQuestUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(subQuestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response error:', errorText);
            throw new Error(errorText || 'Failed to add subquest');
        }

        console.log('Subquest added successfully:', response.status);

        // Use subQuestData to update the UI directly
        appendNewSubQuest({ ...subQuestData, id: generateTemporaryId() });
    } catch (error) {
        console.error('Error creating sub quest:', error);
    }
}

function appendNewSubQuest(subQuest) {
    const subQuestGrid = document.querySelector('#sub-quest-grid');
    if (!subQuestGrid) return;

    // Remove "empty state" message if present
    const emptyState = subQuestGrid.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    debugger
    // Create the new subquest card
    const subQuestCard = document.createElement('div');
    subQuestCard.className = 'sub-quest-card';
    subQuestCard.dataset.subQuestId = subQuest.id;

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'sub-quest-title-wrapper';

    const title = document.createElement('h3');
    title.textContent = subQuest.title;

    const budget = subQuest.budget > 0
        ? Object.assign(document.createElement('p'), { textContent: `Budget: ${subQuest.budget} ,-` })
        : null;

    titleWrapper.appendChild(title);
    if (budget) titleWrapper.appendChild(budget);
    subQuestCard.appendChild(titleWrapper);

    const dutyCardWrapper = document.createElement('div');
    dutyCardWrapper.className = 'duty-card-wrapper';
    subQuestCard.appendChild(dutyCardWrapper);

    // Add the "Add Duty" button using the createAddDutyCard function from the duty script
    const addDutyCard = createAddDutyCard(subQuest);
    subQuestCard.appendChild(addDutyCard);

    // Append the new subquest card to the grid
    subQuestGrid.appendChild(subQuestCard);

    console.log(`Subquest "${subQuest.title}" added to the UI with an "Add Duty" button.`);
}


function generateTemporaryId() {
    return `temp-${Date.now()}`;
}

async function getSubQuests() {
    try {
        const getQuestsUrl = baseUrl + '/sub-quests';

        const response = await fetch(getQuestsUrl, {
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

async function displaySubQuests(subQuests) {
    const subQuestGrid = document.querySelector('#sub-quest-grid');
    if (!subQuestGrid) return;

    subQuestGrid.innerHTML = ''; // Clear existing content

    if (!subQuests || subQuests.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No sub quests available. Create a new sub quest to get started!';
        subQuestGrid.appendChild(emptyState);
        return;
    }

    const promises = subQuests.map(subQuest => {
        const subQuestCard = document.createElement('div');
        subQuestCard.className = 'sub-quest-card';
        subQuestCard.dataset.subQuestId = subQuest.id;

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'sub-quest-title-wrapper';

        const title = document.createElement('h3');
        title.textContent = subQuest.title;

        const budget = subQuest.budget > 0
            ? Object.assign(document.createElement('p'), { textContent: `Budget: ${subQuest.budget} ,-` })
            : null;

        titleWrapper.appendChild(title);
        if (budget) titleWrapper.appendChild(budget);
        subQuestCard.appendChild(titleWrapper);
        subQuestGrid.appendChild(subQuestCard);
        return loadDuties(subQuest, subQuestCard);
    });

    await Promise.all(promises);
}

async function loadSubQuests() {
    const subQuestGrid = document.querySelector('#sub-quest-grid');

    if (subQuestGrid) {
        subQuestGrid.innerHTML = `
                <div class="spinner-container">
                    <div class="spinner" role="status" aria-label="Loading">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                </div>
            `;

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const subQuests = await getSubQuests();
            await displaySubQuests(subQuests);
        } catch (error) {
            console.error('Error loading quests:', error);
            subQuestGrid.innerHTML = '<p class="empty-state">Failed to load sub quests. Please try again later.</p>';
        }
    }
}

export {setupSubQuestBtn, loadSubQuests}