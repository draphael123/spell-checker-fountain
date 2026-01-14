/**
 * Fountain Spell Checker - Popup Script
 * Displays quick stats and links to full dashboard
 */

(function() {
  'use strict';

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const elements = {
    totalMisspellings: document.getElementById('total-misspellings'),
    totalCorrections: document.getElementById('total-corrections'),
    accuracy: document.getElementById('accuracy'),
    progressBar: document.getElementById('progress-bar'),
    troubleList: document.getElementById('trouble-list')
  };

  // ============================================================
  // DATA LOADING
  // ============================================================

  /**
   * Load stats from Chrome storage and update UI
   */
  async function loadStats() {
    try {
      const data = await chrome.storage.local.get(['misspellings', 'stats']);
      const misspellings = data.misspellings || {};
      const stats = data.stats || {
        totalMisspellings: 0,
        totalCorrected: 0
      };

      // Update stat values
      updateStats(stats);

      // Update trouble words
      updateTroubleWords(misspellings);

    } catch (error) {
      console.error('Fountain Spell Checker: Error loading stats', error);
    }
  }

  /**
   * Update the stats display
   * @param {Object} stats - The stats object from storage
   */
  function updateStats(stats) {
    const total = stats.totalMisspellings || 0;
    const corrected = stats.totalCorrected || 0;

    // Animate number updates
    animateNumber(elements.totalMisspellings, total);
    animateNumber(elements.totalCorrections, corrected);

    // Calculate and display accuracy
    const accuracy = total > 0 ? Math.round((corrected / total) * 100) : 100;
    elements.accuracy.textContent = `${accuracy}%`;

    // Update progress bar
    elements.progressBar.style.width = `${accuracy}%`;
  }

  /**
   * Animate a number from current to target value
   * @param {HTMLElement} element - The element to update
   * @param {number} target - The target number
   */
  function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    const diff = target - current;
    const duration = 500;
    const steps = 20;
    const increment = diff / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const value = Math.round(current + (increment * step));
      element.textContent = value;

      if (step >= steps) {
        clearInterval(interval);
        element.textContent = target;
      }
    }, duration / steps);
  }

  /**
   * Update the trouble words list
   * @param {Object} misspellings - The misspellings object from storage
   */
  function updateTroubleWords(misspellings) {
    // Convert to array and sort by count (descending)
    const words = Object.values(misspellings);
    
    if (words.length === 0) {
      elements.troubleList.innerHTML = '<div class="empty-state">No misspellings yet! Keep typing ✨</div>';
      return;
    }

    // Sort by count and take top 5
    const topWords = words
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Generate HTML
    const html = topWords.map(word => `
      <div class="trouble-item">
        <div class="trouble-word">
          <span class="trouble-wrong">${escapeHtml(word.word)}</span>
          <span class="trouble-arrow">→</span>
          <span class="trouble-correct">${escapeHtml(word.correct)}</span>
        </div>
        <span class="trouble-count">${word.count}x</span>
      </div>
    `).join('');

    elements.troubleList.innerHTML = html;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - The text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Initialize the popup
   */
  function init() {
    loadStats();

    // Listen for storage changes to update in real-time
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        loadStats();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

