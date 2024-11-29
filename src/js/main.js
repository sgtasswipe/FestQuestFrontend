document.addEventListener('DOMContentLoaded', () => {
    console.log('FestQuest Frontend Loaded');
    
    // Check if we're on the index page
    const newQuestButton = document.querySelector('.btn-new-quest');
    if (newQuestButton) {
        newQuestButton.addEventListener('click', () => {
            window.location.href = 'newQuest.html';
        });
    }
    
    const questForm = document.querySelector('form');
    if (questForm) {
        questForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const questData = {
                title: document.getElementById('questTitle').value,
                description: document.getElementById('questDescription').value,
                imageUrl: document.getElementById('questImageUrl').value,
                startTime: `${document.getElementById('questStartDate').value}T${document.getElementById('questStartTime').value}:00`,
                endTime: `${document.getElementById('questEndDate').value}T${document.getElementById('questEndTime').value}:00`
            };

            try {
                const response = await fetch('http://localhost:8080/api/quests/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(questData)
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    console.error('Failed to create quest');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    const showEndTimeCheckbox = document.getElementById('showEndTime');
    if (showEndTimeCheckbox) {
        const endTimeFields = document.getElementById('endTimeFields');
        
        showEndTimeCheckbox.addEventListener('change', (e) => {
            endTimeFields.style.display = e.target.checked ? 'block' : 'none';
        });
        
        questForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const questData = {
                title: document.getElementById('questTitle').value,
                description: document.getElementById('questDescription').value,
                imageUrl: document.getElementById('questImageUrl').value,
                startTime: `${document.getElementById('questStartDate').value}T${document.getElementById('questStartTime').value}:00`,
                // Set default end time if not checked
                endTime: showEndTimeCheckbox.checked 
                    ? `${document.getElementById('questEndDate').value}T${document.getElementById('questEndTime').value}:00`
                    : `${document.getElementById('questStartDate').value}T00:00:00`
            };
            
            try {
                const response = await fetch('http://localhost:8080/api/quests/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(questData)
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    console.error('Failed to create quest');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
 // alt herunder er i til billede API'en
    const UNSPLASH_ACCESS_KEY = 'Am5bmpWxe-yJlIgf4etcgTcX1HjzBg-16veiWuYCz98';
    
    if (document.getElementById('searchButton')) {
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

        // Auto-search when typing (with debounce)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 2) {
                    searchButton.click();
                }
            }, 500);
        });

        // Handle image selection
        const selectImage = (imageUrl) => {
            imageUrlInput.value = imageUrl;
            preview.style.backgroundImage = `url(${imageUrl})`;
            imageSelectionPanel.style.display = 'none';
            changeImageBtn.style.display = 'block';
        };

        searchButton.addEventListener('click', async () => {
            const query = searchInput.value;
            if (!query) return;

            try {
                const response = await fetch(
                    `https://api.unsplash.com/search/photos?query=${query}&per_page=21`,
                    {
                        headers: {
                            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                        }
                    }
                );
                
                const data = await response.json();
                imageResults.innerHTML = '';
                
                data.results.forEach(image => {
                    const img = document.createElement('img');
                    img.src = image.urls.small;
                    img.addEventListener('click', () => selectImage(image.urls.regular));
                    imageResults.appendChild(img);
                });
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        });
    }
});
