// Base Dropdown class to handle basic dropdown behavior
class Dropdown {
    constructor(options, placeholder, container) {
        this.dropdown = this.createDropdown(options, placeholder, container);
        console.log(this.dropdown);
        this.dropdown.addEventListener('change', this.handleChange.bind(this));
    }

    handleChange(event) {
        // Base change handler, can be overridden
        console.log('Selected value:', event.target.value);
    }

    getElement() {
        return this.dropdown;
    }

    setOptions(options, placeholderText) {
        this.dropdown.innerHTML = ''; // Clear existing options

        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        placeholderOption.text = placeholderText;
        this.dropdown.appendChild(placeholderOption);

        options.forEach(option => {
            const opt = document.createElement('option');

            if (typeof option === 'object') {
                // For maps: option should be an object with 'value' and 'label'
                opt.value = option.value;  // mapId
                opt.text = option.label;   // mapName
            } else {
                // For groups: option is just a string (group name)
                opt.value = option;  // group name as value
                opt.text = option;   // group name as text
            }

            this.dropdown.appendChild(opt);
        });
    }


    // Helper function to create a dropdown element
    createDropdown(options, placeholderText, container) {
        const dropdown = document.createElement('select');
        dropdown.style.marginBottom = '10px';
        dropdown.style.zIndex = '1020';  // Ensure it appears above other elements
        dropdown.style.pointerEvents = 'auto';  // Ensure it's clickable
        dropdown.classList.add('dropdown');
        dropdown.style.width = '100%';

        // Create placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        placeholderOption.text = placeholderText;
        dropdown.appendChild(placeholderOption);

        if (!options) {
            console.log("options missing in createDropdown");
            return dropdown;
        }

        // Populate with options
        options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.text = optionText;
            dropdown.appendChild(option);
        });

        container.appendChild(dropdown);
        return dropdown;
    }
}

// Class to manage Type dropdown with nested Group dropdowns
class TypeDropdown extends Dropdown {
    constructor(container) {
        console.log("mapsStructureData in type DD constructor: ", mapsStructureData);
        super(Object.keys(mapsStructureData), 'Select Type', container); // Append the TypeDropdown to the container
        this.groupsDropdown = null;
        this.container = container;
        this.createGroupDropdown();
        this.groupsDropdown.hide();
    }

    handleChange(event) {
        super.handleChange(event);
        selectedState.type = event.target.value;  // Update selected type
        this.toggleVisibility(selectedState.type);
        selectedState.group = null;
        selectedState.mapId = null;
        disableMapRelatedButtons(true);
    }

    toggleVisibility() {
        if (this.groupsDropdown) {
            this.groupsDropdown.hide(); // Hide the current group dropdown and its maps
        }

        if (this.groupsDropdown && this.groupsDropdown.mapDropdown) {
            // Clear map dropdown options when type changes
            this.groupsDropdown.mapDropdown.setOptions([]);  // Empty the map dropdown
        }    

        toggleButtonVisibility();

        // Get the map groups for the selected type
        const listOfGroups = mapsStructureData[selectedState.type];

        // If there are map groups, create or update the group dropdown
        if (listOfGroups) {
            console.log("yes there are map groups on toggle visiblity of tpye");
            this.createGroupDropdown();
        }
        if (selectedState.type === Object.keys(mapsStructureData)[1]) {
            if (this.groupsDropdown.mapDropdown) {
                // this.groupsDropdown.mapDropdown.getElement().style.display = 'none';
            }
        }
    }

    createGroupDropdown() {
        let listOfGroups = null;  // Get the groups data for the first type

        if (!this.groupsDropdown) {
            const firstType = Object.keys(mapsStructureData)[0];  // Get the first key (type) from mapsStructureData
            console.log("groups DD doesn;t exist");
            listOfGroups = mapsStructureData[firstType];  // Get the groups data for the first type
            this.groupsDropdown = new GroupDropdown(this.container, listOfGroups);

        } else {
            listOfGroups = mapsStructureData[selectedState.type];  // Get the groups data for the first type
            this.groupsDropdown.listOfGroups = listOfGroups;
            this.groupsDropdown.setOptions(Object.keys(listOfGroups), this.groupsDropdown.placeholderText);
            this.groupsDropdown.show();  // Show the dropdown after updating options
        }
        console.log("selected type i ncreate group DD: ", selectedState.type);
        console.log("map groups in create groupdropdow: ", listOfGroups);

    }
}

// Class to manage Group dropdown, which in turn manages the Map dropdown
class GroupDropdown extends Dropdown {
    constructor(container, listOfGroups) {
        console.log("list of groups: ", listOfGroups);
        const groupKeys = Object.keys(listOfGroups);
        console.log("object key list of groups: ", groupKeys);
        super(groupKeys, 'Select Map Group', container);
        this.placeholderText = 'Select Map Group';
        this.container = container;
        this.listOfGroups = listOfGroups;
        this.mapDropdown = null;
        this.container.appendChild(this.getElement());
        this.createMapDropdown();
    }

    handleChange(event) {
        super.handleChange(event);
        selectedState.group = event.target.value;
        console.log("map groups in handlechange of groups DD: ", this.listOfGroups);
        this.createMapDropdown();
        selectedState.mapId = null;
        disableMapRelatedButtons(true);
    }

    createMapDropdown() {
        const maps = this.listOfGroups[selectedState.group] || [];
        if (!this.mapDropdown) {
            this.mapDropdown = new MapDropdown(maps, this.container);
        } else {
            this.mapDropdown.setOptions(maps);
        }
    }

    show() {
        this.getElement().style.display = 'block';
        if (this.mapDropdown) {
            this.mapDropdown.getElement().style.display = 'block'; // Show the associated map dropdown
        }
    }

    hide() {
        this.getElement().style.display = 'none';
        if (this.mapDropdown) {
            this.mapDropdown.getElement().style.display = 'none'; // Hide the associated map dropdown
        }
    }
}

// Class to manage Map dropdown, without any child dropdowns
class MapDropdown extends Dropdown {
    constructor(maps, container) {
        super([], 'Select Map', container);
        this.placeholderText = 'Select Map';
        this.container = container;
        this.maps = maps;
        this.container.appendChild(this.getElement());
        this.getElement().classList.add('map-dropdown');  // Add a unique class for targeting
    }

    handleChange(event) {
        super.handleChange(event);
        selectedState.mapId = event.target.value;  // Update selected map
        disableMapRelatedButtons(false);
    }

    setOptions(maps) {
        console.log("maps in setOptions of map DD: ", maps);
        const options = maps.map(map => {
            console.log("map name: ", map.mapName);
            return {
                value: map.mapId,
                label: map.mapName // Assuming 'mapName' is the name of the map
            };
        });

        // Uncomment the next line to update the dropdown options
        super.setOptions(options, this.placeholderText);
    }

}
