class TypeSpecificUIManager {
    constructor(container) {
        this.container = container;
        this.typeUIElements = {}; // Store elements associated with each type
    }

    // Register UI elements for a specific type
    registerUIElements(type, elements) {
        this.typeUIElements[type] = elements;

        // Ensure all elements start as hidden
        elements.forEach(el => el.classList.add('hidden'));
    }

    // Show elements for the selected type, hide others
    showUIForType(selectedType) {
        console.log(`selected type: ${selectedType} and in showUIForType`);
        Object.keys(this.typeUIElements).forEach(type => {
            const elements = this.typeUIElements[type];
            elements.forEach(el => {
                if (type === selectedType) {
                    el.classList.remove('hidden');
                    el.classList.add('visible');
                } else {
                    el.classList.remove('visible');
                    el.classList.add('hidden');
                }
            });
        });
    }
}
