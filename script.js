document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); 

    // WOW: True 3D Background with Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#three-bg'),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(50);

    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 500;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x818cf8,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
    });

    const starField = new THREE.Points(particles, particleMaterial);
    scene.add(starField);

    function animate() {
        requestAnimationFrame(animate);
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    const buildBlueprintBtn = document.getElementById('build-blueprint-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const startOverBtn = document.getElementById('start-over-btn');

    const formPage = document.getElementById('form-page');
    const loadingPage = document.getElementById('loading-page');
    const resultsPage = document.getElementById('results-page');
    
    const progressBar = document.getElementById('progress-bar');
    const formSections = document.querySelectorAll('.form-section');
    const resultsContent = document.getElementById('results-content');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Modal elements
    const aiRoadmapModal = document.getElementById('ai-roadmap-modal');
    const aiRoadmapModalBackdrop = document.getElementById('ai-roadmap-modal-backdrop');
    const aiRoadmapModalCloseBtn = document.getElementById('ai-roadmap-modal-close-btn');
    const aiRoadmapTitle = document.getElementById('ai-roadmap-title');
    const aiRoadmapContainer = document.getElementById('ai-roadmap-content-container');

    const resumeModal = document.getElementById('resume-modal');
    const resumeModalBackdrop = document.getElementById('resume-modal-backdrop');
    const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');
    const resumeContent = document.getElementById('resume-content');
    
    const mockInterviewModal = document.getElementById('mock-interview-modal');
    const mockInterviewModalBackdrop = document.getElementById('mock-interview-modal-backdrop');
    const mockInterviewModalCloseBtn = document.getElementById('mock-interview-modal-close-btn');
    const mockInterviewTitle = document.getElementById('mock-interview-title');
    const mockInterviewContent = document.getElementById('mock-interview-content');

    let currentStep = 1;
    const totalSteps = formSections.length;

    // --- Centered Scroll Logic ---
    buildBlueprintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('interactive-tool');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // --- Modal Logic ---
    const openModal = (modal, backdrop) => {
        modal.classList.add('active');
        backdrop.classList.add('active');
    };
    const closeModal = (modal, backdrop) => {
        modal.classList.remove('active');
        backdrop.classList.remove('active');
    };

    const openAiRoadmapModal = (title, roadmapHtml) => {
        aiRoadmapTitle.textContent = title + " Roadmap";
        aiRoadmapContainer.innerHTML = ''; 

        const roadmapElement = document.createElement('div');
        roadmapElement.innerHTML = roadmapHtml;
        const steps = Array.from(roadmapElement.querySelectorAll('li'));
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

        const isoContainer = document.createElement('div');
        isoContainer.className = 'ai-roadmap-isometric-container';

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('class', 'ai-roadmap-svg-path');
        svg.setAttribute('viewBox', '0 0 1400 500');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        const path = document.createElementNS(svgNS, 'path');
        const pathD = "M 50,250 C 250,50 450,450 700,250 S 950,50 1150,250 S 1300,450 1350,250";
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        
        const totalLength = path.getTotalLength();
        path.remove(); 

        const bgPath = document.createElementNS(svgNS, 'path');
        bgPath.setAttribute('d', pathD);
        bgPath.setAttribute('fill', 'none');
        bgPath.setAttribute('stroke', 'rgba(255,255,255,0.1)');
        bgPath.setAttribute('stroke-width', '20');
        bgPath.setAttribute('stroke-linecap', 'round');
        svg.appendChild(bgPath);

        for(let i=0; i < steps.length; i++) {
            const segment = document.createElementNS(svgNS, 'path');
            segment.setAttribute('d', pathD);
            segment.setAttribute('fill', 'none');
            segment.setAttribute('stroke', colors[i % colors.length]);
            segment.setAttribute('stroke-width', '20');
            segment.setAttribute('stroke-linecap', 'round');
            segment.setAttribute('stroke-dasharray', `${totalLength}`);
            segment.setAttribute('stroke-dashoffset', `${totalLength}`);
            segment.style.transition = `stroke-dashoffset 1s ease-out ${i * 0.15}s`;
            svg.appendChild(segment);
            setTimeout(() => {
                const startOffset = totalLength * (1 - (i / steps.length));
                const endOffset = totalLength * (1 - ((i + 1) / steps.length));
                segment.setAttribute('stroke-dashoffset', endOffset);
            }, 100);
        }

        isoContainer.appendChild(svg);
        
        const htmlElementsContainer = document.createElement('div');
        htmlElementsContainer.className = 'ai-roadmap-steps-container';
        isoContainer.appendChild(htmlElementsContainer);

        steps.forEach((step, index) => {
            const percentage = (index + 0.5) / steps.length;
            const point = path.getPointAtLength(totalLength * percentage);

            const stepEl = document.createElement('div');
            stepEl.className = 'ai-roadmap-step-iso';
            stepEl.style.left = `${(point.x / 1400) * 100}%`;
            stepEl.style.top = `${(point.y / 500) * 100}%`;
            
            const contentPlacementTop = (index % 2 !== 0);
             if (contentPlacementTop) {
                stepEl.classList.add('place-top');
            }

            stepEl.innerHTML = `
                <div class="iso-content">
                   ${step.innerHTML}
                </div>
                <div class="iso-line"></div>
                <div class="iso-marker" style="background-color: ${colors[index % colors.length]}">
                    ${index + 1}
                </div>
            `;
            htmlElementsContainer.appendChild(stepEl);
        });

        aiRoadmapContainer.appendChild(isoContainer);
        openModal(aiRoadmapModal, aiRoadmapModalBackdrop);
    };
    
    const openResumeModal = (resumeHtml) => {
        resumeContent.innerHTML = resumeHtml;
        openModal(resumeModal, resumeModalBackdrop);
    };

    const openMockInterviewModal = (title, linksHtml) => {
        mockInterviewTitle.textContent = `Mock Interview Resources for ${title}`;
        mockInterviewContent.innerHTML = linksHtml;
        openModal(mockInterviewModal, mockInterviewModalBackdrop);
    };

    aiRoadmapModalCloseBtn.addEventListener('click', () => closeModal(aiRoadmapModal, aiRoadmapModalBackdrop));
    aiRoadmapModalBackdrop.addEventListener('click', () => closeModal(aiRoadmapModal, aiRoadmapModalBackdrop));
    resumeModalCloseBtn.addEventListener('click', () => closeModal(resumeModal, resumeModalBackdrop));
    resumeModalBackdrop.addEventListener('click', () => closeModal(resumeModal, resumeModalBackdrop));
    mockInterviewModalCloseBtn.addEventListener('click', () => closeModal(mockInterviewModal, mockInterviewModalBackdrop));
    mockInterviewModalBackdrop.addEventListener('click', () => closeModal(mockInterviewModal, mockInterviewModalBackdrop));
    
    // FIX: More robust click handler for dynamically generated buttons
    resultsContent.addEventListener('click', (e) => {
        const button = e.target.closest('button.outline-btn');
        if (!button) return;

        const parentCard = button.closest('.card');
        if (!parentCard) return;

        const title = parentCard.querySelector('h3').textContent;
        
        if (button.classList.contains('view-roadmap-btn')) {
            const roadmapData = parentCard.querySelector('.actionable-roadmap-data');
            if (title && roadmapData) openAiRoadmapModal(title, roadmapData.innerHTML);
        } else if (button.classList.contains('view-resume-btn')) {
            const resumeData = parentCard.querySelector('.sample-resume-data');
            if (resumeData) {
                openResumeModal(resumeData.innerHTML);
            } else {
                console.error("Resume data not found for this card.");
            }
        } else if (button.classList.contains('mock-interview-btn')) {
            const interviewData = parentCard.querySelector('.mock-interview-data');
            if (title && interviewData) {
                openMockInterviewModal(title, interviewData.innerHTML);
             } else {
                console.error("Mock interview data not found for this card.");
            }
        }
    });


    // --- Form Logic ---
    const showPage = (page) => {
        formPage.classList.add('hidden');
        loadingPage.classList.add('hidden');
        resultsPage.classList.add('hidden');
        page.classList.remove('hidden');
        page.classList.add('fade-in');
    };

    const updateFormView = () => {
        formSections.forEach(section => section.classList.remove('active'));
        const activeSection = document.getElementById(`step-${currentStep}`);
        if (activeSection) activeSection.classList.add('active');
        
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;

        prevBtn.classList.toggle('invisible', currentStep === 1);
        nextBtn.classList.toggle('hidden', currentStep === totalSteps);
        submitBtn.classList.toggle('hidden', currentStep !== totalSteps);
    };

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormView();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormView();
        }
    });

    submitBtn.addEventListener('click', async () => {
        showPage(loadingPage);
        const formData = new FormData(document.getElementById('career-form'));
        const studentProfile = Object.fromEntries(formData.entries());
        
        errorMessage.classList.add('hidden');
        resultsContent.innerHTML = '';

        try {
            const result = await callGeminiAPI(studentProfile);
            renderResults(result);
            showPage(resultsPage);
        } catch(e) {
            console.error("API call failed:", e);
            if(errorText) {
                errorText.textContent = e.message || "Failed to get a response from the AI. Please try again.";
            }
            errorMessage.classList.remove('hidden');
            showPage(resultsPage);
        }
    });
    
    startOverBtn.addEventListener('click', () => {
        document.getElementById('career-form').reset();
        currentStep = 1;
        updateFormView();
        resultsContent.innerHTML = '';
        errorMessage.classList.add('hidden');
        showPage(formPage);
        document.getElementById('interactive-tool').scrollIntoView({ behavior: 'smooth' });
    });
    
    // --- Gemini API Call ---
    const callGeminiAPI = async (profile) => {
        const apiKey = "AIzaSyBYHYioHVQRnbAFb4-R-cbDl8qR4wZCZCk"; // IMPORTANT: Replace with your actual API Key

        if (apiKey === "PASTE_YOUR_API_KEY_HERE" || !apiKey) {
           throw new Error("API Key is missing. Please add your Google AI Studio API key to the script.");
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // FINAL ADVANCED PROMPT
        const systemPrompt = `You are a futuristic AI career co-pilot for Indian students. Create 3 diverse, personalized career path recommendations. Format the entire output in HTML within a single <div>. Do not include <!DOCTYPE html>, <html>, <head>, or <body> tags. Use the specified Tailwind CSS classes.

Structure for EACH of the 3 recommendations:
1.  **Main Container**: A <div> with class "card p-6 sm:p-8".
2.  **Career Title**: An <h3> with classes "text-2xl font-bold text-white mb-3 flex items-center". Include a relevant Lucide icon.
3.  **AI Skill Assessment**: A <h4> with text "AI Skill Assessment & Profile Fit". Follow with a <p> with class "text-slate-400". Analyze the user's narrative to identify strengths and weaknesses. Explain why the career fits. Bold keywords using <strong class="font-medium text-green-400">.
4.  **Key Skills to Master**: A <h4> with text "Key Skills to Master" and classes "mt-4". Follow with a <ul> with classes "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-slate-400". Each <li> must have classes "flex items-center text-sm" and a check-circle icon like <i data-lucide='check-circle' class='w-4 h-4 mr-2 text-green-400'></i>.
5.  **Button Group**: A <div> with classes "text-center mt-6 flex flex-wrap justify-center gap-4". Inside, create three buttons:
    a. <button class="outline-btn font-bold py-2 px-6 rounded-full view-roadmap-btn">Learning Roadmap</button>
    b. <button class="outline-btn font-bold py-2 px-6 rounded-full view-resume-btn">Sample Resume</button>
    c. <button class="outline-btn font-bold py-2 px-6 rounded-full mock-interview-btn">Mock Interview Prep</button>

6.  **CRITICAL HIDDEN DATA (MUST be included for EACH recommendation)**:
    a. **Personalized Learning Roadmap Data**: A <div> with class "actionable-roadmap-data" and style="display:none;". Inside, create an <ol> of exactly 5 steps. Each <li> is a milestone with a <h4> for the title and a <p> for the description. THIS DIV IS MANDATORY.
    b. **Sample Resume Data**: A <div> with class "sample-resume-data" and style="display:none;". Inside, create a complete, professional sample resume using semantic HTML. Use a parent div with "resume-header", then divs with "resume-section". Use <h2> for name, <p> for contact, <h3> for section titles (Summary, Skills, Experience, Projects, Education), and <ul> for lists. THIS DIV IS MANDATORY.
    c. **Mock Interview Data**: A <div> with class "mock-interview-data" and style="display:none;". Inside, create a <ul> of 2-3 recommended mock interview websites. Each <li> must contain an <a> tag with a link and a brief description. E.g., <li><a href='https://www.pramp.com/' target='_blank' class='text-indigo-400 hover:underline'>Pramp</a> - Peer-to-peer mock interviews for tech roles.</li>. THIS DIV IS MANDATORY.

Start the entire response with an overall introductory summary paragraph: <p class="p-5 bg-white/5 text-indigo-300 rounded-2xl mb-8 border border-white/10">. This summary should analyze the user's core strengths from their narrative.
`;

        const userQuery = `
            Student's Narrative:
            - Studies & Excitement: ${profile.studies || 'N/A'}
            - Proud Accomplishment: ${profile.projects || 'N/A'}
            - Passions & Problems to Solve: ${profile.passions || 'N/A'}
            - Ideal Work Style: ${profile.workstyle || 'N/A'}
            - Long-Term Aspirations: ${profile.aspirations || 'N/A'}
            
            Based on this narrative, generate the advanced, personalized career blueprint incorporating all the key features.`;
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        let response;
        let delay = 1000;
        for (let i = 0; i < 5; i++) {
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    const candidate = result.candidates?.[0];
                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        return candidate.content.parts[0].text;
                    } else {
                        throw new Error(result.error?.message || "Invalid response structure from API.");
                    }
                } else if (response.status === 429 || response.status >= 500) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                } else {
                   const errorData = await response.json();
                   throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                if (i === 4) throw error;
               await new Promise(res => setTimeout(res, delay));
               delay *= 2;
            }
        }
         throw new Error("Failed to get a response from the API after multiple retries.");
    };

    const renderResults = (htmlContent) => {
        resultsContent.innerHTML = htmlContent;
        lucide.createIcons();
    };
    
    // --- Initializations ---
    updateFormView();
    showPage(formPage);
});
