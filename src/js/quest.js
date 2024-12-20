// Variables - moved outside for global access
let showEndTimeCheckbox;
let editQuestId;
let endTimeFields;

document.addEventListener('DOMContentLoaded', async () => {
    const questForm = document.getElementById('newQuestForm');
    showEndTimeCheckbox = document.getElementById('showEndTime');
    const params = new URLSearchParams(window.location.search);
    editQuestId = params.get('edit');
    endTimeFields = document.getElementById('endTimeFields');

    if (questForm && showEndTimeCheckbox) {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('questStartDate').min = today;
        document.getElementById('questEndDate').min = today;
        document.getElementById('questStartDate').value = today;

        // Initial setup
        showEndTimeCheckbox.addEventListener('change', toggleEndTimeFields);

        if (editQuestId) {
            await loadQuestForEdit();
        }

        const createQuestButton = document.getElementById('createQuestButton');
        if (createQuestButton) {
            createQuestButton.addEventListener('click', handleCreateOrUpdateQuest);
        }
    }
});

// Functions - moved outside DOMContentLoaded
function toggleEndTimeFields(e) {
    endTimeFields.style.display = e.target.checked ? 'block' : 'none';
}

async function loadQuestForEdit() {
    const jwt = localStorage.getItem('jwt');
    try {
        const response = await fetch(`http://40.127.181.161/questboard/quest/${editQuestId}`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });
        const quest = await response.json();
        populateForm(quest);
        document.getElementById('createQuestButton').textContent = 'Update Quest';
    } catch (error) {
        console.error('Error loading quest for editing:', error);
    }
}

function populateForm(quest) {
    document.getElementById('questTitle').value = quest.title;
    document.getElementById('questDescription').value = quest.description;
    document.getElementById('questImageUrl').value = quest.imageUrl;
    
    const startDate = new Date(quest.startTime);
    document.getElementById('questStartDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('questStartTime').value = startDate.toTimeString().slice(0, 5);
    
    if (quest.endTime) {
        const endDate = new Date(quest.endTime);
        document.getElementById('showEndTime').checked = true;
        document.getElementById('endTimeFields').style.display = 'block';
        document.getElementById('questEndDate').value = endDate.toISOString().split('T')[0];
        document.getElementById('questEndTime').value = endDate.toTimeString().slice(0, 5);
    }
    
    // Update preview
    document.getElementById('previewTitle').textContent = quest.title;
    document.getElementById('selectedImagePreview').style.backgroundImage = `url(${quest.imageUrl})`;
    document.getElementById('changeImage').style.display = 'block';
}

async function handleCreateOrUpdateQuest(event) {
    event.preventDefault();
    const createQuestButton = document.getElementById('createQuestButton');
    createQuestButton.disabled = true;

    const questData = {
        title: document.getElementById('questTitle').value,
        description: document.getElementById('questDescription').value,
        imageUrl: document.getElementById('questImageUrl').value,
        startTime: `${document.getElementById('questStartDate').value}T${document.getElementById('questStartTime').value}:00`,
        endTime: showEndTimeCheckbox.checked 
            ? `${document.getElementById('questEndDate').value}T${document.getElementById('questEndTime').value}:00`
            : `${document.getElementById('questStartDate').value}T23:59:59`
    };

    try {
        const jwt = localStorage.getItem('jwt');
        const url = editQuestId
            ? `http://40.127.181.161/questboard/quest/${editQuestId}`
            : `http://40.127.181.161/questboard/quest`;

        const method = editQuestId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(questData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(errorText || 'Failed to create quest');
        }

        const result = await response.json();
        window.location.href = 'questboard.html';
        createQuestButton.disabled = false; 
    } catch (error) {
        console.error('Error creating quest:', error);
        createQuestButton.disabled = false; 
    }
}