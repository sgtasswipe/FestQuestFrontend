

// TODO REMOVE
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
    const showEndTimeCheckbox = document.getElementById('showEndTime');

    if (questForm && showEndTimeCheckbox) {
        // Set default date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('questStartDate').min = today;
        document.getElementById('questEndDate').min = today;
        document.getElementById('questStartDate').value = today;

        const endTimeFields = document.getElementById('endTimeFields');
        showEndTimeCheckbox.addEventListener('change', (e) => {
            endTimeFields.style.display = e.target.checked ? 'block' : 'none';
        });

        const createQuestButton = document.getElementById('createQuestButton');

        if (createQuestButton) {
            createQuestButton.addEventListener('click', async function(event) {
                event.preventDefault();
                createQuestButton.disabled = true; // Disable button

                // Get the date and time values
                const startDate = document.getElementById('questStartDate').value;
                const startTime = document.getElementById('questStartTime').value;
                const endDate = showEndTimeCheckbox.checked ? document.getElementById('questEndDate').value : document.getElementById('questStartDate').value;
                const endTime = showEndTimeCheckbox.checked ? document.getElementById('questEndTime').value : '23:59:59';

                const questData = {
                    title: document.getElementById('questTitle').value,
                    description: document.getElementById('questDescription').value,
                    imageUrl: document.getElementById('questImageUrl').value,
                    startTime: `${startDate}T${startTime}:00`,
                    endTime: `${endDate}T${endTime}`
                };

                try {
                    console.log('Sending quest data:', questData); // Debugging line
                    const response = await fetch('http://localhost:8080/questboard/quest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(questData)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Server response:', errorText);
                        throw new Error(errorText || 'Failed to create quest');
                    }

                    const result = await response.json();
                    console.log('Quest created:', result);
                    window.location.href = 'index.html';
                    createQuestButton.disabled = false; // Re-enable on success
                } catch (error) {
                    console.error('Error creating quest:', error);
                    createQuestButton.disabled = false; // Re-enable on error
                }
            });
        }
    }

    // alt herunder er i til billede API'en
    const UNSPLASH_ACCESS_KEY = "rwTK8Bqlzzqmvf05Slh20N2Z92il3u_NYt5_mhD5V_Q";
    
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
