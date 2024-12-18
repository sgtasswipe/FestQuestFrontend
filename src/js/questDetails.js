// Variables
import {setupSubQuestBtn, loadSubQuests} from "./subQuest.js";

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const questId = params.get('id');
    const questDetails = document.querySelector('.quest-details'); // Changed from questContent

    const urlParams = new URLSearchParams(window.location.search);
    const shareToken = urlParams.get('shareToken');

    if (shareToken) {
        fetch(`http://localhost:8080/questboard/shared/${shareToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            displayQuestDetails(data);
        })
        .catch(error => {
            console.error('Error fetching quest:', error);
        });
    } else {
        if (!questId) {
            window.location.href = 'questboard.html';
            return;
        }

        // Show loading spinner
        if (questDetails) {
            const originalContent = questDetails.innerHTML;
            questDetails.innerHTML = `
                <div class="spinner-container">
                    <div class="spinner" role="status" aria-label="Loading">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                </div>
            `;

            try {
                const quest = await fetchQuestDetails(questId);
                // Restore the original structure and populate it
                questDetails.innerHTML = originalContent;
                await loadSubQuests();
                displayQuestDetails(quest);
                setupActionButtons(quest);
                setupSubQuestBtn();
            } catch (error) {
                console.error('Error loading quest details:', error);
                questDetails.innerHTML = '<p class="empty-state">Failed to load quest details. Please try again later.</p>';
            }
        }

        const addItemBtn = document.getElementById('addItemBtn');
        const newItemInput = document.getElementById('newItemInput');
        const checklistContainer = document.getElementById('checklistItems');

        function addChecklistItem(itemText, isNewItem = false) {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const text = document.createElement('span');
            text.textContent = itemText;
            
            li.appendChild(checkbox);
            li.appendChild(text);
            checklistContainer.appendChild(li);

            if (isNewItem) {
                saveChecklistItems();
            }
        }

        async function loadQuestDetails(questId) {
            const quest = await fetchQuestDetails(questId);
            if (quest.checklistItems) {
                quest.checklistItems.forEach(item => addChecklistItem(item));
            }
        }
    }
});

// Functions
/**
 * Fetches quest details from the server.
 * @param {string} questId - The ID of the quest.
 * @returns {Promise<Object>} - A promise that resolves to the quest details.
 */
async function fetchQuestDetails(questId) {
    const jwt = localStorage.getItem('jwt');
    const response = await fetch(`http://localhost:8080/questboard/quest/${questId}`, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Authorization' :  `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Displays the details of the quest on the page.
 * @param {Object} quest - The quest details.
 */
function displayQuestDetails(quest) {
    document.title = `${quest.title} - FestQuest`;
    document.getElementById('quest-image').src = quest.imageUrl;
    document.getElementById('quest-title').textContent = quest.title;
    document.getElementById('quest-description').textContent = quest.description;

    const startTime = new Date(quest.startTime);
    const formattedStartDate = startTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    document.getElementById('quest-start').textContent = `Starts: ${formattedStartDate}`;

    if (quest.endTime) {
        const endTime = new Date(quest.endTime);
        const durationHours = Math.round((endTime - startTime) / (1000 * 60 * 60));
        document.getElementById('quest-duration').textContent = `Duration: ${durationHours} hours`;
    }

    // Create the Share button
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share';
    shareButton.addEventListener('click', () => {
        shareQuest(quest.id);
    });

    // Append the Share button to the action buttons container
    const actionsContainer = document.getElementById('actionButtons');
    if (actionsContainer) {
        actionsContainer.appendChild(shareButton);
    }
}

/**
 * Sets up action buttons for editing and deleting the quest.
 * @param {Object} quest - The quest details.
 */
function setupActionButtons(quest) {
    const editBtn = document.getElementById('editQuestBtn');
    const deleteBtn = document.getElementById('deleteQuestBtn');


    editBtn.setAttribute('data-href', `newQuest.html?edit=${quest.id}`);
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = editBtn.getAttribute('data-href');
    });

    deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this quest?')) {
            try {
                const response = await fetch(`http://localhost:8080/questboard/quest/${quest.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                if (response.ok) {
                    // Redirect to the questboard page
                    window.location.href = 'questboard.html';
                } else {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Failed to delete quest');
                }
            } catch (error) {
                console.error('Error deleting quest:', error);
                alert('Failed to delete quest: ' + error.message);
            }
        }
    });
}

/**
 * Shows a custom modal dialog for sharing
 * @param {string} shareLink - The link to share
 */
function showShareDialog(shareLink) {
    const dialog = document.createElement('div');
    dialog.className = 'share-dialog';
    dialog.innerHTML = `
        <div class="share-content">
            <h3>Share Quest</h3>
            <p>Copy this link to share:</p>
            <input type="text" value="${shareLink}" readonly>
            <button class="copy-button">Copy Link</button>
            <button class="close-button">Close</button>
        </div>
    `;
    document.body.appendChild(dialog);

    const copyButton = dialog.querySelector('.copy-button');
    const closeButton = dialog.querySelector('.close-button');
    const input = dialog.querySelector('input');

    copyButton.addEventListener('click', () => {
        input.select();
        document.execCommand('copy');
    });

    closeButton.addEventListener('click', () => {
        dialog.remove();
    });
}

// Update the shareQuest function to use the custom dialog
function shareQuest(questId) {
    fetch(`http://localhost:8080/questboard/quest/${questId}/generateShareToken`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const shareLink = `${window.location.origin}/src/html/questDetails.html?shareToken=${data.shareToken}`;
        showShareDialog(shareLink);
    })
    .catch(error => {
        console.error('Error generating share token:', error);
    });
}