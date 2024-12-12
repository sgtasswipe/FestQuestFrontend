// Variables
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const questId = params.get('id');
    const questDetails = document.querySelector('.quest-details'); // Changed from questContent

    if (!questId) {
        window.location.href = 'index.html';
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
            displayQuestDetails(quest);
            setupActionButtons(quest);
        } catch (error) {
            console.error('Error loading quest details:', error);
            questDetails.innerHTML = '<p class="empty-state">Failed to load quest details. Please try again later.</p>';
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
}

/**
 * Sets up action buttons for editing and deleting the quest.
 * @param {Object} quest - The quest details.
 */
function setupActionButtons(quest) {
    const editBtn = document.getElementById('editQuestBtn');
    const deleteBtn = document.getElementById('deleteQuestBtn');

    editBtn.addEventListener('click', () => {
        window.location.href = `newQuest.html?edit=${quest.id}`;
    });

    deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this quest?')) {
            try {
                const response = await fetch(`http://localhost:8080/questboard/quest/${quest.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    window.location.href = 'index.html';
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