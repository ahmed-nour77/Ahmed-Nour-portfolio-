/* ==============================================================
   Ahmed Mohamed Nour Eldin - Interactive Portfolio Engine
   Features: Neural Network Canvas, Bilingual i18n, Typing Effect,
   Theme Switcher, Project Filter, Metrics Counter, Toast
   ============================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER REMOVAL ==========
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loaderBar');
    
    if (loaderBar) {
        loaderBar.style.width = '100%';
    }
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 600);
        }
    }, 700);

    // ========== INTERACTIVE NEURAL CANVAS ==========
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const numParticles = Math.min(Math.floor(window.innerWidth / 15), 65);
        const maxDist = 135;
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.75;
                this.vy = (Math.random() - 0.5) * 0.75;
                this.radius = Math.random() * 2 + 1;
                this.baseAlpha = Math.random() * 0.4 + 0.3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isDark 
                    ? `rgba(0, 242, 254, ${this.baseAlpha})` 
                    : `rgba(2, 132, 199, ${this.baseAlpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.28;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isDark 
                            ? `rgba(0, 242, 254, ${alpha})` 
                            : `rgba(2, 132, 199, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // ========== DYNAMIC TYPING EFFECT ==========
    const typedTextElem = document.getElementById('typedRole');
    const rolesEN = [
        "Data Scientist",
        "AI & Machine Learning Engineer",
        "Deep Learning & Computer Vision Specialist",
        "Predictive Modeling & Analytics Developer"
    ];
    const rolesAR = [
        "عالم بيانات (Data Scientist)",
        "مهندس ذكاء اصطناعي وتعلم آلي",
        "متخصص تعلم عميق ورؤية حاسوبية",
        "مطور نماذج تنبؤية وأنظمة تحليلية"
    ];

    let currentRoleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeRole() {
        const isArabic = document.documentElement.getAttribute('dir') === 'rtl';
        const roles = isArabic ? rolesAR : rolesEN;
        const currentRole = roles[currentRoleIndex % roles.length];

        if (isDeleting) {
            typedTextElem.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typedTextElem.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentRoleIndex++;
            typingSpeed = 500;
        }

        setTimeout(typeRole, typingSpeed);
    }
    if (typedTextElem) typeRole();

    // ========== THEME TOGGLE (DARK / LIGHT) ==========
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('an_theme') || 'dark';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('an_theme', theme);
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ========== BILINGUAL i18n ENGINE (EN / AR) ==========
    const translations = {
        en: {
            nav_home: "Home",
            nav_about: "About",
            nav_leadership: "Leadership",
            nav_projects: "Projects",
            nav_experience: "Experience",
            nav_skills: "Skills",
            nav_certifications: "Certifications",
            nav_education: "Education",
            nav_contact: "Contact",
            nav_cv: "CV",

            hero_hello: "Hello world, I am",
            hero_bio: "AI Engineer & Data Scientist passionate about building end-to-end predictive models, deep learning architectures, and scalable analytics pipelines. Transforming raw business data into actionable foresight.",
            hero_btn_projects: "Explore Projects",
            hero_btn_lead: "Leadership & Spotlights",
            hero_btn_chat: "WhatsApp",
            hero_scroll: "Scroll Down",
            status_available: "Available for AI Opportunities",

            hud_pipeline: "Active Pipeline:",
            hud_frameworks: "Key Frameworks:",
            hud_efficiency: "CIB Benchmark:",
            hud_vision: "Detection Gain:",
            hud_confidence: "Model Confidence Score",

            stat_frameworks: "AI Frameworks Benchmarked (CIB)",
            stat_hours: "Intensive AI Training Hours (NTI)",
            stat_cv: "Accuracy Boost in Vision Pipelines",
            stat_certifications: "Accredited Certifications",

            about_tag: "// 01. ABOUT ME",
            about_title: "Bridging Data Science & Production AI",
            about_subheading: "Architecting Intelligent Systems from Sensor Data to Deep Vision",
            about_p1: "I am an AI Engineer and Data Scientist studying Artificial Intelligence at Delta University for Science and Technology (Expected June 2027). With a practical mindset forged through real-world corporate environments like Commercial International Bank (CIB Egypt) and intensive training at NTI and BUE, I specialize in transforming raw tabular, image, and sensor data into high-value automated intelligence.",
            about_p2: "My technical sweet spot spans the entire machine learning lifecycle: from statistical EDA and advanced feature engineering to training state-of-the-art models (XGBoost, LightGBM, CNNs, Transformers) and deploying explainable, production-ready apps using Flask, Streamlit, and Power BI.",
            comp_1_title: "Predictive Analytics",
            comp_1_desc: "Forecasting equipment failures, customer behavior, and business KPIs with SHAP explainability.",
            comp_2_title: "Deep Learning & Vision",
            comp_2_desc: "CNNs, Spectrogram feature extraction, audio/video deepfake detection, and medical/disease diagnosis.",
            comp_3_title: "Data & BI Dashboards",
            comp_3_desc: "Complex SQL queries, Power BI interactive reports, and Python-driven analytical web applications.",
            comp_4_title: "IoT & Smart Systems",
            comp_4_desc: "Hardware prototyping, ESP32 microcontrollers, LoRa, MQTT, and smart occupancy monitoring.",
            meta_degree: "Degree:",
            meta_location: "Location:",
            meta_email: "Email:",
            meta_phone: "Phone:",

            lead_tag: "// 02. LEADERSHIP & MILESTONES",
            lead_title: "Graduation & Team Leadership Spotlights",
            lead_subtitle: "Directing cross-functional engineering teams, architecting AI & Data pipelines, and delivering executive presentations.",
            spot1_title: "Team Leader — NTI Data Analysis Track",
            spot1_desc: "Selected as Team Leader for our NTI Data Analysis graduation project following a strong academic record. Over the program, I directed the end-to-end development of the Account Risk Dashboard, managed cross-functional team workflows, overseen data pipeline modeling, and successfully delivered actionable customer churn insights.",
            spot2_title: "Team Leader — NTI AI Track",
            spot2_desc: "Appointed as Team Leader for our NTI AI graduation project. I directed the development and deployment of an AI-powered system for automated fight detection using deep learning on video feeds. I managed the end-to-end project, overseen the integration of computer vision models, coordinated diverse workflows, and successfully presented the real-time detection solution.",
            spot3_title: "Smart Parking System Project",
            spot3_desc: "Selected to lead our university IoT project. I spearheaded the complete development of an IoT-based Smart Parking System. I directed the design, managed the hardware and software integration for real-time occupancy monitoring, oversaw system validation, and successfully presented a working prototype to the faculty panel.",

            proj_tag: "// 03. COMPLETE ARSENAL",
            proj_title: "Engineering Impactful AI & IoT Systems",
            proj_subtitle: "Production-oriented machine learning pipelines, deep learning architectures, business intelligence, and embedded hardware systems.",
            filter_all: "All Projects (12)",
            filter_dl: "Computer Vision & Deep Learning",
            filter_ml: "Predictive ML",
            filter_bi: "Analytics & BI",
            filter_iot: "IoT & Embedded",

            p1_title: "AI Fake Detection System (Multimodal Deepfake)",
            p1_desc: "End-to-end deepfake detection pipeline for image and audio data using CNN architectures. Improved voice anomaly classification by 30% and cut false positives by 25% through spectrogram-based audio feature extraction.",
            p2_title: "Automated Fight & Violence Detection System",
            p2_desc: "AI-powered surveillance system for automated real-time violence detection across streaming video feeds using CNN-LSTM and 3D-CNN models, analyzing temporal motion patterns for public security.",
            p3_title: "Cow & Livestock Disease Detection",
            p3_desc: "CNN-based image classification system for automated livestock disease diagnosis, supporting earlier identification and localized treatment through computer vision.",
            p4_title: "Fake Job Posting Detection",
            p4_desc: "NLP-based classifier that flags fraudulent job listings from job description text and structured metadata, built to safeguard job seekers and analyze deceptive recruiting patterns.",
            p5_title: "Predictive Maintenance & Failure Forecasting System",
            p5_desc: "End-to-end industrial predictive pipeline to forecast equipment failures from sensor data. Compared Random Forest, XGBoost, and LightGBM models with SHAP-based interpretability and Flask deployment.",
            p6_title: "AI Employee Attrition & Retention Intelligence",
            p6_desc: "AI-based decision-support system predicting employee attrition risks and delivering personalized retention recommendations. Features clustering, SHAP feature importance, and interactive dashboarding.",
            p7_title: "Customer Segmentation Analysis",
            p7_desc: "K-Means clustering on e-commerce transaction data to segment customer cohorts by purchasing behaviors, empowering targeted marketing strategies and lifetime value optimization.",
            p8_title: "COVID-19 Global Trend Analysis",
            p8_desc: "Processed global datasets to analyze transmission and mortality trends; built interactive time-series plots and regional comparison dashboards to visualize infection waves.",
            p9_title: "Account Risk & Customer Churn Dashboard",
            p9_desc: "Comprehensive banking analytics dashboard designed during NTI track leadership. Delivers granular customer demographics, monthly revenue risk modeling, and churn vulnerability alerts.",
            p10_title: "Sales Performance & Revenue Dashboard",
            p10_desc: "Analyzed retail sales data to identify top-performing revenue drivers and profitability indicators; engineered interactive Power BI reports with dynamic slice-and-dice metrics.",
            p11_title: "IoT Smart Parking Management System",
            p11_desc: "IoT garage-management system engineered with ESP32 controllers and IR sensors for vehicle counting, automated barriers, and real-time bay occupancy display via an interactive web interface.",
            p12_title: "Open Area Environmental Monitoring System",
            p12_desc: "IoT-based environmental monitoring platform transmitting sensor readings across long distances via LoRa and MQTT to a central telemetry dashboard for agricultural and safety oversight.",

            exp_tag: "// 04. CAREER PATH",
            exp_title: "Professional Experience & Internships",
            cib_role: "AI Engineer Intern",
            cib_bullet_1: "Evaluated and benchmarked 3+ AI decision-making frameworks to inform data-driven process improvements, raising workflow integration efficiency by approximately 15%.",
            cib_bullet_2: "Collaborated with cross-functional business and technical teams to identify 2+ key operational improvement areas, contributing to enhanced automation and reporting solutions.",
            bue_role: "Machine Learning Trainee",
            bue_bullet_1: "Completed project-based modules in machine learning and computer vision, improving model accuracy by 10–20% across iterations through rigorous iterative testing and feature refinement.",
            nti_role: "Artificial Intelligence Trainee",
            nti_bullet_1: "Completed an intensive 120-hour program in Artificial Intelligence and Machine Learning covering the end-to-end data lifecycle.",
            nti_bullet_2: "Gained extensive hands-on experience in data preprocessing, exploratory data analysis (EDA), and feature engineering on real-world datasets.",
            nti_bullet_3: "Built and evaluated classification and regression models using Accuracy, Precision, Recall, F1-score, and ROC-AUC metrics.",

            skills_tag: "// 05. TECHNICAL ARSENAL",
            skills_title: "Technologies & Core Competencies",
            cat_mldl: "Machine Learning & Deep Learning",
            cat_ds: "Data Science & Analytics",
            cat_bi: "BI, Reporting & Web Deployment",
            cat_db: "Databases, Languages, IoT & Vision",

            certs_tag: "// 06. CREDENTIALS",
            certs_title: "Verified Certifications & Accreditations",
            c1_desc: "Deep Learning Institute certification specializing in generative models and transformer architectures.",
            c2_desc: "Comprehensive accreditation in Artificial Intelligence foundations and machine learning algorithms.",
            c3_desc: "Corporate certification for benchmarking AI decision systems and optimizing banking operations.",
            c4_desc: "Project-driven certification in computer vision algorithms and machine learning iterative tuning.",
            c5_desc: "Foundational training covering supervised and unsupervised learning paradigms.",

            edu_tag: "// 07. ACADEMICS",
            edu_title: "Academic Foundation",
            edu_degree_tag: "Bachelor of Science",
            edu_degree: "B.Sc. in Artificial Intelligence",
            edu_uni: "Delta University for Science and Technology, Egypt",
            edu_desc: "Rigorous academic curriculum emphasizing core theoretical mathematics, linear algebra, statistical analysis, deep neural networks, computer vision, data structures, algorithms, and software engineering principles.",

            cv_banner_title: "Looking for the complete resume?",
            cv_banner_desc: "View or print an ATS-optimized, executive version of Ahmed Mohamed Nour Eldin's CV.",
            cv_btn_view: "View CV Online",
            cv_btn_print: "Print / Save as PDF",

            contact_tag: "// 08. GET IN TOUCH",
            contact_title: "Let's Build Something Intelligent",
            contact_sub: "Have an AI challenge, a data problem, or an internship/role opportunity? I would love to connect!",
            contact_methods: "Direct Communication",
            contact_methods_sub: "I am actively open to AI engineering internships, data science roles, and collaborative machine learning projects.",
            c_email: "Email",
            form_name: "Your Name",
            form_email: "Your Email",
            form_subject: "Subject",
            form_message: "Message",
            form_send: "Send Message",
            footer_tagline: "Data Scientist & AI Engineer — Building intelligence through code.",
            footer_rights: "All Rights Reserved."
        },
        ar: {
            nav_home: "الرئيسية",
            nav_about: "نبذة عني",
            nav_leadership: "القيادة والمشاريع",
            nav_projects: "كافة المشاريع",
            nav_experience: "الخبرات",
            nav_skills: "المهارات",
            nav_certifications: "الشهادات",
            nav_education: "التعليم",
            nav_contact: "تواصل معي",
            nav_cv: "السيرة الذاتية",

            hero_hello: "أهلاً بك، أنا",
            hero_bio: "مهندس ذكاء اصطناعي وعالم بيانات شغوف ببناء نماذج تنبؤية متكاملة، وبنى تعلم عميق متقدمة، وخطوط معالجة بيانات قابلة للتوسع. أحول البيانات الأولية إلى قرارات استراتيجية ورؤى ذكية.",
            hero_btn_projects: "استكشف المشاريع",
            hero_btn_lead: "القيادة ومشاريع التخرج",
            hero_btn_chat: "واتساب",
            hero_scroll: "مرر للأسفل",
            status_available: "متاح لفرص الذكاء الاصطناعي",

            hud_pipeline: "خط المعالجة الفعال:",
            hud_frameworks: "أطر العمل الأساسية:",
            hud_efficiency: "مقياس CIB المعتمد:",
            hud_vision: "مكاسب الرؤية الحاسوبية:",
            hud_confidence: "نسبة ثقة النماذج الذكية",

            stat_frameworks: "نماذج ذكاء اصطناعي جرى تقييمها (CIB)",
            stat_hours: "ساعة تدريب مكثفة في الذكاء الاصطناعي (NTI)",
            stat_cv: "نسبة تحسن الدقة بنماذج الرؤية الحاسوبية",
            stat_certifications: "شهادات واعتمادات مهنية معتمدة",

            about_tag: "// 01. نبذة عني",
            about_title: "الربط بين علم البيانات والذكاء الاصطناعي الإنتاجي",
            about_subheading: "بناء أنظمة ذكية تمتد من بيانات الحساسات حتى الرؤية الحاسوبية المعقدة",
            about_p1: "أنا مهندس ذكاء اصطناعي وعالم بيانات، أدرس بكالوريوس الذكاء الاصطناعي في جامعة الدلتا للعلوم والتكنولوجيا (تخرج متوقع: يونيو 2027). من خلال تجاربي العملية داخل مؤسسات رائدة مثل البنك التجاري الدولي (CIB مصر) وتدريبات مكثفة في معهد تكنولوجيا الاتصالات (NTI) والجامعة البريطانية (BUE)، أركز على تحويل البيانات الرقمية والصورية إلى حلول ذكية مؤتمتة.",
            about_p2: "تشمل خبرتي دورة حياة التعلم الآلي كاملة: من التحليل الاستكشافي وهندسة الخصائص المتقدمة، حتى تدريب النماذج الفائقة (XGBoost, LightGBM, CNNs, Transformers) ونشر التطبيقات التفاعلية القابلة للتفسير باستخدام Flask و Streamlit و Power BI.",
            comp_1_title: "التحليلات التنبؤية",
            comp_1_desc: "التنبؤ بأعطال المعدات وسلوك العملاء ومؤشرات الأداء مع إمكانية تفسير النماذج باستخدام SHAP.",
            comp_2_title: "التعلم العميق والرؤية الحاسوبية",
            comp_2_desc: "شبكات CNN، وتحليل طيف الصوت Spectrogram، واكتشاف التزييف العميق وتشخيص الأمراض.",
            comp_3_title: "لوحات البيانات و BI",
            comp_3_desc: "استعلامات SQL المتقدمة، ولوحات Power BI التفاعلية، وتطبيقات التحليل المبنية بلغة بايثون.",
            comp_4_title: "إنترنت الأشياء والأنظمة الذكية",
            comp_4_desc: "تصميم النماذج المادية، متحكمات ESP32، تقنيات LoRa و MQTT والمراقبة الفورية للأماكن.",
            meta_degree: "الدرجة العلمية:",
            meta_location: "الموقع:",
            meta_email: "البريد الإلكتروني:",
            meta_phone: "الهاتف:",

            lead_tag: "// 02. القيادة ومشاريع التخرج",
            lead_title: "محطات القيادة ومشاريع التخرج البارزة",
            lead_subtitle: "إدارة وتوجيه فرق هندسية متعددة التخصصات، وتطوير خطوط الذكاء الاصطناعي، وتقديم العروض للجان والشركاء.",
            spot1_title: "قائد الفريق — مسار تحليل البيانات بمعهد NTI",
            spot1_desc: "تم اختياري قائداً للفريق (Team Leader) لمشروع التخرج في مسار تحليل البيانات بمعهد NTI تقديراً لتميزي الأكاديمي. قمت بإدارة التطوير الشامل للوحة تحكم مخاطر الحسابات (Account Risk Dashboard)، وتنسيق مهام الفريق، والإشراف على نمذجة البيانات، وتقديم استنتاجات عملية لتقليل خسارة العملاء (Customer Churn).",
            spot2_title: "قائد الفريق — مسار الذكاء الاصطناعي بمعهد NTI",
            spot2_desc: "عُيّنت قائداً للفريق (Team Leader) لمشروع تخرج مسار الذكاء الاصطناعي بمعهد NTI. أدرت تطوير ونشر نظام ذكاء اصطناعي لكشف الشجار والعنف آلياً عبر مقاطع الفيديو الحية باستخدام التعلم العميق (CNN-LSTM)، وأشرفت على دمج نماذج الرؤية الحاسوبية وتنسيق المهام وعرض حل الكشف المباشر بنجاح.",
            spot3_title: "مشروع نظام المواقف الذكية (Smart Parking System)",
            spot3_desc: "تم اختياري لقيادة مشروع جامعي تطبيقي في إنترنت الأشياء (IoT). قمت بإدارة التطوير المتكامل لنظام مواقف ذكي، وتصميم النظام والدمج العتادي والبرمجي مع الحساسات لمراقبة الإشغال لحظياً والتحقق من النظام وتقديم النموذج العامل بنجاح أمام لجنة القسم.",

            proj_tag: "// 03. الترسانة الكاملة للمشاريع",
            proj_title: "هندسة أنظمة ذكاء اصطناعي وإنترنت أشياء ذات تأثير عملي",
            proj_subtitle: "خطوط تعلم آلي متوافقة مع بيئات الإنتاج، ونماذج تعلم عميق، وتطبيقات ذكاء اصطناعي، وأنظمة عتادية مدمجة.",
            filter_all: "كافة المشاريع (12)",
            filter_dl: "رؤية حاسوبية وتعلم عميق",
            filter_ml: "تعلم آلي تنبؤي",
            filter_bi: "تحليلات ولوحات BI",
            filter_iot: "إنترنت الأشياء ومتحكمات",

            p1_title: "نظام كشف التزييف العميق متعدد الوسائط (AI Fake Detection)",
            p1_desc: "خط متكامل لكشف التزييف العميق للصور والصوت باستخدام شبكات CNN. رفع دقة كشف التزييف الصوتي بنسبة 30% وخفض الإيجابيات الكاذبة بنسبة 25% عبر استخراج ميزات طيف الصوت (Spectrograms).",
            p2_title: "نظام كشف العنف والشجار الآلي في الوقت الحقيقي",
            p2_desc: "نظام مراقبة ذكي لكشف الشجار والعنف آلياً في الوقت الفعلي عبر تدفقات كاميرات المراقبة باستخدام شبكات CNN-LSTM و 3D-CNN لتحليل الأنماط الحركية الزمانية لحماية الأمن العام.",
            p3_title: "نظام تشخيص أمراض الأبقار والماشية بالرؤية الحاسوبية",
            p3_desc: "نظام تصنيف صور مبني على شبكات CNN للتشخيص الآلي لأمراض الماشية، مما يدعم الاكتشاف المبكر للمرض وحماية الإنتاج الحيواني.",
            p4_title: "نظام كشف إعلانات التوظيف الاحتيالية (Fake Job Detection)",
            p4_desc: "مصنف لمعالجة اللغة الطبيعية (NLP) يرصد إعلانات الوظائف الاحتيالية من نصوص الإعلانات والبيانات الوصفية لحماية الباحثين عن عمل وتحليل أنماط التوظيف المضللة.",
            p5_title: "نظام الصيانة التنبؤية والتوقع المبكر للأعطال",
            p5_desc: "بناء خط نمذجة تنبؤي متكامل للتنبؤ بأعطال المعدات الصناعية من بيانات الحساسات، مع مقارنة أداء Random Forest و XGBoost و LightGBM ونشر التطبيق عبر Flask مع تفسير القرارات عبر SHAP.",
            p6_title: "نظام ذكاء استبقاء الموظفين وتحليل الاستقالات (Employee Attrition)",
            p6_desc: "نظام دعم قرار ذكي يتنبأ بمخاطر ترك الموظفين للعمل ويقدم توصيات مخصصة لإدارات الموارد البشرية مع تجميع الأنماط (Clustering) وتفسير النتائج عبر SHAP.",
            p7_title: "تحليل تقسيم وتصنيف العملاء (Customer Segmentation)",
            p7_desc: "تطبيق خوارزمية K-Means على بيانات التجارة الإلكترونية لتقسيم مجموعات العملاء وفق سلوكياتهم الشرائية، لدعم الحملات التسويقية الموجهة.",
            p8_title: "تحليل الاتجاهات العالمية لجائحة كوفيد-19",
            p8_desc: "معالجة وتحليل البيانات الوبائية العالمية لدراسة اتجاهات الإصابات والوفيات؛ بناء رسوم بيانية تفاعلية متسلسلة زمنياً باستخدام Plotly.",
            p9_title: "لوحة مؤشرات مخاطر الحسابات وتسرب العملاء (Account Risk)",
            p9_desc: "لوحة تحكم بنكية متكاملة جرى تطويرها خلال قيادة مسار تحليل البيانات بـ NTI، تقدم تحليلاً ديموغرافياً للعملاء ونمذجة المخاطر المالية ومؤشرات التسرب.",
            p10_title: "لوحة أداء المبيعات والإيرادات (Sales Performance)",
            p10_desc: "تحليل بيانات مبيعات التجزئة لتحديد محركات الإيرادات ومؤشرات الأداء الأساسية؛ وبناء تقارير Power BI تفاعلية مع تجزئة ديناميكية.",
            p11_title: "نظام إدارة المواقف الذكية (Smart Parking System)",
            p11_desc: "نظام مواقف ذكي متكامل يعمل بمتحكم ESP32 وحساسات الأشعة تحت الحمراء لحساب السيارات وفتح البوابات تلقائياً وعرض الإشغال المباشر عبر واجهة ويب.",
            p12_title: "نظام المراقبة البيئية للمناطق المفتوحة (Open Area Monitoring)",
            p12_desc: "منصة مراقبة بيئية ترسل قراءات الحساسات عبر مسافات بعيدة باستخدام تقنيات LoRa و MQTT إلى منصة ويب مركزية للأغراض الزراعية والأمنية.",

            exp_tag: "// 04. المسار المهني",
            exp_title: "الخبرات المهنية والتدريب الميداني",
            cib_role: "متدرب مهندس ذكاء اصطناعي (Intern)",
            cib_bullet_1: "تقييم وقياس أداء 3+ أطر عمل لاتخاذ القرار بالذكاء الاصطناعي لتحسين العمليات التشغيلية ورفع كفاءة تدفق العمل بحوالي 15%.",
            cib_bullet_2: "التعاون مع فرق الأعمال والتقنية لتحديد منطقتين رئيسيتين للتحسين التشغيلي والمساهمة في بناء حلول الأتمتة وإعداد التقارير.",
            bue_role: "متدرب تعلم آلي (Machine Learning Trainee)",
            bue_bullet_1: "إتمام وحدات قائمة على المشاريع في التعلم الآلي والرؤية الحاسوبية، محققاً زيادة في دقة النماذج بنسبة 10–20% عبر التحسين المتكرر للميزات.",
            nti_role: "متدرب ذكاء اصطناعي (AI Trainee)",
            nti_bullet_1: "إتمام برنامج تدريبي مكثف لمدة 120 ساعة في الذكاء الاصطناعي والتعلم الآلي مغطياً دورة حياة البيانات بالكامل.",
            nti_bullet_2: "اكتساب خبرة عملية في معالجة البيانات، والتحليل الاستكشافي (EDA)، وهندسة الميزات على مجموعات بيانات حقيقية.",
            nti_bullet_3: "بناء وتقييم نماذج التصنيف والانحدار باستخدام مقاييس الدقة (Precision, Recall, F1-score, ROC-AUC).",

            skills_tag: "// 05. الترسانة التقنية",
            skills_title: "المهارات والتقنيات الأساسية",
            cat_mldl: "التعلم الآلي والتعلم العميق",
            cat_ds: "علم البيانات والتحليلات المتقدمة",
            cat_bi: "ذكاء الأعمال والنشر البرمجي",
            cat_db: "قواعد البيانات، اللغات، إنترنت الأشياء والرؤية",

            certs_tag: "// 06. الاعتمادات المهنية",
            certs_title: "الشهادات والاعتمادات الموثقة",
            c1_desc: "شهادة معهد التعلم العميق من NVIDIA متخصصة في الذكاء الاصطناعي التوليدي وبنى Transformers.",
            c2_desc: "اعتماد رسمي شامل في أسس الذكاء الاصطناعي وخوارزميات التعلم الآلي من معهد NTI وهواوي.",
            c3_desc: "شهادة إتمام التدريب الصيفي لدى البنك التجاري الدولي لتقييم أطر قرارات الذكاء الاصطناعي.",
            c4_desc: "شهادة عملية في تطبيقات خوارزميات الرؤية الحاسوبية والضبط المتكرر لنماذج الذكاء الاصطناعي.",
            c5_desc: "تدريب تأسيسي معتمد في نماذج التعلم الخاضع للإشراف وغير الخاضع للإشراف.",

            edu_tag: "// 07. التعليم الأكاديمي",
            edu_title: "الأساس الأكاديمي",
            edu_degree_tag: "بكالوريوس العلوم",
            edu_degree: "بكالوريوس الذكاء الاصطناعي",
            edu_uni: "جامعة الدلتا للعلوم والتكنولوجيا، مصر",
            edu_desc: "منهج أكاديمي متين يركز على الرياضيات النظرية، والجبر الخطي، والتحليل الإحصائي، والشبكات العصبية العميقة، والرؤية الحاسوبية، وهياكل البيانات والخوارزميات، وهندسة البرمجيات.",

            cv_banner_title: "هل ترغب في مراجعة السيرة الذاتية الكاملة؟",
            cv_banner_desc: "تصفح أو اطبع نسخة مهنية متوافقة مع أنظمة الفرز الآلي (ATS) لأحمد محمد نور الدين.",
            cv_btn_view: "عرض السيرة الذاتية",
            cv_btn_print: "طباعة / حفظ كـ PDF",

            contact_tag: "// 08. تواصل معي",
            contact_title: "لنبنِ معاً حلولاً ذكية تترك أثراً",
            contact_sub: "هل لديك تحدٍ تقني في معالجة البيانات، أو فرصة تدريب/عمل في الذكاء الاصطناعي؟ يسعدني تواصلك!",
            contact_methods: "وسائل التواصل المباشرة",
            contact_methods_sub: "أنا متاح لفرص التدريب والعمل كمهندس ذكاء اصطناعي، واستشارات علم البيانات، والمشاريع البرمجية.",
            c_email: "البريد الإلكتروني",
            form_name: "الاسم الكريم",
            form_email: "البريد الإلكتروني",
            form_subject: "الموضوع",
            form_message: "نص الرسالة",
            form_send: "إرسال الرسالة",
            footer_tagline: "عالم بيانات ومهندس ذكاء اصطناعي — نبني الذكاء عبر الأكواد.",
            footer_rights: "جميع الحقوق محفوظة."
        }
    };

    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');

    function applyLanguage(lang) {
        const isAr = lang === 'ar';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
        if (langText) {
            langText.textContent = isAr ? "English" : "العربية";
        }
        localStorage.setItem('an_lang', lang);

        const dict = translations[lang] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            if (dict[key]) {
                elem.innerHTML = dict[key];
            }
        });
    }

    const savedLang = localStorage.getItem('an_lang') || 'en';
    applyLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('lang') || 'en';
            applyLanguage(current === 'en' ? 'ar' : 'en');
        });
    }

    // ========== PROJECT FILTERING ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // ========== SCROLL PROGRESS BAR & ACTIVE NAV SPY ==========
    const scrollBar = document.getElementById('scrollBar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollBar) scrollBar.style.width = scrolled + '%';

        if (backToTop) {
            if (winScroll > 450) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        let currentSection = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            if (winScroll >= sectionTop) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== MOBILE HAMBURGER MENU ==========
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('active');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // ========== COPY EMAIL TO CLIPBOARD WITH TOAST ==========
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(document.documentElement.getAttribute('lang') === 'ar' ? 'تم نسخ البريد بنجاح!' : 'Email copied to clipboard!');
                });
            }
        });
    });

    function showToast(msg) {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});