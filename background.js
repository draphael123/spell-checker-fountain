/**
 * Fountain Spell Checker - Background Service Worker
 * Handles storage initialization and cleanup
 */

// ============================================================
// STORAGE INITIALIZATION
// ============================================================

/**
 * Initialize storage with default values on extension install
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Fountain Spell Checker installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set default storage structure
    await initializeStorage();
    
    // Open welcome/landing page on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('landing.html')
    });
  } else if (details.reason === 'update') {
    // Migrate storage if needed on updates
    await migrateStorage();
  }
});

/**
 * Initialize storage with default values
 */
async function initializeStorage() {
  const defaultData = {
    misspellings: {},
    stats: {
      totalMisspellings: 0,
      totalCorrected: 0,
      weeklyData: {}
    },
    settings: {
      enabled: true,
      showPopups: true,
      soundEnabled: false
    }
  };
  
  try {
    await chrome.storage.local.set(defaultData);
    console.log('Fountain Spell Checker: Storage initialized');
  } catch (error) {
    console.error('Fountain Spell Checker: Error initializing storage', error);
  }
}

/**
 * Migrate storage for version updates
 */
async function migrateStorage() {
  try {
    const data = await chrome.storage.local.get(null);
    
    // Ensure stats structure exists
    if (!data.stats) {
      data.stats = {
        totalMisspellings: 0,
        totalCorrected: 0,
        weeklyData: {}
      };
    }
    
    // Ensure weeklyData exists
    if (!data.stats.weeklyData) {
      data.stats.weeklyData = {};
    }
    
    // Ensure misspellings object exists
    if (!data.misspellings) {
      data.misspellings = {};
    }
    
    // Ensure settings exist
    if (!data.settings) {
      data.settings = {
        enabled: true,
        showPopups: true,
        soundEnabled: false
      };
    }
    
    await chrome.storage.local.set(data);
    console.log('Fountain Spell Checker: Storage migrated');
  } catch (error) {
    console.error('Fountain Spell Checker: Error migrating storage', error);
  }
}

// ============================================================
// STORAGE CLEANUP
// ============================================================

/**
 * Clean up old weekly data (keep only last 60 days)
 */
async function cleanupOldData() {
  try {
    const data = await chrome.storage.local.get(['stats']);
    
    if (!data.stats || !data.stats.weeklyData) return;
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const cutoffDate = sixtyDaysAgo.toISOString().split('T')[0];
    
    const weeklyData = data.stats.weeklyData;
    let cleaned = false;
    
    for (const date in weeklyData) {
      if (date < cutoffDate) {
        delete weeklyData[date];
        cleaned = true;
      }
    }
    
    if (cleaned) {
      await chrome.storage.local.set({ stats: data.stats });
      console.log('Fountain Spell Checker: Cleaned up old data');
    }
  } catch (error) {
    console.error('Fountain Spell Checker: Error cleaning up data', error);
  }
}

// Run cleanup once a day using alarms
chrome.alarms.create('cleanup', { periodInMinutes: 1440 }); // 24 hours

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    cleanupOldData();
  }
});

// ============================================================
// MESSAGE HANDLING
// ============================================================

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    chrome.storage.local.get(['misspellings', 'stats']).then((data) => {
      sendResponse(data);
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'resetData') {
    initializeStorage().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'exportData') {
    chrome.storage.local.get(null).then((data) => {
      sendResponse(data);
    });
    return true;
  }
});

// ============================================================
// STARTUP
// ============================================================

/**
 * Run cleanup on browser startup
 */
chrome.runtime.onStartup.addListener(() => {
  cleanupOldData();
});

console.log('Fountain Spell Checker: Background service worker loaded');

