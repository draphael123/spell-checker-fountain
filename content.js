/**
 * Fountain Spell Checker - Content Script
 * Real spell checking using a dictionary of correct words + fuzzy matching
 */

(function() {
  'use strict';

  // ============================================================
  // DICTIONARY OF CORRECT WORDS (Common English words)
  // ============================================================
  const DICTIONARY = new Set([
    // Articles, prepositions, conjunctions
    "a", "an", "the", "and", "or", "but", "if", "then", "else", "when",
    "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to",
    "from", "up", "down", "in", "out", "on", "off", "over", "under",
    "again", "further", "once", "here", "there", "where", "why", "how",
    "all", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too",
    "very", "just", "also", "now", "of", "as",
    
    // Pronouns
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves",
    "you", "your", "yours", "yourself", "yourselves",
    "he", "him", "his", "himself", "she", "her", "hers", "herself",
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
    "what", "which", "who", "whom", "this", "that", "these", "those",
    
    // Common verbs
    "be", "been", "being", "am", "is", "are", "was", "were",
    "have", "has", "had", "having", "do", "does", "did", "doing", "done",
    "will", "would", "shall", "should", "may", "might", "must", "can", "could",
    "go", "goes", "went", "gone", "going",
    "come", "comes", "came", "coming",
    "take", "takes", "took", "taken", "taking",
    "make", "makes", "made", "making",
    "get", "gets", "got", "gotten", "getting",
    "know", "knows", "knew", "known", "knowing",
    "think", "thinks", "thought", "thinking",
    "see", "sees", "saw", "seen", "seeing",
    "want", "wants", "wanted", "wanting",
    "use", "uses", "used", "using",
    "find", "finds", "found", "finding",
    "give", "gives", "gave", "given", "giving",
    "tell", "tells", "told", "telling",
    "work", "works", "worked", "working",
    "call", "calls", "called", "calling",
    "try", "tries", "tried", "trying",
    "ask", "asks", "asked", "asking",
    "need", "needs", "needed", "needing",
    "feel", "feels", "felt", "feeling",
    "become", "becomes", "became", "becoming",
    "leave", "leaves", "left", "leaving",
    "put", "puts", "putting",
    "mean", "means", "meant", "meaning",
    "keep", "keeps", "kept", "keeping",
    "let", "lets", "letting",
    "begin", "begins", "began", "begun", "beginning",
    "seem", "seems", "seemed", "seeming",
    "help", "helps", "helped", "helping",
    "show", "shows", "showed", "shown", "showing",
    "hear", "hears", "heard", "hearing",
    "play", "plays", "played", "playing",
    "run", "runs", "ran", "running",
    "move", "moves", "moved", "moving",
    "live", "lives", "lived", "living",
    "believe", "believes", "believed", "believing",
    "hold", "holds", "held", "holding",
    "bring", "brings", "brought", "bringing",
    "happen", "happens", "happened", "happening",
    "write", "writes", "wrote", "written", "writing",
    "provide", "provides", "provided", "providing",
    "sit", "sits", "sat", "sitting",
    "stand", "stands", "stood", "standing",
    "lose", "loses", "lost", "losing",
    "pay", "pays", "paid", "paying",
    "meet", "meets", "met", "meeting",
    "include", "includes", "included", "including",
    "continue", "continues", "continued", "continuing",
    "set", "sets", "setting",
    "learn", "learns", "learned", "learning",
    "change", "changes", "changed", "changing",
    "lead", "leads", "led", "leading",
    "understand", "understands", "understood", "understanding",
    "watch", "watches", "watched", "watching",
    "follow", "follows", "followed", "following",
    "stop", "stops", "stopped", "stopping",
    "create", "creates", "created", "creating",
    "speak", "speaks", "spoke", "spoken", "speaking",
    "read", "reads", "reading",
    "allow", "allows", "allowed", "allowing",
    "add", "adds", "added", "adding",
    "spend", "spends", "spent", "spending",
    "grow", "grows", "grew", "grown", "growing",
    "open", "opens", "opened", "opening",
    "walk", "walks", "walked", "walking",
    "win", "wins", "won", "winning",
    "offer", "offers", "offered", "offering",
    "remember", "remembers", "remembered", "remembering",
    "love", "loves", "loved", "loving",
    "consider", "considers", "considered", "considering",
    "appear", "appears", "appeared", "appearing",
    "buy", "buys", "bought", "buying",
    "wait", "waits", "waited", "waiting",
    "serve", "serves", "served", "serving",
    "die", "dies", "died", "dying",
    "send", "sends", "sent", "sending",
    "expect", "expects", "expected", "expecting",
    "build", "builds", "built", "building",
    "stay", "stays", "stayed", "staying",
    "fall", "falls", "fell", "fallen", "falling",
    "cut", "cuts", "cutting",
    "reach", "reaches", "reached", "reaching",
    "kill", "kills", "killed", "killing",
    "remain", "remains", "remained", "remaining",
    "suggest", "suggests", "suggested", "suggesting",
    "raise", "raises", "raised", "raising",
    "pass", "passes", "passed", "passing",
    "sell", "sells", "sold", "selling",
    "require", "requires", "required", "requiring",
    "report", "reports", "reported", "reporting",
    "decide", "decides", "decided", "deciding",
    "pull", "pulls", "pulled", "pulling",
    
    // Common nouns
    "time", "year", "people", "way", "day", "man", "woman", "child", "children",
    "world", "life", "hand", "part", "place", "case", "week", "company",
    "system", "program", "question", "work", "government", "number", "night",
    "point", "home", "water", "room", "mother", "area", "money", "story",
    "fact", "month", "lot", "right", "study", "book", "eye", "job", "word",
    "business", "issue", "side", "kind", "head", "house", "service", "friend",
    "father", "power", "hour", "game", "line", "end", "member", "law", "car",
    "city", "community", "name", "president", "team", "minute", "idea", "kid",
    "body", "information", "back", "parent", "face", "others", "level", "office",
    "door", "health", "person", "art", "war", "history", "party", "result",
    "change", "morning", "reason", "research", "girl", "guy", "moment", "air",
    "teacher", "force", "education", "food", "student", "group", "country",
    "problem", "today", "development", "sense", "example", "family", "experience",
    "music", "process", "society", "thing", "form", "effect", "report",
    "decision", "event", "love", "relationship", "age", "order", "control",
    "policy", "class", "field", "data", "paper", "school", "attention",
    "ability", "technology", "action", "future", "position", "evidence",
    "performance", "practice", "theory", "plan", "term", "death", "news",
    "security", "interest", "truth", "model", "economy", "period", "behavior",
    
    // Common adjectives
    "good", "new", "first", "last", "long", "great", "little", "own", "other",
    "old", "right", "big", "high", "different", "small", "large", "next",
    "early", "young", "important", "few", "public", "bad", "same", "able",
    "human", "local", "sure", "free", "better", "best", "true", "full",
    "special", "easy", "clear", "recent", "certain", "personal", "open",
    "red", "difficult", "available", "likely", "short", "single", "medical",
    "current", "wrong", "private", "past", "foreign", "fine", "common",
    "poor", "natural", "significant", "similar", "hot", "dead", "central",
    "happy", "serious", "ready", "simple", "left", "physical", "general",
    "environmental", "financial", "blue", "democratic", "dark", "various",
    "entire", "close", "legal", "religious", "cold", "final", "main",
    "green", "nice", "huge", "popular", "traditional", "cultural", "beautiful",
    "wonderful", "amazing", "awesome", "terrible", "horrible", "excellent",
    "perfect", "complete", "successful", "useful", "helpful", "careful",
    "powerful", "peaceful", "grateful", "respectful", "thoughtful",
    
    // Common adverbs  
    "up", "so", "out", "just", "now", "how", "then", "more", "also", "here",
    "well", "only", "very", "even", "back", "there", "down", "still", "in",
    "as", "to", "when", "never", "really", "most", "on", "why", "about",
    "over", "such", "through", "new", "however", "way", "off", "always",
    "today", "already", "actually", "probably", "ago", "often", "later",
    "together", "maybe", "certainly", "finally", "especially", "usually",
    "quickly", "slowly", "suddenly", "exactly", "simply", "clearly", "nearly",
    "almost", "enough", "especially", "particularly", "generally", "usually",
    "recently", "currently", "previously", "originally", "eventually",
    "definitely", "absolutely", "completely", "entirely", "extremely",
    "fairly", "highly", "largely", "mainly", "merely", "mostly", "partly",
    "primarily", "purely", "slightly", "somewhat", "strongly", "totally",
    "truly", "unfortunately", "fortunately", "apparently", "obviously",
    "necessarily", "possibly", "probably", "presumably", "supposedly",
    
    // Numbers
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
    "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty", "sixty",
    "seventy", "eighty", "ninety", "hundred", "thousand", "million", "billion",
    "first", "second", "third", "fourth", "fifth",
    
    // Days and months
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
    "january", "february", "march", "april", "may", "june", "july", "august",
    "september", "october", "november", "december",
    
    // Common tech/internet words
    "email", "internet", "website", "online", "computer", "phone", "app",
    "software", "hardware", "password", "account", "login", "download",
    "upload", "click", "search", "google", "facebook", "twitter", "youtube",
    
    // Contractions (expanded)
    "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't",
    "shouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't",
    "hadn't", "i'm", "i've", "i'll", "i'd", "you're", "you've", "you'll",
    "you'd", "he's", "he'll", "he'd", "she's", "she'll", "she'd", "it's",
    "it'll", "we're", "we've", "we'll", "we'd", "they're", "they've",
    "they'll", "they'd", "that's", "there's", "here's", "what's", "who's",
    "let's", "ain't",
    
    // More common words
    "because", "through", "between", "before", "after", "while", "during",
    "without", "within", "along", "behind", "beyond", "despite", "towards",
    "whether", "although", "though", "since", "until", "unless", "except",
    "another", "enough", "every", "everything", "everyone", "something",
    "someone", "anything", "anyone", "nothing", "together", "against",
    "around", "across", "inside", "outside", "above", "below", "near",
    "far", "away", "forward", "backward", "straight", "wrong", "right",
    "necessary", "possible", "impossible", "available", "different",
    "similar", "separate", "together", "special", "general", "specific",
    "particular", "various", "several", "certain", "obvious", "apparent",
    "average", "typical", "normal", "regular", "standard", "official",
    "original", "actual", "real", "virtual", "physical", "mental",
    "social", "political", "economic", "financial", "personal", "professional",
    "technical", "practical", "theoretical", "traditional", "modern",
    "ancient", "recent", "previous", "following", "current", "present",
    "future", "final", "initial", "primary", "secondary", "additional",
    "extra", "basic", "advanced", "simple", "complex", "easy", "difficult",
    "hard", "soft", "strong", "weak", "fast", "slow", "quick", "early",
    "late", "soon", "immediate", "sudden", "gradual", "constant", "regular",
    "frequent", "rare", "common", "ordinary", "extraordinary", "excellent",
    "wonderful", "terrible", "horrible", "beautiful", "ugly", "pretty",
    "handsome", "lovely", "nice", "kind", "gentle", "rough", "smooth",
    "clean", "dirty", "fresh", "stale", "sweet", "sour", "bitter", "salty",
    "hot", "cold", "warm", "cool", "wet", "dry", "light", "dark", "bright",
    "heavy", "loud", "quiet", "silent", "noisy", "safe", "dangerous",
    "healthy", "sick", "tired", "awake", "asleep", "alive", "dead",
    "rich", "poor", "cheap", "expensive", "free", "busy", "empty", "full",
    "hungry", "thirsty", "angry", "happy", "sad", "excited", "bored",
    "interested", "boring", "interesting", "amazing", "surprising",
    "disappointed", "satisfied", "confused", "confident", "nervous",
    "scared", "afraid", "proud", "ashamed", "embarrassed", "sorry",
    "grateful", "thankful", "careful", "careless"
  ]);

  // ============================================================
  // SPELL CHECKING FUNCTIONS
  // ============================================================

  /**
   * Calculate Levenshtein distance between two strings
   */
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Find the best matching word from dictionary
   */
  function findCorrection(word) {
    const lowerWord = word.toLowerCase();
    
    // If word is in dictionary, it's correct
    if (DICTIONARY.has(lowerWord)) {
      return null;
    }
    
    // Skip very short words (likely abbreviations) or very long words
    if (lowerWord.length < 3 || lowerWord.length > 20) {
      return null;
    }
    
    // Skip words with numbers
    if (/\d/.test(lowerWord)) {
      return null;
    }
    
    let bestMatch = null;
    let bestDistance = Infinity;
    
    // Calculate max allowed distance based on word length
    const maxDistance = lowerWord.length <= 4 ? 1 : 
                        lowerWord.length <= 6 ? 2 : 
                        lowerWord.length <= 9 ? 3 : 4;
    
    // Find closest match
    for (const dictWord of DICTIONARY) {
      // Quick length check to skip obviously different words
      if (Math.abs(dictWord.length - lowerWord.length) > maxDistance) {
        continue;
      }
      
      // Check if first letter matches (most typos keep first letter)
      // This greatly speeds up the search
      if (dictWord[0] !== lowerWord[0] && dictWord[0] !== lowerWord[1]) {
        continue;
      }
      
      const distance = levenshtein(lowerWord, dictWord);
      
      if (distance > 0 && distance <= maxDistance && distance < bestDistance) {
        bestDistance = distance;
        bestMatch = dictWord;
      }
    }
    
    return bestMatch;
  }

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  let activePopup = null;
  let currentMisspelling = null;
  let currentElement = null;

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================
  
  function getLastWord(text) {
    const words = text.trim().split(/\s+/);
    return words[words.length - 1] || '';
  }

  function getCurrentWord(element) {
    let text = '';
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const cursorPos = element.selectionStart;
      text = element.value.substring(0, cursorPos);
    } else if (element.isContentEditable) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        text = preCaretRange.toString();
      }
    }
    
    return getLastWord(text);
  }

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  // ============================================================
  // STORAGE FUNCTIONS
  // ============================================================

  async function logMisspelling(misspelled, correct) {
    try {
      const data = await chrome.storage.local.get(['misspellings', 'stats']);
      const misspellings = data.misspellings || {};
      const stats = data.stats || {
        totalMisspellings: 0,
        totalCorrected: 0,
        weeklyData: {}
      };
      
      const now = Date.now();
      const today = getTodayDate();
      const key = misspelled.toLowerCase();
      
      if (misspellings[key]) {
        misspellings[key].count++;
        misspellings[key].lastSeen = now;
      } else {
        misspellings[key] = {
          word: misspelled.toLowerCase(),
          correct: correct,
          count: 1,
          correctedCount: 0,
          firstSeen: now,
          lastSeen: now
        };
      }
      
      stats.totalMisspellings++;
      
      if (!stats.weeklyData[today]) {
        stats.weeklyData[today] = { misspellings: 0, corrections: 0 };
      }
      stats.weeklyData[today].misspellings++;
      
      await chrome.storage.local.set({ misspellings, stats });
    } catch (error) {
      console.error('Fountain: Error logging misspelling', error);
    }
  }

  async function logCorrection(word) {
    try {
      const data = await chrome.storage.local.get(['misspellings', 'stats']);
      const misspellings = data.misspellings || {};
      const stats = data.stats || {
        totalMisspellings: 0,
        totalCorrected: 0,
        weeklyData: {}
      };
      
      const today = getTodayDate();
      const key = word.toLowerCase();
      
      if (misspellings[key]) {
        misspellings[key].correctedCount++;
      }
      
      stats.totalCorrected++;
      
      if (!stats.weeklyData[today]) {
        stats.weeklyData[today] = { misspellings: 0, corrections: 0 };
      }
      stats.weeklyData[today].corrections++;
      
      await chrome.storage.local.set({ misspellings, stats });
    } catch (error) {
      console.error('Fountain: Error logging correction', error);
    }
  }

  // ============================================================
  // POPUP MANAGEMENT
  // ============================================================

  function showPopup(element, misspelled, correct) {
    hidePopup();
    
    const popup = document.createElement('div');
    popup.className = 'fountain-spell-popup';
    popup.innerHTML = `
      <div class="fountain-spell-icon">✨</div>
      <div class="fountain-spell-content">
        <span class="fountain-spell-wrong">${misspelled}</span>
        <span class="fountain-spell-arrow">→</span>
        <span class="fountain-spell-correct">${correct}</span>
      </div>
      <div class="fountain-spell-hint">Delete and retype correctly</div>
    `;
    
    document.body.appendChild(popup);
    positionPopup(popup, element);
    
    requestAnimationFrame(() => {
      popup.classList.add('fountain-spell-visible');
    });
    
    activePopup = popup;
    currentMisspelling = { word: misspelled, correct: correct };
    currentElement = element;
  }

  function positionPopup(popup, element) {
    const rect = element.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;
    
    if (left + popupRect.width > window.innerWidth) {
      left = window.innerWidth - popupRect.width - 16;
    }
    
    if (top + popupRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - popupRect.height - 8;
    }
    
    popup.style.top = `${top}px`;
    popup.style.left = `${Math.max(8, left)}px`;
  }

  function hidePopup() {
    if (activePopup) {
      activePopup.classList.remove('fountain-spell-visible');
      activePopup.classList.add('fountain-spell-hiding');
      
      setTimeout(() => {
        if (activePopup && activePopup.parentNode) {
          activePopup.parentNode.removeChild(activePopup);
        }
        activePopup = null;
        currentMisspelling = null;
        currentElement = null;
      }, 200);
    }
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  function handleInput(event) {
    const element = event.target;
    
    if (!isTextInput(element)) return;
    
    if (activePopup && currentMisspelling && currentElement === element) {
      const currentWord = getCurrentWord(element).toLowerCase().replace(/[^a-z']/g, '');
      
      if (currentWord === currentMisspelling.correct.toLowerCase()) {
        logCorrection(currentMisspelling.word);
        hidePopup();
        return;
      }
    }
  }

  function handleKeyUp(event) {
    const element = event.target;
    
    if (!isTextInput(element)) return;
    
    const triggerKeys = [' ', '.', ',', '!', '?', ';', ':', 'Enter', 'Tab'];
    
    if (triggerKeys.includes(event.key)) {
      let text = '';
      let cursorPos = 0;
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        text = element.value;
        cursorPos = element.selectionStart || text.length;
      } else if (element.isContentEditable) {
        text = element.textContent || element.innerText || '';
        cursorPos = text.length;
      }
      
      const textBeforeCursor = text.substring(0, cursorPos);
      const textWithoutTrigger = textBeforeCursor.replace(/[\s.,!?;:]+$/, '');
      const words = textWithoutTrigger.split(/\s+/);
      const lastCompletedWord = words[words.length - 1] || '';
      const cleanWord = lastCompletedWord.replace(/[^a-zA-Z']/g, '');
      
      if (cleanWord && cleanWord.length >= 2) {
        const correction = findCorrection(cleanWord);
        
        if (correction) {
          console.log('Fountain: Misspelling detected!', cleanWord, '->', correction);
          showPopup(element, cleanWord, correction);
          logMisspelling(cleanWord, correction);
        }
      }
    }
  }

  function isTextInput(element) {
    if (!element) return false;
    
    const tagName = element.tagName;
    
    if (tagName === 'INPUT') {
      const type = element.type?.toLowerCase();
      const textTypes = ['text', 'search', 'email', 'url', 'tel', 'password', ''];
      return textTypes.includes(type);
    }
    
    if (tagName === 'TEXTAREA') {
      return true;
    }
    
    if (element.isContentEditable) {
      return true;
    }
    
    return false;
  }

  function handleBlur(event) {
    setTimeout(() => {
      if (activePopup && currentElement === event.target) {
        hidePopup();
      }
    }, 200);
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
    document.addEventListener('input', handleInput, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('blur', handleBlur, true);
    
    const observer = new MutationObserver((mutations) => {
      if (activePopup && currentElement) {
        const rect = currentElement.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          hidePopup();
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✨ Fountain Spell Checker initialized (v2 - Smart Dictionary)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
