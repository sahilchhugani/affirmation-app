const button = document.getElementById("new-affirmation");
const text = document.getElementById("affirmation");
const heartButton = document.getElementById("heart-button");
const dailyButton = document.getElementById("refresh-daily");
const dailyText = document.getElementById("daily-affirmation");
const dailyStatus = document.getElementById("daily-status");
const favoritesToggle = document.getElementById("favorites-toggle");
const favoritesSidebar = document.getElementById("favorites-sidebar");
const closeSidebar = document.getElementById("close-sidebar");
const favoritesList = document.getElementById("favorites-list");
const streakNumber = document.getElementById("streak-number");
const nameInput = document.getElementById("name-input");
const saveNameButton = document.getElementById("save-name");
const personalTitle = document.getElementById("personal-title");
const nameToggle = document.getElementById("name-toggle");
const nameSidebar = document.getElementById("name-sidebar");
const closeNameSidebar = document.getElementById("close-name-sidebar");
const themeToggle = document.getElementById("theme-toggle");
const soundToggle = document.getElementById("sound-toggle");
const categoryButtons = document.getElementById("category-buttons");
const relationshipToggle = document.getElementById("relationship-toggle");
const relationshipSidebar = document.getElementById("relationship-sidebar");
const closeRelationshipSidebar = document.getElementById("close-relationship-sidebar");
const partnerNameInput = document.getElementById("partner-name-input");
const savePartnerNameButton = document.getElementById("save-partner-name");
const relationshipModeCheckbox = document.getElementById("relationship-mode-checkbox");
const regularCategories = document.getElementById("regular-categories");
const relationshipCategories = document.getElementById("relationship-categories");
const relationshipCategoryButtons = document.getElementById("relationship-category-buttons");
const partnerDisplayName = document.getElementById("partner-display-name");
const feelingInput = document.getElementById("feeling-input");
const body = document.body;
const flowersContainer = document.querySelector('.flowers-container');

// Sound settings
let soundEnabled = true;
let audioContext = null;

// Category settings
let currentCategory = 'general';
let currentRelationshipCategory = 'love';

// Relationship mode settings
let relationshipMode = false;
let partnerName = '';

// Typing animation settings
let isTyping = false;
let typingTimeout = null;

// Initialize Audio Context (must be done after user interaction)
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Play a gentle chime sound using Web Audio API
function playChime() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    // Create a gentle, bell-like chime with multiple harmonics
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - a pleasant C major chord
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      
      // Stagger the notes slightly for a more musical effect
      const startTime = now + (index * 0.05);
      const volume = 0.15 - (index * 0.03); // Decreasing volume for each note
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 1.3);
    });
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

// Play a special sparkle sound for daily affirmations
function playSparkle() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    // Create a magical sparkle effect with ascending notes
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      
      const startTime = now + (index * 0.1);
      const volume = 0.12;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.9);
    });
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

// Play a soft pop for favorites
function playPop() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, now); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

// Play a soft keystroke sound for typing animation
function playKeystroke() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    // Random frequency for variety
    const freq = 800 + Math.random() * 400;
    oscillator.frequency.setValueAtTime(freq, now);
    
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch (e) {
    // Silent fail
  }
}

// Typing animation function
async function typeText(element, text, speed = 30) {
  isTyping = true;
  element.textContent = '';
  element.classList.add('typing-cursor');
  
  for (let i = 0; i < text.length; i++) {
    if (!isTyping) break; // Allow interruption
    
    element.textContent += text[i];
    
    // Play keystroke sound occasionally (not every character)
    if (i % 3 === 0) {
      playKeystroke();
    }
    
    // Variable speed for more natural feel
    const delay = text[i] === ' ' ? speed * 0.5 : 
                  text[i] === '.' || text[i] === '!' || text[i] === '?' ? speed * 3 :
                  text[i] === ',' ? speed * 2 :
                  speed + Math.random() * 20;
    
    await new Promise(resolve => {
      typingTimeout = setTimeout(resolve, delay);
    });
  }
  
  element.classList.remove('typing-cursor');
  isTyping = false;
}

// Stop typing animation
function stopTyping() {
  isTyping = false;
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
}

// Load sound preference
function loadSoundPreference() {
  const saved = localStorage.getItem('soundEnabled');
  soundEnabled = saved === null ? true : saved === 'true';
  updateSoundToggle();
}

// Toggle sound on/off
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundToggle();
  
  // Play a test sound when enabling
  if (soundEnabled) {
    playPop();
  }
}

// Update sound toggle button appearance
function updateSoundToggle() {
  if (soundToggle) {
    soundToggle.textContent = soundEnabled ? '🔔' : '🔕';
    soundToggle.title = soundEnabled ? 'Sound On (click to mute)' : 'Sound Off (click to unmute)';
  }
}

// Initialize daily affirmation on page load
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadName();
  loadSoundPreference();
  loadCategory();
  loadRelationshipCategory();
  loadPartnerName();
  loadRelationshipMode();
  loadDailyAffirmation();
  loadFavorites();
  updateDailyButtonState();
  updateStreak();
});

// Name management functions
function loadName() {
  const savedName = localStorage.getItem('userName');
  if (savedName && savedName.trim() !== '') {
    nameInput.value = savedName;
    updateTitle(savedName);
  } else {
    updateTitle('');
  }
  // Always start with sidebar closed - user can open it with the toggle
  nameSidebar.classList.remove('open');
}

function saveName() {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem('userName', name);
    updateTitle(name);
    // Show a brief confirmation
    saveNameButton.textContent = 'Saved!';
    setTimeout(() => {
      saveNameButton.textContent = 'Save';
      // Auto-close sidebar after saving
      nameSidebar.classList.remove('open');
    }, 1000);
  } else {
    // Clear name if empty
    localStorage.removeItem('userName');
    updateTitle('');
  }
}

function toggleNameSidebar() {
  nameSidebar.classList.toggle('open');
}

function closeNameSidebarHandler() {
  nameSidebar.classList.remove('open');
}

function updateTitle(name) {
  if (name && name.trim() !== '') {
    personalTitle.textContent = `For ${name} 💖`;
    document.title = `For ${name} 💖`;
  } else {
    personalTitle.textContent = 'For You 💖';
    document.title = 'Words of Affirmation 💖';
  }
}

// Theme management
const themes = ['pink', 'christmas', 'winter'];
let currentThemeIndex = 0;

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && themes.includes(savedTheme)) {
    currentThemeIndex = themes.indexOf(savedTheme);
  }
  applyTheme(themes[currentThemeIndex]);
}

function applyTheme(theme) {
  // Remove all theme classes
  body.classList.remove('theme-pink', 'theme-christmas', 'theme-winter');
  // Add current theme class
  body.classList.add(`theme-${theme}`);
  
  // Update flowers/snowflakes based on theme
  updateThemeElements(theme);
  
  // Save theme preference
  localStorage.setItem('theme', theme);
}

function updateThemeElements(theme) {
  const flowers = flowersContainer.querySelectorAll('.flower');
  
  if (theme === 'christmas') {
    // Change flowers to snowflakes and holiday emojis
    const holidayEmojis = ['❄️', '🎄', '⭐', '🎁', '❄️', '🎄', '⭐', '🎁', '❄️', '🎄', '⭐', '🎁', '❄️', '🎄', '⭐'];
    flowers.forEach((flower, index) => {
      flower.textContent = holidayEmojis[index % holidayEmojis.length];
    });
  } else if (theme === 'winter') {
    // Change to snowflakes
    const winterEmojis = ['❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️', '❄️'];
    flowers.forEach((flower, index) => {
      flower.textContent = winterEmojis[index % winterEmojis.length];
    });
  } else {
    // Default pink theme - restore flowers
    const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌸', '🌺', '🌻'];
    flowers.forEach((flower, index) => {
      flower.textContent = flowerEmojis[index % flowerEmojis.length];
    });
  }
}

function switchTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(themes[currentThemeIndex]);
}

// Event listeners for name input
saveNameButton.addEventListener('click', saveName);
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveName();
  }
});
nameToggle.addEventListener('click', toggleNameSidebar);
closeNameSidebar.addEventListener('click', closeNameSidebarHandler);
themeToggle.addEventListener('click', switchTheme);

// Close name sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (nameSidebar.classList.contains('open') && 
      !nameSidebar.contains(e.target) && 
      !nameToggle.contains(e.target)) {
    closeNameSidebarHandler();
  }
});

// Streak tracking functions
function getTodayDate() {
  return new Date().toDateString();
}

function getTodayDateISO() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

function getStreakData() {
  const streakData = localStorage.getItem('streakData');
  return streakData ? JSON.parse(streakData) : { streak: 0, lastDate: null };
}

function saveStreakData(streak, lastDate) {
  localStorage.setItem('streakData', JSON.stringify({ streak, lastDate }));
}

function updateStreak() {
  const today = getTodayDateISO();
  const streakData = getStreakData();
  
  if (!streakData.lastDate) {
    // First time using the app
    streakNumber.textContent = '0';
    return;
  }
  
  const lastDate = new Date(streakData.lastDate);
  const todayDate = new Date(today);
  const diffTime = todayDate - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - keep current streak (but ensure it's at least 1 if they've used it)
    streakNumber.textContent = streakData.streak > 0 ? streakData.streak : '0';
  } else if (diffDays === 1) {
    // Consecutive day - show current streak, will increment when they use it
    streakNumber.textContent = streakData.streak || '0';
  } else {
    // Missed a day - reset streak display (will be set to 1 when they use it)
    streakNumber.textContent = '0';
  }
}

function incrementStreak() {
  const today = getTodayDateISO();
  const streakData = getStreakData();
  
  if (!streakData.lastDate) {
    // First time
    saveStreakData(1, today);
    streakNumber.textContent = '1';
    return;
  }
  
  const lastDate = new Date(streakData.lastDate);
  const todayDate = new Date(today);
  const diffTime = todayDate - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - don't increment, just update display
    streakNumber.textContent = streakData.streak || 1;
  } else if (diffDays === 1) {
    // Consecutive day - increment
    const newStreak = (streakData.streak || 0) + 1;
    saveStreakData(newStreak, today);
    streakNumber.textContent = newStreak;
  } else {
    // Missed days - reset to 1
    saveStreakData(1, today);
    streakNumber.textContent = '1';
  }
}

// Check if daily affirmation was already refreshed today

function getLastDailyRefreshDate() {
  return localStorage.getItem('lastDailyRefresh');
}

function setLastDailyRefreshDate() {
  localStorage.setItem('lastDailyRefresh', getTodayDate());
}

function canRefreshDaily() {
  const lastRefresh = getLastDailyRefreshDate();
  const today = getTodayDate();
  return lastRefresh !== today;
}

function updateDailyButtonState() {
  if (!canRefreshDaily()) {
    dailyButton.disabled = true;
    dailyButton.textContent = "Already refreshed today";
    dailyStatus.textContent = "Come back tomorrow for a new special affirmation!";
    dailyStatus.style.opacity = "0.8";
  } else {
    dailyButton.disabled = false;
    dailyButton.textContent = "Get Today's Special";
    dailyStatus.textContent = "";
  }
}

function loadDailyAffirmation() {
  const savedDaily = localStorage.getItem('dailyAffirmation');
  const savedDate = localStorage.getItem('dailyAffirmationDate');
  
  if (savedDaily && savedDate === getTodayDate()) {
    dailyText.textContent = savedDaily;
    updateDailyButtonState();
  }
}

async function fetchDailyAffirmation() {
  if (!canRefreshDaily()) {
    return;
  }

  dailyText.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 200));
  
  dailyText.textContent = 'Preparing something special...';
  dailyText.classList.remove('fade-out');
  dailyText.classList.add('fade-in');
  
  try {
    const response = await fetch('/generate-daily-affirmation');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    dailyText.classList.remove('fade-in');
    dailyText.classList.add('fade-out');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Display the affirmation (no typing animation)
    const affirmationText = data.affirmation || 'Something special happened, but it is beyond words!';
    dailyText.textContent = affirmationText;
    dailyText.classList.remove('fade-out');
    dailyText.classList.add('fade-in');
    
    // Play sparkle sound for daily affirmation
    playSparkle();
    
    // Save to localStorage
    localStorage.setItem('dailyAffirmation', affirmationText);
    localStorage.setItem('dailyAffirmationDate', getTodayDate());
    setLastDailyRefreshDate();
    updateDailyButtonState();
    
    // Update streak
    incrementStreak();
    
    setTimeout(() => {
      dailyText.classList.remove('fade-in');
    }, 400);
  } catch (error) {
    dailyText.textContent = 'Sorry, could not fetch today\'s special affirmation right now.';
    dailyText.classList.remove('fade-out');
    dailyText.classList.add('fade-in');
  }
}

async function fetchAffirmation() {
  // Stop any ongoing typing
  stopTyping();
  
  // Add fade-out animation
  text.classList.add('fade-out');
  
  // Wait for fade-out to complete
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const loadingMessage = relationshipMode 
    ? `Writing something special for ${partnerName || 'your love'}...` 
    : 'Thinking of something nice…';
  text.textContent = loadingMessage;
  text.classList.remove('fade-out');
  text.classList.add('fade-in');
  
  // Reset heart button
  heartButton.textContent = '🤍';
  heartButton.classList.remove('favorited');
  
  try {
    let response;
    if (relationshipMode) {
      // Use relationship endpoint
      const encodedName = encodeURIComponent(partnerName || 'my love');
      response = await fetch(`/generate-relationship-affirmation?category=${currentRelationshipCategory}&partnerName=${encodedName}`);
    } else {
      // Use regular endpoint, include custom feeling if provided
      const customFeeling = feelingInput ? feelingInput.value.trim() : '';
      const feelingParam = customFeeling ? `&feeling=${encodeURIComponent(customFeeling)}` : '';
      response = await fetch(`/generate-affirmation?category=${currentCategory}${feelingParam}`);
      
      // Clear the feeling input after use
      if (feelingInput && customFeeling) {
        feelingInput.value = '';
      }
    }
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Fade out loading text
    text.classList.remove('fade-in');
    text.classList.add('fade-out');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Display the affirmation (no typing animation to avoid scrambling)
    const affirmationText = data.affirmation || 'Something nice happened, but it is beyond words!';
    text.textContent = affirmationText;
    text.classList.remove('fade-out');
    text.classList.add('fade-in');
    
    // Play chime sound
    playChime();
    
    // Update streak when user gets a new affirmation
    incrementStreak();
    
    // Remove fade-in class after animation completes
    setTimeout(() => {
      text.classList.remove('fade-in');
    }, 400);
  } catch (error) {
    text.textContent = 'Sorry, could not fetch a new affirmation right now.';
    text.classList.remove('fade-out');
    text.classList.add('fade-in');
  }
}

function saveFavorite() {
  const affirmation = text.textContent;
  if (!affirmation || affirmation === 'Click the button for a little love!' || affirmation.includes('Thinking') || affirmation.includes('Sorry')) {
    return;
  }

  const favorites = getFavorites();
  
  // Check if already favorited
  const isAlreadyFavorite = favorites.some(fav => fav.text === affirmation);
  
  if (isAlreadyFavorite) {
    // Remove from favorites
    const updatedFavorites = favorites.filter(fav => fav.text !== affirmation);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    heartButton.textContent = '🤍';
    heartButton.classList.remove('favorited');
  } else {
    // Add to favorites
    const newFavorite = {
      text: affirmation,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: Date.now()
    };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    heartButton.textContent = '❤️';
    heartButton.classList.add('favorited');
    
    // Play pop sound when favoriting
    playPop();
  }
  
  loadFavorites();
}

function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function loadFavorites() {
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p class="no-favorites">No favorites yet. Click the heart to save affirmations!</p>';
    return;
  }
  
  // Sort by most recent first
  favorites.sort((a, b) => b.timestamp - a.timestamp);
  
  favoritesList.innerHTML = favorites.map((fav, index) => `
    <div class="favorite-item">
      <div class="favorite-text">${fav.text}</div>
      <div class="favorite-date">${fav.date}</div>
      <button class="remove-favorite" data-index="${index}">×</button>
    </div>
  `).join('');
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      removeFavorite(index);
    });
  });
  
  // Check if current affirmation is favorited
  const currentAffirmation = text.textContent;
  const isFavorite = favorites.some(fav => fav.text === currentAffirmation);
  if (isFavorite) {
    heartButton.textContent = '❤️';
    heartButton.classList.add('favorited');
  } else {
    heartButton.textContent = '🤍';
    heartButton.classList.remove('favorited');
  }
}

function removeFavorite(index) {
  const favorites = getFavorites();
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavorites();
  
  // Update heart button if current affirmation was removed
  const currentAffirmation = text.textContent;
  const isFavorite = favorites.some(fav => fav.text === currentAffirmation);
  if (!isFavorite) {
    heartButton.textContent = '🤍';
    heartButton.classList.remove('favorited');
  }
}

function toggleSidebar() {
  favoritesSidebar.classList.toggle('open');
}

function closeSidebarHandler() {
  favoritesSidebar.classList.remove('open');
}

// Category selection
function selectCategory(category) {
  currentCategory = category;
  localStorage.setItem('selectedCategory', category);
  
  // Update button states
  const buttons = categoryButtons.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  // Play a soft click sound
  playPop();
}

function loadCategory() {
  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    currentCategory = saved;
    const buttons = categoryButtons.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === saved) {
        btn.classList.add('active');
      }
    });
  }
}

// Initialize category buttons
if (categoryButtons) {
  categoryButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      selectCategory(e.target.dataset.category);
    }
  });
}

// Relationship mode functions
function selectRelationshipCategory(category) {
  currentRelationshipCategory = category;
  localStorage.setItem('selectedRelationshipCategory', category);
  
  // Update button states
  const buttons = relationshipCategoryButtons.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  // Play a soft click sound
  playPop();
}

function loadRelationshipCategory() {
  const saved = localStorage.getItem('selectedRelationshipCategory');
  if (saved) {
    currentRelationshipCategory = saved;
    if (relationshipCategoryButtons) {
      const buttons = relationshipCategoryButtons.querySelectorAll('.category-btn');
      buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === saved) {
          btn.classList.add('active');
        }
      });
    }
  }
}

function loadPartnerName() {
  const saved = localStorage.getItem('partnerName');
  if (saved) {
    partnerName = saved;
    if (partnerNameInput) partnerNameInput.value = saved;
    if (partnerDisplayName) partnerDisplayName.textContent = saved;
  }
}

function savePartnerName() {
  const name = partnerNameInput.value.trim();
  if (name) {
    partnerName = name;
    localStorage.setItem('partnerName', name);
    if (partnerDisplayName) partnerDisplayName.textContent = name;
    
    // Show confirmation
    savePartnerNameButton.textContent = 'Saved!';
    setTimeout(() => {
      savePartnerNameButton.textContent = 'Save';
    }, 1000);
    
    playPop();
  }
}

function loadRelationshipMode() {
  const saved = localStorage.getItem('relationshipMode');
  relationshipMode = saved === 'true';
  
  if (relationshipModeCheckbox) {
    relationshipModeCheckbox.checked = relationshipMode;
  }
  
  updateRelationshipModeUI();
}

function toggleRelationshipMode() {
  relationshipMode = relationshipModeCheckbox.checked;
  localStorage.setItem('relationshipMode', relationshipMode);
  updateRelationshipModeUI();
  playPop();
}

function updateRelationshipModeUI() {
  if (relationshipMode) {
    // Show relationship categories, hide regular
    if (regularCategories) regularCategories.style.display = 'none';
    if (relationshipCategories) relationshipCategories.style.display = 'block';
    if (relationshipToggle) relationshipToggle.classList.add('active');
    
    // Update button text
    button.textContent = `Send love to ${partnerName || 'your love'} 💕`;
    
    // Update title
    if (partnerName) {
      personalTitle.textContent = `For ${partnerName} 💕`;
    } else {
      personalTitle.textContent = 'For Your Love 💕';
    }
  } else {
    // Show regular categories, hide relationship
    if (regularCategories) regularCategories.style.display = 'block';
    if (relationshipCategories) relationshipCategories.style.display = 'none';
    if (relationshipToggle) relationshipToggle.classList.remove('active');
    
    // Restore button text
    button.textContent = 'Show me love ❤️';
    
    // Restore title based on user name
    const userName = localStorage.getItem('userName');
    if (userName) {
      personalTitle.textContent = `For ${userName} 💖`;
    } else {
      personalTitle.textContent = 'For You 💖';
    }
  }
}

function toggleRelationshipSidebar() {
  relationshipSidebar.classList.toggle('open');
}

function closeRelationshipSidebarHandler() {
  relationshipSidebar.classList.remove('open');
}

// Initialize relationship category buttons
if (relationshipCategoryButtons) {
  relationshipCategoryButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      selectRelationshipCategory(e.target.dataset.category);
    }
  });
}

// Event listeners
button.addEventListener("click", fetchAffirmation);
heartButton.addEventListener("click", saveFavorite);
dailyButton.addEventListener("click", fetchDailyAffirmation);
favoritesToggle.addEventListener("click", toggleSidebar);
closeSidebar.addEventListener("click", closeSidebarHandler);
if (soundToggle) soundToggle.addEventListener("click", toggleSound);

// Enter key on feeling input triggers affirmation
if (feelingInput) {
  feelingInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchAffirmation();
    }
  });
}

// Relationship mode event listeners
if (relationshipToggle) relationshipToggle.addEventListener("click", toggleRelationshipSidebar);
if (closeRelationshipSidebar) closeRelationshipSidebar.addEventListener("click", closeRelationshipSidebarHandler);
if (savePartnerNameButton) savePartnerNameButton.addEventListener("click", savePartnerName);
if (partnerNameInput) {
  partnerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') savePartnerName();
  });
}
if (relationshipModeCheckbox) relationshipModeCheckbox.addEventListener("change", toggleRelationshipMode);

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (favoritesSidebar.classList.contains('open') && 
      !favoritesSidebar.contains(e.target) && 
      !favoritesToggle.contains(e.target)) {
    closeSidebarHandler();
  }
  
  // Close relationship sidebar when clicking outside
  if (relationshipSidebar && relationshipSidebar.classList.contains('open') && 
      !relationshipSidebar.contains(e.target) && 
      !relationshipToggle.contains(e.target)) {
    closeRelationshipSidebarHandler();
  }
});
