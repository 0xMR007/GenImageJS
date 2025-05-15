/**
 * GenImageJS - AI Image Generator
 * 
 * Author: 0xMR007
 * Version: 1.0.0
 * Description: A JavaScript application that uses the HuggingFace API to generate images from text descriptions
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const darkThemeButton = document.querySelector(".theme-toggle");
    const promptForm = document.querySelector(".prompt-form");
    const promptInput = document.querySelector(".prompt-input");
    const promptButton = document.querySelector(".prompt-btn");
    const selectedModel = document.getElementById("model-select");
    const selectedCount = document.getElementById("count-select");
    const selectedRatio = document.getElementById("ratio-select");
    const gridGallery = document.querySelector(".gallery-grid");
    const getStartedBtn = document.getElementById('get-started-btn');
    const welcomeSection = document.querySelector('.welcome-section');
    const generatorSection = document.getElementById('generator-section');
    const modelTooltip = document.getElementById('model-tooltip');
    const modelInfoIcon = document.querySelector('.model-info-icon');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    // API Configuration
    // Replace with your own valid HuggingFace API key
    const API_KEY = "YOUR-API-KEY";

    // Sample Prompts for Random Generator
    const examplePrompts = [
        "A magic forest with glowing plants and fairy homes among giant mushrooms",
        "An old steampunk airship floating through golden clouds at sunset",
        "A future Mars colony with glass domes and gardens against red mountains",
        "A dragon sleeping on gold coins in a crystal cave",
        "An underwater kingdom with merpeople and glowing coral buildings",
        "A floating island with waterfalls pouring into clouds below",
        "A witch's cottage in fall with magic herbs in the garden",
        "A robot painting in a sunny studio with art supplies around it",
        "A magical library with floating glowing books and spiral staircases",
        "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
        "A cosmic beach with glowing sand and an aurora in the night sky",
        "A medieval marketplace with colorful tents and street performers",
        "A cyberpunk city with neon signs and flying cars at night",
        "A peaceful bamboo forest with a hidden ancient temple",
        "A giant turtle carrying a village on its back in the ocean",
    ];

    // ========================
    // Theme Management
    // ========================
    
    /**
     * Initialize theme based on user preference or system settings
     */
    function initTheme() {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

        document.body.classList.toggle("dark-theme", isDark);
        if (darkThemeButton) {
            darkThemeButton.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function changeTheme() {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        darkThemeButton.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    // Initialize theme
    initTheme();
    
    // Apply theme toggle listener
    if (darkThemeButton) {
        darkThemeButton.addEventListener("click", changeTheme);
    }

    // ========================
    // Welcome Section Navigation
    // ========================
    
    /**
     * Handle transitions between welcome screen and generator section with improved animations
     */
    function initWelcomeNavigation() {
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', function() {
                // Smooth transition out for welcome section
                welcomeSection.style.opacity = '0';
                welcomeSection.style.transform = 'translateY(-20px)';
                
                // Timing sequence for smoother transition
                setTimeout(() => {
                    welcomeSection.style.height = '0';
                    welcomeSection.style.margin = '0';
                    welcomeSection.style.overflow = 'hidden';
                    generatorSection.style.display = 'block';
                    
                    // Give very small delay for display:block to take effect
                    setTimeout(() => {
                        generatorSection.style.opacity = '1';
                        generatorSection.style.transform = 'translateY(0)';
                        
                        // Stagger animations of form elements
                        const formElements = [
                            promptInput,
                            ...document.querySelectorAll('.select-wrapper'),
                            document.querySelector('.generate-btn')
                        ];
                        
                        formElements.forEach((el, index) => {
                            if (el) {
                                setTimeout(() => {
                                    el.style.opacity = '1';
                                    el.style.transform = 'translateY(0)';
                                }, index * 80);
                            }
                        });
                        
                        // Focus on the textarea for immediate input
                        setTimeout(() => {
                            promptInput.focus();
                        }, 300);
                    }, 50);
                }, 300);
            });
        }
    }

    // Initialize welcome section navigation
    initWelcomeNavigation();

    /**
     * Handle transitions back to welcome screen with improved animations
     */
    function initBackToHome() {
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', function() {
                // Fade out generator section
                generatorSection.style.opacity = '0';
                generatorSection.style.transform = 'translateY(20px)';
                
                // Reset form and clear gallery with animation
                if (promptForm) {
                    promptForm.reset();
                }
                
                // Clear gallery with fade-out animation
                if (gridGallery && gridGallery.children.length > 0) {
                    const cards = gridGallery.querySelectorAll('.img-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.9)';
                        }, index * 50);
                    });
                    
                    // Wait for fade-out to complete before clearing
                    setTimeout(() => {
                        gridGallery.innerHTML = '';
                    }, cards.length * 50 + 150);
                }
                
                // Delay showing welcome section
                setTimeout(() => {
                    // Hide generator completely
                    generatorSection.style.display = 'none';
                    
                    // Prepare welcome section
                    welcomeSection.style.display = 'block';
                    welcomeSection.style.height = 'auto';
                    welcomeSection.style.margin = '40px 0 50px';
                    welcomeSection.style.overflow = 'visible';
                    welcomeSection.style.transform = 'translateY(20px)';
                    
                    // Trigger reflow for animation to work
                    welcomeSection.offsetHeight;
                    
                    // Animate in
                    setTimeout(() => {
                        welcomeSection.style.opacity = '1';
                        welcomeSection.style.transform = 'translateY(0)';
                    }, 50);
                }, 350);
            });
        }
    }
    
    // Same here but for the back to home button
    initBackToHome();

    // ========================
    // Model Tooltips
    // ========================
    
    /**
     * Initialize model description tooltips with improved animations
     */
    function initModelTooltips() {
        if (selectedModel && modelTooltip) {
            // Show description on select change with smooth animation
            selectedModel.addEventListener('change', function() {
                const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                const description = selectedOption.getAttribute('data-description');
                
                if (description) {
                    modelTooltip.textContent = description;
                    modelTooltip.style.transform = 'translateY(5px)';
                    modelTooltip.classList.add('active');
                    
                    setTimeout(() => {
                        modelTooltip.style.transform = 'translateY(0)';
                    }, 10);
                    
                    // Auto-hide with smooth fade out
                    setTimeout(() => {
                        modelTooltip.style.transform = 'translateY(-5px)';
                        setTimeout(() => {
                            modelTooltip.classList.remove('active');
                        }, 200);
                    }, 3000);
                } else {
                    modelTooltip.classList.remove('active');
                }
            });
            
            // Show description on info icon hover/click with improved animations
            if (modelInfoIcon) {
                modelInfoIcon.addEventListener('mouseenter', function() {
                    const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                    const description = selectedOption.getAttribute('data-description');
                    
                    if (description && selectedOption.value !== "") {
                        modelTooltip.textContent = description;
                        modelTooltip.style.transform = 'translateY(5px)';
                        modelTooltip.classList.add('active');
                        
                        setTimeout(() => {
                            modelTooltip.style.transform = 'translateY(0)';
                        }, 10);
                    }
                });
                
                modelInfoIcon.addEventListener('mouseleave', function() {
                    setTimeout(() => {
                        if (!modelTooltip.hasAttribute('data-locked')) {
                            modelTooltip.style.transform = 'translateY(-5px)';
                            setTimeout(() => {
                                modelTooltip.classList.remove('active');
                            }, 200);
                        }
                    }, 300);
                });
                
                modelInfoIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                    const description = selectedOption.getAttribute('data-description');
                    
                    if (description && selectedOption.value !== "") {
                        modelTooltip.textContent = description;
                        
                        if (modelTooltip.classList.contains('active')) {
                            modelTooltip.removeAttribute('data-locked');
                            modelTooltip.style.transform = 'translateY(-5px)';
                            setTimeout(() => {
                                modelTooltip.classList.remove('active');
                            }, 200);
                        } else {
                            modelTooltip.setAttribute('data-locked', 'true');
                            modelTooltip.style.transform = 'translateY(5px)';
                            modelTooltip.classList.add('active');
                            setTimeout(() => {
                                modelTooltip.style.transform = 'translateY(0)';
                            }, 10);
                            
                            // Auto-hide after clicking outside
                            document.addEventListener('click', function hideTooltip() {
                                modelTooltip.removeAttribute('data-locked');
                                modelTooltip.style.transform = 'translateY(-5px)';
                                setTimeout(() => {
                                    modelTooltip.classList.remove('active');
                                }, 200);
                                document.removeEventListener('click', hideTooltip);
                            });
                        }
                    }
                });
            }
            
            // Hide tooltip with animation when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!modelInfoIcon?.contains(e.target) && !selectedModel.contains(e.target)) {
                    if (modelTooltip.classList.contains('active')) {
                        modelTooltip.removeAttribute('data-locked');
                        modelTooltip.style.transform = 'translateY(-5px)';
                        setTimeout(() => {
                            modelTooltip.classList.remove('active');
                        }, 200);
                    }
                }
            });
        }
    }

    // Initialize model tooltips
    initModelTooltips();

    // ========================
    // Image Generation
    // ========================
    
    /**
     * Get a random prompt from the examples list with typing animation
     */
    function getRandomPrompt() {
        const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
        
        // Clear existing text first
        promptInput.value = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            promptInput.value += prompt[i];
            i++;
            if (i >= prompt.length) {
                clearInterval(typeInterval);
                promptInput.focus();
            }
        }, 15);  // Speed of typing
    }

    // ========================
    // Get Random Prompt Button
    // ========================
    if (promptButton) {
        promptButton.addEventListener("click", getRandomPrompt);
    }

    /**
     * Calculate image dimensions based on selected aspect ratio
     * @param {string} ratio - Aspect ratio (e.g. "1/1", "16/9")
     * @param {number} baseSize - Base size for dimension calculation
     * @returns {Object} - Width and height dimensions
     */
    function getImageDimensions(ratio, baseSize = 512) {
        const [width, height] = ratio.split("/").map(Number);
        const scaleFactor = baseSize / Math.sqrt(width * height);
        
        let calculatedWidth = Math.round(width * scaleFactor);
        let calculatedHeight = Math.round(height * scaleFactor);

        // Ensure width and height are multiples of 16 for API compatibility
        calculatedWidth = Math.ceil(calculatedWidth / 16) * 16;
        calculatedHeight = Math.ceil(calculatedHeight / 16) * 16;
        
        return {
            width: calculatedWidth,
            height: calculatedHeight
        };
    }

    /**
     * Show error message on image card
     * @param {number} imgIndex - Index of the image card
     * @param {string} errorMessage - Error message to display
     */
    function showErrorMessage(imgIndex, errorMessage) {
        const imgCard = document.querySelector(`.img-card[data-index="${imgIndex}"]`);
        if (imgCard) {
            imgCard.classList.remove("loading");
            imgCard.classList.add("error");
            
            const statusText = imgCard.querySelector(".status-text");
            const statusIcon = imgCard.querySelector(".status-container i");
            
            if (statusText) statusText.textContent = errorMessage || "Failed to generate image";
            if (statusIcon) {
                statusIcon.className = "fa-solid fa-circle-exclamation";
            }
        }
    }

    /**
     * Update image card with generated image
     * @param {number} imgIndex - Index of the image card
     * @param {string} imgUrl - URL of the generated image
     */
    function updateImageCard(imgIndex, imgUrl) {
        const imgCard = document.querySelector(`.img-card[data-index="${imgIndex}"]`);
        if (imgCard) {
            // Create image element
            const img = document.createElement("img");
            img.className = "result-img";
            img.src = imgUrl;
            img.alt = "Generated image";
            
            // Remove loading state and append image with animation
            imgCard.classList.remove("loading");
            
            img.style.opacity = '0';
            imgCard.appendChild(img);
            
            // Create overlay with download button
            const overlay = document.createElement("div");
            overlay.className = "img-overlay";
            overlay.style.opacity = '0';
            
            const downloadBtn = document.createElement("button");
            downloadBtn.className = "img-download-btn";
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
            downloadBtn.setAttribute("aria-label", "Download image");
            downloadBtn.addEventListener("click", () => {
                const a = document.createElement("a");
                a.href = imgUrl;
                a.download = `genimage-${Date.now()}.png`;
                a.click();
            });
            
            overlay.appendChild(downloadBtn);
            imgCard.appendChild(overlay);
            
            // Trigger animation with slight delay
            setTimeout(() => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                overlay.style.opacity = '1';
            }, 50);
        }
    }

    /**
     * Create image cards for the generation process with improved animations
     * @param {string} model - Selected model ID
     * @param {number} count - Number of images to generate
     * @param {string} ratio - Selected aspect ratio
     * @param {string} promptText - Text prompt for image generation
     */
    function createImageCards(model, count, ratio, promptText) {
        // Clear gallery first with fade out animation
        if (gridGallery.children.length > 0) {
            const cards = gridGallery.querySelectorAll('.img-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                }, index * 50);
            });
            
            // Wait for fade-out to complete before clearing
            setTimeout(() => {
                gridGallery.innerHTML = '';
                addNewImageCards();
            }, cards.length * 50 + 100);
        } else {
            addNewImageCards();
        }
        
        // Function to add new image cards with staggered animation
        function addNewImageCards() {
            // Add new cards with staggered entrance
            for (let i = 0; i < count; i++) {
                const imgCard = document.createElement("div");
                imgCard.className = "img-card loading";
                imgCard.setAttribute("data-index", i);
                
                // Set aspect ratio based on selected ratio
                const gridStyle = getComputedStyle(gridGallery);
                const columnWidth = parseFloat(gridStyle.gridTemplateColumns.split(" ")[0]);
                
                if (ratio !== "1/1") {
                    const [width, height] = ratio.split("/").map(Number);
                    imgCard.style.aspectRatio = `${width}/${height}`;
                }
                
                // Create status container for loading state
                const statusContainer = document.createElement("div");
                statusContainer.className = "status-container";
                
                const spinner = document.createElement("div");
                spinner.className = "spinner";
                
                const icon = document.createElement("i");
                icon.className = "fa-solid fa-spinner fa-spin";
                
                const statusText = document.createElement("div");
                statusText.className = "status-text";
                statusText.textContent = "Generating...";
                
                statusContainer.appendChild(spinner);
                statusContainer.appendChild(icon);
                statusContainer.appendChild(statusText);
                imgCard.appendChild(statusContainer);
                
                // Set initial opacity for animation
                imgCard.style.opacity = '0';
                imgCard.style.transform = 'translateY(15px)';
                
                // Add to gallery
                gridGallery.appendChild(imgCard);
                
                // Trigger entrance animation with staggered delay
                setTimeout(() => {
                    imgCard.style.opacity = '1';
                    imgCard.style.transform = 'translateY(0)';
                }, i * 80);
            }
            
            // Start API calls after cards are created
            generateImages(model, count, ratio, promptText);
        }
    }

    /**
     * Generate images using the HuggingFace API
     * @param {string} model - Selected AI model
     * @param {number} count - Number of images to generate
     * @param {string} ratio - Aspect ratio
     * @param {string} promptText - Text description for image generation
     */
    async function generateImages(model, count, ratio, promptText) {
        const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${model}`;
        const {width, height} = getImageDimensions(ratio);
        const generateBtn = document.querySelector(".generate-btn");
        
        if (generateBtn) generateBtn.setAttribute("disabled", "true");
        if (promptButton) promptButton.setAttribute("disabled", "true");

        const imagePromises = Array.from({length: count}, async (_, i) => {
            try {
                console.log(`Generating image ${i+1}/${count} with model: ${model}`);
                
                const response = await fetch(MODEL_URL, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: promptText,
                        parameters: {width, height},
                        options: {wait_for_model: true, user_cache: false},
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("API Error:", errorData);
                    showErrorMessage(i, errorData?.error || "API request failed");
                    return;
                }

                const result = await response.blob();
                updateImageCard(i, URL.createObjectURL(result));
                console.log(`Image ${i+1} generated successfully`);
            } catch (error) {
                console.error("Generation error:", error);
                showErrorMessage(i, error.message);
            }
        });

        await Promise.allSettled(imagePromises);
        if (generateBtn) generateBtn.removeAttribute("disabled");
        if (promptButton) promptButton.removeAttribute("disabled");
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const model = selectedModel.value;
        const count = parseInt(selectedCount.value, 10);
        const ratio = selectedRatio.value;
        const promptText = promptInput.value.trim();
        
        if (!model || !count || !ratio || !promptText) {
            // Show error notification if fields are missing
            alert("Please fill in all required fields.");
            return;
        }
        
        // Create image cards and start generation
        createImageCards(model, count, ratio, promptText);
    }

    // Add form submission handler
    if (promptForm) {
        promptForm.addEventListener("submit", handleFormSubmit);
    }
});