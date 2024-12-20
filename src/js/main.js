// Variables
import UnsplashAPI from './Unsplashedapi.js';

document.addEventListener('DOMContentLoaded', async () => {

    const newQuestButton = document.querySelector('.btn-new-quest');
    const logoutButton = document.querySelector('.btn-logout');
    const shareButton = document.createElement('button');
    

    // Functions
    /**
     * Loads the quest board by fetching quests from the server.
     */
    async function loadQuestBoard() {
        const questGrid = document.querySelector('#quest-grid');
        
        // Show loading spinner with container
        if (questGrid) {
            questGrid.innerHTML = `
                <div class="spinner-container">
                    <div class="spinner" role="status" aria-label="Loading">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                </div>
            `;

            try {
                // Add a small delay to ensure spinner is visible
                await new Promise(resolve => setTimeout(resolve, 300));
                const quests = await fetchQuests();
                displayQuests(quests);
            } catch (error) {
                console.error('Error loading quests:', error);
                questGrid.innerHTML = '<p class="empty-state">Failed to load quests. Please try again later.</p>';
            }
        }
    }

    async function fetchQuests() {
        const jwt = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:8080/questboard/quests`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async function setupNewQuestPage() {
        const newQuestButton = document.querySelector('.btn-new-quest');
        if (newQuestButton) {
            newQuestButton.addEventListener('click', () => {
                window.location.href = 'newQuest.html';
            });
        }

        if (document.getElementById('searchButton')) {
            const unsplashAPI = new UnsplashAPI();
            const searchButton = document.getElementById('searchButton');
            const imageResults = document.getElementById('imageResults');
            const imageUrlInput = document.getElementById('questImageUrl');
            const preview = document.getElementById('selectedImagePreview');
            const changeImageBtn = document.getElementById('changeImage');
            const imageSelectionPanel = document.querySelector('.image-selection-panel');
            const previewTitle = document.getElementById('previewTitle');
            const previewDate = document.getElementById('previewDate');
            const titleInput = document.getElementById('questTitle');
            const dateInput = document.getElementById('questStartDate');
            const searchInput = document.getElementById('imageSearch');

            // Helper functions
            /**
             * Updates the preview title as the user types.
             */
            function updatePreviewTitle(e) {
                previewTitle.textContent = e.target.value || 'Quest Title';
            }

            /**
             * Updates the preview date as the user selects a date.
             */
            function updatePreviewDate(e) {
                previewDate.textContent = e.target.value || 'Date';
            }

            /**
             * Displays the image selection panel.
             */
            function showImageSelection() {
                imageSelectionPanel.style.display = 'block';
                changeImageBtn.style.display = 'none';
            }

            let searchTimeout;
            /**
             * Handles input in the search field with a debounce.
             */
            function handleSearchInput(e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length >= 2) {
                        searchButton.click();
                    }
                }, 500);
            }

            /**
             * Selects an image and updates the preview.
             */
            function selectImage(imageUrl) {
                imageUrlInput.value = imageUrl;
                preview.style.backgroundImage = `url(${imageUrl})`;
                imageSelectionPanel.style.display = 'none';
                changeImageBtn.style.display = 'block';
            }

            /**
             * Handles the search button click to fetch images.
             */
            async function handleSearch() {
                const query = searchInput.value;
                if (!query) return;

                const images = await unsplashAPI.searchImages(query);
                imageResults.innerHTML = '';

                images.forEach(image => {
                    const img = document.createElement('img');
                    img.src = image.urls.small;
                    img.addEventListener('click', () => selectImage(image.urls.regular));
                    imageResults.appendChild(img);
                });
            }

            // Event listeners
            titleInput.addEventListener('input', updatePreviewTitle);
            dateInput.addEventListener('input', updatePreviewDate);
            changeImageBtn.addEventListener('click', showImageSelection);
            searchInput.addEventListener('input', handleSearchInput);
            searchButton.addEventListener('click', handleSearch);
        }
    }

    // Create a share button for each quest
    function createQuestElement(quest) {
        // Create the Share button
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Share';
        shareButton.addEventListener('click', () => {
            shareQuest(quest.id);
        });
        
        questElement.appendChild(shareButton);
    }

    // Add the shareQuest function
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
            // Update the share link to use the correct path
            const shareLink = `${window.location.origin}/src/html/questDetails.html?shareToken=${data.shareToken}`;
            alert(`Share this link: ${shareLink}`);
        })
        .catch(error => {
            console.error('Error generating share token:', error);
        });
    }

    /**
     * Displays the fetched quests on the quest grid.
     */
    function displayQuests(quests) {
        const questGrid = document.querySelector('#quest-grid');
        if (!questGrid) return;

        questGrid.innerHTML = ''; // Clear existing content

        if (!quests || quests.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No quests available. Create a new quest to get started!';
            emptyState.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 1.2rem;
            margin: 2rem auto;
            background-color: #f5f5f5;
            border-radius: 8px;
            max-width: 80%;
            width: fit-content;
            `;
            questGrid.style.display = 'flex';
            questGrid.style.justifyContent = 'center';
            questGrid.style.alignItems = 'center';
            questGrid.appendChild(emptyState);
            return;
        }

        quests.forEach(quest => {
            const questCard = document.createElement('div');
            questCard.className = 'quest-card';
            questCard.dataset.questId = quest.id;
            questCard.style.cursor = 'pointer';
            questCard.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            questCard.style.borderRadius = '8px';
            questCard.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            questCard.style.transition = 'transform 0.2s ease-in-out';
            questCard.style.margin = '10px';
            questCard.style.padding = '15px';
            questCard.addEventListener('mouseenter', () => {
            questCard.style.transform = 'scale(1.02)';
            });
            questCard.addEventListener('mouseleave', () => {
            questCard.style.transform = 'scale(1)';
            });
            questCard.addEventListener('click', () => {
            window.location.href = `questDetails.html?id=${quest.id}`;
            });

            const image = document.createElement('img');
            image.src = quest.imageUrl;
            image.alt = quest.title;
            image.className = 'quest-image'; 
            image.style.borderRadius = '8px';

            const info = document.createElement('div');
            info.className = 'quest-info';

            const title = document.createElement('h3');
            title.textContent = quest.title;

            const description = document.createElement('p');
            description.textContent = quest.description;

            const dates = document.createElement('div');
            dates.className = 'quest-dates';

            const startTime = new Date(quest.startTime);
            const formattedStartDate = startTime.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            let timeDisplay = `<time>Starts: ${formattedStartDate}</time>`;
            if (quest.endTime) {
                const endTime = new Date(quest.endTime);
                const durationHours = Math.round((endTime - startTime) / (1000 * 60 * 60));
                timeDisplay += `<time>Duration: ${durationHours} hours</time>`;
            }

            dates.innerHTML = timeDisplay;

            info.appendChild(title);
            info.appendChild(description);
            info.appendChild(dates);
            questCard.appendChild(image);
            questCard.appendChild(info);
            questGrid.appendChild(questCard);
        });
    }

    // Event listeners and initial actions

    if (newQuestButton) {
        newQuestButton.addEventListener('click', () => {
            window.location.href = 'newQuest.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwt');
            window.location.href = 'index.html';
        });
    }

    if (window.location.pathname.endsWith('questboard.html') || window.location.pathname.endsWith('/')) {
        await loadQuestBoard();
    } else if (window.location.pathname.includes('newQuest.html')) {
        await setupNewQuestPage();
    }
});