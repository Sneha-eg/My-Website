// VBSPU PREP HUB — AUTHENTICATION + LEARNING LIBRARY
// Browser-only demo: accounts, bookmarks, history and theme are stored locally.

const $ = (id) => document.getElementById(id);
const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const safeWrite = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const feedbackForm = $("feedbackForm");
feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("feedbackName").value.trim();
  const email = $("feedbackEmail").value.trim();
  const message = $("feedbackMessage").value.trim();
  const subject = encodeURIComponent("Website feedback from " + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nFeedback:\n${message}`);
  toast("Opening your email app...");
  window.location.href = `mailto:notusefulll000@gmail.com?subject=${subject}&body=${body}`;
  feedbackForm.reset();
});

const guidePanel = $("guidePanel");
const guideMessages = $("guideMessages");
const guideInput = $("guideInput");
function addGuideMessage(message, type, action) {
  const bubble = document.createElement("div");
  bubble.className = `guide-message guide-${type}`;
  bubble.textContent = message;
  guideMessages.appendChild(bubble);
  if (action) {
    const button = document.createElement(action.note ? "button" : "a");
    button.className = "guide-action";
    button.textContent = action.label;
    if (action.note) {
      button.type = "button";
      button.dataset.note = action.note;
    } else {
      button.href = action.href;
    }
    guideMessages.appendChild(button);
  }
  guideMessages.scrollTop = guideMessages.scrollHeight;
}
function guideResponse(question) {
  const text = question.toLowerCase();
  if (/^(hi|hello|hey)\b/.test(text)) {
    return { message: "Hi! Tell me what you want to work on—DSA, aptitude, interviews, resumes, or finding resources." };
  }
  const topicLinks = [
    [/\bhtml\b/, "HTML"], [/\bcss\b/, "CSS"], [/\bjavascript\b|\bjs notes?\b/, "JavaScript"],
    [/\bpython\b/, "Python"], [/\bc\+\+\b/, "C++"],
    [/\bc programming\b|\bc language\b|\bc notes\b/, "C"], [/\bjava\b(?!script)/, "Java"],
    [/\boperating systems?\b|\bos notes\b/, "Operating System"],
    [/\bdbms\b|\bdatabase management\b/, "DBMS"],
    [/\bcomputer networks?\b|\bnetworking notes\b/, "Computer Networks"],
    [/\boops\b|\bobject[- ]oriented\b/, "OOPs"], [/\bdsa notes?\b/, "DSA Notes"],
    [/\barrays?\b/, "Arrays"], [/\bstrings?\b/, "Strings"], [/\blinked lists?\b/, "Linked List"],
    [/\bstacks?\b/, "Stack"], [/\bqueues?\b/, "Queue"], [/\btrees?\b/, "Trees"],
    [/\bgraphs?\b/, "Graphs"], [/\bdynamic programming\b|\bdp notes\b/, "Dynamic Programming"],
    [/\bquantitative aptitude\b|\baptitude notes\b/, "Quantitative Aptitude"],
    [/\blogical reasoning\b/, "Logical Reasoning"], [/\bverbal ability\b/, "Verbal Ability"],
    [/\bdata interpretation\b/, "Data Interpretation"], [/\bhr questions?\b/, "HR Questions"],
    [/\btechnical questions?\b/, "Technical Questions"], [/\bresume tips\b|\bcv tips\b/, "Expert Resume Tips"],
    [/\bats templates?\b/, "ATS Friendly Templates"], [/\bprofessional resume layouts?\b/, "Professional Layouts"]
  ];
  const topic = topicLinks.find(([pattern]) => pattern.test(text));
  if (topic) {
    const title = topic[1];
    return { message: `I found the ${title} learning notes. Open the lesson to read them.`, label: `Open ${title} notes`, note: title };
  }
  if (/(start|beginner|new here|where.*begin)/.test(text)) {
    return { message: "Start with one small goal: explore the learning resources, then follow the DSA roadmap from Arrays & Strings. Try a short practice session and build from there.", label: "See the DSA roadmap", href: "#roadmap" };
  }
  if (/(dsa|data structure|algorithm|roadmap)/.test(text)) {
    return { message: "The roadmap begins with Arrays & Strings, then moves to Linked Lists, Stacks & Queues, Trees & Graphs, and Dynamic Programming. Open a topic to study at your own pace.", label: "Open Arrays lesson", note: "Arrays" };
  }
  if (/(aptitude|quant|reason|verbal|math)/.test(text)) {
    return { message: "For aptitude, begin with Quantitative Aptitude and practise a little regularly. Logical Reasoning and Verbal Ability are also in the resources library.", label: "Open Quantitative Aptitude", note: "Quantitative Aptitude" };
  }
  if (/(interview|hr question|technical question)/.test(text)) {
    return { message: "Interview prep is in the resources library. Start with HR Questions, then review Technical Questions and practise explaining a project using clear examples.", label: "Open HR Questions", note: "HR Questions" };
  }
  if (/(resume|cv|ats)/.test(text)) {
    return { message: "The Resume Builder resources cover practical resume tips, ATS-friendly templates, and professional layouts. Keep your details accurate and easy to scan.", label: "Open resume tips", note: "Expert Resume Tips" };
  }
  if (/(resource|find|search|library|subject|notes)/.test(text)) {
    return { message: "Browse the Resources section and use its search box to find a topic, subject, or skill. You can also filter saved and recently opened lessons.", label: "Browse resources", href: "#resources" };
  }
  if (/(account|login|log in|sign up|register)/.test(text)) {
    return { message: "You can create an account or log in using the buttons at the top of the page. Your saved lessons and recent activity are stored in this browser." };
  }
  if (/(contact|feedback|email|suggest)/.test(text)) {
    return { message: "You can send feedback or contact the site creators using the form near the bottom of the page.", label: "Go to feedback", href: "#feedback" };
  }
  return { message: "I can guide you around the hub. Ask me about getting started, DSA, aptitude, interview prep, resumes, accounts, or finding resources." };
}
function sendGuideMessage(question) {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return;
  addGuideMessage(trimmedQuestion, "student");
  const response = guideResponse(trimmedQuestion);
  addGuideMessage(response.message, "bot", response.label ? response : null);
}
$("guideToggle").addEventListener("click", () => {
  const isOpening = guidePanel.classList.contains("hidden");
  guidePanel.classList.toggle("hidden", !isOpening);
  $("guideToggle").setAttribute("aria-expanded", String(isOpening));
  if (isOpening) guideInput.focus();
});
$("guideClose").addEventListener("click", () => {
  guidePanel.classList.add("hidden");
  $("guideToggle").setAttribute("aria-expanded", "false");
  $("guideToggle").focus();
});
$("guideForm").addEventListener("submit", (event) => {
  event.preventDefault();
  sendGuideMessage(guideInput.value);
  guideInput.value = "";
});
document.querySelectorAll("[data-guide-suggestion]").forEach((button) => {
  button.addEventListener("click", () => sendGuideMessage(button.dataset.guideSuggestion));
});

// ---------------- AUTHENTICATION ----------------
let authMode = "login";
const homeView = $("homeView"), authScreen = $("authScreen"), readerScreen = $("readerScreen");
const userKey = "vbspu_prep_users_v1", sessionKey = "vbspu_prep_session_v1";
function getUsers(){ return safeRead(userKey, []); }
function setUsers(users){ safeWrite(userKey, users); }
function toast(message){ const t=$("toast"); if(!t)return; t.textContent=message; t.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove("show"),2400); }
function showAuth(mode){ authMode=mode; homeView.classList.add("hidden"); readerScreen?.classList.add("hidden"); authScreen.classList.remove("hidden"); document.body.classList.remove("dark"); renderAuth(); window.scrollTo(0,0); }
function showHome(){ authScreen.classList.add("hidden"); readerScreen?.classList.add("hidden"); homeView.classList.remove("hidden"); applyTheme(localStorage.getItem(themeKey)||"light"); /* restore dark mode after leaving login screen */ window.scrollTo(0,0); refreshUser(); }
function renderAuth(){
 const signup=authMode==="signup";
 $("formKicker").textContent=signup?"GET STARTED":"WELCOME BACK";
 $("formTitle").textContent=signup?"Create your account":"Log in to your account";
 $("formSubtitle").textContent=signup?"A few details and your learning space is ready.":"Enter your details to continue where you left off.";
 $("nameField").classList.toggle("hidden",!signup); $("confirmField").classList.toggle("hidden",!signup); $("forgotLink").classList.toggle("hidden",signup);
 $("submitBtn").innerHTML=signup?'Create account <span>↗</span>':'Log in <span>↗</span>';
 $("switchPrompt").textContent=signup?"Already have an account?":"Don't have an account?"; $("switchMode").textContent=signup?"Log in":"Create one";
 $("storyTitle").innerHTML=signup?"Make room for<br>what's <em>next.</em>":"Your next chapter<br>starts <em>here.</em>";
 $("storyText").textContent=signup?"Join a learning space designed to help you build skills, stay organised and prepare for the opportunities ahead.":"A focused space to learn, practise and prepare for the opportunities ahead. Everything you need, all in one place.";
 $("authForm").reset(); $("formError").textContent=""; $("password").autocomplete=signup?"new-password":"current-password";
}
async function hashPassword(password,email){
 const data=new TextEncoder().encode(email.toLowerCase()+":"+password);
 if(!window.crypto?.subtle) return btoa(unescape(encodeURIComponent(email.toLowerCase()+":"+password)));
 const digest=await crypto.subtle.digest("SHA-256",data);
 return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function refreshUser(){
 const email=localStorage.getItem(sessionKey), user=getUsers().find(u=>u.email===email);
 document.querySelector(".cta-band")?.classList.toggle("hidden", !!user); // hide bottom signup section when logged in
 if(user){ $("userMenu").classList.remove("hidden"); $("loginOpen").classList.add("hidden"); $("signupOpen").classList.add("hidden"); $("userName").textContent=user.name.split(" ")[0]; $("userInitial").textContent=user.name.trim()[0].toUpperCase(); $("userEmail").textContent=user.email; }
 else { $("userMenu").classList.add("hidden"); $("loginOpen").classList.remove("hidden"); $("signupOpen").classList.remove("hidden"); }
}
["loginOpen"].forEach(id=>$(id).addEventListener("click",()=>showAuth("login")));
["signupOpen","heroSignup","bottomSignup"].forEach(id=>$(id).addEventListener("click",()=>showAuth("signup")));
$("authHome").addEventListener("click",showHome); $("backHome").addEventListener("click",showHome);
$("switchMode").addEventListener("click",()=>{authMode=authMode==="login"?"signup":"login";renderAuth();});
$("userChip").addEventListener("click",()=>$("userDropdown").classList.toggle("hidden"));
$("logoutBtn").addEventListener("click",()=>{localStorage.removeItem(sessionKey); $("userDropdown").classList.add("hidden"); refreshUser(); toast("You have been logged out.");});
document.querySelectorAll(".show-password").forEach(btn=>btn.addEventListener("click",()=>{const input=$(btn.dataset.target); input.type=input.type==="password"?"text":"password"; btn.textContent=input.type==="password"?"Show":"Hide";}));
$("forgotLink").addEventListener("click",()=>toast("Password recovery is not available in this browser-only demo."));
$("authForm").addEventListener("submit",async e=>{
 e.preventDefault(); const email=$("email").value.trim().toLowerCase(), password=$("password").value, error=$("formError"); error.textContent="";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){error.textContent="Please enter a valid email address.";return;}
 if(password.length<8){error.textContent="Password must be at least 8 characters.";return;}
 const users=getUsers();
 if(authMode==="signup"){
  const name=$("fullName").value.trim(), confirm=$("confirmPassword").value;
  if(name.length<2){error.textContent="Please enter your full name.";return;}
  if(password!==confirm){error.textContent="Your passwords do not match.";return;}
  if(users.some(u=>u.email===email)){error.textContent="An account with this email already exists. Please log in.";return;}
  users.push({name,email,passwordHash:await hashPassword(password,email),createdAt:new Date().toISOString()}); setUsers(users); localStorage.setItem(sessionKey,email); showHome(); toast("Welcome to VBSPU Prep Hub, "+name.split(" ")[0]+"!"); return;
 }
 const user=users.find(u=>u.email===email), passwordHash=await hashPassword(password,email);
 if(!user||user.passwordHash!==passwordHash){error.textContent="Email or password is incorrect.";return;}
 localStorage.setItem(sessionKey,email); showHome(); toast("Welcome back, "+user.name.split(" ")[0]+"!");
});

// ---------------- LEARNING LIBRARY ----------------

/* Google Drive file IDs for lesson PDFs, keyed by lesson title. */
const DRIVE_PDF_IDS = {
 "Arrays":              "1Li-vOznuJhBDDqy0ORJfNigaxtxDjuMo",
 "Strings":             "1azA-ryNPVPC82c5Sut0D0XDNcHDRHm61",
 "Linked List":         "1V6UskTjz2ckQTzxmmHHNXoRo8oRYsvrG",
 "Stack":               "15hOxqSuyC3oA8uPhxiCG5ezqaF2W13gD",
 "Queue":               "1JafQ7f4v3RcJoewDD_GP7rlUkUYZhbhI",
 "Trees":               "13WENj2DtmljV0xJRxXM1FANY89aoRO3M",
 "Graphs":              "1HmffSupiMJr0fTiepifwxZ1-CgU9ekcz",
 "Dynamic Programming": "1dMcczbsNBB4FMmMyrJ3gZg1wi6nF1h0s",
 "Quantitative Aptitude":"1tZ84svLV2aT_ceC2t_jWxzrKbE076eGt",
 "Logical Reasoning":   "1owWVxfb0tcprkdjbCRCdeiML_JGLa1WP",
 "Verbal Ability":      "1dYWXGjRleS0_en-_ml2fz8wOqAn9cS4a",
 "Data Interpretation": "1siibedPSEXxC1Hp5L5px6bICOfjHjP9H",
 "Expert Resume Tips":  "",
 "ATS Friendly Templates":"",
 "Professional Layouts": "",
 "HR Questions":        "",
 "Technical Questions": "",
 "Google":              "",
 "Microsoft":           "",
 "Amazon":              "",
 "TCS":                 "",
 "Infosys":             "",
 "Accenture":           "",
 "Capgemini":           "",
 "Wipro":               "",
 "HTML":                "1P5B_WF5Zt91rQqjyQRg3SklqipKrJ3rT",
 "CSS":                 "1zo2a0yMLYF99iaCSjPN-9mS_v-rGfYPO",
 "C":                   "1EPUBCBm61zyKSFrafNBni5LIWt5-kHBx",
 "JavaScript":          "12ao7kw4jBadcbajwEPu5gVR5TEjJEYPQ",
 "Python":              "1hraQd26Q-DR9d7LAgRX3uOUDx5nZXO9J",
 "C++":                 "14bSD25nx2-RixGX_i0KPhU9aLFVni1Az",
 "Operating System":    "1XrDC7vo2WCa6VI5scP72qrCol28YeGmg",
 "DBMS":                "1eVkISGgBhmvQnCXv-uJu3D8zQnzjj7lb",
 "Computer Networks":   "1O0idLnb9CuL0pXVjAWWm6Wq_e9uwqzKJ",
 "OOPs":                "1i8hc_GFXxrTu_ZWe_74DqLVXzyoumBU3",
 "Java":                "11ldI7m3Jkf55o0RTqpUX-B1HWQc21DXI",
 "DSA Notes":           "1M2llFTrUR3hPvhx_WbisI7X4XWUCJKUn",
};

function renderPdf(item){
 const box=$("lessonPdf"), frame=$("pdfFrame"), fileId=DRIVE_PDF_IDS[item.title]||"";
 frame.classList.add("hidden"); frame.removeAttribute("src"); $("pdfPreviewBtn").textContent="Preview here";
 if(!fileId){box.classList.add("hidden");frame.removeAttribute("data-preview-url");return;}
 const driveFileUrl=`https://drive.google.com/file/d/${fileId}`;
 box.classList.remove("hidden");
 $("pdfOpen").href=`${driveFileUrl}/view?usp=sharing`;
 $("pdfDownload").href=`https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
 frame.dataset.previewUrl=`${driveFileUrl}/preview`;
}
$("pdfPreviewBtn").addEventListener("click",()=>{
 const f=$("pdfFrame"), show=f.classList.contains("hidden");
 if(show)f.src=f.dataset.previewUrl;
 f.classList.toggle("hidden",!show); $("pdfPreviewBtn").textContent=show?"Hide preview":"Preview here";
});

const resources = [
 {title:"Arrays",cat:"DSA Preparation",tag:"DSA ROADMAP",icon:"[]",lead:"An array stores multiple values of the same type in a continuous sequence of memory locations.",sections:[ ["What is an array?","Think of an array as a row of numbered boxes. Each box stores one value, and its position is called an index. In most programming languages, indexing starts at 0."],["Example in C",'int marks[5] = {78, 85, 91, 67, 88};\nprintf("%d", marks[0]); // 78'],["Important operations","Traversal visits every element. Insertion adds an element at a position. Deletion removes an element. Searching finds a value. Access by index is usually O(1), while searching an unsorted array is O(n)."],["Try it","Create an array of five numbers, print all values using a loop, and calculate their sum."]] },
 {title:"Strings",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A string is a sequence of characters used to represent text.",sections:[["Core idea","In C, a string is a character array ending with the special null character \\0. Other languages provide built-in string types."],["Example in C",'char name[] = "Sneha";\nprintf("%s", name);'],["Common operations","Find length, compare two strings, copy a string, join strings, reverse text and check whether a string is a palindrome. In C, common functions are strlen, strcmp, strcpy and strcat from string.h."],["Try it","Write a program that counts the vowels in a given string."]] },
 {title:"Linked List",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A linked list is a sequence of nodes where each node stores data and a link to the next node.",sections:[["Why use it?","Unlike an array, linked-list nodes do not need to sit next to each other in memory. This makes insertion and deletion convenient when you already have the required node."],["Node structure in C",'struct Node {\n  int data;\n  struct Node *next;\n};'],["Types","A singly linked list points forward. A doubly linked list has both next and previous links. A circular linked list connects its last node back to the first."],["Remember","Accessing the element at a position takes O(n), because you move node by node. Inserting at the head takes O(1). Try drawing three nodes and their arrows."]] },
 {title:"Stack",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A stack follows LIFO: Last In, First Out. The last item added is the first one removed.",sections:[["Everyday example","A stack of plates works like a stack data structure. You add a plate on top and remove the top plate first."],["Main operations","push adds an item, pop removes the top item, peek/top reads the top item, and isEmpty checks whether the stack has no elements."],["Applications","Function calls, undo operations, browser history, expression evaluation and balanced brackets use stacks."],["Complexity","Push and pop are O(1) when implemented with an array or linked list. Try tracing push(10), push(20), pop(), push(30)."]] },
 {title:"Queue",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A queue follows FIFO: First In, First Out. The first item added is the first one removed.",sections:[["Everyday example","Think of people standing in a ticket line. The person who arrives first is served first."],["Main operations","enqueue inserts at the rear, dequeue removes from the front, and front/peek reads the first item."],["Types","A simple queue, circular queue, priority queue and deque solve different ordering needs."],["Applications","CPU scheduling, printer queues, request handling and breadth-first search use queues. Enqueue and dequeue can both be O(1) with a circular array or linked list."]] },
 {title:"Trees",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A tree is a hierarchical, non-linear data structure made of nodes connected by edges.",sections:[["Tree vocabulary","The top node is the root. A node directly below another is its child. Nodes with no children are leaves. The height is the longest path from a node to a leaf."],["Binary tree","A binary tree allows each node to have at most two children: left and right. A binary search tree keeps smaller values on the left and larger values on the right (for the usual distinct-key rule)."],["Traversals","Preorder: root-left-right. Inorder: left-root-right. Postorder: left-right-root. Level order visits nodes level by level using a queue."],["Try it","Draw a tree with 10 as root, 5 as its left child and 15 as its right child. Write all three depth-first traversals."]] },
 {title:"Graphs",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"A graph models relationships using vertices (nodes) and edges (connections).",sections:[["Where graphs appear","Maps, social networks, computer networks and dependency systems can all be represented as graphs."],["Types and storage","A graph can be directed or undirected, weighted or unweighted. An adjacency matrix uses a 2D table; an adjacency list stores the neighbours of each vertex."],["Traversal","Breadth-first search (BFS) explores level by level using a queue. Depth-first search (DFS) explores a path deeply before backtracking, often using recursion or a stack."],["Try it","Draw five cities connected by roads. Mark the roads as edges and cities as vertices. Decide whether the graph is weighted."]] },
 {title:"Dynamic Programming",cat:"DSA Preparation",tag:"DSA ROADMAP",lead:"Dynamic programming solves a problem by reusing answers to smaller overlapping subproblems.",sections:[["When to use it","Look for overlapping subproblems (the same smaller question appears repeatedly) and optimal substructure (an optimal answer can be built from smaller optimal answers)."],["Two approaches","Memoization is top-down: use recursion and store results. Tabulation is bottom-up: fill a table from the smallest cases toward the final answer."],["Example: Fibonacci","Instead of recalculating fib(3) many times, store each computed value. With tabulation, fib[0]=0, fib[1]=1, then fib[i]=fib[i-1]+fib[i-2]."],["Study tip","Define the state, write the transition, set base cases, choose an iteration order, and analyse time and space complexity."]] },
 {title:"Quantitative Aptitude",cat:"Aptitude Practice",tag:"PRACTICE AREA",lead:"Quantitative aptitude tests how comfortably you work with numbers, calculations and mathematical relationships.",sections:[["Core topics","Practise percentages, ratio and proportion, averages, profit and loss, simple and compound interest, time and work, speed-distance-time, mixtures and number systems."],["Example: percentage","15% of 240 = (15/100) × 240 = 36. Convert percentages to fractions or decimals to calculate quickly."],["A reliable method","Read what is being asked, note the given values, choose a formula, calculate carefully, and check whether the answer is reasonable."],["Practice question","A shirt marked at ₹800 is discounted by 15%. The discount is ₹120, so the selling price is ₹680."]] },
 {title:"Logical Reasoning",cat:"Aptitude Practice",tag:"PRACTICE AREA",lead:"Logical reasoning measures how well you identify patterns, relationships and valid conclusions.",sections:[["Common question types","Number and letter series, analogy, classification, coding-decoding, direction sense, blood relations, syllogisms, seating arrangements and puzzles."],["Solving strategy","Write down the facts, avoid assumptions, draw a small diagram for directions or seating, and eliminate options that contradict the clues."],["Example","Series: 2, 4, 8, 16, __. Each term is multiplied by 2, so the next term is 32."],["Practice habit","Start untimed to understand the pattern. Then repeat similar questions with a time limit and review every mistake."]] },
 {title:"Verbal Ability",cat:"Aptitude Practice",tag:"PRACTICE AREA",lead:"Verbal ability checks reading, vocabulary, grammar and the ability to communicate ideas clearly.",sections:[["Important areas","Reading comprehension, sentence correction, error spotting, fill in the blanks, synonyms, antonyms, para jumbles and basic grammar."],["Grammar checklist","Check subject-verb agreement, tense consistency, articles, prepositions, pronoun reference and punctuation."],["Reading method","Read the question first when useful, identify the passage's main idea, distinguish facts from opinions, and answer only from the given text."],["Daily practice","Read a short article, note unfamiliar words, and write a two-sentence summary in your own words."]] },
 {title:"Data Interpretation",cat:"Aptitude Practice",tag:"PRACTICE AREA",lead:"Data interpretation is the skill of extracting meaning from tables, charts and numerical information.",sections:[["Common formats","Tables, bar graphs, line graphs, pie charts and caselets. Questions often ask for totals, differences, ratios, averages and percentage change."],["Example","If sales rise from 200 units to 250 units, percentage increase = (50/200) × 100 = 25%."],["Avoid mistakes","Read labels and units carefully, check the time period, and do not confuse percentage points with percentage change."],["Try it","Create a small table of marks in five subjects. Calculate the average and identify the highest and lowest scores."]] },
 {title:"Expert Resume Tips",cat:"Resume Builder",tag:"CAREER TOOLKIT",lead:"A strong resume makes your skills, projects and achievements easy for a recruiter to understand.",sections:[["Keep it focused","For a student or fresher, one well-organised page is usually enough. Use clear headings, consistent spacing and readable fonts."],["Useful sections","Name and contact, short summary (optional), education, technical skills, projects, internships, certifications and achievements."],["Write impactfully","Start bullet points with action verbs such as built, designed, analysed or implemented. Mention tools and measurable outcomes where truthful."],["Before sending","Proofread, use a professional file name, check links, and tailor relevant skills and projects to the role. Never invent experience."]] },
 {title:"ATS Friendly Templates",cat:"Resume Builder",tag:"CAREER TOOLKIT",lead:"An ATS-friendly resume uses a simple structure that applicant tracking systems can parse reliably.",sections:[["Layout","Prefer a single-column layout with standard headings such as Education, Skills and Projects. Avoid complex tables, text boxes, charts and decorative skill bars."],["Keywords","Use relevant words from the job description naturally when they accurately describe your experience. Do not keyword-stuff."],["File format","Follow the employer's instructions. If no format is specified, a clean PDF is often convenient; keep an editable copy as well."],["Quick check","Copy the text from your exported PDF into a plain text editor. If the order becomes confusing, simplify the layout."]] },
 {title:"Professional Layouts",cat:"Resume Builder",tag:"CAREER TOOLKIT",lead:"A professional resume layout makes important information easy to scan in a few seconds.",sections:[["Visual hierarchy","Use your name as the strongest heading, section headings consistently, and bullets for details. Keep margins and spacing balanced."],["Typography","Choose one or two readable fonts. Use a restrained accent colour and avoid tiny text."],["Student project example","Project name — one-line purpose. Then list your contribution, technologies used and the result or feature delivered."],["Choose clarity","A beautiful resume is useful only when the content is easy to find. Prioritise readability over decoration."]] },
 {title:"HR Questions",cat:"Interview Questions",tag:"INTERVIEW PREPARATION",lead:"HR interviews explore your communication, motivation, self-awareness and fit for a role.",sections:[["Common questions","Tell me about yourself; why should we hire you; what are your strengths; describe a challenge; where do you see yourself in five years?"],["Use the STAR method","For behavioural questions, explain the Situation, Task, Action and Result. Keep the story specific and focus on what you did."],["Sample structure: introduce yourself","Mention your current education, relevant skills, one project or achievement, and what kind of opportunity you are seeking. Keep it concise."],["Prepare honestly","Use real examples. Practise aloud, but do not memorise a robotic script. Prepare thoughtful questions for the interviewer."]] },
 {title:"Technical Questions",cat:"Interview Questions",tag:"INTERVIEW PREPARATION",lead:"Technical interviews assess your understanding of fundamentals and how you approach unfamiliar problems.",sections:[["Core areas","Programming fundamentals, data structures, algorithms, OOP, DBMS, operating systems, computer networks and project discussions."],["Explain your thinking","Clarify the problem, discuss a straightforward approach, improve it if possible, then walk through an example and analyse complexity."],["Project preparation","Know the problem your project solves, your role, the technology choices, important design decisions and what you would improve."],["Practice","Try explaining one concept each day in simple language, then solve a small coding problem without looking at the solution."]] },
 {title:"Google",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"Prepare for software roles by strengthening problem solving, computer science fundamentals and communication.",sections:[["Build foundations","Practise arrays, strings, hash maps, trees, graphs, recursion, sorting, searching and dynamic programming."],["Interview approach","Clarify constraints, discuss edge cases, explain your approach, write readable code and test it with examples."],["Beyond coding","Be ready to discuss projects, design decisions, collaboration and trade-offs. The exact process varies by role and hiring cycle."],["Preparation plan","Use a balanced routine: learn a pattern, solve a few problems, review mistakes and explain one solution aloud."]] },
 {title:"Microsoft",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"Prepare for Microsoft opportunities with strong coding fundamentals, problem solving and clear communication.",sections:[["Technical preparation","Review data structures, algorithms, object-oriented programming, databases and operating-system basics."],["Problem solving","Practise explaining brute-force and improved approaches, testing edge cases and analysing complexity."],["Project discussion","Be ready to explain what you built, why you chose the tools, the challenges you faced and how you measured success."],["Keep current","Role expectations and interview formats can change. Check the official careers listing for the role you apply to."]] },
 {title:"Amazon",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"Prepare for Amazon roles by combining coding practice with examples of ownership, customer focus and teamwork.",sections:[["Coding foundations","Practise arrays, strings, linked lists, trees, graphs, heaps, sorting, searching and complexity analysis."],["Behavioural preparation","Prepare real examples that show ownership, learning from mistakes, customer focus and delivering results."],["Use STAR","Describe the situation, your responsibility, the actions you personally took and the measurable result."],["Role awareness","Review the job description carefully. Expectations differ across software, operations, data and other roles."]] },
 {title:"TCS",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"A structured preparation plan can help you approach TCS fresher assessments and interviews confidently.",sections:[["Preparation areas","Review aptitude, reasoning, verbal ability, programming fundamentals and the technical topics listed for your role."],["Coding practice","Practise writing correct programs, tracing loops, using arrays and strings, and explaining basic data structures."],["Interview readiness","Revise your strongest programming language, academic subjects and projects. Be prepared to explain your own resume."],["Check current details","Assessment stages and eligibility rules can vary by drive. Use the official TCS careers or hiring communication for current information."]] },
 {title:"Infosys",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"Prepare for Infosys opportunities with a balanced focus on aptitude, logical thinking and programming fundamentals.",sections:[["Build a routine","Practise quantitative aptitude, logical reasoning, verbal ability and coding regularly."],["Technical revision","Review your chosen language, OOP concepts, data structures, databases and project work."],["During assessments","Read instructions carefully, manage time and test code with boundary cases."],["Stay informed","Role-specific processes and test patterns may change. Follow the official recruitment communication."]] },
 {title:"Accenture",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"A broad preparation plan helps you build confidence for technology and consulting fresher roles.",sections:[["Core preparation","Practise communication, aptitude, reasoning, basic programming and the technical skills relevant to the role."],["Digital skills","Review fundamentals of databases, cloud concepts, software development and the tools mentioned in the job description."],["Interview examples","Prepare concise stories about teamwork, learning quickly, solving a problem and handling feedback."],["Verify the process","Assessment rounds differ by role and hiring programme. Check the latest official candidate instructions."]] },
 {title:"Capgemini",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"Prepare for Capgemini roles by combining aptitude, communication and technical fundamentals.",sections:[["What to revise","Quantitative and logical reasoning, verbal skills, programming basics, OOP, DBMS and project concepts."],["Coding habits","Practise writing clear code and tracing outputs. Focus on fundamentals before attempting difficult problems."],["Interview preparation","Explain your academic projects, your contribution, your technical choices and what you learned."],["Current information","Hiring stages and criteria vary. Always rely on the current official job or campus placement notice."]] },
 {title:"Wipro",cat:"Company Preparation",tag:"COMPANY PREPARATION",lead:"A consistent practice schedule can help you prepare for Wipro fresher opportunities.",sections:[["Practice areas","Revise aptitude, logical reasoning, verbal ability, programming and computer science fundamentals."],["Technical basics","Be comfortable with one programming language, arrays, strings, functions, OOP and basic SQL."],["Communication","Practise explaining your solution step by step and discussing your projects clearly."],["Check eligibility","Role requirements and hiring steps can change. Confirm details from the current official recruitment notice."]] },
 {title:"HTML",cat:"Study Resources",tag:"WEB DEVELOPMENT",lead:"HTML (HyperText Markup Language) gives a web page its structure and meaning.",sections:[["Basic document","A page usually contains <!DOCTYPE html>, html, head and body elements. The head stores metadata and the body contains visible content."],["Common elements","Use h1–h6 for headings, p for paragraphs, a for links, img for images, ul/ol/li for lists, and header, nav, main, section and footer for page structure."],["Example",'<!DOCTYPE html>\n<html lang="en">\n<head><title>My page</title></head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>My first web page.</p>\n</body>\n</html>'],["Good practice","Use semantic elements, meaningful alt text for images, labels for form inputs and a logical heading order. HTML describes content; CSS controls appearance."]] },
 {title:"CSS",cat:"Study Resources",tag:"WEB DEVELOPMENT",lead:"CSS (Cascading Style Sheets) controls how HTML elements look and how they are arranged on a page.",sections:[["Ways to add CSS","Inline CSS uses the style attribute. Internal CSS uses a style element in the head. External CSS uses a separate .css file linked with link."],["Selectors","Element selectors target tags (p), class selectors target reusable classes (.card), ID selectors target a unique ID (#header), and the universal selector (*) targets all elements."],["Example",' .card {\n  background: #f4f4f4;\n  padding: 20px;\n  border-radius: 10px;\n}'],["Layout and responsive design","Learn the box model, display, position, Flexbox, Grid, media queries, typography, colours and spacing. Use responsive layouts so pages work on phones and laptops."]] },
 {title:"C",cat:"Study Resources",tag:"PROGRAMMING",lead:"C is a procedural programming language that teaches variables, control flow, functions, arrays, pointers and memory concepts.",sections:[["Basic program",'#include <stdio.h>\nint main(void) {\n  printf("Hello, world!\\n");\n  return 0;\n}'],["Fundamental building blocks","Use int, char, float and double for common data types. Use if/else and switch for decisions, and for/while/do-while for repetition."],["Functions and arrays","Functions divide a program into reusable parts. Arrays store multiple values of the same type. Pointers store memory addresses and are important for dynamic data structures."],["Practice","Write small programs for even/odd, factorial, prime checking, array sum, string length and swapping two values."]] },
 {title:"JavaScript",cat:"Study Resources",tag:"WEB DEVELOPMENT",lead:"JavaScript adds behaviour and interactivity to web pages and is also used on servers and in many other environments.",sections:[["Variables and values",'let score = 10;\nconst student = "A learner";\nconsole.log(score, student);'],["Core concepts","Learn strings, numbers, booleans, arrays, objects, conditions, loops, functions, scope and error handling."],["DOM and events","The DOM represents the page as objects. Use querySelector to find elements, textContent to change text, and addEventListener to respond to clicks, input and form submission."],["Practice","Create a button that changes a heading, validate a simple form, and build a small to-do list. Keep HTML, CSS and JavaScript in separate files as projects grow."]] },
 {title:"Python",cat:"Study Resources",tag:"PROGRAMMING",lead:"Python is a readable, high-level programming language used in automation, web development, data science and more.",sections:[["First program",'name = "Student"\nprint("Hello", name)'],["Core syntax","Learn variables, indentation, strings, lists, tuples, sets, dictionaries, conditions, loops and functions."],["Useful features","List comprehensions, modules, file handling, exceptions and classes help organise larger programs."],["Practice","Write a calculator, number guessing game, word counter and a program that reads a text file. Focus on understanding each line rather than memorising syntax."]] },
 {title:"C++",cat:"Study Resources",tag:"PROGRAMMING",lead:"C++ builds on C-style programming and adds powerful features such as classes, templates and the Standard Template Library.",sections:[["Basic example",'#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, world!";\n  return 0;\n}'],["Object-oriented programming","Classes group data and functions. Objects are instances of classes. Learn constructors, encapsulation, inheritance, polymorphism and abstraction."],["STL","The Standard Template Library provides containers such as vector, stack, queue, map and set, plus algorithms such as sort and find."],["Practice","Solve array, string and searching problems. Learn when to use vector, map, set and priority_queue."]] },
 {title:"Operating System",cat:"Study Resources",tag:"CORE COMPUTER SCIENCE",lead:"An operating system manages computer hardware and provides services for programs and users.",sections:[["Main responsibilities","Process management, memory management, file systems, device management, security and user interfaces."],["Processes and threads","A process is a running program with its own resources. Threads are execution paths within a process that can share its resources."],["Important concepts","Revise CPU scheduling (FCFS, SJF, Round Robin), process states, context switching, deadlocks, paging, virtual memory and file allocation."],["Quick check","A deadlock requires mutual exclusion, hold and wait, no preemption and circular wait. Removing at least one condition can prevent deadlock."]] },
 {title:"DBMS",cat:"Study Resources",tag:"CORE COMPUTER SCIENCE",lead:"A Database Management System helps users store, organise, retrieve and manage data reliably.",sections:[["Why DBMS?","It supports controlled access, reduced redundancy, consistency, security, backup and concurrent access to data."],["Relational model","Data is stored in tables. Rows are records and columns are attributes. A primary key uniquely identifies a row; a foreign key references a key in another table."],["SQL example",'SELECT name, marks\nFROM Students\nWHERE marks >= 75\nORDER BY marks DESC;'],["Must-study topics","ER diagrams, keys, relational algebra, joins, normalization (1NF, 2NF, 3NF), transactions, ACID properties and indexing."]] },
 {title:"Computer Networks",cat:"Study Resources",tag:"CORE COMPUTER SCIENCE",lead:"Computer networks connect devices so they can exchange data and share resources.",sections:[["Network basics","Learn LAN, MAN and WAN, network topologies, transmission media, bandwidth, latency and packet switching."],["OSI model","The seven layers are Physical, Data Link, Network, Transport, Session, Presentation and Application. Each layer has a different responsibility."],["TCP/IP and protocols","Understand IP addressing, TCP versus UDP, DNS, HTTP/HTTPS, DHCP, routing and ports."],["Example","When you open a website, DNS helps find an IP address, TCP may establish a reliable connection, and HTTP carries the web request and response."]] },
 {title:"OOPs",cat:"Study Resources",tag:"CORE COMPUTER SCIENCE",lead:"Object-oriented programming organises software around objects that combine data and behaviour.",sections:[["Four pillars","Encapsulation bundles data and methods; abstraction exposes essentials; inheritance reuses and extends behaviour; polymorphism allows one interface to have different implementations."],["Class and object","A class is a blueprint. An object is an instance created from that blueprint."],["Example","A Student class might have name and rollNumber fields plus a displayDetails() method. Each Student object can hold different values."],["Why it matters","OOP can improve modularity and reuse when applied thoughtfully. Avoid unnecessary complexity and keep each class focused."]] },
 {title:"Java",cat:"Study Resources",tag:"PROGRAMMING",lead:"Java is a class-based, object-oriented language widely used for backend, enterprise and Android-related development.",sections:[["Basic program",'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}'],["Key concepts","Learn primitive types, variables, operators, conditions, loops, arrays, methods, classes, objects and constructors."],["OOP in Java","Practise encapsulation, inheritance, polymorphism, abstraction, interfaces and access modifiers."],["More to learn","Understand exception handling, collections, generics, file handling and the JVM/JRE/JDK distinction."]] },
 {title:"DSA Notes",cat:"Study Resources",tag:"DATA STRUCTURES",lead:"Data Structures and Algorithms help you organise data and solve computational problems efficiently.",sections:[["Data structures","Arrays, linked lists, stacks, queues, trees, graphs, hash tables and heaps each organise information differently."],["Algorithms","Learn searching, sorting, recursion, greedy methods, divide and conquer, backtracking and dynamic programming."],["Complexity","Big-O notation describes how time or space requirements grow as input size increases. Compare O(1), O(log n), O(n), O(n log n) and O(n²)."],["How to study","Understand the idea, trace a small example, implement it, test edge cases and analyse complexity. Consistent practice beats memorising solutions."]] }
];

const extraTopics = [
 ["Time and Work","Aptitude Practice","If one person completes a job in 6 days, their one-day work rate is 1/6 of the job. Add individual rates to find a combined rate."],
 ["Profit and Loss","Aptitude Practice","Profit = Selling Price − Cost Price. Profit percentage is calculated on cost price; loss percentage is also calculated on cost price."],
 ["Resume Project Section","Resume Builder","Describe each project with its purpose, your contribution, technologies used and a concrete outcome. Be ready to explain every item you list."],
 ["Mock Interview Practice","Interview Questions","Practise a 60-second introduction, one project explanation, one behavioural STAR story and one technical concept aloud."],
 ["Placement Roadmap","Company Preparation","Build a weekly routine across aptitude, coding, CS fundamentals, resume improvement and mock interviews. Adjust it to each role's requirements."]
];
extraTopics.forEach(([title,cat,detail])=>resources.push({title,cat,tag:cat.toUpperCase(),lead:detail,sections:[["Understand the concept",detail],["How to practise","Write the key idea in your own words, solve one basic example, then attempt a slightly harder variation."],["Revision checklist","Can you explain the concept without notes? Can you solve a new example? Can you identify common mistakes?"]]}));

const iconFor = title => ({"HTML":"H","CSS":"C","JavaScript":"JS","Python":"Py","C++":"C+","Arrays":"[]","Strings":"Aa","Linked List":"LL","Stack":"ST","Queue":"Q","Trees":"TR","Graphs":"GR","Dynamic Programming":"DP","DBMS":"DB","Operating System":"OS","Computer Networks":"CN","OOPs":"OOP","Java":"J","C":"C"}[title] || title.slice(0,2).toUpperCase());
let bookmarks=safeRead("vbspu_learning_bookmarks",[]), history=safeRead("vbspu_learning_history",[]), currentResource=null, currentFilter="all";

// Category container + "View all / Show less" state
const resourceGrid=$("resourceCategories");
const PREVIEW_COUNT=6, expandedCats=new Set(); // items shown per category before "View all"

function resourceCard(item){return `<a class="resource-item" href="#lesson" data-note="${encodeURIComponent(item.title)}"><span class="resource-symbol">${iconFor(item.title)}</span><span><b>${item.title}</b><small>${item.cat}</small></span><i>↗</i></a>`;}
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function renderLibrary(){
 if(!resourceGrid)return;
 let list=resources;
 if(currentFilter==="saved")list=resources.filter(x=>bookmarks.includes(x.title));
 if(currentFilter==="recent")list=history.map(t=>resources.find(x=>x.title===t)).filter(Boolean);
 const q=$("resourceSearch").value.trim().toLowerCase();
 if(q)list=list.filter(x=>(x.title+" "+x.cat+" "+x.lead).toLowerCase().includes(q));
 const searching=!!q||currentFilter!=="all"; // while searching/filtering, show every match
 if(!list.length){
  resourceGrid.innerHTML=`<div class="library-empty">No matching resources. Try another keyword.</div>`;
 }else{
  const groups=new Map();
  list.forEach(x=>{if(!groups.has(x.cat))groups.set(x.cat,[]);groups.get(x.cat).push(x);});
  resourceGrid.innerHTML=[...groups].map(([cat,items])=>{
   const expanded=searching||expandedCats.has(cat);
   const visible=expanded?items:items.slice(0,PREVIEW_COUNT);
   const toggle=!searching&&items.length>PREVIEW_COUNT?`<button class="cat-toggle" data-cat="${escapeHTML(cat)}">${expanded?"Show less":`View all (${items.length})`}</button>`:"";
   return `<div class="resource-category" data-cat-section="${escapeHTML(cat)}"><div class="category-head"><h3>${escapeHTML(cat)}<span>${items.length}</span></h3>${toggle}</div><div class="resource-grid">${visible.map(resourceCard).join("")}</div></div>`;
  }).join("");
 }
 $("libraryStatus").textContent=`${list.length} ${list.length===1?"resource":"resources"} · ${bookmarks.length} saved · ${history.length} recently opened`;
}
resourceGrid?.addEventListener("click",e=>{
 const b=e.target.closest(".cat-toggle"); if(!b)return;
 const c=b.dataset.cat; expandedCats.has(c)?expandedCats.delete(c):expandedCats.add(c);
 renderLibrary();
 if(!expandedCats.has(c))[...document.querySelectorAll(".resource-category")].find(s=>s.dataset.catSection===c)?.scrollIntoView({block:"nearest"});
});
function renderLesson(item){
 return item.sections.map(([heading,body])=>`<section class="lesson-section"><h2>${escapeHTML(heading)}</h2>${body.includes("\\n")||body.includes("#include")||body.includes("<!DOCTYPE")||body.includes("SELECT ")||body.includes("public class")||body.includes("int marks")||body.includes("char name")||body.includes(" .card")||body.includes("let score")||body.includes("name =")||body.includes("struct Node")?`<pre><code>${escapeHTML(body)}</code></pre>`:`<p>${escapeHTML(body)}</p>`}</section>`).join("");
}
function openResource(title){
 const item=resources.find(x=>x.title.toLowerCase()===decodeURIComponent(title).toLowerCase()); if(!item)return;
 currentResource=item; history=[item.title,...history.filter(x=>x!==item.title)].slice(0,12); safeWrite("vbspu_learning_history",history);
 homeView.classList.add("hidden"); authScreen.classList.add("hidden"); readerScreen.classList.remove("hidden");
 $("readerCategory").textContent=item.cat.toUpperCase(); $("readerMeta").textContent=`${item.tag} · Beginner friendly`; $("readerKicker").textContent=`${item.tag} / LEARNING NOTE`;
 $("readerTitle").textContent=item.title; $("readerLead").textContent=item.lead; $("readerBody").innerHTML=renderLesson(item);
 renderPdf(item);
 updateReaderSave();
 const index=resources.indexOf(item); $("readerPrev").disabled=index===0; $("readerNext").disabled=index===resources.length-1;
 window.scrollTo(0,0);
}
function closeReader(){readerScreen.classList.add("hidden");homeView.classList.remove("hidden");window.scrollTo(0,0);renderLibrary();}
function updateReaderSave(){const saved=bookmarks.includes(currentResource?.title); $("readerSave").textContent=saved?"★ Saved lesson":"☆ Save lesson"; $("readerSave").classList.toggle("saved",saved);}
function toggleSave(title){bookmarks=bookmarks.includes(title)?bookmarks.filter(x=>x!==title):[...bookmarks,title];safeWrite("vbspu_learning_bookmarks",bookmarks);if(currentResource?.title===title)updateReaderSave();renderLibrary();toast(bookmarks.includes(title)?"Lesson saved to bookmarks":"Removed from bookmarks");}
document.addEventListener("click",e=>{
 const target=e.target.closest("[data-note]"); if(target){e.preventDefault();openResource(target.dataset.note);return;}
});
document.addEventListener("keydown",e=>{const target=e.target.closest("[data-note]");if(target&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openResource(target.dataset.note);}});
$("readerBack").addEventListener("click",closeReader);
$("readerSave").addEventListener("click",()=>currentResource&&toggleSave(currentResource.title));
$("readerPrev").addEventListener("click",()=>{if(!currentResource)return;const i=resources.indexOf(currentResource);if(i>0)openResource(resources[i-1].title);});
$("readerNext").addEventListener("click",()=>{if(!currentResource)return;const i=resources.indexOf(currentResource);if(i<resources.length-1)openResource(resources[i+1].title);});
$("completeLesson").addEventListener("click",()=>{toast("Lesson marked as explored — keep going!");});
$("resourceSearch").addEventListener("input",renderLibrary);
document.querySelectorAll(".library-filter").forEach(btn=>btn.addEventListener("click",()=>{currentFilter=btn.dataset.filter;document.querySelectorAll(".library-filter").forEach(b=>b.classList.toggle("active",b===btn));renderLibrary();}));

// Theme persists across visits.
const themeKey="vbspu-prep-theme";
function applyTheme(theme){document.body.classList.toggle("dark",theme==="dark");$("themeToggle").textContent=theme==="dark"?"☀":"◐";localStorage.setItem(themeKey,theme);}
$("themeToggle").addEventListener("click",()=>applyTheme(document.body.classList.contains("dark")?"light":"dark"));
applyTheme(localStorage.getItem(themeKey)||"light");
renderLibrary(); refreshUser();
