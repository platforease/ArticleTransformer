document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.getElementById('navbar');
    const generateBtn = document.getElementById('generate-btn');
    const articleContent = document.getElementById('article-content');
    const languagesGrid = document.getElementById('languages-grid');
    const featuresGrid = document.getElementById('features-grid');
    const allLanguagesGrid = document.getElementById('all-languages-grid');
    const featuredLanguages = document.getElementById('featured-languages');
    const resultsSection = document.getElementById('results-section');
    const resultsCount = document.getElementById('results-count');
    const progressPercent = document.getElementById('progress-percent');
    const progressFill = document.getElementById('progress-fill');
    const modal = document.getElementById('language-modal');
    const modalCloseBtn = document.getElementById('close-modal');
    const viewAllLanguagesButton = document.getElementById('view-all-languages');

    const SUPPORTED_LANGUAGES = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', flag: '🇰🇷' },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
        { code: 'ru', name: 'Russian', flag: '🇷🇺' },
        { code: 'it', name: 'Italian', flag: '🇮🇹' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
        { code: 'pl', name: 'Polish', flag: '🇵🇱' },
        { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
        { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
        { code: 'da', name: 'Danish', flag: '🇩🇰' },
        { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
        { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
        { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
        { code: 'th', name: 'Thai', flag: '🇹🇭' },
        { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
        { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
        { code: 'ms', name: 'Malay', flag: '🇲🇾' },
        { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
        { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
        { code: 'cs', name: 'Czech', flag: '🇨🇿' },
        { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
        { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
        { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
        { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
        { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
        { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
        { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
        { code: 'et', name: 'Estonian', flag: '🇪🇪' },
        { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
        { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
        { code: 'el', name: 'Greek', flag: '🇬🇷' },
        { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
        { code: 'eu', name: 'Basque', flag: '🇪🇸' }
    ];

    const FEATURES = [
        {
            icon: 'fas fa-copy',
            title: '1-to-20+ Article Generation',
            description: 'Transform a single article into 20+ unique variations while maintaining quality and relevance.'
        },
        {
            icon: 'fas fa-language',
            title: '40+ Language Support',
            description: 'Instantly translate your content into over 40 languages with native-level accuracy.'
        },
        {
            icon: 'fas fa-bolt',
            title: 'AI Prompt Website Builder',
            description: 'Create complete websites with simple prompts. Just describe your vision and watch AI build it instantly.'
        },
        {
            icon: 'fas fa-magic',
            title: 'AI-Powered Enhancement',
            description: 'Advanced AI algorithms ensure each generated article is unique, engaging, and SEO-optimized.'
        },
        {
            icon: 'fas fa-tachometer-alt',
            title: 'Lightning Fast Processing',
            description: 'Generate and translate dozens of articles in minutes, not hours.'
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Quality Assurance',
            description: 'Built-in quality checks ensure every generated article meets professional standards.'
        }
    ];

    function renderLanguages(languages, container) {
        container.innerHTML = '';
        languages.forEach(lang => {
            const languageItem = document.createElement('div');
            languageItem.className = 'language-item';
            languageItem.innerHTML = `
                <span class="language-flag">${lang.flag}</span>
                <span class="language-name">${lang.name}</span>
            `;
            container.appendChild(languageItem);

            // Click event to add/remove selected languages
            languageItem.addEventListener('click', () => {
                languageItem.classList.toggle('selected');
                updateGenerateButtonState();
            });
        });
    }

    function renderFeatures(features) {
        features.forEach(feature => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <i class="${feature.icon} feature-icon"></i>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            featuresGrid.appendChild(featureItem);
        });
    }

    function updateGenerateButtonState() {
        const selectedLanguages = document.querySelectorAll('.language-item.selected');
        generateBtn.disabled = !articleContent.value.trim() || selectedLanguages.length === 0;
    }

    // Input validation function
    function validateInputs() {
        const articleText = articleContent.value.trim();
        const selectedLanguages = document.querySelectorAll('.language-item.selected');
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        articleContent.classList.remove('input-error');
        
        if (!articleText) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = 'Please enter article content';
            error.style.display = 'block';
            articleContent.parentNode.appendChild(error);
            articleContent.classList.add('input-error');
            isValid = false;
        }
        
        if (selectedLanguages.length === 0) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = 'Please select at least one language';
            error.style.display = 'block';
            languagesGrid.parentNode.appendChild(error);
            isValid = false;
        }
        
        return isValid;
    }

    // Initialize input validation handlers
    function initInputValidation() {
        articleContent.addEventListener('input', function() {
            this.classList.remove('input-error');
            const error = this.parentNode.querySelector('.error-message');
            if (error) error.remove();
            updateGenerateButtonState();
            updateLanguageSelection();
        });
        
        // Clear language selection errors when languages are clicked
        document.addEventListener('click', function(e) {
            if (e.target.closest('.language-item')) {
                const error = languagesGrid.parentNode.querySelector('.error-message');
                if (error) error.remove();
            }
        });
    }

    function toggleModal() {
        modal.classList.toggle('show');
    }

    function initializeModal() {
        viewAllLanguagesButton.addEventListener('click', toggleModal);
        modalCloseBtn.addEventListener('click', toggleModal);
    }

    const STATS = [
        { value: '500K+', label: 'Articles Generated' },
        { value: '40+', label: 'Languages Supported' },
        { value: '15K+', label: 'Active Users' },
        { value: '98%', label: 'Satisfaction Rate' }
    ];

    let selectedLanguagesList = [];
    let showingAllLanguages = false;

    function renderFeaturedLanguageCards(languages, container) {
        container.innerHTML = '';
        languages.forEach(lang => {
            const languageCard = document.createElement('div');
            languageCard.className = 'language-card';
            languageCard.innerHTML = `
                <span class="language-flag">${lang.flag}</span>
                <div class="language-name">${lang.name}</div>
                <div class="language-native">Native</div>
            `;
            container.appendChild(languageCard);
        });
    }

    function renderFeatureCards(features) {
        features.forEach(feature => {
            const featureCard = document.createElement('div');
            featureCard.className = 'feature-card';
            featureCard.innerHTML = `
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            featuresGrid.appendChild(featureCard);
        });
    }

    function renderStats() {
        const statsGrid = document.getElementById('stats-grid');
        if (statsGrid) {
            STATS.forEach(stat => {
                const statCard = document.createElement('div');
                statCard.className = 'stat-card';
                statCard.innerHTML = `
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                `;
                statsGrid.appendChild(statCard);
            });
        }
    }

    function renderAllLanguagesModal() {
        allLanguagesGrid.innerHTML = '';
        SUPPORTED_LANGUAGES.forEach(lang => {
            const languageItem = document.createElement('div');
            languageItem.className = 'all-language-item';
            languageItem.innerHTML = `
                <span class="language-flag">${lang.flag}</span>
                <div class="language-info">
                    <div class="language-name">${lang.name}</div>
                    <div class="language-native">${lang.name}</div>
                </div>
            `;
            allLanguagesGrid.appendChild(languageItem);
        });
        
        document.getElementById('total-languages').textContent = SUPPORTED_LANGUAGES.length;
    }

    function handleNavbarScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    function updateLanguageSelection() {
        const selectedItems = document.querySelectorAll('.language-item.selected');
        selectedLanguagesList = Array.from(selectedItems).map(item => 
            item.querySelector('.language-name').textContent
        );
        
        const generateText = document.getElementById('generate-text');
        if (selectedLanguagesList.length > 0) {
            generateText.textContent = `Generate 20+ Articles in ${selectedLanguagesList.length} Languages`;
        } else {
            generateText.textContent = 'Generate Articles';
        }
    }

    function showMoreLanguages() {
        const showAllBtn = document.getElementById('show-all-languages');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                showingAllLanguages = !showingAllLanguages;
                if (showingAllLanguages) {
                    renderLanguages(SUPPORTED_LANGUAGES, languagesGrid);
                    showAllBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
                } else {
                    renderLanguages(SUPPORTED_LANGUAGES.slice(0, 6), languagesGrid);
                    showAllBtn.innerHTML = '<i class="fas fa-plus"></i> Show All 40+ Languages';
                }
            });
        }
    }

    function generateSampleArticles() {
        const articlesGrid = document.getElementById('articles-grid');
        if (articlesGrid) {
            const sampleArticles = [
                {
                    flag: '🇺🇸',
                    variant: 'standard',
                    title: 'The Future of AI Technology',
                    content: 'Artificial Intelligence is revolutionizing the way we work and live. From automated customer service to advanced data analysis...',
                    wordCount: 150
                },
                {
                    flag: '🇪🇸',
                    variant: 'enhanced',
                    title: 'El Futuro de la Tecnología IA',
                    content: 'La Inteligencia Artificial está revolucionando la forma en que trabajamos y vivimos. Desde atención al cliente automatizada...',
                    wordCount: 145
                },
                {
                    flag: '🇫🇷',
                    variant: 'premium',
                    title: 'L\'Avenir de la Technologie IA',
                    content: 'L\'Intelligence Artificielle révolutionne notre façon de travailler et de vivre. Du service client automatisé...',
                    wordCount: 152
                }
            ];

            setTimeout(() => {
                articlesGrid.innerHTML = '';
                sampleArticles.forEach(article => {
                    const articleCard = document.createElement('div');
                    articleCard.className = 'article-card';
                    articleCard.innerHTML = `
                        <div class="article-header">
                            <span class="article-flag">${article.flag}</span>
                            <span class="article-variant ${article.variant}">${article.variant}</span>
                        </div>
                        <h4 class="article-title">${article.title}</h4>
                        <p class="article-content">${article.content}</p>
                        <div class="article-footer">
                            <span class="word-count">${article.wordCount} words</span>
                            <button class="btn btn-ghost btn-sm">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    `;
                    articlesGrid.appendChild(articleCard);
                });
            }, 2000);
        }
    }

    function initializeScrollToTopButton() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize everything
    renderFeaturedLanguageCards(SUPPORTED_LANGUAGES.slice(0, 8), featuredLanguages);
    renderLanguages(SUPPORTED_LANGUAGES.slice(0, 6), languagesGrid);
    renderFeatureCards(FEATURES);
    renderStats();
    renderAllLanguagesModal();
    initializeModal();
    handleNavbarScroll();
    showMoreLanguages();
    initializeScrollToTopButton();
    
    // Initialize new enhanced features
    initParticles();
    initTypewriter();
    init3DEffects();

    // Initialize input validation
    initInputValidation();

    // Event listeners
    generateBtn.addEventListener('click', () => {
        // Validate inputs before proceeding
        if (!validateInputs()) {
            return;
        }
        
        // Add loading state to button
        const originalHTML = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Enhanced progress animation
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5; // Slower, more realistic progress
            progressPercent.textContent = `${progress}%`;
            progressFill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                resultsCount.textContent = `${selectedLanguagesList.length * 20 || 20} Articles`;
                generateSampleArticles();
                
                // Restore button after delay
                setTimeout(() => {
                    generateBtn.innerHTML = originalHTML;
                    generateBtn.disabled = false;
                    updateGenerateButtonState(); // Re-check state
                }, 1000);
                return;
            }
        }, 150); // Slower animation for better UX
    });

    articleContent.addEventListener('input', () => {
        updateGenerateButtonState();
        updateLanguageSelection();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleModal();
        }
    });
    
    // Enhanced particle system initialization
    function initParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 10 + 2;
            const posX = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Typewriter effect for hero title
    function initTypewriter() {
        const text = "Transform One Article Into 20+ Multilingual Masterpieces";
        const typewriter = document.getElementById('typewriter-text');
        if (!typewriter) return;
        
        let i = 0;
        
        function type() {
            if (i < text.length) {
                typewriter.innerHTML = text.substring(0, i+1) + '<span class="cursor">|</span>';
                i++;
                setTimeout(type, 50);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    typewriter.innerHTML = text;
                }, 1000);
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 500);
    }
    
    // 3D parallax effects for floating cards
    function init3DEffects() {
        const heroImage = document.querySelector('.hero-image');
        if (!heroImage) return;
        
        heroImage.addEventListener('mousemove', (e) => {
            const rect = heroImage.getBoundingClientRect();
            const xAxis = (rect.width / 2 - (e.clientX - rect.left)) / 25;
            const yAxis = (rect.height / 2 - (e.clientY - rect.top)) / 25;
            
            const cards = document.querySelectorAll('.floating-card');
            cards.forEach((card, i) => {
                // Different depth for each card
                const depth = 1 + (i * 0.2);
                card.style.transform = `rotateY(${xAxis * depth}deg) rotateX(${yAxis * depth}deg)`;
            });
        });
        
        heroImage.addEventListener('mouseleave', () => {
            const cards = document.querySelectorAll('.floating-card');
            cards.forEach(card => {
                card.style.transform = 'rotateY(0) rotateX(0)';
            });
        });
    }

    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
        });
    });
    
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
    
    // Add logo hover effect
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.03)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
        });
    });
    
    // Add floating card hover effects
    document.querySelectorAll('.floating-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.05)';
            card.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
    });
});

