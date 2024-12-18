import {loadDuties, createAddDutyCard} from "./duty.js";

const jwt = localStorage.getItem('jwt');
const urlParams = new URLSearchParams(window.location.search);
const questId = urlParams.get('id');
const baseUrl = `http://localhost:8080/quest/${questId}`;
let addBudgetField;
let subQuestCard = document.createElement('div');

function setupSubQuestBtn() {
    const addSubQuestBtn = document.getElementById('addSubquestBtn');

    addSubQuestBtn.addEventListener('click', async ()=> {
        showSubQuestDialog();
    })
}

// hover functions //
function showDeleteButtonOnHover(subQuest, titleWrapper, subQuestCard) {
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
        deleteButton.onclick = () => deleteSubQuest(subQuest.id, subQuestCard);
    }
}

function hideDeleteButtonOnHover(titleWrapper) {
    const deleteButton = titleWrapper.querySelector(".delete-button")
    titleWrapper.removeChild(deleteButton)
}
function showUpdateButtonOnHover(subQuest, titleWrapper, subQuestCard){
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
        updateButton.onclick = () => showUpdateDialog(subQuest, subQuestCard);
    }
}

function hideUpdateButtonOnHover(titleWrapper) {
    const updateButton = titleWrapper.querySelector(".update-button")
    titleWrapper.removeChild(updateButton)
}

function showUpdateDialog(subQuest, subQuestCard) {
    const dialog = document.createElement('div');
    dialog.className = 'update-sub-quest-dialog';

    const addBudgetToggleHTML = `
        <div class="add-price-toggle">
            <label class="checkbox-label">
                <input type="checkbox" id="show-add-budget" /> Add Budget
            </label>
        </div>
        <div id="add-budget-field" style="display: none;">
            <label for="budget">Budget</label>
            <input type="number" id="budget" name="budget" min="0" />
        </div>
    `;

    dialog.innerHTML = `
        <div class="update-sub-quest-content">
            <form id="update-sub-quest-form">
                <h3>Update Sub Quest</h3>
                <label for="update-sub-quest-title">Sub Quest Title</label>
                <input type="text" id="update-sub-quest-title" value="${subQuest.title}" required>

                ${addBudgetToggleHTML}

                <div class="button-group">
                    <button type="button" class="close-button">Close</button>
                    <button type="button" id="update-sub-quest-button">Update Sub Quest</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(dialog);

    const closeButton = dialog.querySelector('.close-button');
    const updateButton = dialog.querySelector('#update-sub-quest-button');
    const showAddBudget = document.getElementById('show-add-budget');
    const addBudgetField = document.getElementById('add-budget-field');
    const budgetInput = document.getElementById('budget');

    // Show or hide the budget input field based on checkbox state
    showAddBudget.addEventListener('change', (e) => {
        addBudgetField.style.display = e.target.checked ? 'block' : 'none';
    });

    // Close dialog
    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    // Update button logic
    updateButton.addEventListener('click', async () => {
        const updatedSubQuest = {
            ...subQuest,
            title: document.getElementById('update-sub-quest-title').value,
            budget: showAddBudget.checked ? parseInt(budgetInput.value, 10) || 0 : subQuest.budget // Conditionally get the budget
        };

        try {
            await updateSubQuest(updatedSubQuest);
            updateSubQuestUI(subQuestCard, updatedSubQuest);
            dialog.remove();
        } catch (error) {
            console.error('Failed to update sub quest:', error);
            alert('Failed to update sub quest. Please try again.');
        }
    });
}

function updateSubQuestUI(subQuestCard, updatedSubQuest) {
    const titleElement = subQuestCard.querySelector('h3');
    const budgetElement = subQuestCard.querySelector('p');

    titleElement.textContent = updatedSubQuest.title;

    if (budgetElement) {
        budgetElement.textContent = `Budget: ${updatedSubQuest.budget} ,- 💰`;
    } else {
        const newBudgetElement = document.createElement('p');
        newBudgetElement.textContent = `Budget: ${updatedSubQuest.budget} ,- 💰`;
        subQuestCard.querySelector('.sub-quest-title-wrapper').appendChild(newBudgetElement);
    }
}

function showSubQuestDialog() {
    const dialog = document.createElement('div');

    dialog.className = 'add-sub-quest-dialog';
    dialog.innerHTML =`
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
        </div>`;
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
                budget: showAddBudget.checked ? `${document.getElementById('budget').value}` : '0',
                dutyList: [] // Optional, if duties are relevant
            };

            await addSubQuest(subQuestData); // Update UI dynamically
            dialog.remove();
        });
    }
}

function toggleAddBudgetCheckbox(e) {
    const addBudgetField = document.getElementById('add-budget-field');
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

        console.log('Contacted sub quest backend: ', response.status);

        // Use subQuestData to update the UI directly
        appendNewSubQuest({ ...subQuestData, id: generateTemporaryId() });
    } catch (error) {
        console.error('Error creating sub quest:', error);
    }
}

async function deleteSubQuest(subQuestId, subQuestCard) {
    try {
        const deleteSubQuestUrl = baseUrl + '/sub-quest/' + subQuestId;
        const response = await fetch(deleteSubQuestUrl, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });
        subQuestCard.remove();
        console.log('Sub quest deleted successfully:', response.status);
    } catch (error) {
        console.error('Error deleting sub quest: ', error);
    }
}

async function updateSubQuest(updatedSubQuest) {
    try {
        const deleteSubQuestUrl = baseUrl + '/sub-quest/' + updatedSubQuest.id;
        const response = await fetch(deleteSubQuestUrl, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(updatedSubQuest)
        });
        console.log('Sub quest updated successfully:', response.status);
    } catch (error) {
        console.error('Error updating sub quest: ', error);
    }
}

function appendNewSubQuest(subQuest) {
    const subQuestGrid = document.querySelector('#sub-quest-grid');
    if (!subQuestGrid) return;

    // Remove "empty state" message if present
    const emptyState = subQuestGrid.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    // Create the new subquest card
    subQuestCard = document.createElement('div');
    subQuestCard.className = 'sub-quest-card';
    subQuestCard.dataset.subQuestId = subQuest.id;

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'sub-quest-title-wrapper';
    titleWrapper.addEventListener("mouseenter", () => showDeleteButtonOnHover(subQuest, titleWrapper, subQuestCard))
    titleWrapper.addEventListener("mouseleave",  () => hideDeleteButtonOnHover(titleWrapper))

    titleWrapper.addEventListener("mouseenter", () => showUpdateButtonOnHover(subQuest, titleWrapper, subQuestCard))
    titleWrapper.addEventListener("mouseleave",  () => hideUpdateButtonOnHover(titleWrapper))


    const title = document.createElement('h3');
    title.textContent = subQuest.title;

    let budget = subQuest.budget > 0
        ? Object.assign(document.createElement('p'), { textContent: `Budget: ${subQuest.budget} ,- 💰`})
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


    console.log(`Subquest ${subQuest.title} added to the UI with an "Add Duty" button.`);
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
        titleWrapper.addEventListener("mouseenter", () => showDeleteButtonOnHover(subQuest, titleWrapper, subQuestCard))
        titleWrapper.addEventListener("mouseleave",  () => hideDeleteButtonOnHover(titleWrapper))

        titleWrapper.addEventListener("mouseenter", () => showUpdateButtonOnHover(subQuest, titleWrapper, subQuestCard))
        titleWrapper.addEventListener("mouseleave",  () => hideUpdateButtonOnHover(titleWrapper))

        const title = document.createElement('h3');
        title.textContent = subQuest.title;

        const budget = subQuest.budget > 0
            ? Object.assign(document.createElement('p'), { textContent: `Budget: ${subQuest.budget} ,- 💰` })
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

async function calculateBudget(subQuest) {
    const duties = await loadDuties(subQuest);
    return duties.reduce((sum, duty) => sum + duty.cost, 0);
}

export {setupSubQuestBtn, loadSubQuests}