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
     * Handle transitions between welcome screen and generator section
     */
    function initWelcomeNavigation() {
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', function() {
                // Smooth transition
                welcomeSection.style.opacity = '0';
                welcomeSection.style.height = '0';
                welcomeSection.style.margin = '0';
                welcomeSection.style.overflow = 'hidden';
                
                setTimeout(() => {
                    welcomeSection.style.display = 'none';
                    generatorSection.style.opacity = '1';
                    // Focus on the textarea for immediate input
                    promptInput.focus();
                }, 300);
            });
        }
    }

    // Initialize welcome section navigation
    initWelcomeNavigation();

    // ========================
    // Model Tooltips
    // ========================
    
    /**
     * Initialize model description tooltips
     */
    function initModelTooltips() {
        if (selectedModel && modelTooltip) {
            // Show description on select change
            selectedModel.addEventListener('change', function() {
                const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                const description = selectedOption.getAttribute('data-description');
                
                if (description) {
                    modelTooltip.textContent = description;
                    modelTooltip.classList.add('active');
                    
                    // Auto-hide after 3 seconds
                    setTimeout(() => {
                        modelTooltip.classList.remove('active');
                    }, 3000);
                } else {
                    modelTooltip.classList.remove('active');
                }
            });
            
            // Show description on info icon hover/click
            if (modelInfoIcon) {
                modelInfoIcon.addEventListener('mouseenter', function() {
                    const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                    const description = selectedOption.getAttribute('data-description');
                    
                    if (description && selectedOption.value !== "") {
                        modelTooltip.textContent = description;
                        modelTooltip.classList.add('active');
                    }
                });
                
                modelInfoIcon.addEventListener('mouseleave', function() {
                    setTimeout(() => {
                        modelTooltip.classList.remove('active');
                    }, 500);
                });
                
                modelInfoIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const selectedOption = selectedModel.options[selectedModel.selectedIndex];
                    const description = selectedOption.getAttribute('data-description');
                    
                    if (description && selectedOption.value !== "") {
                        modelTooltip.textContent = description;
                        
                        if (modelTooltip.classList.contains('active')) {
                            modelTooltip.classList.remove('active');
                        } else {
                            modelTooltip.classList.add('active');
                            
                            // Auto-hide after clicking outside
                            document.addEventListener('click', function hideTooltip() {
                                modelTooltip.classList.remove('active');
                                document.removeEventListener('click', hideTooltip);
                            });
                        }
                    }
                });
            }
            
            // Hide tooltip when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!modelInfoIcon?.contains(e.target) && !selectedModel.contains(e.target)) {
                    modelTooltip.classList.remove('active');
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
     * Get a random prompt from the examples list
     */
    function getRandomPrompt() {
        const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
        promptInput.value = prompt;
        promptInput.focus();
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
        calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
        calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

        return {width: calculatedWidth, height: calculatedHeight};
    }

    /**
     * Display error message in the image card
     * @param {number} imgIndex - Index of the image card
     * @param {string} errorMessage - Error message to display
     */
    function showErrorMessage(imgIndex, errorMessage) {
        const imgCard = document.getElementById(`img-card-${imgIndex}`);
        
        if (!imgCard) return;
        
        imgCard.classList.remove("loading");
        imgCard.classList.add("error");
        const statusContainer = imgCard.querySelector(".status-container");
        if (statusContainer) {
            const statusText = statusContainer.querySelector(".status-text");
            if (statusText) {
                statusText.textContent = `Error: ${errorMessage || "Failed to generate image"}`;
            }
        }
    }

    /**
     * Update image card with generated image
     * @param {number} imgIndex - Index of the image card
     * @param {string} imgUrl - URL of the generated image
     */
    function updateImageCard(imgIndex, imgUrl) {
        const imgCard = document.getElementById(`img-card-${imgIndex}`);

        if (!imgCard) return;

        imgCard.classList.remove("loading");
        imgCard.innerHTML = `<img src="${imgUrl}" class="result-img" alt="Generated image">
                        <div class="img-overlay">
                            <a href="${imgUrl}" target="_blank" class="img-download-btn" download="${Date.now()}.png">
                                <i class="fa-solid fa-download"></i>
                            </a>
                        </div>`;
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
     * Create placeholder image cards in loading state
     * @param {string} model - Selected AI model
     * @param {number} count - Number of images to generate
     * @param {string} ratio - Aspect ratio
     * @param {string} promptText - Text description for image generation
     */
    function createImageCards(model, count, ratio, promptText) {
        gridGallery.innerHTML = "";

        for (let i = 0; i < count; i++) {
            gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${ratio}">
                                        <div class="status-container">
                                            <div class="spinner"></div>
                                            <i class="fa-solid fa-triangle-exclamation"></i>
                                            <p class="status-text">Generating...</p>
                                        </div>
                                    </div>`;
        }
        generateImages(model, count, ratio, promptText);
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const model = selectedModel.value;
        const count = parseInt(selectedCount.value) || 1;
        const ratio = selectedRatio.value || "1/1";
        const promptText = promptInput.value.trim();

        if (!model || !count || !ratio || !promptText) {
            alert('Please fill in all fields');
            return;
        }

        console.log("Form submitted with:", { model, count, ratio, promptText });
        createImageCards(model, count, ratio, promptText);
    }

    // Apply event listeners for image generation
    if (promptButton && promptInput && promptForm) {
        promptButton.addEventListener("click", getRandomPrompt);
        promptForm.addEventListener("submit", handleFormSubmit);
    }
});