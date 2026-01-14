/**
 * Fountain Spell Checker - Content Script
 * Real spell checking using a dictionary of correct words + optimized fuzzy matching
 * v3 - BK-tree for O(log n) lookups + keyboard shortcuts
 */

(function() {
  'use strict';

  // ============================================================
  // DICTIONARY OF CORRECT WORDS (Common English words)
  // ============================================================
  const WORD_LIST = [
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
    "grateful", "thankful", "careful", "careless",
    
    // Commonly misspelled words (correct spellings)
    "accommodate", "accommodation", "achieve", "achievement", "acknowledge",
    "acquaintance", "acquire", "acquisition", "across", "address", "advertisement",
    "advice", "advise", "affect", "effect", "aggression", "aggressive",
    "amateur", "analysis", "analyze", "annual", "apparent", "appearance",
    "appreciate", "argument", "atheist", "awful", "basically", "beginning",
    "belief", "beneficial", "benefit", "bizarre", "boundary", "breath", "breathe",
    "brilliant", "bureau", "bureaucracy", "business", "calendar", "camouflage",
    "campaign", "candidate", "caribbean", "category", "ceiling", "cemetery",
    "challenge", "changeable", "characteristic", "chief", "colleague",
    "column", "coming", "commission", "commitment", "committee", "communicate",
    "comparative", "comparison", "compatible", "competition", "completely",
    "concentrate", "concern", "condemn", "confusion", "congratulate",
    "conscience", "conscious", "consensus", "consequence", "consistent",
    "contemporary", "content", "continuous", "control", "controlled",
    "controlling", "controversial", "convenience", "convenient", "coolly",
    "cooperate", "cooperation", "coordinate", "coordination", "copyright",
    "correspondence", "correspondent", "criticize", "curiosity", "curious",
    "curriculum", "cylinder", "deceive", "decide", "decision", "defense",
    "definite", "definitely", "definition", "dependent", "describe",
    "description", "desperate", "desperation", "develop", "development",
    "difference", "dilemma", "dining", "disappear", "disappoint", "disappointment",
    "disapprove", "disaster", "discipline", "disease", "dissatisfied",
    "distinguish", "disturb", "divine", "doctor", "dominant", "dominate",
    "doubt", "drunkenness", "easily", "ecstasy", "efficiency", "efficient",
    "eighth", "either", "elaborate", "eliminate", "embarrass", "embarrassment",
    "emergency", "emission", "emphasize", "employee", "employment", "empty",
    "encourage", "enemy", "engagement", "enormous", "enough", "enthusiasm",
    "enthusiastic", "entrance", "envelope", "environment", "environmental",
    "equipment", "equipped", "equivalent", "escape", "especially", "essential",
    "establish", "exaggerate", "exaggeration", "examination", "examine",
    "exceed", "excellence", "excellent", "except", "exception", "excitement",
    "exercise", "exhaust", "exhibit", "exhibition", "existence", "expect",
    "expectation", "expense", "expensive", "experience", "experiment",
    "expert", "explanation", "explicit", "explore", "explosion", "express",
    "expression", "extensive", "extraordinary", "extreme", "extremely",
    "familiar", "fantasy", "fascinate", "fascinating", "fashion", "favorite",
    "feasible", "february", "fierce", "fiery", "finally", "financially",
    "fluorescent", "foreign", "foreigner", "foresee", "forget", "forgettable",
    "forgiveness", "formerly", "forth", "fortunate", "fortunately", "forty",
    "forward", "fourth", "freight", "friend", "friendly", "friendship",
    "frighten", "fulfil", "fulfill", "fundamental", "furniture", "further",
    "furthermore", "gauge", "generally", "generous", "genius", "genuine",
    "global", "government", "governor", "gradually", "grammar", "grammatical",
    "grateful", "great", "grief", "guarantee", "guard", "guardian", "guess",
    "guidance", "guilty", "gymnasium", "handkerchief", "handle", "handsome",
    "happened", "happiness", "harass", "harassment", "height", "helpful",
    "heroes", "hesitate", "hierarchy", "hindrance", "history", "holiday",
    "honor", "honorable", "hopeful", "hopefully", "horizon", "huge",
    "humorous", "humour", "hundred", "hunger", "hygiene", "hypocrisy",
    "hypocrite", "ideal", "ideally", "ignorance", "ignorant", "illegal",
    "illegible", "illiterate", "illness", "illustration", "imaginary",
    "imagination", "imagine", "imitation", "immediate", "immediately",
    "immense", "immigration", "impact", "implement", "implication",
    "importance", "important", "impose", "impossible", "impression",
    "impressive", "improve", "improvement", "incidentally", "include",
    "income", "inconvenience", "inconvenient", "increase", "incredible",
    "incredibly", "independence", "independent", "indicate", "indication",
    "indispensable", "individual", "industrial", "inevitable", "inevitably",
    "infinite", "influence", "influential", "information", "ingredient",
    "inheritance", "initial", "initially", "initiative", "innocence",
    "innocent", "innovation", "inoculate", "inquiry", "insistence",
    "inspiration", "install", "installation", "instance", "instead",
    "institution", "instruction", "instrument", "insurance", "integrate",
    "integration", "intellectual", "intelligence", "intelligent", "intend",
    "intense", "intention", "interest", "interested", "interesting",
    "interfere", "interference", "intermediate", "internal", "international",
    "interpret", "interpretation", "interrupt", "interruption", "intervention",
    "introduce", "introduction", "investigate", "investigation", "investment",
    "invitation", "involve", "involvement", "ironic", "ironically",
    "irrelevant", "irresistible", "island", "issue", "jealous", "jealousy",
    "jewelry", "jewellery", "journalist", "journey", "judgment", "judgement",
    "justice", "justify", "kernel", "keyboard", "kindergarten", "kitchen",
    "knowledge", "knowledgeable", "label", "laboratory", "language", "latter",
    "laugh", "laughter", "launch", "lawyer", "league", "lecture", "legal",
    "leisure", "length", "letter", "liaison", "liberal", "library", "license",
    "licence", "lieutenant", "lightning", "likelihood", "likely", "limousine",
    "literature", "livelihood", "loneliness", "lonely", "loose", "lose",
    "losing", "loss", "lovely", "luxury", "machine", "machinery", "magazine",
    "magnificent", "maintain", "maintenance", "major", "majority", "manage",
    "management", "manager", "maneuver", "manner", "manufacture", "manufacturer",
    "marriage", "marry", "marvelous", "marvellous", "material", "mathematics",
    "matter", "mature", "maximum", "meadow", "meant", "measure", "measurement",
    "mechanism", "medicine", "medieval", "mediocre", "medium", "member",
    "membership", "memento", "memorable", "memory", "mention", "merely",
    "message", "messenger", "method", "middle", "military", "millennium",
    "millionaire", "miniature", "minimum", "minister", "ministry", "minor",
    "minority", "minuscule", "minute", "miracle", "mirror", "mischief",
    "mischievous", "miserable", "misery", "mislead", "missile", "mission",
    "misspell", "mistake", "mixture", "mobile", "model", "moderate", "modern",
    "modest", "moment", "monitor", "moral", "moreover", "mortgage", "mosquito",
    "mother", "motion", "motivate", "motivation", "mountain", "movement",
    "multiple", "municipal", "murder", "muscle", "museum", "mysterious",
    "mystery", "naive", "narrative", "narrow", "nation", "national",
    "native", "natural", "naturally", "nature", "naughty", "navigate",
    "necessary", "necessity", "negative", "neglect", "negotiate", "negotiation",
    "neighbor", "neighbour", "neighborhood", "neighbourhood", "neither",
    "nephew", "nervous", "neutral", "never", "nevertheless", "niece",
    "ninety", "ninth", "noble", "noisy", "nominate", "nomination", "none",
    "nonetheless", "normal", "normally", "northern", "notable", "notably",
    "notice", "noticeable", "notion", "notorious", "novel", "nowadays",
    "nowhere", "nuisance", "numerous", "obedient", "object", "objection",
    "objective", "obligation", "oblige", "observation", "observe", "obstacle",
    "obtain", "obvious", "obviously", "occasion", "occasional", "occasionally",
    "occupation", "occupy", "occur", "occurred", "occurrence", "occurring",
    "offense", "offence", "offensive", "official", "officially", "omission",
    "omit", "operate", "operation", "opinion", "opponent", "opportunity",
    "oppose", "opposite", "opposition", "optimism", "optimistic", "option",
    "optional", "ordinary", "organization", "organize", "origin", "original",
    "originally", "other", "otherwise", "ought", "outcome", "outline",
    "output", "outrageous", "outside", "outstanding", "overall", "overcome",
    "overseas", "overwhelming", "owner", "ownership", "oxygen", "package",
    "paid", "painful", "painting", "pair", "panic", "panicky", "paper",
    "paragraph", "parallel", "parcel", "parent", "parliament", "partial",
    "partially", "participant", "participate", "participation", "particular",
    "particularly", "partly", "partner", "partnership", "passenger", "passion",
    "passionate", "passive", "past", "pastime", "patience", "patient",
    "pattern", "pause", "payment", "peace", "peaceful", "peculiar", "penalty",
    "penetrate", "perceive", "percentage", "perception", "perfect", "perfectly",
    "perform", "performance", "perhaps", "period", "permanent", "permission",
    "permit", "perseverance", "persist", "persistent", "personality",
    "personnel", "perspective", "persuade", "persuasion", "phenomenon",
    "philosophy", "photograph", "phrase", "physical", "physically", "physician",
    "piece", "pigeon", "pilot", "pioneer", "pitiful", "place", "plain",
    "plaintiff", "planet", "planning", "plant", "platform", "plausible",
    "pleasant", "please", "pleasure", "plenty", "pocket", "poem", "poetry",
    "point", "poison", "policy", "polite", "political", "politician",
    "politics", "pollution", "popular", "popularity", "population", "portrait",
    "portray", "position", "positive", "possess", "possession", "possibility",
    "possibly", "postpone", "potato", "potatoes", "potential", "potentially",
    "poverty", "powerful", "practically", "practice", "practise", "praise",
    "prayer", "precede", "precise", "precisely", "precision", "predict",
    "prediction", "prefer", "preference", "preferred", "prejudice", "preliminary",
    "premier", "premise", "preparation", "prepare", "prescription", "presence",
    "present", "presentation", "preserve", "president", "presidential",
    "pressure", "presumably", "pretend", "pretty", "prevent", "prevention",
    "previous", "previously", "price", "pride", "priest", "primarily",
    "primary", "prime", "primitive", "principal", "principle", "print",
    "prior", "priority", "prison", "prisoner", "privacy", "private",
    "privilege", "prize", "probably", "problem", "procedure", "proceed",
    "process", "produce", "producer", "product", "production", "profession",
    "professional", "professor", "profit", "program", "programme", "progress",
    "project", "promise", "promote", "promotion", "prompt", "pronounce",
    "pronunciation", "proof", "propaganda", "proper", "properly", "property",
    "proportion", "proposal", "propose", "prospect", "prosperity", "protect",
    "protection", "protein", "protest", "proud", "prove", "provide", "province",
    "provincial", "provision", "provoke", "psychological", "psychology",
    "public", "publication", "publicity", "publicly", "publish", "publisher",
    "pupil", "purchase", "pure", "purely", "purple", "purpose", "pursue",
    "pursuit", "qualification", "qualify", "quality", "quantity", "quarrel",
    "quarantine", "quarter", "queen", "question", "questionnaire", "queue",
    "quiet", "quietly", "quit", "quite", "quote", "racial", "radical",
    "rage", "railway", "raise", "random", "range", "rapid", "rapidly",
    "rare", "rarely", "rate", "rather", "ratio", "rational", "reach",
    "react", "reaction", "reader", "readily", "reading", "ready", "real",
    "realistic", "reality", "realize", "realise", "really", "reason",
    "reasonable", "reasonably", "reassure", "recall", "receipt", "receive",
    "recent", "recently", "reception", "recipe", "recipient", "recognition",
    "recognize", "recognise", "recommend", "recommendation", "record",
    "recover", "recovery", "recruit", "recruitment", "reduce", "reduction",
    "refer", "referee", "reference", "referred", "reflect", "reflection",
    "reform", "refrigerator", "refuse", "regard", "regarding", "regardless",
    "regime", "region", "regional", "register", "registration", "regret",
    "regular", "regularly", "regulation", "reinforce", "reject", "relate",
    "related", "relation", "relationship", "relative", "relatively", "relax",
    "release", "relevant", "reliable", "relief", "relieve", "religion",
    "religious", "reluctant", "rely", "remain", "remainder", "remarkable",
    "remedy", "remember", "remind", "remote", "remove", "rent", "repair",
    "repeat", "repeatedly", "repetition", "replace", "replacement", "reply",
    "report", "reporter", "represent", "representation", "representative",
    "reproduce", "republic", "republican", "reputation", "request", "require",
    "requirement", "rescue", "research", "researcher", "resemble", "reservation",
    "reserve", "residence", "resident", "resign", "resignation", "resist",
    "resistance", "resolution", "resolve", "resort", "resource", "respect",
    "respond", "response", "responsibility", "responsible", "rest", "restaurant",
    "restore", "restrict", "restriction", "result", "retain", "retire",
    "retirement", "retrieve", "return", "reveal", "revenue", "reverse",
    "review", "revolution", "revolutionary", "reward", "rhetoric", "rhythm",
    "rice", "rich", "rid", "ride", "ridiculous", "right", "rigid", "ring",
    "rise", "risk", "ritual", "rival", "river", "road", "rock", "role",
    "roll", "romantic", "roof", "room", "root", "rope", "rough", "roughly",
    "round", "route", "routine", "row", "royal", "rub", "ruin", "rule",
    "rumor", "rumour", "rural", "rush", "sacred", "sacrifice", "sad",
    "sadly", "safe", "safely", "safety", "sake", "salary", "sale", "salt",
    "sample", "sanction", "sand", "sandwich", "satellite", "satisfaction",
    "satisfactory", "satisfy", "save", "saving", "scale", "scandal", "scarce",
    "scarcely", "scared", "scatter", "scenario", "scene", "scenery", "schedule",
    "scheme", "scholar", "scholarship", "school", "science", "scientific",
    "scientist", "scissors", "scope", "score", "scratch", "screen", "script",
    "sea", "seal", "search", "season", "seat", "secondary", "secret",
    "secretary", "section", "sector", "secure", "security", "see", "seed",
    "seek", "seem", "segment", "seize", "select", "selection", "self",
    "sell", "senate", "senator", "send", "senior", "sensation", "sense",
    "sensible", "sensitive", "sentence", "separate", "separately", "separation",
    "sequence", "series", "serious", "seriously", "servant", "serve",
    "service", "session", "settle", "settlement", "severe", "sex", "sexual",
    "shade", "shadow", "shake", "shall", "shallow", "shame", "shape",
    "share", "sharp", "shed", "sheep", "sheet", "shelf", "shell", "shelter",
    "shift", "shine", "ship", "shirt", "shock", "shoe", "shoot", "shop",
    "shore", "short", "shortage", "shortly", "shot", "shoulder", "shout",
    "show", "shut", "sick", "side", "siege", "sight", "sign", "signal",
    "significance", "significant", "significantly", "silence", "silent",
    "silk", "silly", "silver", "similar", "similarity", "similarly", "simple",
    "simply", "simultaneous", "sin", "since", "sincere", "sincerely", "sing",
    "single", "sink", "sister", "site", "situation", "size", "skill",
    "skin", "sky", "slave", "sleep", "slice", "slide", "slight", "slightly",
    "slip", "slope", "slow", "slowly", "small", "smart", "smell", "smile",
    "smoke", "smooth", "snap", "snow", "social", "society", "soft", "software",
    "soil", "solar", "soldier", "sole", "solely", "solid", "solution",
    "solve", "somebody", "somehow", "someone", "something", "sometimes",
    "somewhat", "somewhere", "son", "song", "soon", "sophisticated", "sorry",
    "sort", "soul", "sound", "source", "south", "southern", "space",
    "span", "spare", "speak", "speaker", "special", "specialist", "species",
    "specific", "specifically", "specification", "specify", "specimen",
    "spectacle", "spectacular", "spectrum", "speculate", "speech", "speed",
    "spell", "spelling", "spend", "sphere", "spirit", "spiritual", "spite",
    "split", "spokesman", "sponsor", "sport", "spot", "spread", "spring",
    "square", "squeeze", "stability", "stable", "staff", "stage", "stair",
    "stake", "stand", "standard", "star", "stare", "start", "state",
    "statement", "station", "statistics", "status", "stay", "steady",
    "steal", "steam", "steel", "steep", "stem", "step", "stick", "stiff",
    "still", "stimulate", "stock", "stomach", "stone", "stop", "storage",
    "store", "storm", "story", "straight", "strain", "strange", "stranger",
    "strategic", "strategy", "stream", "street", "strength", "strengthen",
    "stress", "stretch", "strict", "strictly", "strike", "string", "strip",
    "stroke", "strong", "strongly", "structural", "structure", "struggle",
    "student", "studio", "study", "stuff", "stupid", "style", "subject",
    "submit", "subsequent", "subsequently", "substance", "substantial",
    "substantially", "substitute", "subtle", "succeed", "success", "successful",
    "successfully", "such", "sudden", "suddenly", "suffer", "sufficient",
    "sufficiently", "sugar", "suggest", "suggestion", "suicide", "suit",
    "suitable", "sum", "summary", "summer", "summit", "sun", "super",
    "superb", "superintendent", "superior", "superstition", "supervise",
    "supervision", "supervisor", "supplement", "supply", "support", "supporter",
    "suppose", "supposed", "suppress", "supreme", "sure", "surely", "surface",
    "surgery", "surplus", "surprise", "surprised", "surprising", "surprisingly",
    "surround", "surrounding", "survey", "survival", "survive", "survivor",
    "suspect", "suspend", "suspicion", "suspicious", "sustain", "swallow",
    "swear", "sweep", "sweet", "swim", "swing", "switch", "symbol", "sympathy",
    "symptom", "system", "table", "tackle", "tail", "take", "tale", "talent",
    "talk", "tall", "tank", "tap", "tape", "target", "task", "taste",
    "tax", "teach", "teacher", "teaching", "team", "tear", "technical",
    "technique", "technology", "teenage", "teenager", "telephone", "television",
    "tell", "temperature", "temporary", "tempt", "tend", "tendency", "tender",
    "tennis", "tense", "tension", "tent", "term", "terrible", "terribly",
    "territory", "terror", "terrorist", "test", "testimony", "text", "than",
    "thank", "that", "theater", "theatre", "theme", "themselves", "then",
    "theoretical", "theory", "therapy", "there", "thereby", "therefore",
    "thick", "thief", "thin", "thing", "think", "thinking", "third",
    "thorough", "thoroughly", "those", "though", "thought", "thousand",
    "threat", "threaten", "threshold", "thrive", "throat", "through",
    "throughout", "throw", "thrust", "thumb", "thus", "ticket", "tide",
    "tie", "tight", "time", "tiny", "tip", "tire", "tired", "tissue",
    "title", "tobacco", "today", "toe", "together", "toilet", "tolerance",
    "tolerate", "tomato", "tomatoes", "tomorrow", "tone", "tongue", "tonight",
    "tool", "tooth", "top", "topic", "torture", "total", "totally", "touch",
    "tough", "tour", "tourist", "tournament", "toward", "towards", "tower",
    "town", "toy", "trace", "track", "trade", "tradition", "traditional",
    "traffic", "tragedy", "trail", "train", "trainer", "training", "trait",
    "transfer", "transform", "transformation", "transition", "translate",
    "translation", "transmission", "transmit", "transparent", "transport",
    "transportation", "trap", "trauma", "travel", "traveler", "traveller",
    "treasure", "treat", "treatment", "treaty", "tree", "tremendous", "trend",
    "trial", "tribe", "tribute", "trick", "trigger", "trip", "triumph",
    "troop", "tropical", "trouble", "truck", "true", "truly", "trust",
    "truth", "try", "tube", "tune", "tunnel", "turn", "twelve", "twenty",
    "twice", "twin", "twist", "type", "typical", "typically", "tyranny",
    "ugly", "ultimate", "ultimately", "umbrella", "unable", "uncertainty",
    "uncle", "undergo", "undermine", "underneath", "understand", "understanding",
    "undertake", "unemployment", "unexpected", "unfair", "unfortunate",
    "unfortunately", "uniform", "union", "unique", "unit", "unite", "unity",
    "universal", "universe", "university", "unknown", "unless", "unlike",
    "unlikely", "unnecessary", "until", "unusual", "up", "update", "upon",
    "upper", "upset", "upstairs", "urban", "urge", "urgent", "usage",
    "useful", "user", "usual", "usually", "utility", "utilize", "utilise",
    "vacation", "vacuum", "vague", "valid", "valley", "valuable", "value",
    "van", "variety", "various", "vary", "vast", "vegetable", "vehicle",
    "venture", "venue", "verb", "verse", "version", "vertical", "very",
    "vessel", "veteran", "via", "victim", "victory", "video", "view",
    "viewer", "village", "violate", "violation", "violence", "violent",
    "virtual", "virtually", "virtue", "virus", "visible", "vision", "visit",
    "visitor", "visual", "vital", "vivid", "vocabulary", "voice", "volume",
    "voluntary", "volunteer", "vote", "voter", "vulnerable", "wage", "wait",
    "wake", "walk", "wall", "wander", "want", "war", "warm", "warn",
    "warning", "warrant", "wash", "waste", "watch", "water", "wave",
    "way", "weak", "weakness", "wealth", "wealthy", "weapon", "wear",
    "weather", "wedding", "week", "weekend", "weekly", "weigh", "weight",
    "weird", "welcome", "welfare", "well", "west", "western", "wet",
    "whatever", "wheat", "wheel", "whenever", "where", "whereas", "wherever",
    "whether", "while", "whisper", "white", "who", "whoever", "whole",
    "whose", "why", "wide", "widely", "widespread", "wife", "wild", "will",
    "willing", "willingness", "win", "wind", "window", "wine", "wing",
    "winner", "winter", "wire", "wisdom", "wise", "wish", "withdraw",
    "withdrawal", "within", "without", "witness", "woman", "wonder",
    "wonderful", "wood", "wooden", "word", "work", "worker", "working",
    "workshop", "world", "worldwide", "worried", "worry", "worse", "worship",
    "worst", "worth", "worthy", "would", "wound", "wrap", "write", "writer",
    "writing", "wrong", "yard", "yeah", "year", "yellow", "yes", "yesterday",
    "yet", "yield", "young", "youngster", "your", "yours", "yourself",
    "youth", "zone"
  ];

  // ============================================================
  // BK-TREE IMPLEMENTATION FOR FAST FUZZY MATCHING
  // ============================================================

  /**
   * Calculate Levenshtein distance between two strings
   * Optimized with early termination when exceeding maxDistance
   */
  function levenshtein(a, b, maxDistance = Infinity) {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    // Quick length-based rejection
    if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;
    
    // Ensure a is the shorter string for memory efficiency
    if (a.length > b.length) {
      [a, b] = [b, a];
    }
    
    const aLen = a.length;
    const bLen = b.length;
    
    // Use single array instead of matrix for memory efficiency
    let prevRow = new Array(aLen + 1);
    let currRow = new Array(aLen + 1);
    
    // Initialize first row
    for (let i = 0; i <= aLen; i++) {
      prevRow[i] = i;
    }
    
    for (let j = 1; j <= bLen; j++) {
      currRow[0] = j;
      let minInRow = j;
      
      for (let i = 1; i <= aLen; i++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        currRow[i] = Math.min(
          prevRow[i] + 1,      // deletion
          currRow[i - 1] + 1,  // insertion
          prevRow[i - 1] + cost // substitution
        );
        minInRow = Math.min(minInRow, currRow[i]);
      }
      
      // Early termination if all values in row exceed maxDistance
      if (minInRow > maxDistance) {
        return maxDistance + 1;
      }
      
      // Swap rows
      [prevRow, currRow] = [currRow, prevRow];
    }
    
    return prevRow[aLen];
  }

  /**
   * BK-Tree Node
   */
  class BKNode {
    constructor(word) {
      this.word = word;
      this.children = new Map(); // distance -> child node
    }
  }

  /**
   * BK-Tree for efficient fuzzy string matching
   * Provides O(log n) average case lookups instead of O(n)
   */
  class BKTree {
    constructor() {
      this.root = null;
      this.size = 0;
    }

    /**
     * Add a word to the tree
     */
    add(word) {
      if (!this.root) {
        this.root = new BKNode(word);
        this.size = 1;
        return;
      }

      let current = this.root;
      while (true) {
        const dist = levenshtein(word, current.word);
        
        if (dist === 0) return; // Word already exists
        
        if (!current.children.has(dist)) {
          current.children.set(dist, new BKNode(word));
          this.size++;
          return;
        }
        
        current = current.children.get(dist);
      }
    }

    /**
     * Find all words within maxDistance of the query word
     */
    search(query, maxDistance) {
      const results = [];
      
      if (!this.root) return results;
      
      const stack = [this.root];
      
      while (stack.length > 0) {
        const node = stack.pop();
        const dist = levenshtein(query, node.word, maxDistance + 1);
        
        if (dist <= maxDistance) {
          results.push({ word: node.word, distance: dist });
        }
        
        // Only explore children within the valid range
        const minDist = Math.max(0, dist - maxDistance);
        const maxDist = dist + maxDistance;
        
        for (const [childDist, childNode] of node.children) {
          if (childDist >= minDist && childDist <= maxDist) {
            stack.push(childNode);
          }
        }
      }
      
      return results;
    }

    /**
     * Check if a word exists exactly in the tree
     */
    contains(word) {
      if (!this.root) return false;
      
      let current = this.root;
      while (current) {
        const dist = levenshtein(word, current.word);
        if (dist === 0) return true;
        current = current.children.get(dist);
      }
      
      return false;
    }
  }

  // ============================================================
  // DICTIONARY INITIALIZATION
  // ============================================================
  
  // Create Set for O(1) exact match lookups
  const DICTIONARY = new Set(WORD_LIST);
  
  // Build BK-tree for efficient fuzzy matching
  const bkTree = new BKTree();
  for (const word of WORD_LIST) {
    bkTree.add(word);
  }

  // Cache for recent lookups (LRU-style)
  const lookupCache = new Map();
  const CACHE_SIZE = 100;

  function getCachedCorrection(word) {
    if (lookupCache.has(word)) {
      const result = lookupCache.get(word);
      // Move to end (most recently used)
      lookupCache.delete(word);
      lookupCache.set(word, result);
      return result;
    }
    return undefined;
  }

  function setCachedCorrection(word, correction) {
    if (lookupCache.size >= CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = lookupCache.keys().next().value;
      lookupCache.delete(firstKey);
    }
    lookupCache.set(word, correction);
  }

  // ============================================================
  // SPELL CHECKING FUNCTIONS
  // ============================================================

  /**
   * Find the best matching word from dictionary using BK-tree
   */
  function findCorrection(word) {
    const lowerWord = word.toLowerCase();
    
    // Check exact match first (O(1))
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
    
    // Check cache
    const cached = getCachedCorrection(lowerWord);
    if (cached !== undefined) {
      return cached;
    }
    
    // Calculate max allowed distance based on word length
    const maxDistance = lowerWord.length <= 4 ? 1 : 
                        lowerWord.length <= 6 ? 2 : 
                        lowerWord.length <= 9 ? 3 : 4;
    
    // Search BK-tree for candidates
    const candidates = bkTree.search(lowerWord, maxDistance);
    
    if (candidates.length === 0) {
      setCachedCorrection(lowerWord, null);
      return null;
    }
    
    // Find best match (closest distance, then alphabetically for ties)
    candidates.sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      return a.word.localeCompare(b.word);
    });
    
    // Filter out exact matches (distance 0)
    const corrections = candidates.filter(c => c.distance > 0);
    
    if (corrections.length === 0) {
      setCachedCorrection(lowerWord, null);
      return null;
    }
    
    const bestMatch = corrections[0].word;
    setCachedCorrection(lowerWord, bestMatch);
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
      <div class="fountain-spell-hint">Delete and retype correctly • Press <kbd>Esc</kbd> to dismiss</div>
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
      
      const popupToRemove = activePopup;
      setTimeout(() => {
        if (popupToRemove && popupToRemove.parentNode) {
          popupToRemove.parentNode.removeChild(popupToRemove);
        }
      }, 200);
      
      activePopup = null;
      currentMisspelling = null;
      currentElement = null;
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

  function handleKeyDown(event) {
    // Escape key dismisses the popup
    if (event.key === 'Escape' && activePopup) {
      event.preventDefault();
      event.stopPropagation();
      hidePopup();
      return;
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
    // Use capture phase for keydown to intercept Escape before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
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
    
    console.log(`✨ Fountain Spell Checker initialized (v3 - BK-tree optimized)`);
    console.log(`   Dictionary: ${DICTIONARY.size} words | BK-tree nodes: ${bkTree.size}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
