import UnsplashAPI from './Unsplashedapi.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('FestQuest Frontend Loaded');
    
    // Setup new quest button regardless of page
    const newQuestButton = document.querySelector('.btn-new-quest');
    if (newQuestButton) {
        console.log('New Quest button found');
        newQuestButton.addEventListener('click', () => {
            window.location.href = 'newQuest.html';
        });
    }

    // Load quests if we're on the index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        console.log('Loading quest board...');
        await loadQuestBoard();
    } else if (window.location.pathname.includes('newQuest.html')) {
        console.log('Setting up new quest page...');
        await setupNewQuestPage();
    }
});

async function loadQuestBoard() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.log('No userId found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    try {
        const quests = await fetchQuests(userId);
        console.log('Fetched quests:', quests);
        const questGrid = document.querySelector('#quest-grid');
        
        if (!questGrid) {
            console.error('Quest grid not found in DOM');
            return;
        }
        
        if (!quests || quests.length === 0) {
            questGrid.innerHTML = '<p class="empty-state">No quests available. Create a new quest to get started!</p>';
            return;
        }

        questGrid.innerHTML = quests.map(quest => `
            <div class="quest-card" data-quest-id="${quest.id}">
                <img src="${quest.imageUrl}" alt="${quest.title}" class="quest-image">
                <div class="quest-info">
                    <h3>${quest.title}</h3>
                    <p>${quest.description}</p>
                    <div class="quest-dates">
                        <time>Starts: ${new Date(quest.startTime).toLocaleString()}</time>
                        <time>Ends: ${new Date(quest.endTime).toLocaleString()}</time>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading quests:', error);
        const questGrid = document.querySelector('#quest-grid');
        if (questGrid) {
            questGrid.innerHTML = '<p class="empty-state">Failed to load quests. Please try again later.</p>';
        }
    }
}

async function fetchQuests(userId) {
    const response = await fetch(`http://localhost:8080/questboard/quests/${userId}`, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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

        titleInput.addEventListener('input', (e) => {
            previewTitle.textContent = e.target.value || 'Quest Title';
        });

        dateInput.addEventListener('input', (e) => {
            previewDate.textContent = e.target.value || 'Date';
        });

        changeImageBtn.addEventListener('click', () => {
            imageSelectionPanel.style.display = 'block';
            changeImageBtn.style.display = 'none';
        });

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 2) {
                    searchButton.click();
                }
            }, 500);
        });

        const selectImage = (imageUrl) => {
            imageUrlInput.value = imageUrl;
            preview.style.backgroundImage = `url(${imageUrl})`;
            imageSelectionPanel.style.display = 'none';
            changeImageBtn.style.display = 'block';
        };

        searchButton.addEventListener('click', async () => {
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
        });
    }
}

async function displayQuests(quests) {
    const questGrid = document.querySelector('#quest-grid');
    if (!questGrid) return;
    
    if (!quests || quests.length === 0) {
        questGrid.innerHTML = '<p class="empty-state">No quests available. Create a new quest to get started!</p>';
        return;
    }

    questGrid.innerHTML = quests.map(quest => `
        <div class="quest-card" data-quest-id="${quest.id}">
            <img src="${quest.imageUrl}" alt="${quest.title}" class="quest-image">
            <div class="quest-info">
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
                <div class="quest-dates">
                    <time>Starts: ${new Date(quest.startTime).toLocaleString()}</time>
                    <time>Ends: ${new Date(quest.endTime).toLocaleString()}</time>
                </div>
            </div>
        </div>
    `).join('');
}