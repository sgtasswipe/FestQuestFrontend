import UnsplashAPI from './Unsplashedapi.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('FestQuest Frontend Loaded');
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
});