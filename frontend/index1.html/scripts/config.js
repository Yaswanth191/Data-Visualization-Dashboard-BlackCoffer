export const API_BASE_URL = 'http://localhost:5000';
export const CHART_CONFIGS = {
    intensity: { type: 'bar', color: 'rgba(54, 162, 235, 0.7)' },
    likelihood: { type: 'line', color: 'rgba(153, 102, 255, 0.2)' },
    relevance: { type: 'radar', color: 'rgba(255, 99, 132, 0.2)' },
    country: { 
        type: 'doughnut', 
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    },
    topic: { type: 'bar', color: 'rgba(75, 192, 192, 0.7)' }
};

export const PREVIEW_PAGE_SIZE = 10;