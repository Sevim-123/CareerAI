/*
 * Career data for the Career Skill & Roadmap Analyzer.
 *
 * To add a new career track, copy one of the objects in `tracks`, give it a
 * new key, and fill in every field. Every skill in `skills` needs an entry in
 * `skillNotes` and in `resources` (below). Every level needs 3 roadmap phases
 * and 6 study-plan rows.
 */
window.CareerData = {
  tracks: {
    ai: {
      label: "Artificial Intelligence",
      fullRoadmap: "https://roadmap.sh/ai-engineer",
      aliases: [
        "artificial intelligence", "ai", "ai engineer", "ai developer",
        "machine learning", "ml", "ml engineer", "machine learning engineer",
        "deep learning", "yapay zeka", "yapay zeka muhendisi", "yapay zeka muhendisligi"
      ],
      skills: ["Python", "Git", "Data Structures", "Math & Statistics", "Machine Learning", "Deep Learning"],
      foundationalSkills: ["C", "C++"],
      skillNotes: {
        "Python": "Core language for data and ML work: functions, classes, virtual environments.",
        "Git": "Version control, branches, and clean GitHub commits.",
        "Data Structures": "Lists, dicts, sets, Big-O complexity, and C/C++ memory/structure comparison.",
        "Math & Statistics": "Linear algebra (vectors/matrices), probability, mean/variance, gradients.",
        "Machine Learning": "NumPy, Pandas, Scikit-Learn, train/test split, classification/regression.",
        "Deep Learning": "Neural network basics and PyTorch tensor/model training."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–3): Workflow & Foundations", desc: "Set up Git/GitHub and reinforce Python data structures alongside C/C++ fundamentals." },
          { title: "Phase 2 (Weeks 4–8): Math & Classical ML", desc: "Cover linear algebra & statistics, then practice NumPy, Pandas, and Scikit-Learn." },
          { title: "Phase 3 (Weeks 9–12): Evaluation & Deep Learning", desc: "Master model validation, build 1 end-to-end ML project, and start PyTorch basics." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–4): Deep Architectures", desc: "Work with CNNs, sequence/transformer models, and experiment tracking." },
          { title: "Phase 2 (Weeks 5–8): Deployment & APIs", desc: "Serve models via FastAPI/Docker and optimize inference speed." },
          { title: "Phase 3 (Weeks 9–12): Applied Capstone", desc: "Ship a reproducible AI project with benchmarks and documentation." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): System & Model Optimization", desc: "Focus on quantization, profiling, and scalable data pipelines." },
          { title: "Phase 2 (Weeks 5–8): MLOps & Reliability", desc: "Automate testing, CI/CD, and drift/error monitoring." },
          { title: "Phase 3 (Weeks 9–12): Research & Leadership", desc: "Publish technical write-ups, open-source tools, or benchmark studies." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Week 1", focus: "Git & GitHub", routine: "3h init/add/commit/branch/push; 2h organize Python & C/C++ code", output: "Clean ai-foundations GitHub repo" },
          { period: "Weeks 2–3", focus: "Data Structures", routine: "3h Python data structures & Big-O; 2h C/C++ structure comparison", output: "15–20 solved core problems" },
          { period: "Weeks 4–6", focus: "Math & Statistics", routine: "3h matrices, derivatives, probability; 2h NumPy numeric practice", output: "NumPy math & stats notebook" },
          { period: "Weeks 7–8", focus: "Data & First ML", routine: "3h Pandas cleaning/EDA; 2h Scikit-Learn baseline models", output: "First classification model" },
          { period: "Weeks 9–10", focus: "Model Evaluation", routine: "3h train/test, cross-validation, overfitting; 2h tuning", output: "End-to-end ML mini project" },
          { period: "Weeks 11–12", focus: "Deep Learning Intro", routine: "3h neural net intuition & PyTorch; 2h small model training", output: "PyTorch baseline + README" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "CNNs & Transfer Learning", routine: "3h CNN architectures & fine-tuning pretrained models; 2h image dataset practice", output: "Fine-tuned image classifier" },
          { period: "Weeks 3–4", focus: "Transformers & Sequences", routine: "3h attention & Hugging Face Transformers; 2h text classification", output: "Fine-tuned text model + experiment log" },
          { period: "Weeks 5–6", focus: "Model Serving", routine: "3h FastAPI endpoints for models; 2h Docker packaging", output: "Containerized inference API" },
          { period: "Weeks 7–8", focus: "Inference Optimization", routine: "3h batching, ONNX export, profiling; 2h latency benchmarks", output: "Before/after latency report" },
          { period: "Weeks 9–10", focus: "Capstone Build", routine: "3h end-to-end pipeline; 2h evaluation & error analysis", output: "Working capstone prototype" },
          { period: "Weeks 11–12", focus: "Reproducibility & Docs", routine: "3h tests, configs, fixed seeds; 2h README & benchmarks", output: "Reproducible capstone repo" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Profiling & Quantization", routine: "3h GPU/CPU profiling & mixed precision; 2h quantization experiments", output: "Optimization benchmark notebook" },
          { period: "Weeks 3–4", focus: "Data Pipelines", routine: "3h scalable data loading & feature pipelines; 2h data validation", output: "Validated training pipeline" },
          { period: "Weeks 5–6", focus: "CI/CD for ML", routine: "3h automated tests & training CI; 2h model registry/versioning", output: "Automated train-and-release workflow" },
          { period: "Weeks 7–8", focus: "Monitoring", routine: "3h drift & error monitoring; 2h alerting dashboards", output: "Monitoring dashboard for a live model" },
          { period: "Weeks 9–10", focus: "Research Study", routine: "3h reproduce a recent paper; 2h ablation experiments", output: "Reproduction + ablation results" },
          { period: "Weeks 11–12", focus: "Publish & Share", routine: "3h technical write-up; 2h open-source release", output: "Published write-up or OSS tool" }
        ]
      }
    },

    web: {
      label: "Web Development",
      fullRoadmap: "https://roadmap.sh/full-stack",
      aliases: [
        "web development", "web dev", "web", "web developer", "frontend", "front end",
        "front-end", "backend", "back end", "back-end", "full stack", "full-stack",
        "fullstack", "web gelistirme", "web gelistirici", "web yazilim"
      ],
      skills: ["HTML/CSS", "JavaScript", "Git", "React", "SQL", "Node.js"],
      foundationalSkills: ["Python", "C", "C++"],
      skillNotes: {
        "HTML/CSS": "Semantic structure, Flexbox/Grid, responsive layouts.",
        "JavaScript": "ES6+, async/await, DOM manipulation, fetch API.",
        "Git": "Branching, pull requests, and portfolio hosting.",
        "React": "Components, props/state, hooks, reusable UI.",
        "SQL": "Relational modeling, joins, indexing, queries.",
        "Node.js": "REST APIs, middleware, authentication basics."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–4): Web Core & Git", desc: "Build responsive pages with HTML/CSS and JavaScript fundamentals." },
          { title: "Phase 2 (Weeks 5–8): React & APIs", desc: "Create interactive frontend components connected to APIs." },
          { title: "Phase 3 (Weeks 9–12): Backend & SQL", desc: "Build a Node.js + SQL CRUD app and deploy it." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–4): TypeScript & Architecture", desc: "Add strict typing, modular folders, and state patterns." },
          { title: "Phase 2 (Weeks 5–8): Auth & Database Tuning", desc: "Implement auth flows, caching, and clean SQL queries." },
          { title: "Phase 3 (Weeks 9–12): Testing & Deployment", desc: "Add automated tests and CI/CD pipelines." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): Performance", desc: "Optimize bundle size, rendering, and Core Web Vitals." },
          { title: "Phase 2 (Weeks 5–8): Scalability", desc: "Design service boundaries, queues, and observability." },
          { title: "Phase 3 (Weeks 9–12): System Design", desc: "Lead architecture reviews and production rollouts." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Weeks 1–2", focus: "HTML, CSS & Git", routine: "3h responsive layouts; 2h Git workflow & deployment", output: "Responsive landing page" },
          { period: "Weeks 3–4", focus: "JavaScript Core", routine: "3h JS fundamentals & async; 2h interactive DOM apps", output: "Interactive JS utility app" },
          { period: "Weeks 5–7", focus: "React", routine: "3h components/hooks; 2h API consumption", output: "Multi-view React frontend" },
          { period: "Weeks 8–9", focus: "SQL", routine: "3h schema & queries; 2h practice datasets", output: "Normalized DB schema" },
          { period: "Weeks 10–11", focus: "Node.js API", routine: "3h REST endpoints; 2h connecting React + SQL", output: "Full-stack CRUD app" },
          { period: "Week 12", focus: "Polish & Portfolio", routine: "3h bug fixes & docs; 2h live deployment", output: "Hosted full-stack portfolio" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "TypeScript", routine: "3h types, generics, strict mode; 2h migrate a JS project", output: "Strictly typed project" },
          { period: "Weeks 3–4", focus: "Architecture & State", routine: "3h folder structure & state patterns; 2h refactoring", output: "Modular frontend architecture" },
          { period: "Weeks 5–6", focus: "Authentication", routine: "3h sessions/JWT & password hashing; 2h protected routes", output: "Secure login flow" },
          { period: "Weeks 7–8", focus: "Database Tuning", routine: "3h indexes, query plans, caching; 2h optimize slow queries", output: "Query performance report" },
          { period: "Weeks 9–10", focus: "Automated Testing", routine: "3h unit & integration tests; 2h end-to-end tests", output: "Test suite with coverage report" },
          { period: "Weeks 11–12", focus: "CI/CD & Deployment", routine: "3h CI pipeline; 2h staged deployment", output: "Auto-deployed production app" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Core Web Vitals", routine: "3h Lighthouse audits & rendering optimization; 2h bundle splitting", output: "Before/after performance audit" },
          { period: "Weeks 3–4", focus: "Caching & CDN", routine: "3h HTTP caching, CDN, SSR/SSG trade-offs; 2h implementation", output: "Cached, edge-delivered app" },
          { period: "Weeks 5–6", focus: "Service Boundaries", routine: "3h splitting services, queues & background jobs; 2h implementation", output: "Async job processing service" },
          { period: "Weeks 7–8", focus: "Observability", routine: "3h logging, metrics, tracing; 2h dashboards & alerts", output: "Observability dashboard" },
          { period: "Weeks 9–10", focus: "System Design", routine: "3h design case studies; 2h writing design docs", output: "2 system design documents" },
          { period: "Weeks 11–12", focus: "Production Rollout", routine: "3h feature flags & canary releases; 2h incident runbooks", output: "Rollout plan + runbook" }
        ]
      }
    },

    data: {
      label: "Data Science",
      fullRoadmap: "https://roadmap.sh/ai-data-scientist",
      aliases: [
        "data science", "data scientist", "data analyst", "data analysis", "data analytics",
        "veri bilimi", "veri bilimci", "veri analizi", "veri analisti"
      ],
      skills: ["Python", "SQL", "Math & Statistics", "Pandas & NumPy", "Data Visualization", "Machine Learning"],
      foundationalSkills: ["Excel", "R", "Git"],
      skillNotes: {
        "Python": "Scripting, functions, and Jupyter notebooks for analysis.",
        "SQL": "SELECT, JOIN, GROUP BY, and window functions on real datasets.",
        "Math & Statistics": "Descriptive stats, distributions, hypothesis testing, regression basics.",
        "Pandas & NumPy": "Loading, cleaning, reshaping, and aggregating tabular data.",
        "Data Visualization": "Matplotlib/Seaborn charts, choosing the right chart, dashboards.",
        "Machine Learning": "Scikit-Learn regression/classification, validation, feature engineering."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–6): Python, SQL & Data Wrangling", desc: "Learn Python for analysis, write SQL queries, and clean data with Pandas." },
          { title: "Phase 2 (Weeks 7–10): Statistics & Visualization", desc: "Apply descriptive and inferential statistics and tell stories with charts." },
          { title: "Phase 3 (Weeks 11–12): First ML & Portfolio", desc: "Train a baseline model and publish your analysis notebooks on GitHub/Kaggle." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–4): Feature Engineering & Model Selection", desc: "Engineer features, tune models, and compare them with proper validation." },
          { title: "Phase 2 (Weeks 5–8): Experimentation & Advanced SQL", desc: "Design A/B tests, compute significance, and write analytics-grade SQL." },
          { title: "Phase 3 (Weeks 9–12): Dashboards & Communication", desc: "Build an interactive dashboard and present findings to non-technical audiences." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): Big Data & Pipelines", desc: "Process large datasets with Spark and automate reliable data pipelines." },
          { title: "Phase 2 (Weeks 5–8): Advanced Modeling", desc: "Time series forecasting, causal inference, and model interpretability." },
          { title: "Phase 3 (Weeks 9–12): Production & Impact", desc: "Deploy models, monitor them, and quantify business impact." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Weeks 1–2", focus: "Python for Data", routine: "3h Python basics in Jupyter; 2h Git & notebook hygiene", output: "Organized analysis repo" },
          { period: "Weeks 3–4", focus: "SQL", routine: "3h SELECT/JOIN/GROUP BY; 2h practice on a public dataset", output: "20 solved SQL exercises" },
          { period: "Weeks 5–6", focus: "Pandas & NumPy", routine: "3h loading & cleaning data; 2h merges & aggregations", output: "Cleaned dataset + notebook" },
          { period: "Weeks 7–8", focus: "Statistics", routine: "3h distributions & hypothesis tests; 2h apply them to your dataset", output: "Statistical findings notebook" },
          { period: "Weeks 9–10", focus: "Visualization", routine: "3h Matplotlib/Seaborn; 2h storytelling with charts", output: "Visual EDA report" },
          { period: "Weeks 11–12", focus: "First ML Model", routine: "3h Scikit-Learn regression/classification; 2h project write-up", output: "Kaggle-style project with README" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "Feature Engineering", routine: "3h encoding, scaling, feature creation; 2h Scikit-Learn pipelines", output: "Reusable preprocessing pipeline" },
          { period: "Weeks 3–4", focus: "Model Selection", routine: "3h cross-validation & tuning; 2h compare 3+ models", output: "Model comparison report" },
          { period: "Weeks 5–6", focus: "A/B Testing", routine: "3h experiment design & statistical power; 2h analyze a sample test", output: "A/B test analysis notebook" },
          { period: "Weeks 7–8", focus: "Advanced SQL", routine: "3h window functions & CTEs; 2h analytics queries", output: "Analytics SQL library" },
          { period: "Weeks 9–10", focus: "Dashboards", routine: "3h Streamlit or Power BI; 2h connect real data", output: "Interactive dashboard" },
          { period: "Weeks 11–12", focus: "Capstone", routine: "3h end-to-end analysis; 2h presentation", output: "Capstone + slide deck" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Big Data", routine: "3h Spark/PySpark; 2h large dataset processing", output: "Distributed processing notebook" },
          { period: "Weeks 3–4", focus: "Data Pipelines", routine: "3h orchestration (Airflow/dbt); 2h data quality checks", output: "Scheduled data pipeline" },
          { period: "Weeks 5–6", focus: "Time Series", routine: "3h forecasting methods; 2h backtesting", output: "Forecasting model + evaluation" },
          { period: "Weeks 7–8", focus: "Causal Inference & Interpretability", routine: "3h causal methods & SHAP; 2h apply them to a model", output: "Interpretability report" },
          { period: "Weeks 9–10", focus: "Model Deployment", routine: "3h model API & batch scoring; 2h monitoring", output: "Deployed model service" },
          { period: "Weeks 11–12", focus: "Impact & Publishing", routine: "3h business-impact write-up; 2h public sharing", output: "Published case study" }
        ]
      }
    },

    mobile: {
      label: "Mobile Development",
      fullRoadmap: "https://roadmap.sh/flutter",
      aliases: [
        "mobile development", "mobile", "mobile developer", "mobile app development",
        "mobile apps", "app development", "android", "ios", "flutter", "android developer",
        "ios developer", "flutter developer", "mobil", "mobil gelistirme",
        "mobil uygulama", "mobil uygulama gelistirme", "mobil gelistirici"
      ],
      skills: ["Git", "Dart", "Flutter", "State Management", "REST APIs", "Firebase"],
      foundationalSkills: ["Java", "Kotlin", "Swift", "JavaScript", "C++", "C#"],
      skillNotes: {
        "Git": "Branching, pull requests, and tagging app releases.",
        "Dart": "Types, null safety, async/await, classes and collections.",
        "Flutter": "Widgets, layouts, navigation, and the hot-reload workflow (one codebase for Android & iOS).",
        "State Management": "setState, then Provider/Riverpod or BLoC for larger apps.",
        "REST APIs": "HTTP requests, JSON parsing, loading and error states.",
        "Firebase": "Authentication, Firestore database, and push notifications."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–4): Dart & Flutter Basics", desc: "Learn Dart syntax and build static screens with core Flutter widgets." },
          { title: "Phase 2 (Weeks 5–8): Navigation, State & APIs", desc: "Add multi-screen navigation, manage state, and fetch data from an API." },
          { title: "Phase 3 (Weeks 9–12): Firebase & First Release", desc: "Add login and cloud data with Firebase, then publish a test build." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–4): Architecture & Scalable State", desc: "Adopt a layered architecture with Riverpod or BLoC." },
          { title: "Phase 2 (Weeks 5–8): Offline, Testing & Performance", desc: "Local storage, unit/widget tests, and performance profiling." },
          { title: "Phase 3 (Weeks 9–12): Store Release", desc: "Polish UX, add analytics, and ship to Google Play / App Store." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): Native Integrations", desc: "Platform channels, native SDKs, background tasks, and push notifications." },
          { title: "Phase 2 (Weeks 5–8): CI/CD & Modularization", desc: "Automate builds and store releases; split large apps into packages." },
          { title: "Phase 3 (Weeks 9–12): Scale & Leadership", desc: "Monitor release health, publish packages, and mentor others." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Weeks 1–2", focus: "Dart", routine: "3h syntax, null safety, collections; 2h small console exercises", output: "Dart exercises repo" },
          { period: "Weeks 3–4", focus: "Flutter Widgets", routine: "3h layouts (Row/Column/Stack); 2h rebuild a real app screen", output: "3 static UI screens" },
          { period: "Weeks 5–6", focus: "Navigation & State", routine: "3h routing & setState/Provider; 2h build a to-do app", output: "Working to-do app" },
          { period: "Weeks 7–8", focus: "REST APIs", routine: "3h http package & JSON; 2h loading/error states", output: "API-powered app (e.g. weather)" },
          { period: "Weeks 9–10", focus: "Firebase", routine: "3h authentication & Firestore; 2h connect them to your app", output: "App with login + cloud data" },
          { period: "Weeks 11–12", focus: "Polish & Release", routine: "3h UI polish & app icons; 2h build APK / TestFlight", output: "Installable test build + README" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "Layered Architecture", routine: "3h layers & folder structure; 2h refactor an existing app", output: "Refactored layered app" },
          { period: "Weeks 3–4", focus: "Riverpod / BLoC", routine: "3h advanced state patterns; 2h migrate state logic", output: "Scalable state layer" },
          { period: "Weeks 5–6", focus: "Local Storage & Offline", routine: "3h local database & caching; 2h offline mode", output: "Offline-capable app" },
          { period: "Weeks 7–8", focus: "Testing", routine: "3h unit & widget tests; 2h integration tests", output: "Test suite running in CI" },
          { period: "Weeks 9–10", focus: "Performance & UX", routine: "3h DevTools profiling; 2h animations & accessibility", output: "Performance report" },
          { period: "Weeks 11–12", focus: "Store Release", routine: "3h store listing, signing, privacy; 2h analytics & crash reporting", output: "App live on a store" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Platform Channels", routine: "3h native Kotlin/Swift bridges; 2h integrate a native SDK", output: "Native plugin" },
          { period: "Weeks 3–4", focus: "Background & Push", routine: "3h background tasks & notifications; 2h edge cases", output: "Reliable push/background flow" },
          { period: "Weeks 5–6", focus: "Mobile CI/CD", routine: "3h automated builds; 2h signing & store deployment", output: "Automated release pipeline" },
          { period: "Weeks 7–8", focus: "Modularization", routine: "3h packages & feature modules; 2h dependency boundaries", output: "Modular app structure" },
          { period: "Weeks 9–10", focus: "Release Health", routine: "3h crash & performance monitoring; 2h release metrics", output: "Release health dashboard" },
          { period: "Weeks 11–12", focus: "Open Source & Mentoring", routine: "3h publish a package; 2h code reviews & write-ups", output: "Published pub.dev package" }
        ]
      }
    },

    cyber: {
      label: "Cybersecurity",
      fullRoadmap: "https://roadmap.sh/cyber-security",
      aliases: [
        "cybersecurity", "cyber security", "cyber", "security", "information security", "infosec",
        "penetration testing", "pentest", "pentester", "ethical hacking", "soc analyst",
        "security analyst", "siber guvenlik", "bilgi guvenligi", "siber guvenlik uzmani"
      ],
      skills: ["Linux", "Networking", "Bash Scripting", "Python", "Web Security", "Security Tools"],
      foundationalSkills: ["C", "C++", "Git", "SQL", "JavaScript"],
      skillNotes: {
        "Linux": "File system, permissions, processes, services, and logs.",
        "Networking": "OSI/TCP-IP, DNS, HTTP, ports, subnets, and packet flow.",
        "Bash Scripting": "Automating tasks and processing text with grep/sed/awk.",
        "Python": "Small security scripts and automated log analysis.",
        "Web Security": "OWASP Top 10: injection, XSS, broken authentication, access control.",
        "Security Tools": "Nmap, Wireshark, and Burp Suite — only in legal lab environments."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–4): Linux & Networking Foundations", desc: "Get comfortable with the Linux command line and core networking concepts." },
          { title: "Phase 2 (Weeks 5–8): Scripting & Web Security Basics", desc: "Automate with Bash/Python and learn the OWASP Top 10 through labs." },
          { title: "Phase 3 (Weeks 9–12): Tools & Hands-on Labs", desc: "Practice Nmap, Wireshark, and Burp Suite on legal training platforms." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–6): Defensive Operations", desc: "Log analysis, SIEM basics, and incident response workflows." },
          { title: "Phase 2 (Weeks 7–8): Offensive Fundamentals", desc: "A structured penetration testing methodology in lab environments." },
          { title: "Phase 3 (Weeks 9–12): Reporting & Certification", desc: "Write professional reports and prepare for an entry-level certification." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): Cloud & Application Security", desc: "Audit cloud configurations and review application code for flaws." },
          { title: "Phase 2 (Weeks 5–8): Detection Engineering & Threat Hunting", desc: "Write detections and hunt for threats proactively." },
          { title: "Phase 3 (Weeks 9–12): Research & Leadership", desc: "Advanced CTFs, security research, and responsible disclosure." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Weeks 1–2", focus: "Linux", routine: "3h command line, permissions, processes; 2h OverTheWire Bandit", output: "Bandit levels 0–10 + notes" },
          { period: "Weeks 3–4", focus: "Networking", routine: "3h TCP/IP, DNS, HTTP, subnets; 2h Wireshark captures", output: "Annotated packet captures" },
          { period: "Weeks 5–6", focus: "Bash & Python Scripting", routine: "3h scripting basics; 2h automate log parsing", output: "Log-parsing script on GitHub" },
          { period: "Weeks 7–8", focus: "Web Security", routine: "3h OWASP Top 10; 2h PortSwigger Academy labs", output: "10 solved web security labs" },
          { period: "Weeks 9–10", focus: "Security Tools", routine: "3h Nmap & Burp Suite; 2h guided TryHackMe rooms", output: "Tool cheat sheet + lab write-ups" },
          { period: "Weeks 11–12", focus: "Beginner CTFs", routine: "3h beginner CTF challenges; 2h write-ups", output: "CTF write-up portfolio" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "Log Analysis", routine: "3h Windows/Linux logs; 2h investigate sample incidents", output: "Incident investigation notes" },
          { period: "Weeks 3–4", focus: "SIEM Basics", routine: "3h Splunk/Elastic queries; 2h build alerts", output: "Detection dashboard in a home lab" },
          { period: "Weeks 5–6", focus: "Incident Response", routine: "3h IR lifecycle; 2h tabletop exercise", output: "Incident response playbook" },
          { period: "Weeks 7–8", focus: "Pentest Methodology", routine: "3h recon, enumeration, exploitation in labs; 2h privilege escalation", output: "Lab pentest notes" },
          { period: "Weeks 9–10", focus: "Reporting", routine: "3h writing findings & risk ratings; 2h a full report", output: "Professional pentest report" },
          { period: "Weeks 11–12", focus: "Certification Prep", routine: "3h exam objectives; 2h practice tests", output: "Exam-ready study tracker" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Cloud Security", routine: "3h IAM, misconfigurations, logging; 2h audit a lab account", output: "Cloud security audit" },
          { period: "Weeks 3–4", focus: "Secure Code Review", routine: "3h common code flaws; 2h review an open-source project", output: "Code review findings" },
          { period: "Weeks 5–6", focus: "Detection Engineering", routine: "3h Sigma/YARA rules; 2h test them against samples", output: "Detection rule set" },
          { period: "Weeks 7–8", focus: "Threat Hunting", routine: "3h hypothesis-driven hunts; 2h MITRE ATT&CK mapping", output: "Threat hunt report" },
          { period: "Weeks 9–10", focus: "Advanced CTFs", routine: "3h hard challenges; 2h team practice", output: "Advanced CTF write-ups" },
          { period: "Weeks 11–12", focus: "Research & Disclosure", routine: "3h research a vulnerability class; 2h responsible disclosure write-up", output: "Published research post" }
        ]
      }
    },

    devops: {
      label: "DevOps / Cloud",
      fullRoadmap: "https://roadmap.sh/devops",
      aliases: [
        "devops", "devops / cloud", "devops/cloud", "devops engineer", "cloud", "cloud engineer",
        "cloud computing", "site reliability engineering", "sre", "platform engineering",
        "bulut", "bulut bilisim", "bulut muhendisi"
      ],
      skills: ["Linux", "Git", "Bash Scripting", "Docker", "CI/CD", "Cloud Platforms"],
      foundationalSkills: ["Python", "Networking", "Go", "SQL"],
      skillNotes: {
        "Linux": "Shell, processes, systemd services, permissions, and logs.",
        "Git": "Branching strategies, pull requests, and release tags.",
        "Bash Scripting": "Automating setup and deployment tasks with scripts.",
        "Docker": "Images, containers, Dockerfiles, volumes, and Compose.",
        "CI/CD": "Automated build, test, and deploy pipelines (e.g. GitHub Actions).",
        "Cloud Platforms": "Core AWS/Azure/GCP services: compute, storage, networking, IAM."
      },
      roadmap: {
        Beginner: [
          { title: "Phase 1 (Weeks 1–5): Linux, Git & Scripting", desc: "Master the command line, Git workflows, and Bash automation." },
          { title: "Phase 2 (Weeks 6–9): Containers & CI/CD", desc: "Containerize an app with Docker and automate it with a CI pipeline." },
          { title: "Phase 3 (Weeks 10–12): Cloud Deployment", desc: "Deploy the containerized app to a cloud provider." }
        ],
        Intermediate: [
          { title: "Phase 1 (Weeks 1–6): IaC & Kubernetes", desc: "Provision infrastructure with Terraform and run workloads on Kubernetes." },
          { title: "Phase 2 (Weeks 7–8): Continuous Deployment", desc: "GitOps-style automated rollouts." },
          { title: "Phase 3 (Weeks 9–12): Monitoring & Reliability", desc: "Metrics, logs, alerts, and on-call basics." }
        ],
        Advanced: [
          { title: "Phase 1 (Weeks 1–4): Platform Engineering & DevSecOps", desc: "Build golden paths for developers and secure the delivery pipeline." },
          { title: "Phase 2 (Weeks 5–8): Cost & Reliability", desc: "Cloud cost optimization, SLOs, and error budgets." },
          { title: "Phase 3 (Weeks 9–12): Resilience & Leadership", desc: "Disaster recovery, incident command, and architecture reviews." }
        ]
      },
      studyPlan: {
        Beginner: [
          { period: "Weeks 1–2", focus: "Linux", routine: "3h shell, permissions, processes; 2h systemd & logs", output: "Linux command cheat sheet" },
          { period: "Week 3", focus: "Git", routine: "3h branching & pull requests; 2h team workflow practice", output: "Repo with clean PR history" },
          { period: "Weeks 4–5", focus: "Bash Scripting", routine: "3h scripting fundamentals; 2h automate a server setup", output: "Setup automation script" },
          { period: "Weeks 6–7", focus: "Docker", routine: "3h images & Dockerfiles; 2h Docker Compose multi-service app", output: "Containerized app" },
          { period: "Weeks 8–9", focus: "CI/CD", routine: "3h GitHub Actions basics; 2h test-and-build pipeline", output: "Green CI pipeline" },
          { period: "Weeks 10–12", focus: "Cloud Deployment", routine: "3h cloud fundamentals (compute, storage, IAM); 2h deploy your app", output: "App running in the cloud + README" }
        ],
        Intermediate: [
          { period: "Weeks 1–2", focus: "Terraform", routine: "3h infrastructure-as-code basics; 2h provision a VM + network", output: "Terraform module" },
          { period: "Weeks 3–4", focus: "Kubernetes Basics", routine: "3h pods, deployments, services; 2h local cluster practice", output: "App running on Kubernetes" },
          { period: "Weeks 5–6", focus: "Helm & Configuration", routine: "3h Helm charts, ConfigMaps, Secrets; 2h templating", output: "Helm chart for your app" },
          { period: "Weeks 7–8", focus: "Continuous Deployment", routine: "3h GitOps (e.g. Argo CD); 2h automated rollouts", output: "Push-to-deploy workflow" },
          { period: "Weeks 9–10", focus: "Monitoring", routine: "3h Prometheus & Grafana; 2h alerts", output: "Monitoring dashboard + alerts" },
          { period: "Weeks 11–12", focus: "Logging & Reliability", routine: "3h centralized logging; 2h failure drills", output: "Runbook + postmortem template" }
        ],
        Advanced: [
          { period: "Weeks 1–2", focus: "Platform Design", routine: "3h internal developer platforms; 2h design a golden path", output: "Platform design doc" },
          { period: "Weeks 3–4", focus: "DevSecOps", routine: "3h image scanning & secrets management; 2h policy as code", output: "Secured delivery pipeline" },
          { period: "Weeks 5–6", focus: "Cost Optimization", routine: "3h cost analysis & rightsizing; 2h autoscaling", output: "Cost reduction report" },
          { period: "Weeks 7–8", focus: "SLOs & Error Budgets", routine: "3h define SLIs/SLOs; 2h burn-rate alerting", output: "SLO dashboard" },
          { period: "Weeks 9–10", focus: "High Availability & DR", routine: "3h multi-zone design & backups; 2h disaster recovery test", output: "DR plan + test results" },
          { period: "Weeks 11–12", focus: "Incident Leadership", routine: "3h incident command; 2h architecture reviews", output: "Incident management guide" }
        ]
      }
    }
  },

  // Common spellings → canonical skill name (keys must be lowercase).
  skillAliases: {
    "python": "Python", "py": "Python",
    "c": "C",
    "c++": "C++", "cpp": "C++",
    "c#": "C#", "csharp": "C#",
    "java": "Java", "kotlin": "Kotlin", "swift": "Swift",
    "go": "Go", "golang": "Go",
    "r": "R", "excel": "Excel",
    "js": "JavaScript", "javascript": "JavaScript", "es6": "JavaScript",
    "ts": "TypeScript", "typescript": "TypeScript",
    "html": "HTML/CSS", "css": "HTML/CSS", "html/css": "HTML/CSS", "html5": "HTML/CSS", "css3": "HTML/CSS",
    "sql": "SQL", "mysql": "SQL", "postgresql": "SQL", "postgres": "SQL", "sqlite": "SQL",
    "git": "Git", "github": "Git",
    "react": "React", "react.js": "React", "reactjs": "React",
    "node": "Node.js", "node.js": "Node.js", "nodejs": "Node.js",
    "ml": "Machine Learning", "machine learning": "Machine Learning",
    "scikit-learn": "Machine Learning", "sklearn": "Machine Learning",
    "dl": "Deep Learning", "deep learning": "Deep Learning",
    "pytorch": "Deep Learning", "tensorflow": "Deep Learning", "keras": "Deep Learning",
    "data structures": "Data Structures", "dsa": "Data Structures", "algorithms": "Data Structures",
    "math": "Math & Statistics", "statistics": "Math & Statistics", "math & statistics": "Math & Statistics",
    "linear algebra": "Math & Statistics", "probability": "Math & Statistics", "stats": "Math & Statistics",
    "pandas": "Pandas & NumPy", "numpy": "Pandas & NumPy", "pandas & numpy": "Pandas & NumPy",
    "data visualization": "Data Visualization", "visualization": "Data Visualization",
    "matplotlib": "Data Visualization", "seaborn": "Data Visualization",
    "tableau": "Data Visualization", "power bi": "Data Visualization", "powerbi": "Data Visualization",
    "dart": "Dart", "flutter": "Flutter",
    "state management": "State Management", "provider": "State Management",
    "riverpod": "State Management", "bloc": "State Management",
    "rest": "REST APIs", "rest api": "REST APIs", "rest apis": "REST APIs", "api": "REST APIs", "apis": "REST APIs",
    "firebase": "Firebase", "firestore": "Firebase",
    "linux": "Linux", "ubuntu": "Linux", "kali": "Linux", "kali linux": "Linux",
    "networking": "Networking", "network": "Networking", "networks": "Networking", "tcp/ip": "Networking",
    "bash": "Bash Scripting", "shell": "Bash Scripting", "shell scripting": "Bash Scripting", "bash scripting": "Bash Scripting",
    "web security": "Web Security", "owasp": "Web Security",
    "security tools": "Security Tools", "nmap": "Security Tools", "wireshark": "Security Tools",
    "burp suite": "Security Tools", "burp": "Security Tools", "metasploit": "Security Tools",
    "docker": "Docker", "containers": "Docker",
    "ci/cd": "CI/CD", "cicd": "CI/CD", "github actions": "CI/CD", "jenkins": "CI/CD", "gitlab ci": "CI/CD",
    "cloud": "Cloud Platforms", "cloud platforms": "Cloud Platforms", "aws": "Cloud Platforms",
    "azure": "Cloud Platforms", "gcp": "Cloud Platforms", "google cloud": "Cloud Platforms",
    "kubernetes": "Kubernetes", "k8s": "Kubernetes", "terraform": "Terraform"
  },

  // Free learning resources for each core skill.
  resources: {
    "Python": [
      { label: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Kaggle Learn: Python", url: "https://www.kaggle.com/learn/python" }
    ],
    "Git": [
      { label: "Pro Git (free book)", url: "https://git-scm.com/book/en/v2" },
      { label: "GitHub Skills", url: "https://skills.github.com/" }
    ],
    "Data Structures": [
      { label: "VisuAlgo", url: "https://visualgo.net/en" },
      { label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" }
    ],
    "Math & Statistics": [
      { label: "Khan Academy: Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra" },
      { label: "Khan Academy: Statistics", url: "https://www.khanacademy.org/math/statistics-probability" }
    ],
    "Machine Learning": [
      { label: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
      { label: "Kaggle Learn: Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" }
    ],
    "Deep Learning": [
      { label: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" },
      { label: "fast.ai Course", url: "https://course.fast.ai/" }
    ],
    "HTML/CSS": [
      { label: "MDN: Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
      { label: "web.dev: Learn CSS", url: "https://web.dev/learn/css" }
    ],
    "JavaScript": [
      { label: "javascript.info", url: "https://javascript.info/" },
      { label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
    ],
    "React": [
      { label: "react.dev: Learn React", url: "https://react.dev/learn" }
    ],
    "SQL": [
      { label: "SQLBolt", url: "https://sqlbolt.com/" },
      { label: "Kaggle Learn: Intro to SQL", url: "https://www.kaggle.com/learn/intro-to-sql" }
    ],
    "Node.js": [
      { label: "Node.js Learn", url: "https://nodejs.org/en/learn" }
    ],
    "Pandas & NumPy": [
      { label: "Kaggle Learn: Pandas", url: "https://www.kaggle.com/learn/pandas" },
      { label: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" }
    ],
    "Data Visualization": [
      { label: "Kaggle Learn: Data Visualization", url: "https://www.kaggle.com/learn/data-visualization" },
      { label: "Matplotlib Tutorials", url: "https://matplotlib.org/stable/tutorials/index.html" }
    ],
    "Dart": [
      { label: "Dart Language Tour", url: "https://dart.dev/language" }
    ],
    "Flutter": [
      { label: "Flutter: Get Started", url: "https://docs.flutter.dev/get-started" }
    ],
    "State Management": [
      { label: "Flutter: State Management", url: "https://docs.flutter.dev/data-and-backend/state-mgmt/intro" }
    ],
    "REST APIs": [
      { label: "MDN: HTTP Overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { label: "Flutter: Fetch Data", url: "https://docs.flutter.dev/cookbook/networking/fetch-data" }
    ],
    "Firebase": [
      { label: "Firebase for Flutter", url: "https://firebase.google.com/docs/flutter/setup" }
    ],
    "Linux": [
      { label: "Linux Journey", url: "https://linuxjourney.com/" },
      { label: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/" }
    ],
    "Networking": [
      { label: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/" }
    ],
    "Bash Scripting": [
      { label: "The Linux Command Line (free book)", url: "https://linuxcommand.org/tlcl.php" },
      { label: "GNU Bash Manual", url: "https://www.gnu.org/software/bash/manual/bash.html" }
    ],
    "Web Security": [
      { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
    ],
    "Security Tools": [
      { label: "TryHackMe", url: "https://tryhackme.com/" },
      { label: "Nmap Book", url: "https://nmap.org/book/" }
    ],
    "Docker": [
      { label: "Docker: Get Started", url: "https://docs.docker.com/get-started/" }
    ],
    "CI/CD": [
      { label: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" }
    ],
    "Cloud Platforms": [
      { label: "AWS Skill Builder", url: "https://skillbuilder.aws/" },
      { label: "Microsoft Learn: Azure", url: "https://learn.microsoft.com/en-us/training/azure/" },
      { label: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/" }
    ]
  }
};
