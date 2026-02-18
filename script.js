// ===== Dropdown Management =====
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchSuggestions = document.getElementById('searchSuggestions');
const videoModal = document.getElementById('videoModal');
const courseVideo = document.getElementById('courseVideo');
const courseYoutube = document.getElementById('courseYoutube');
const videoTitleEl = document.getElementById('videoTitle');
const videoSubtitleEl = document.getElementById('videoSubtitle');
const videoCloseBtn = document.getElementById('videoCloseBtn');

// Track which course is currently selected for playback
let currentCourseMeta = null;

// Simple mapping of course title to demo MP4 URL
// Replace these URLs with your real course video files if needed
const courseVideoSources = {
    'Complete JavaScript Masterclass': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'Python for Data Analysis': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'UI/UX Design Fundamentals': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'Digital Marketing Strategy': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'Professional Photography Basics': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'React & Redux Complete Guide': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'Introduction to Machine Learning': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'Flutter App Development': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    'AWS Solutions Architect': 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    default: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
};

// Mapping of course title to YouTube embed URLs
// Put your own YouTube links here
const courseYoutubeSources = {
    'Complete JavaScript Masterclass': 'https://youtu.be/hKB-YGF14SY?si=hgpGppp1_Jovq-RF',
    'Python for Data Analysis': 'https://www.youtube.com/embed/r-uOLxNrNk8',
    'UI/UX Design Fundamentals': 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
    'Digital Marketing Strategy': 'https://www.youtube.com/embed/nJ0-QlFk9Is',
    'Professional Photography Basics': 'https://www.youtube.com/embed/7ZVyNjKSr0M',
    'React & Redux Complete Guide': 'https://www.youtube.com/embed/bMknfKXIFA8',
    'Introduction to Machine Learning': 'https://www.youtube.com/embed/GwIo3gDZCVQ',
    'Flutter App Development': 'https://www.youtube.com/embed/VPvVD8t02U8',
    'AWS Solutions Architect': 'https://www.youtube.com/embed/Ia-UEYYR44s'
};

// Toggle notification dropdown
notificationBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
    userDropdown.classList.remove('show');
    searchSuggestions.classList.remove('show');
});

// Toggle user dropdown
userProfile.addEventListener('click', function(e) {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
    notificationDropdown.classList.remove('show');
    searchSuggestions.classList.remove('show');
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
        notificationDropdown.classList.remove('show');
    }
    if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
    }
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('show');
    }
});

// Mark all as read
const markReadBtn = document.querySelector('.mark-read-btn');
markReadBtn.addEventListener('click', function() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').style.display = 'none';
});

// Notification item click
const notificationItems = document.querySelectorAll('.notification-item');
notificationItems.forEach(item => {
    item.addEventListener('click', function() {
        this.classList.remove('unread');
        notificationDropdown.classList.remove('show');
        // Check if there are any unread notifications left
        const remainingUnread = document.querySelectorAll('.notification-item.unread');
        if (remainingUnread.length === 0) {
            document.querySelector('.notification-badge').style.display = 'none';
        }
    });
});

// User dropdown items
const userDropdownItems = document.querySelectorAll('.user-dropdown-item');
userDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        userDropdown.classList.remove('show');
        
        // Actions for demo purposes
        if (action === 'Logout') {
            if (confirm('Are you sure you want to logout?')) {
                try {
                    localStorage.removeItem('lf_logged_in');
                    localStorage.removeItem('lf_guest');
                    localStorage.removeItem('lf_user_email');
                    localStorage.removeItem('lf_user_name');
                } catch (e) {
                    // ignore storage errors
                }
                window.location.href = 'signin.html';
            }
        } else {
            alert('Opening: ' + action);
        }
    });
});

// ===== User Profile Initialization =====
function initUserProfile() {
    const avatarEls = document.querySelectorAll('.user-avatar, .user-dropdown-avatar');
    const nameEls = document.querySelectorAll('.user-name, .user-dropdown-name');
    const emailEl = document.querySelector('.user-dropdown-email');

    if (!avatarEls.length || !nameEls.length) return;

    let displayName = 'Guest';
    let email = '';
    let initials = 'G';

    try {
        const loggedIn = localStorage.getItem('lf_logged_in') === 'true';
        const guest = localStorage.getItem('lf_guest') === 'true';
        const storedName = localStorage.getItem('lf_user_name');
        const storedEmail = localStorage.getItem('lf_user_email');

        if (loggedIn && storedEmail) {
            displayName = storedName || storedEmail.split('@')[0] || 'User';
            email = storedEmail;
        } else if (guest) {
            displayName = storedName || 'Guest';
            email = 'Guest session';
        }
    } catch (err) {
        // Keep defaults if localStorage fails
    }

    if (displayName) {
        const parts = displayName.trim().split(/\s+/);
        const first = parts[0] || '';
        const second = parts[1] || '';
        initials = (first.charAt(0) + (second.charAt(0) || '')).toUpperCase() || 'U';
    }

    avatarEls.forEach(el => {
        el.textContent = initials;
    });
    nameEls.forEach(el => {
        el.textContent = displayName;
    });
    if (emailEl) {
        emailEl.textContent = email || 'Not signed in';
    }
}

initUserProfile();

// ===== Video Modal Helpers =====
function openVideoModal(title, instructor, category) {
    if (!videoModal) return;

    videoTitleEl.textContent = title;
    videoSubtitleEl.textContent = `${category} • ${instructor}`;

    // Decide whether to use YouTube or local MP4
    const ytBase = courseYoutubeSources[title];

    // Always stop and hide both players first
    if (courseVideo) {
        courseVideo.pause();
        courseVideo.removeAttribute('src');
        const sourceEl = courseVideo.querySelector('source');
        if (sourceEl) {
            sourceEl.removeAttribute('src');
        }
        courseVideo.load();
        courseVideo.style.display = 'none';
    }
    if (courseYoutube) {
        courseYoutube.src = '';
        courseYoutube.style.display = 'none';
    }

    if (ytBase && courseYoutube) {
        // Use YouTube embed with autoplay
        const urlWithParams = ytBase.includes('?')
            ? `${ytBase}&autoplay=1&rel=0`
            : `${ytBase}?autoplay=1&rel=0`;
        courseYoutube.src = urlWithParams;
        courseYoutube.style.display = 'block';
    } else if (courseVideo) {
        // Fallback to MP4 video
        const src = courseVideoSources[title] || courseVideoSources.default;
        const sourceEl = courseVideo.querySelector('source');
        if (sourceEl) {
            sourceEl.src = src;
        } else {
            courseVideo.src = src;
        }
        courseVideo.style.display = 'block';
        courseVideo.currentTime = 0;

        // Attempt to autoplay; some browsers may block this, which is fine
        const playPromise = courseVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Ignore autoplay errors (user can press play)
            });
        }
    }

    videoModal.classList.add('show');
}

function closeVideoModal() {
    if (!videoModal) return;
    if (courseVideo) {
        courseVideo.pause();
        courseVideo.style.display = 'none';
    }
    if (courseYoutube) {
        // Reset src to fully stop the YouTube player
        courseYoutube.src = '';
        courseYoutube.style.display = 'none';
    }
    videoModal.classList.remove('show');
}

if (videoCloseBtn && videoModal) {
    videoCloseBtn.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', function (e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
}

// ===== Search Functionality =====
let searchTimeout;

// Show/hide search clear button
searchInput.addEventListener('input', function(e) {
    const value = e.target.value;
    
    if (value.length > 0) {
        searchClear.classList.add('show');
        
        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(value);
        }, 300);
    } else {
        searchClear.classList.remove('show');
        searchSuggestions.classList.remove('show');
        // Show all courses
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// Clear search
searchClear.addEventListener('click', function() {
    searchInput.value = '';
    this.classList.remove('show');
    searchSuggestions.classList.remove('show');
    
    // Show all courses
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.style.display = 'block';
    });
});

// Show suggestions on focus
searchInput.addEventListener('focus', function() {
    if (this.value.length === 0) {
        searchSuggestions.classList.add('show');
    }
});

// Search suggestions click
const suggestionItems = document.querySelectorAll('.suggestion-item');
suggestionItems.forEach(item => {
    item.addEventListener('click', function() {
        const searchTerm = this.getAttribute('data-search');
        searchInput.value = searchTerm;
        searchClear.classList.add('show');
        searchSuggestions.classList.remove('show');
        performSearch(searchTerm);
    });
});

// Perform search function
function performSearch(searchTerm) {
    const courseCards = document.querySelectorAll('.course-card');
    const lowerSearchTerm = searchTerm.toLowerCase();
    let foundCount = 0;
    
    courseCards.forEach(card => {
        const title = card.querySelector('.course-title').textContent.toLowerCase();
        const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
        const category = card.querySelector('.course-category').textContent.toLowerCase();
        
        if (title.includes(lowerSearchTerm) || 
            instructor.includes(lowerSearchTerm) || 
            category.includes(lowerSearchTerm)) {
            card.style.display = 'block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show message if no results
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    if (foundCount === 0) {
        const contentArea = document.querySelector('.content-area');
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.style.cssText = 'text-align: center; padding: 60px 20px; color: var(--text-secondary);';
        message.innerHTML = `
            <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20" style="margin: 0 auto 20px; opacity: 0.5;">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <h3 style="font-size: 24px; margin-bottom: 8px; color: var(--text-primary);">No results found</h3>
            <p>Try searching for something else</p>
        `;
        const firstSection = document.querySelector('.content-area section');
        firstSection.insertAdjacentElement('beforebegin', message);
    }
}

// ===== Category Filter =====
const categoryChips = document.querySelectorAll('.category-chip');
categoryChips.forEach(chip => {
    chip.addEventListener('click', function() {
        categoryChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.textContent.trim();
        const courseCards = document.querySelectorAll('.course-card');
        
        // Remove any existing no-results message
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        courseCards.forEach(card => {
            const courseCategory = card.querySelector('.course-category').textContent;
            
            if (category === 'All Courses' || courseCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== Navigation =====
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        navItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Show alert for demo
        const navText = this.textContent.trim();
        console.log('Navigating to: ' + navText);
    });
});

// ===== Course Card Interactions =====
const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.course-title').textContent;
        const instructor = this.querySelector('.course-instructor').textContent;
        const category = this.querySelector('.course-category').textContent;
        
        // Update bottom player
        document.querySelector('.current-title').textContent = title;
        document.querySelector('.current-instructor').textContent = instructor;
        
        // Update thumbnail gradient
        const thumbnailGradient = window.getComputedStyle(this.querySelector('.course-thumbnail')).background;
        document.querySelector('.current-thumbnail').style.background = thumbnailGradient;
        
        // Visual feedback
        courseCards.forEach(c => c.style.transform = '');
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);

        // Store selected course; video opens only when play button is pressed
        currentCourseMeta = { title, instructor, category };

        // Reset player state to "ready" (show play icon)
        if (typeof isPlaying !== 'undefined' && playPauseBtn) {
            isPlaying = false;
            playPauseBtn.innerHTML = `
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
            `;
        }

        // Toast for feedback
        showToast(`Selected: ${title}. Press play to start.`);
    });
});

// ===== Player Controls =====
const playPauseBtn = document.querySelector('.play-pause-btn');
let isPlaying = false;

if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
        // If no course selected yet, try to infer from current player text
        if (!currentCourseMeta) {
            const currentTitleEl = document.querySelector('.current-title');
            const currentInstructorEl = document.querySelector('.current-instructor');
            if (currentTitleEl && currentInstructorEl) {
                const title = currentTitleEl.textContent;
                const instructor = currentInstructorEl.textContent;
                // Find matching course card to get category if possible
                let category = 'Course';
                const matchCard = Array.from(document.querySelectorAll('.course-card')).find(card => {
                    const t = card.querySelector('.course-title');
                    return t && t.textContent === title;
                });
                if (matchCard) {
                    const catEl = matchCard.querySelector('.course-category');
                    if (catEl) category = catEl.textContent;
                }
                currentCourseMeta = { title, instructor, category };
            }
        }

        // If still no course, do nothing
        if (!currentCourseMeta) {
            showToast('Select a course first.');
            return;
        }

        // If modal is not open, start playback (open video)
        if (!videoModal || !videoModal.classList.contains('show')) {
            const { title, instructor, category } = currentCourseMeta;
            openVideoModal(title, instructor, category);
            isPlaying = true;
            this.innerHTML = `
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
            `;
            showToast('Playing');
        } else {
            // If modal is open, treat as pause/stop and close overlay
            closeVideoModal();
            isPlaying = false;
            this.innerHTML = `
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
            `;
            showToast('Paused');
        }
    });
}

// Previous/Next buttons
const controlButtons = document.querySelectorAll('.control-btn');
controlButtons.forEach((btn, index) => {
    if (index === 0) { // Previous button
        btn.addEventListener('click', function() {
            showToast('Previous lesson');
        });
    } else if (index === 2) { // Next button
        btn.addEventListener('click', function() {
            showToast('Next lesson');
        });
    }
});

// Progress bar interaction
const progressTrack = document.querySelector('.progress-track');
const progressCurrent = document.querySelector('.progress-current');

progressTrack.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    progressCurrent.style.width = percentage + '%';
    
    const currentTime = Math.floor((percentage / 100) * 2120); // 35:20 = 2120 seconds
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.querySelector('.time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Volume control
const volumeSlider = document.querySelector('.volume-slider');
const volumeFill = document.querySelector('.volume-fill');

volumeSlider.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    volumeFill.style.width = percentage + '%';
});

// ===== Hero Button =====
const heroBtn = document.querySelector('.hero-btn');
heroBtn.addEventListener('click', function() {
    // Find first course with progress
    const courseWithProgress = Array.from(courseCards).find(card => {
        const progress = card.querySelector('.progress-fill');
        return progress && parseFloat(progress.style.width) > 0;
    });
    
    if (courseWithProgress) {
        courseWithProgress.click();
        courseWithProgress.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// ===== View All Links =====
const viewAllLinks = document.querySelectorAll('.view-all');
viewAllLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.closest('section');
        const sectionTitle = section.querySelector('.section-title').textContent;
        showToast(`Viewing all: ${sectionTitle}`);
    });
});

// ===== Toast Notification =====
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-weight: 500;
        border: 1px solid var(--border-color);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        opacity: 0;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Space bar to play/pause
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        playPauseBtn.click();
    }
    
    // Slash to focus search
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close dropdowns / modals
    if (e.key === 'Escape') {
        notificationDropdown.classList.remove('show');
        userDropdown.classList.remove('show');
        searchSuggestions.classList.remove('show');
        if (videoModal && videoModal.classList.contains('show')) {
            closeVideoModal();
        }
    }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize =====
console.log('LearnFlow E-Learning Platform Loaded');
console.log('Keyboard shortcuts:');
console.log('  - Space: Play/Pause');
console.log('  - /: Focus search');
console.log('  - Esc: Close dropdowns');
