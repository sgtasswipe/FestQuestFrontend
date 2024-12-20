function createDeleteButton() {
    deleteButton = document.createElement("button")
    deleteButton.className = "delete-button"
    deleteButton.style.background = "red"
    deleteButton.style.display = 'flex';
    deleteButton.innerHTML = "delete";
    deleteButton.position= "absolute"
    deleteButton.style.cursor = "pointer"
    deleteButton.style.top ="3px"
    deleteButton.style.right = "3px"

}

export {createDeleteButton}



class Card {
    /**
     * Creates a card with title, buttons, and optional extra details.
     * @param {Object} options - Options for the card.
     * @param {string} options.title - The main title for the card.
     * @param {string} [options.extraDetails] - Optional details to display under the title.
     * @param {Function} options.onEdit - Callback for the "Edit" button.
     * @param {Function} options.onDelete - Callback for the "Delete" button.
     * @param {Function} [options.extraContent] - Function to add custom content to the card.
     */
    createCard({ title, extraDetails = '', onEdit, onDelete, extraContent = null }) {
        const card = document.createElement('div');
        card.className = 'card';

        // Title Section
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        card.appendChild(titleElement);

        // Optional Details Section
        if (extraDetails) {
            const detailsElement = document.createElement('p');
            detailsElement.textContent = extraDetails;
            card.appendChild(detailsElement);
        }

        // Button Section
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';

        const editButton = this.createButton({
            text: 'Edit',
            className: 'edit-button',
            onClick: onEdit,
            styles: { background: 'blue', color: 'white' },
        });

        const deleteButton = this.createButton({
            text: 'Delete',
            className: 'delete-button',
            onClick: onDelete,
            styles: { background: 'red', color: 'white' },
        });

        buttonWrapper.appendChild(editButton);
        buttonWrapper.appendChild(deleteButton);
        card.appendChild(buttonWrapper);

        // Add Extra Content if provided
        if (extraContent) {
            extraContent(card);
        }

        return card;
    }

    /**
     * Helper to create a button element.
     * @param {Object} options - Options for the button.
     * @param {string} options.text - The text for the button.
     * @param {string} options.className - The class name for the button.
     * @param {Function} options.onClick - Callback for the button click event.
     * @param {Object} [options.styles] - CSS styles for the button.
     */
    createButton({ text, className, onClick, styles = {} }) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className;
        Object.assign(button.style, styles);
        button.addEventListener('click', onClick);
        return button;
    }
}

export default CardManager;
