import { API_BASE_URL } from './config.js';
import { fetchData, updateAllCharts } from './data-manager.js';
import { showLoading, hideLoading } from './utils.js';

// Global variables
let selectedFiles = [];

// DOM Elements
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const selectedFilesList = document.getElementById('selectedFilesList');
const uploadedFilesList = document.getElementById('uploadedFilesList');
const uploadProgress = document.getElementById('uploadProgress');
const uploadProgressBar = uploadProgress.querySelector('.progress-bar');

// Initialize file management
export const initFileManagement = () => {
    setupFileEventListeners();
};

// Set up all file-related event listeners
const setupFileEventListeners = () => {
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
};

// Handle file selection
const handleFileSelect = (event) => {
    const files = event.target.files;
    selectedFiles = Array.from(files);
    updateSelectedFilesList();
};

// Update the selected files list UI
const updateSelectedFilesList = () => {
    if (selectedFiles.length === 0) {
        selectedFilesList.innerHTML = '<p class="text-muted">No files selected</p>';
        return;
    }
    
    let html = '';
    selectedFiles.forEach((file, index) => {
        const fileSize = (file.size / 1024).toFixed(2); // KB
        html += `
            <div class="file-item">
                <div class="file-name">
                    <i class="fas fa-file-alt"></i>
                    <div>
                        <div>${file.name}</div>
                        <small class="text-muted">${fileSize} KB</small>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-file btn-danger" data-index="${index}">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    selectedFilesList.innerHTML = html;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-file.btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeFile(parseInt(e.currentTarget.dataset.index));
        });
    });
};

// Remove a file from selection
const removeFile = (index) => {
    selectedFiles.splice(index, 1);
    updateSelectedFilesList();
};

// Clear all selected files
export const clearSelectedFiles = () => {
    selectedFiles = [];
    fileInput.value = '';
    updateSelectedFilesList();
};

// Handle drag over event
const handleDragOver = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary-color)';
    dropZone.style.backgroundColor = 'rgba(110, 142, 251, 0.1)';
};

// Handle drag leave event
const handleDragLeave = () => {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.backgroundColor = 'white';
};

// Handle drop event
const handleDrop = (e) => {
    e.preventDefault();
    handleDragLeave();
    
    if (e.dataTransfer.files.length) {
        selectedFiles = Array.from(e.dataTransfer.files);
        updateSelectedFilesList();
    }
};

// Upload selected files
export const uploadSelectedFiles = async () => {
    if (selectedFiles.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No files selected',
            text: 'Please select files to upload first'
        });
        return;
    }
    
    uploadProgress.style.display = 'block';
    uploadProgressBar.style.width = '0%';
    
    try {
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append('file', file);
            
            // Update progress UI
            uploadProgressBar.style.width = `${(i / selectedFiles.length) * 100}%`;
            
            try {
                const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                updateUploadedFilesList(file.name, 'success', response.data.message);
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                updateUploadedFilesList(file.name, 'error', error.response?.data?.message || 'Upload failed');
            }
        }
        
        // Complete progress
        uploadProgressBar.style.width = '100%';
        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 1000);
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Upload Complete',
            text: 'All files have been uploaded successfully'
        });
        
        // Refresh data after all uploads
        fetchData();
    } catch (error) {
        console.error('Upload error:', error);
        uploadProgress.style.display = 'none';
        Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Error uploading files. Check console for details.'
        });
    }
};

// Update the uploaded files list UI
const updateUploadedFilesList = (filename, status, message) => {
    // Remove "no files" message if it exists
    if (uploadedFilesList.querySelector('p.text-muted')) {
        uploadedFilesList.innerHTML = '';
    }
    
    const statusClass = status === 'success' ? 'text-success' : 'text-danger';
    const statusIcon = status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-name">
            <i class="fas ${statusIcon} ${statusClass}"></i>
            <div>
                <div>${filename}</div>
                <small class="${statusClass}">${message}</small>
            </div>
        </div>
    `;
    
    uploadedFilesList.appendChild(fileItem);
};

// Show upload modal
export const showUploadModal = () => {
    document.getElementById('uploadStatus').innerHTML = '';
    document.getElementById('uploadProgressBar').style.display = 'none';
    document.getElementById('fileInput').value = '';
    new bootstrap.Modal(document.getElementById('uploadModal')).show();
};

// Handle file upload from modal
export const uploadFile = async () => {
    const modalFileInput = document.getElementById('uploadModal').querySelector('#fileInput');
    const uploadOption = document.getElementById('uploadOption');
    const uploadStatus = document.getElementById('uploadStatus');
    const modalProgressBar = document.getElementById('uploadProgressBar');
    const modalProgressBarInner = modalProgressBar.querySelector('.progress-bar');
    const uploadButtonText = document.getElementById('uploadButtonText');
    const uploadSpinner = document.getElementById('uploadSpinner');
    
    if (!modalFileInput.files || modalFileInput.files.length === 0) {
        uploadStatus.innerHTML = '<div class="alert alert-danger">Please select a file first</div>';
        return;
    }

    const file = modalFileInput.files[0];
    if (!file.name.endsWith('.json')) {
        uploadStatus.innerHTML = '<div class="alert alert-danger">Only JSON files are allowed</div>';
        return;
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
        uploadStatus.innerHTML = '<div class="alert alert-danger">File size exceeds 50MB limit</div>';
        return;
    }

    try {
        // Show loading state
        uploadButtonText.style.display = 'none';
        uploadSpinner.style.display = 'inline-block';
        modalProgressBar.style.display = 'block';
        uploadStatus.innerHTML = '<div class="alert alert-info">Processing file...</div>';
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('option', uploadOption.value);

        const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function(progressEvent) {
                if (progressEvent.total > 0) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    modalProgressBarInner.style.width = percentCompleted + '%';
                    modalProgressBarInner.setAttribute('aria-valuenow', percentCompleted);
                }
            }
        });

        uploadStatus.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> ${response.data.message}<br>
                Loaded ${response.data.count.toLocaleString()} records
            </div>
        `;
        
        // Refresh data after successful upload
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
            fetchData();
        }, 1500);
        
    } catch (error) {
        console.error('Upload error:', error);
        let errorMessage = 'Error uploading file';
        
        if (error.response) {
            errorMessage = error.response.data.error || 
                          error.response.data.message || 
                          `Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'No response from server. Is the backend running?';
        }
        
        uploadStatus.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> <strong>Upload failed:</strong> ${errorMessage}
            </div>
        `;
    } finally {
        if (uploadButtonText) uploadButtonText.style.display = 'inline';
        if (uploadSpinner) uploadSpinner.style.display = 'none';
    }
};