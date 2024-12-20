const API_URL = 'http://40.127.181.161/questboard';

async function loadSharedQuest() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareToken = urlParams.get('shareToken');
    
    if (!shareToken) {
        console.log('No share token found in URL');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/shared/${shareToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const quest = await response.json();
        console.log('Received quest data:', quest);
        updateQuestDisplay(quest);
    } catch (error) {
        console.error('Error loading shared quest:', error);
        showError(`Failed to load quest: ${error.message}`);
    }
}

function updateQuestDisplay(quest) {
    document.getElementById('quest-title').textContent = quest.title;
    document.getElementById('quest-description').textContent = quest.description;
    document.getElementById('quest-start').textContent = new Date(quest.startTime).toLocaleString();
    document.getElementById('quest-duration').textContent = quest.endTime ? 
        `Until ${new Date(quest.endTime).toLocaleString()}` : 'No end time set';
    
    // Hide edit/delete buttons for shared view
    document.getElementById('editQuestBtn').style.display = 'none';
    document.getElementById('deleteQuestBtn').style.display = 'none';
}

function showError(message) {
    const questDetails = document.querySelector('.quest-details');
    questDetails.innerHTML = `<div class="error-message">${message}</div>`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadSharedQuest);
