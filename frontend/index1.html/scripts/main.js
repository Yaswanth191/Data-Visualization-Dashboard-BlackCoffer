import { fetchData } from './data-manager.js';
import { updateAllCharts } from './charts.js';
import { setupEventListeners } from './handlers.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modals
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const uploadModal = new bootstrap.Modal(document.getElementById('uploadModal'));

    // Initialize select2
    $('.form-select').select2({
        placeholder: "Select values",
        allowClear: true,
        width: '100%'
    });

    // Setup event listeners
    setupEventListeners();

    // Fetch initial data
    fetchData().then(() => {
        updateAllCharts();
    });
});