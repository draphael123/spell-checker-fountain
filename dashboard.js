/**
 * Fountain Spell Checker - Dashboard Script
 * Handles stats visualization, data management, and chart rendering
 */

(function() {
  'use strict';

  // ============================================================
  // STATE
  // ============================================================
  let currentData = {
    misspellings: {},
    stats: {
      totalMisspellings: 0,
      totalCorrected: 0,
      weeklyData: {}
    }
  };

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const elements = {
    // Stats
    statMisspellings: document.getElementById('stat-misspellings'),
    statCorrections: document.getElementById('stat-corrections'),
    statAccuracy: document.getElementById('stat-accuracy'),
    statUnique: document.getElementById('stat-unique'),
    misspellTrend: document.getElementById('misspell-trend'),
    correctTrend: document.getElementById('correct-trend'),
    
    // Chart
    activityChart: document.getElementById('activity-chart'),
    
    // Trouble words
    troubleGrid: document.getElementById('trouble-grid'),
    
    // Table
    wordsTableBody: document.getElementById('words-table-body'),
    searchInput: document.getElementById('search-input'),
    sortSelect: document.getElementById('sort-select'),
    tableCount: document.getElementById('table-count'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.section'),
    
    // Actions
    exportBtn: document.getElementById('export-btn'),
    resetBtn: document.getElementById('reset-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    lastUpdated: document.getElementById('last-updated'),
    
    // Modal
    resetModal: document.getElementById('reset-modal'),
    modalCancel: document.getElementById('modal-cancel'),
    modalConfirm: document.getElementById('modal-confirm')
  };

  // Chart instance
  let chartInstance = null;

  // ============================================================
  // DATA LOADING
  // ============================================================

  /**
   * Load all data from Chrome storage
   */
  async function loadData() {
    try {
      const data = await chrome.storage.local.get(['misspellings', 'stats']);
      currentData.misspellings = data.misspellings || {};
      currentData.stats = data.stats || {
        totalMisspellings: 0,
        totalCorrected: 0,
        weeklyData: {}
      };
      
      updateUI();
      updateLastUpdated();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  /**
   * Update the last updated timestamp
   */
  function updateLastUpdated() {
    const now = new Date();
    elements.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }

  // ============================================================
  // UI UPDATES
  // ============================================================

  /**
   * Update all UI components
   */
  function updateUI() {
    updateStats();
    updateChart();
    updateTroubleWords();
    updateTable();
  }

  /**
   * Update stats cards
   */
  function updateStats() {
    const stats = currentData.stats;
    const misspellings = currentData.misspellings;
    
    const total = stats.totalMisspellings || 0;
    const corrected = stats.totalCorrected || 0;
    const accuracy = total > 0 ? Math.round((corrected / total) * 100) : 100;
    const uniqueCount = Object.keys(misspellings).length;
    
    // Animate values
    animateValue(elements.statMisspellings, total);
    animateValue(elements.statCorrections, corrected);
    elements.statAccuracy.textContent = `${accuracy}%`;
    animateValue(elements.statUnique, uniqueCount);
    
    // Calculate trends (last 7 days vs previous 7 days)
    const trends = calculateTrends(stats.weeklyData);
    
    if (trends.misspellings !== null) {
      elements.misspellTrend.textContent = formatTrend(trends.misspellings);
      elements.misspellTrend.className = `stat-trend ${trends.misspellings > 0 ? 'negative' : ''}`;
    }
    
    if (trends.corrections !== null) {
      elements.correctTrend.textContent = formatTrend(trends.corrections);
      elements.correctTrend.className = `stat-trend ${trends.corrections < 0 ? 'negative' : ''}`;
    }
  }

  /**
   * Animate a value from current to target
   */
  function animateValue(element, target) {
    const current = parseInt(element.textContent) || 0;
    const diff = target - current;
    const duration = 500;
    const steps = 20;
    let step = 0;
    
    if (diff === 0) return;
    
    const interval = setInterval(() => {
      step++;
      element.textContent = Math.round(current + (diff * (step / steps)));
      
      if (step >= steps) {
        clearInterval(interval);
        element.textContent = target;
      }
    }, duration / steps);
  }

  /**
   * Calculate trends from weekly data
   */
  function calculateTrends(weeklyData) {
    const dates = Object.keys(weeklyData).sort().reverse();
    
    if (dates.length < 2) {
      return { misspellings: null, corrections: null };
    }
    
    // Last 7 days
    const recentDates = dates.slice(0, 7);
    const previousDates = dates.slice(7, 14);
    
    const recentMisspellings = recentDates.reduce((sum, date) => 
      sum + (weeklyData[date]?.misspellings || 0), 0);
    const previousMisspellings = previousDates.reduce((sum, date) => 
      sum + (weeklyData[date]?.misspellings || 0), 0);
    
    const recentCorrections = recentDates.reduce((sum, date) => 
      sum + (weeklyData[date]?.corrections || 0), 0);
    const previousCorrections = previousDates.reduce((sum, date) => 
      sum + (weeklyData[date]?.corrections || 0), 0);
    
    return {
      misspellings: previousMisspellings > 0 
        ? Math.round(((recentMisspellings - previousMisspellings) / previousMisspellings) * 100)
        : null,
      corrections: previousCorrections > 0
        ? Math.round(((recentCorrections - previousCorrections) / previousCorrections) * 100)
        : null
    };
  }

  /**
   * Format trend percentage
   */
  function formatTrend(value) {
    if (value === null) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value}%`;
  }

  // ============================================================
  // CHART
  // ============================================================

  /**
   * Update the activity chart
   */
  function updateChart() {
    const weeklyData = currentData.stats.weeklyData || {};
    
    // Generate last 30 days
    const dates = [];
    const misspellings = [];
    const corrections = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      misspellings.push(weeklyData[dateStr]?.misspellings || 0);
      corrections.push(weeklyData[dateStr]?.corrections || 0);
    }
    
    // Draw chart using canvas
    drawChart(dates, misspellings, corrections);
  }

  /**
   * Draw the chart using canvas
   */
  function drawChart(labels, misspellings, corrections) {
    const canvas = elements.activityChart;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value
    const maxValue = Math.max(...misspellings, ...corrections, 5);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxValue - (maxValue / 4) * i), padding.left - 8, y + 4);
    }
    
    // Calculate point positions
    const stepX = chartWidth / (labels.length - 1);
    
    const getY = (value) => {
      return padding.top + chartHeight - (value / maxValue) * chartHeight;
    };
    
    // Draw area fill for misspellings
    ctx.beginPath();
    ctx.moveTo(padding.left, getY(0));
    for (let i = 0; i < misspellings.length; i++) {
      ctx.lineTo(padding.left + i * stepX, getY(misspellings[i]));
    }
    ctx.lineTo(padding.left + (misspellings.length - 1) * stepX, getY(0));
    ctx.closePath();
    
    const gradientMisspell = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradientMisspell.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
    gradientMisspell.addColorStop(1, 'rgba(255, 107, 107, 0)');
    ctx.fillStyle = gradientMisspell;
    ctx.fill();
    
    // Draw misspellings line
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    for (let i = 0; i < misspellings.length; i++) {
      if (i === 0) {
        ctx.moveTo(padding.left + i * stepX, getY(misspellings[i]));
      } else {
        ctx.lineTo(padding.left + i * stepX, getY(misspellings[i]));
      }
    }
    ctx.stroke();
    
    // Draw area fill for corrections
    ctx.beginPath();
    ctx.moveTo(padding.left, getY(0));
    for (let i = 0; i < corrections.length; i++) {
      ctx.lineTo(padding.left + i * stepX, getY(corrections[i]));
    }
    ctx.lineTo(padding.left + (corrections.length - 1) * stepX, getY(0));
    ctx.closePath();
    
    const gradientCorrect = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradientCorrect.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
    gradientCorrect.addColorStop(1, 'rgba(74, 222, 128, 0)');
    ctx.fillStyle = gradientCorrect;
    ctx.fill();
    
    // Draw corrections line
    ctx.beginPath();
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    for (let i = 0; i < corrections.length; i++) {
      if (i === 0) {
        ctx.moveTo(padding.left + i * stepX, getY(corrections[i]));
      } else {
        ctx.lineTo(padding.left + i * stepX, getY(corrections[i]));
      }
    }
    ctx.stroke();
    
    // Draw x-axis labels (every 5th label)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < labels.length; i += 5) {
      ctx.fillText(labels[i], padding.left + i * stepX, height - 8);
    }
  }

  // ============================================================
  // TROUBLE WORDS
  // ============================================================

  /**
   * Update the trouble words grid
   */
  function updateTroubleWords() {
    const words = Object.values(currentData.misspellings);
    
    if (words.length === 0) {
      elements.troubleGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✨</div>
          <div class="empty-text">No misspellings yet! Keep typing to track your progress.</div>
        </div>
      `;
      return;
    }
    
    // Sort by count and take top 10
    const topWords = words.sort((a, b) => b.count - a.count).slice(0, 10);
    
    elements.troubleGrid.innerHTML = topWords.map(word => {
      const rate = word.count > 0 ? Math.round((word.correctedCount / word.count) * 100) : 0;
      return `
        <div class="trouble-card">
          <div class="trouble-word-row">
            <span class="trouble-wrong">${escapeHtml(word.word)}</span>
            <span class="trouble-arrow">→</span>
            <span class="trouble-correct">${escapeHtml(word.correct)}</span>
          </div>
          <div class="trouble-stats">
            <span class="trouble-count">${word.count}x misspelled</span>
            <span>${rate}% corrected</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================================================
  // TABLE
  // ============================================================

  /**
   * Update the words table
   */
  function updateTable() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const sortBy = elements.sortSelect.value;
    
    let words = Object.values(currentData.misspellings);
    
    // Filter by search
    if (searchTerm) {
      words = words.filter(w => 
        w.word.toLowerCase().includes(searchTerm) ||
        w.correct.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort
    words = sortWords(words, sortBy);
    
    // Update count
    elements.tableCount.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;
    
    if (words.length === 0) {
      elements.wordsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            ${searchTerm ? 'No matching words found' : 'No misspellings recorded yet'}
          </td>
        </tr>
      `;
      return;
    }
    
    // Render rows
    elements.wordsTableBody.innerHTML = words.map(word => {
      const rate = word.count > 0 ? Math.round((word.correctedCount / word.count) * 100) : 0;
      return `
        <tr>
          <td><span class="word-misspelled">${escapeHtml(word.word)}</span></td>
          <td><span class="word-correct">${escapeHtml(word.correct)}</span></td>
          <td><span class="badge count">${word.count}</span></td>
          <td><span class="badge corrected">${word.correctedCount}</span></td>
          <td><span class="badge rate">${rate}%</span></td>
          <td>${formatDate(word.firstSeen)}</td>
          <td>${formatDate(word.lastSeen)}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Sort words array
   */
  function sortWords(words, sortBy) {
    switch (sortBy) {
      case 'count-desc':
        return words.sort((a, b) => b.count - a.count);
      case 'count-asc':
        return words.sort((a, b) => a.count - b.count);
      case 'recent':
        return words.sort((a, b) => b.lastSeen - a.lastSeen);
      case 'oldest':
        return words.sort((a, b) => a.firstSeen - b.firstSeen);
      case 'alpha-asc':
        return words.sort((a, b) => a.word.localeCompare(b.word));
      case 'alpha-desc':
        return words.sort((a, b) => b.word.localeCompare(a.word));
      default:
        return words;
    }
  }

  /**
   * Format timestamp to readable date
   */
  function formatDate(timestamp) {
    if (!timestamp) return '--';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  /**
   * Handle navigation clicks
   */
  function handleNavigation(e) {
    e.preventDefault();
    
    const target = e.currentTarget.dataset.section;
    
    // Update nav items
    elements.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === target);
    });
    
    // Update sections
    elements.sections.forEach(section => {
      section.classList.toggle('active', section.id === target);
    });
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Export data as JSON
   */
  function exportData() {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `fountain-spell-checker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Show reset confirmation modal
   */
  function showResetModal() {
    elements.resetModal.classList.add('active');
  }

  /**
   * Hide reset confirmation modal
   */
  function hideResetModal() {
    elements.resetModal.classList.remove('active');
  }

  /**
   * Reset all data
   */
  async function resetData() {
    try {
      await chrome.runtime.sendMessage({ action: 'resetData' });
      hideResetModal();
      loadData();
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================

  function setupEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
      item.addEventListener('click', handleNavigation);
    });
    
    // Table controls
    elements.searchInput.addEventListener('input', () => {
      updateTable();
    });
    
    elements.sortSelect.addEventListener('change', () => {
      updateTable();
    });
    
    // Actions
    elements.exportBtn.addEventListener('click', exportData);
    elements.resetBtn.addEventListener('click', showResetModal);
    elements.refreshBtn.addEventListener('click', loadData);
    
    // Modal
    elements.modalCancel.addEventListener('click', hideResetModal);
    elements.modalConfirm.addEventListener('click', resetData);
    
    // Close modal on backdrop click
    elements.resetModal.addEventListener('click', (e) => {
      if (e.target === elements.resetModal) {
        hideResetModal();
      }
    });
    
    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        loadData();
      }
    });
    
    // Handle window resize for chart
    window.addEventListener('resize', () => {
      updateChart();
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
    setupEventListeners();
    loadData();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

