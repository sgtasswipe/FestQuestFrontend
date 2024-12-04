document.addEventListener('DOMContentLoaded', () => {
    const questForm = document.getElementById('newQuestForm');
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
});