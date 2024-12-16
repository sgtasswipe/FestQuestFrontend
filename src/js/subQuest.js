let addBudgetField;


function setupSubQuestBtn(quest) {
    const addSubQuestBtn = document.getElementById('addSubquestBtn');

    addSubQuestBtn.addEventListener('click', async ()=> {
        showSubQuestDialog();
    })
}


function showSubQuestDialog() {
    //let showAddBudgetCheckbox = document.getElementById('budget');

    const dialog = document.createElement('div');
    dialog.className = 'add-sub-quest-dialog';
    dialog.innerHTML = `
        <div class="new-sub-quest-content">
            <form id="new-sub-quest-form">
                <h3>Add Sub Quest</h3>
                <label for="Sub Quest Title">Sub Quest Title</label>
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
                <button type="button" id="create-sub-quest-button">Create Sub Quest</button>
                <button class="close-button">Close</button>
            </form>
        </div>
    `;
    document.body.appendChild(dialog);

    /////////////////////////////////////////

    const createQuestButton = document.getElementById('create-sub-quest-button');
    const closeButton = dialog.querySelector('.close-button');
    let showAddBudget = document.getElementById('show-add-budget');
    addBudgetField = document.getElementById('add-budget-field');

    /////////////////////////////////////////

    closeButton.addEventListener('click', () => {
        dialog.remove();
    });

    if (showAddBudget) {
        showAddBudget.addEventListener('change', toggleAddBudgetCheckbox)
    }

    if (createQuestButton) {
        createQuestButton.addEventListener('click', () => {
            const subQuestData = {
                title: document.getElementById('sub-quest-title').value,
                budget: showAddBudget.checked ? `${document.getElementById('budget').value}` : '0',
                dutyList: []
            };

            addSubQuest(subQuestData).then(r => console.log(subQuestData));
        });
    }

}

function toggleAddBudgetCheckbox(e) {
    addBudgetField.style.display = e.target.checked ? 'block' : 'none';
}

async function addSubQuest(subQuestData) {
    try {
        const jwt = localStorage.getItem('jwt');
        console.log(subQuestData)
        const urlParams = new URLSearchParams(window.location.search);
        const questId = urlParams.get('id');

        const url = `http://localhost:8080/quest/${questId}/sub-quest`;

        const response = await fetch(url, {
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
        } else {
            console.log('Subquest added successfully:', response.status);
        }

    } catch (error) {
        console.error('Error creating quest:', error);
    }
}


export {setupSubQuestBtn}