/**
 * Fountain Spell Checker - Content Script
 * Handles real-time spell checking across all text inputs on any website
 */

(function() {
  'use strict';

  // ============================================================
  // MISSPELLING DICTIONARY (200+ common misspellings)
  // Format: "misspelling": "correct"
  // ============================================================
  const MISSPELLINGS = {
    // Common short typos
    "teh": "the",
    "hte": "the",
    "taht": "that",
    "waht": "what",
    "whta": "what",
    "yuo": "you",
    "cna": "can",
    "adn": "and",
    "thn": "then",
    "fo": "of",
    "ot": "to",
    "ti": "it",
    "si": "is",
    "nto": "not",
    "hwo": "how",
    "hsa": "has",
    "hav": "have",
    "jsut": "just",
    "liek": "like",
    "knwo": "know",
    "wnat": "want",
    "form": "from",
    "woudl": "would",
    "coudl": "could",
    "shoudl": "should",
    "thsi": "this",
    "whit": "with",
    "ther": "there",
    "tehy": "they",
    "hvae": "have",
    "ahve": "have",
    "nwo": "now",
    "eveyr": "every",
    "soem": "some",
    "yoru": "your",
    "aobut": "about",
    "beeing": "being",
    "goign": "going",
    "sayign": "saying",
    "doign": "doing",
    "makign": "making",
    "takign": "taking",
    "comign": "coming",
    "geting": "getting",
    "poeple": "people",
    "thign": "thing",
    "thnig": "thing",
    "rigth": "right",
    "rigt": "right",
    
    // A
    "acheive": "achieve",
    "achievment": "achievement",
    "accomodate": "accommodate",
    "acommodate": "accommodate",
    "accross": "across",
    "adress": "address",
    "adres": "address",
    "agressive": "aggressive",
    "agressively": "aggressively",
    "alot": "a lot",
    "amoung": "among",
    "amuont": "amount",
    "amout": "amount",
    "anwser": "answer",
    "apparantly": "apparently",
    "apperance": "appearance",
    "arguement": "argument",
    "assasination": "assassination",
    "athiest": "atheist",
    "awfull": "awful",
    "awsome": "awesome",
    
    // B
    "basicly": "basically",
    "basicaly": "basically",
    "basicalyl": "basically",
    "beleive": "believe",
    "belive": "believe",
    "beleiv": "believe",
    "believ": "believe",
    "beileve": "believe",
    "beatiful": "beautiful",
    "beautifull": "beautiful",
    "beutiful": "beautiful",
    "beauitful": "beautiful",
    "beautful": "beautiful",
    "bueatiful": "beautiful",
    "becuase": "because",
    "becasue": "because",
    "beacuse": "because",
    "becouse": "because",
    "becuz": "because",
    "bcause": "because",
    "becasue": "because",
    "begining": "beginning",
    "begginning": "beginning",
    "beggining": "beginning",
    "beginnig": "beginning",
    "beleif": "belief",
    "belif": "belief",
    "buisness": "business",
    "bussiness": "business",
    "busines": "business",
    "buisines": "business",
    "bizzare": "bizarre",
    "bizare": "bizarre",
    
    // C
    "calender": "calendar",
    "camoflage": "camouflage",
    "carribean": "Caribbean",
    "catagory": "category",
    "cemetary": "cemetery",
    "changable": "changeable",
    "cheif": "chief",
    "cieling": "ceiling",
    "collaegue": "colleague",
    "collegue": "colleague",
    "comming": "coming",
    "commited": "committed",
    "commitee": "committee",
    "completly": "completely",
    "concious": "conscious",
    "consciense": "conscience",
    "concensus": "consensus",
    "copywrite": "copyright",
    "criticise": "criticize",
    "curiousity": "curiosity",
    
    // D
    "decieve": "deceive",
    "decive": "deceive",
    "definately": "definitely",
    "definatly": "definitely",
    "definitly": "definitely",
    "definetly": "definitely",
    "definetely": "definitely",
    "definitley": "definitely",
    "definantly": "definitely",
    "deffinitely": "definitely",
    "definate": "definite",
    "definit": "definite",
    "desparate": "desperate",
    "desprate": "desperate",
    "desparete": "desperate",
    "desperatly": "desperately",
    "develope": "develop",
    "develp": "develop",
    "diffrent": "different",
    "diferent": "different",
    "differnt": "different",
    "diffrent": "different",
    "difffrent": "different",
    "differant": "different",
    "differnce": "difference",
    "diference": "difference",
    "dilema": "dilemma",
    "dillemma": "dilemma",
    "disapear": "disappear",
    "dissapear": "disappear",
    "dissappear": "disappear",
    "disappar": "disappear",
    "disapoint": "disappoint",
    "dissappoint": "disappoint",
    "dissapoint": "disappoint",
    "disapointed": "disappointed",
    "doesnt": "doesn't",
    "dosent": "doesn't",
    "dont": "don't",
    "dosen't": "doesn't",
    
    // E
    "embarass": "embarrass",
    "embaress": "embarrass",
    "embarras": "embarrass",
    "embarasing": "embarrassing",
    "embarrasing": "embarrassing",
    "embarassed": "embarrassed",
    "enviroment": "environment",
    "enviorment": "environment",
    "enviornment": "environment",
    "envirnoment": "environment",
    "eviroment": "environment",
    "equiped": "equipped",
    "equiptment": "equipment",
    "equipement": "equipment",
    "essense": "essence",
    "essentail": "essential",
    "esential": "essential",
    "essencial": "essential",
    "excede": "exceed",
    "exellent": "excellent",
    "excellant": "excellent",
    "excelent": "excellent",
    "excellnet": "excellent",
    "exersice": "exercise",
    "exercize": "exercise",
    "excercise": "exercise",
    "exersize": "exercise",
    "existance": "existence",
    "existense": "existence",
    "experiance": "experience",
    "expierence": "experience",
    "expirience": "experience",
    "exprience": "experience",
    "experiece": "experience",
    "explaination": "explanation",
    "explination": "explanation",
    "extremly": "extremely",
    "extreamly": "extremely",
    
    // F
    "familar": "familiar",
    "farenheit": "Fahrenheit",
    "febuary": "February",
    "finaly": "finally",
    "flourescent": "fluorescent",
    "foriegn": "foreign",
    "foreward": "forward",
    "fourty": "forty",
    "freind": "friend",
    "frustation": "frustration",
    "fullfill": "fulfill",
    "futher": "further",
    
    // G
    "gaurd": "guard",
    "goverment": "government",
    "govenment": "government",
    "gratefull": "grateful",
    "greatful": "grateful",
    "garantee": "guarantee",
    "guidence": "guidance",
    "guage": "gauge",
    
    // H
    "happend": "happened",
    "harrass": "harass",
    "heighth": "height",
    "heirarchy": "hierarchy",
    "heros": "heroes",
    "humourous": "humorous",
    "hygene": "hygiene",
    "hypocracy": "hypocrisy",
    
    // I
    "ignorence": "ignorance",
    "imagin": "imagine",
    "imediately": "immediately",
    "immediatly": "immediately",
    "immediatley": "immediately",
    "immeditaely": "immediately",
    "immedaitely": "immediately",
    "imitate": "imitate",
    "importent": "important",
    "importnat": "important",
    "importatnt": "important",
    "imposible": "impossible",
    "impossable": "impossible",
    "independant": "independent",
    "independet": "independent",
    "indispensible": "indispensable",
    "influance": "influence",
    "influnce": "influence",
    "infomation": "information",
    "informtion": "information",
    "innoculate": "inoculate",
    "inteligence": "intelligence",
    "intelligance": "intelligence",
    "inteligent": "intelligent",
    "intresting": "interesting",
    "intersting": "interesting",
    "interessting": "interesting",
    "interuption": "interruption",
    "irrelevent": "irrelevant",
    "irrelavant": "irrelevant",
    "irresistable": "irresistible",
    "isnt": "isn't",
    "iland": "island",
    "itinery": "itinerary",
    "its'": "its",
    
    // J
    "jewlery": "jewelry",
    "judgement": "judgment",
    "judgemant": "judgment",
    
    // K
    "kernal": "kernel",
    "knowlege": "knowledge",
    "knowledgable": "knowledgeable",
    
    // L
    "lanugage": "language",
    "langauge": "language",
    "labratory": "laboratory",
    "lenght": "length",
    "liason": "liaison",
    "libary": "library",
    "lisence": "license",
    "lightening": "lightning",
    "likelyhood": "likelihood",
    "lollypop": "lollipop",
    "loosing": "losing",
    
    // M
    "maintainance": "maintenance",
    "maintenence": "maintenance",
    "managment": "management",
    "manuever": "maneuver",
    "marraige": "marriage",
    "medeval": "medieval",
    "medevial": "medieval",
    "millenium": "millennium",
    "millionaire": "millionaire",
    "minature": "miniature",
    "miniscule": "minuscule",
    "mischevious": "mischievous",
    "mispell": "misspell",
    "misspel": "misspell",
    "moniter": "monitor",
    
    // N
    "naturaly": "naturally",
    "naturall": "naturally",
    "neccessary": "necessary",
    "necessery": "necessary",
    "necesary": "necessary",
    "neccesary": "necessary",
    "neccessery": "necessary",
    "necessarry": "necessary",
    "neice": "niece",
    "nieghbor": "neighbor",
    "neighbour": "neighbor",
    "nieghbour": "neighbor",
    "negihbor": "neighbor",
    "noticable": "noticeable",
    "noticeable": "noticeable",
    "nuisence": "nuisance",
    "nver": "never",
    "nevr": "never",
    
    // O
    "obediant": "obedient",
    "obvioulsy": "obviously",
    "obviusly": "obviously",
    "obviosly": "obviously",
    "occassion": "occasion",
    "ocasion": "occasion",
    "occaison": "occasion",
    "occured": "occurred",
    "occurd": "occurred",
    "occurence": "occurrence",
    "occurrance": "occurrence",
    "occuring": "occurring",
    "omision": "omission",
    "omitting": "omitting",
    "opion": "opinion",
    "oppinion": "opinion",
    "opinon": "opinion",
    "oppurtunity": "opportunity",
    "oportunity": "opportunity",
    "oppertunity": "opportunity",
    "opprotunity": "opportunity",
    "optimisim": "optimism",
    "orginally": "originally",
    "orignal": "original",
    "origianl": "original",
    "orginal": "original",
    "otehr": "other",
    "ohter": "other",
    "outragous": "outrageous",
    
    // P
    "parliment": "parliament",
    "particulary": "particularly",
    "particualrly": "particularly",
    "pastime": "pastime",
    "paticular": "particular",
    "peacful": "peaceful",
    "peaple": "people",
    "peopel": "people",
    "percieve": "perceive",
    "perfer": "prefer",
    "perfomance": "performance",
    "performence": "performance",
    "permenent": "permanent",
    "permanant": "permanent",
    "permissable": "permissible",
    "perseverence": "perseverance",
    "persistant": "persistent",
    "personell": "personnel",
    "persue": "pursue",
    "peice": "piece",
    "plagerism": "plagiarism",
    "playwrite": "playwright",
    "pleasent": "pleasant",
    "plese": "please",
    "pls": "please",
    "politican": "politician",
    "posession": "possession",
    "possesion": "possession",
    "posible": "possible",
    "possable": "possible",
    "possiable": "possible",
    "posibly": "possibly",
    "potatos": "potatoes",
    "practise": "practice",
    "precede": "precede",
    "predjudice": "prejudice",
    "presance": "presence",
    "presense": "presence",
    "privelege": "privilege",
    "priviledge": "privilege",
    "privlege": "privilege",
    "probaly": "probably",
    "probalby": "probably",
    "probabyl": "probably",
    "problably": "probably",
    "probelm": "problem",
    "porblem": "problem",
    "professer": "professor",
    "proffesional": "professional",
    "profesional": "professional",
    "promiss": "promise",
    "pronounciation": "pronunciation",
    "proove": "prove",
    "protien": "protein",
    "publically": "publicly",
    "purposly": "purposely",
    
    // Q
    "quarentine": "quarantine",
    "questionaire": "questionnaire",
    "que": "queue",
    
    // R
    "realy": "really",
    "realyl": "really",
    "reall": "really",
    "realise": "realize",
    "recieve": "receive",
    "recive": "receive",
    "receve": "receive",
    "recieved": "received",
    "reciept": "receipt",
    "recipt": "receipt",
    "reccomend": "recommend",
    "recomend": "recommend",
    "recommed": "recommend",
    "reccommend": "recommend",
    "recomended": "recommended",
    "refered": "referred",
    "reffered": "referred",
    "referance": "reference",
    "refrence": "reference",
    "relevent": "relevant",
    "relavent": "relevant",
    "relevnt": "relevant",
    "religous": "religious",
    "religios": "religious",
    "rember": "remember",
    "remeber": "remember",
    "remmeber": "remember",
    "remembr": "remember",
    "repitition": "repetition",
    "restaraunt": "restaurant",
    "resturant": "restaurant",
    "restraunt": "restaurant",
    "resteraunt": "restaurant",
    "restarant": "restaurant",
    "rythm": "rhythm",
    "rythym": "rhythm",
    "rhythym": "rhythm",
    "rediculous": "ridiculous",
    "rediculus": "ridiculous",
    "ridiculus": "ridiculous",
    
    // S
    "sacrilige": "sacrilege",
    "saftey": "safety",
    "safty": "safety",
    "sandwhich": "sandwich",
    "sandwitch": "sandwich",
    "sanwich": "sandwich",
    "sattelite": "satellite",
    "satelite": "satellite",
    "scarey": "scary",
    "scedule": "schedule",
    "schedual": "schedule",
    "schdule": "schedule",
    "shcedule": "schedule",
    "scisors": "scissors",
    "sissors": "scissors",
    "seige": "siege",
    "sentance": "sentence",
    "sentense": "sentence",
    "seperate": "separate",
    "seprate": "separate",
    "separete": "separate",
    "seperat": "separate",
    "seperately": "separately",
    "separatly": "separately",
    "sergent": "sergeant",
    "sheild": "shield",
    "shineing": "shining",
    "sieze": "seize",
    "similer": "similar",
    "similiar": "similar",
    "simlar": "similar",
    "sincerly": "sincerely",
    "sincerely": "sincerely",
    "skilfull": "skillful",
    "somthing": "something",
    "somethign": "something",
    "somtimes": "sometimes",
    "sometims": "sometimes",
    "speach": "speech",
    "speek": "speak",
    "specialy": "specially",
    "speciman": "specimen",
    "stoping": "stopping",
    "stragedy": "strategy",
    "stategy": "strategy",
    "strech": "stretch",
    "strentgh": "strength",
    "strenght": "strength",
    "stregth": "strength",
    "strenous": "strenuous",
    "stuborn": "stubborn",
    "studing": "studying",
    "studdy": "study",
    "succede": "succeed",
    "succed": "succeed",
    "succesful": "successful",
    "successfull": "successful",
    "succesfull": "successful",
    "succesfully": "successfully",
    "sucess": "success",
    "succes": "success",
    "sufficent": "sufficient",
    "sufficiant": "sufficient",
    "superintendant": "superintendent",
    "supercede": "supersede",
    "suprise": "surprise",
    "surprize": "surprise",
    "suprised": "surprised",
    "surprized": "surprised",
    "surround": "surround",
    "surveilance": "surveillance",
    "survivied": "survived",
    
    // T
    "tecnique": "technique",
    "techique": "technique",
    "tecnical": "technical",
    "techincal": "technical",
    "temperture": "temperature",
    "temprature": "temperature",
    "temparature": "temperature",
    "tendancy": "tendency",
    "tendacy": "tendency",
    "therefor": "therefore",
    "therfore": "therefore",
    "therfor": "therefore",
    "theif": "thief",
    "thier": "their",
    "ther": "their",
    "theres": "there's",
    "thats": "that's",
    "tho": "though",
    "thru": "through",
    "throuhg": "through",
    "throught": "thought",
    "thot": "thought",
    "thougt": "thought",
    "thoughout": "throughout",
    "togather": "together",
    "togehter": "together",
    "togther": "together",
    "tomatos": "tomatoes",
    "tommorow": "tomorrow",
    "tommorrow": "tomorrow",
    "tomorow": "tomorrow",
    "tomorro": "tomorrow",
    "tounge": "tongue",
    "totaly": "totally",
    "totall": "totally",
    "trama": "trauma",
    "truely": "truly",
    "trully": "truly",
    "twelfth": "twelfth",
    "tyrany": "tyranny",
    
    // U
    "underate": "underrate",
    "unfornate": "unfortunate",
    "unfortanate": "unfortunate",
    "unforunate": "unfortunate",
    "unfournate": "unfortunate",
    "unfortune": "unfortunate",
    "unfortunat": "unfortunate",
    "unfortunatly": "unfortunately",
    "unfortunatley": "unfortunately",
    "unfortunalty": "unfortunately",
    "unfortantly": "unfortunately",
    "unfortuantly": "unfortunately",
    "unneccessary": "unnecessary",
    "unnecesary": "unnecessary",
    "unecessary": "unnecessary",
    "unnecessery": "unnecessary",
    "untill": "until",
    "untl": "until",
    "unusuall": "unusual",
    "unusaul": "unusual",
    "upholstry": "upholstery",
    "useable": "usable",
    "usefull": "useful",
    "usful": "useful",
    "usualy": "usually",
    "usally": "usually",
    "ussually": "usually",
    
    // V
    "vaccum": "vacuum",
    "vacume": "vacuum",
    "valueable": "valuable",
    "vegatable": "vegetable",
    "vehical": "vehicle",
    "villian": "villain",
    "visable": "visible",
    
    // W
    "wanna": "want to",
    "warrent": "warrant",
    "wether": "whether",
    "wheather": "weather",
    "wierd": "weird",
    "wired": "weird",
    "wellfare": "welfare",
    "wensday": "Wednesday",
    "wendsday": "Wednesday",
    "wedensday": "Wednesday",
    "wednseday": "Wednesday",
    "whereever": "wherever",
    "whever": "wherever",
    "wich": "which",
    "whcih": "which",
    "whihc": "which",
    "wilfull": "willful",
    "withdrawl": "withdrawal",
    "withold": "withhold",
    "withot": "without",
    "wihout": "without",
    "whitout": "without",
    "wonderfull": "wonderful",
    "wonderfuly": "wonderfully",
    "writting": "writing",
    "writeing": "writing",
    "writen": "written",
    "worls": "world",
    "wordl": "world",
    "wouldnt": "wouldn't",
    "wont": "won't",
    "wasnt": "wasn't",
    "werent": "weren't",
    
    // X, Y, Z
    "yatch": "yacht",
    "yeild": "yield",
    "youre": "you're",
    "your'e": "you're",
    "zefer": "zephyr"
  };

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  let activePopup = null;
  let currentMisspelling = null;
  let currentElement = null;
  let lastWord = '';

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================
  
  /**
   * Extracts the last word from a text string
   * @param {string} text - The input text
   * @returns {string} The last word (lowercase)
   */
  function getLastWord(text) {
    const words = text.trim().split(/\s+/);
    return words[words.length - 1] || '';
  }

  /**
   * Gets the current word being typed (before cursor)
   * @param {HTMLElement} element - The input element
   * @returns {string} The current word
   */
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

  /**
   * Checks if a word is misspelled
   * @param {string} word - The word to check
   * @returns {string|null} The correct spelling or null
   */
  function checkSpelling(word) {
    const lowerWord = word.toLowerCase().replace(/[^a-z']/g, '');
    return MISSPELLINGS[lowerWord] || null;
  }

  /**
   * Gets current date in YYYY-MM-DD format
   * @returns {string} Formatted date
   */
  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  // ============================================================
  // STORAGE FUNCTIONS
  // ============================================================

  /**
   * Logs a misspelling to Chrome storage
   * @param {string} misspelled - The misspelled word
   * @param {string} correct - The correct spelling
   */
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
      
      // Update or create misspelling entry
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
      
      // Update stats
      stats.totalMisspellings++;
      
      // Update weekly data
      if (!stats.weeklyData[today]) {
        stats.weeklyData[today] = { misspellings: 0, corrections: 0 };
      }
      stats.weeklyData[today].misspellings++;
      
      await chrome.storage.local.set({ misspellings, stats });
    } catch (error) {
      console.error('Fountain Spell Checker: Error logging misspelling', error);
    }
  }

  /**
   * Logs a correction to Chrome storage
   * @param {string} word - The word that was corrected
   */
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
      
      // Update corrected count for this word
      if (misspellings[key]) {
        misspellings[key].correctedCount++;
      }
      
      // Update stats
      stats.totalCorrected++;
      
      // Update weekly data
      if (!stats.weeklyData[today]) {
        stats.weeklyData[today] = { misspellings: 0, corrections: 0 };
      }
      stats.weeklyData[today].corrections++;
      
      await chrome.storage.local.set({ misspellings, stats });
    } catch (error) {
      console.error('Fountain Spell Checker: Error logging correction', error);
    }
  }

  // ============================================================
  // POPUP MANAGEMENT
  // ============================================================

  /**
   * Creates and shows the spell check popup
   * @param {HTMLElement} element - The input element
   * @param {string} misspelled - The misspelled word
   * @param {string} correct - The correct spelling
   */
  function showPopup(element, misspelled, correct) {
    // Remove existing popup if any
    hidePopup();
    
    // Create popup container
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
    
    // Position the popup near the element
    document.body.appendChild(popup);
    positionPopup(popup, element);
    
    // Animate in
    requestAnimationFrame(() => {
      popup.classList.add('fountain-spell-visible');
    });
    
    activePopup = popup;
    currentMisspelling = { word: misspelled, correct: correct };
    currentElement = element;
  }

  /**
   * Positions the popup near the input element
   * @param {HTMLElement} popup - The popup element
   * @param {HTMLElement} element - The input element
   */
  function positionPopup(popup, element) {
    const rect = element.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 8;
    let left = rect.left + window.scrollX;
    
    // Adjust if popup would go off screen
    if (left + popupRect.width > window.innerWidth) {
      left = window.innerWidth - popupRect.width - 16;
    }
    
    if (top + popupRect.height > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - popupRect.height - 8;
    }
    
    popup.style.top = `${top}px`;
    popup.style.left = `${Math.max(8, left)}px`;
  }

  /**
   * Hides and removes the active popup
   */
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

  /**
   * Handles input events on text fields
   * @param {Event} event - The input event
   */
  function handleInput(event) {
    const element = event.target;
    
    // Check if this is a text input element
    if (!isTextInput(element)) return;
    
    // If we have an active popup, check if user typed the correct word
    if (activePopup && currentMisspelling && currentElement === element) {
      const currentWord = getCurrentWord(element);
      
      // Check if the word was deleted (user is correcting)
      if (currentWord === '' || !currentWord.toLowerCase().startsWith(currentMisspelling.word.toLowerCase().charAt(0))) {
        // Word was likely deleted, wait for new input
        return;
      }
      
      // Check if user typed the correct word
      if (currentWord.toLowerCase() === currentMisspelling.correct.toLowerCase()) {
        logCorrection(currentMisspelling.word);
        hidePopup();
        return;
      }
    }
  }

  /**
   * Handles keyup events to detect word completion
   * @param {Event} event - The keyup event
   */
  function handleKeyUp(event) {
    const element = event.target;
    
    // Check if this is a text input element
    if (!isTextInput(element)) return;
    
    // Check on space, punctuation, or Enter
    const triggerKeys = [' ', '.', ',', '!', '?', ';', ':', 'Enter', 'Tab'];
    
    if (triggerKeys.includes(event.key)) {
      // Get the text content
      let text = '';
      let cursorPos = 0;
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        text = element.value;
        cursorPos = element.selectionStart || text.length;
      } else if (element.isContentEditable) {
        text = element.textContent || element.innerText || '';
        cursorPos = text.length;
      }
      
      // Get text before cursor (where the space was just typed)
      const textBeforeCursor = text.substring(0, cursorPos);
      
      // Find the last completed word (the word before the space/punctuation)
      // Remove the trailing trigger character and get the last word
      const textWithoutTrigger = textBeforeCursor.replace(/[\s.,!?;:]+$/, '');
      const words = textWithoutTrigger.split(/\s+/);
      const lastCompletedWord = words[words.length - 1] || '';
      const cleanWord = lastCompletedWord.replace(/[^a-zA-Z']/g, '');
      
      console.log('Fountain: Checking word:', cleanWord); // Debug log
      
      if (cleanWord && cleanWord.length >= 2) {
        const correct = checkSpelling(cleanWord);
        
        if (correct) {
          // Found a misspelling!
          console.log('Fountain: Misspelling found!', cleanWord, '->', correct); // Debug log
          showPopup(element, cleanWord, correct);
          logMisspelling(cleanWord, correct);
        }
      }
    }
  }

  /**
   * Checks if an element is a text input
   * @param {HTMLElement} element - The element to check
   * @returns {boolean} True if text input
   */
  function isTextInput(element) {
    if (!element) return false;
    
    const tagName = element.tagName;
    
    // Check for input elements (text type)
    if (tagName === 'INPUT') {
      const type = element.type?.toLowerCase();
      const textTypes = ['text', 'search', 'email', 'url', 'tel', 'password', ''];
      return textTypes.includes(type);
    }
    
    // Check for textarea
    if (tagName === 'TEXTAREA') {
      return true;
    }
    
    // Check for contenteditable
    if (element.isContentEditable) {
      return true;
    }
    
    return false;
  }

  /**
   * Handles focus out to potentially hide popup
   * @param {Event} event - The blur event
   */
  function handleBlur(event) {
    // Delay hiding to allow for click events on popup
    setTimeout(() => {
      if (activePopup && currentElement === event.target) {
        hidePopup();
      }
    }, 200);
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Initialize the spell checker
   */
  function init() {
    // Use event delegation on document for all text inputs
    document.addEventListener('input', handleInput, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('blur', handleBlur, true);
    
    // Handle dynamically created elements via MutationObserver
    const observer = new MutationObserver((mutations) => {
      // Popup repositioning if needed
      if (activePopup && currentElement) {
        const rect = currentElement.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          // Element was removed, hide popup
          hidePopup();
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✨ Fountain Spell Checker initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

