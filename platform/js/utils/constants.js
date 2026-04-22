const UNITS = [
    {
      id:1, title:"Foundations of Data Literacy",
      icon:"📊", hours:"2h", topics:5, quizCount:8,
      tagline:"Understand what data literacy means and build the vocabulary to champion data culture at Wits.",
      outcomes:["Define data literacy and its relevance to higher education","Distinguish between nominal, ordinal, continuous, time-series, and textual data types","Apply the ACCURATE data quality framework","Understand the DIKW hierarchy","Identify and challenge common data myths"],
      sections:[
        {title:"1.1 Why Data Literacy Matters",content:`
          <p>We live in a world saturated with data. Every student login, assignment submission, fee payment, and counselling visit generates a data point. Yet most of this data sits unused — in siloed systems, misinterpreted by non-specialists, or simply never examined.</p>
          <p>For Wits, data literacy is not a technical nice-to-have. It is a strategic imperative tied to the university's commitment to student access, success, and equity. South Africa's HE sector faces graduation rates below 30% for regulation-time completion (CHE, 2022). Meaningful progress requires every staff member to be able to read, interpret, and act on data.</p>
          <div class="key-concept"><div class="kc-label">Key Concept</div><div class="kc-term">Data Literacy</div><div class="kc-def">"The ability to read, work with, analyse, and argue with data as information. Data literacy is not just about understanding statistics — it is about asking: What does this data actually tell us? What does it not tell us? Who is missing from this data?"</div><div class="kc-src">Wolff, Kortuem &amp; Cavero, 2015</div></div>
          <p>Calzada Prado &amp; Marzal (2013) extend this definition to include the social and political dimensions of data — who has power over data, whose stories data captures, and whose it erases. At a historically complex institution like Wits, this framing carries particular moral weight.</p>
        `},
        {title:"1.2 The Data Literacy Spectrum",content:`
          <p>Data literacy exists on a spectrum of increasing sophistication described by Wolff et al. (2016) as four progressive competency levels:</p>
          <div class="diagram-box"><pre>  THE DATA LITERACY SPECTRUM (Wolff et al., 2016)
      ════════════════════════════════════════════════
    
      LEVEL 1: READ DATA
      Understand what data is, how it is structured, and what it represents.
      Example: Read a module pass-rate table and understand what the columns mean.
    
      LEVEL 2: WORK WITH DATA
      Access, clean, organise, and prepare data for analysis.
      Example: Download a PeopleSoft report and clean missing values in Excel.
    
      LEVEL 3: ANALYSE DATA
      Apply statistical methods, identify patterns, trends, and anomalies.
      Example: Calculate the correlation between attendance and WPA across a cohort.
    
      LEVEL 4: ARGUE WITH DATA
      Use data evidence to make decisions, challenge assumptions, and tell stories.
      Example: Present evidence to the Faculty Board advocating for tutorial reform.
    
      ──────────────────────────── INCREASING SOPHISTICATION ──────────►
      Most HE professionals operate at Level 1–2.
      This programme will take Data Champions to Level 3–4.</pre></div>
          <p>Higher levels do not make lower levels obsolete. A data champion who can build predictive models but cannot critically read a basic pivot table is not truly data literate.</p>
        `},
        {title:"1.3 The DIKW Pyramid",content:`
          <p>The Data–Information–Knowledge–Wisdom (DIKW) pyramid (Ackoff, 1989; Rowley, 2007) describes the transformative journey from raw facts to actionable institutional wisdom.</p>
          <div class="diagram-box"><pre>                          ╱╲
                             ╱  ╲   WISDOM  — Knowing WHEN &amp; WHY to act
                            ╱────╲          'We must restructure Year 1 curriculum'
                           ╱      ╲
                          ╱ KNOW-  ╲  KNOWLEDGE — Knowing HOW (patterns, context)
                         ╱  LEDGE  ╲   'Students missing Week 3–5 rarely recover'
                        ╱────────────╲
                       ╱             ╲  INFORMATION — Knowing WHAT (structured)
                      ╱ INFORMATION  ╲   'First-year EBE pass rate dropped 8%'
                     ╱────────────────╲
                    ╱                  ╲  DATA — Raw facts &amp; records
                   ╱      D A T A      ╲   'Student 1234567: MATH1037: 42%'
                  ╱────────────────────╲
    
      Source: Ackoff (1989); Rowley (2007)</pre></div>
          <p>The Data Champion's primary role is to accelerate this journey — transforming institutional data into knowledge and wisdom that enable targeted, timely, and equitable interventions.</p>
        `},
        {title:"1.4 Data Types",content:`
          <p>Understanding data types is fundamental — it determines which analysis methods are appropriate. Applying the wrong method is one of the most common errors in educational analytics.</p>
          <table class="data-table"><thead><tr><th>Data Type</th><th>Student Examples</th><th>Correct Method</th><th>Common Mistake</th></tr></thead><tbody>
            <tr><td><strong>Nominal</strong></td><td>Faculty, Gender, Race, Programme</td><td>Frequency tables, Chi-square, Bar charts</td><td>Calculating a "mean race" — meaningless and harmful</td></tr>
            <tr><td><strong>Ordinal</strong></td><td>Year of study (1st–4th), Satisfaction ratings 1–5</td><td>Median, Rank correlation, Kruskal-Wallis</td><td>Treating scale gaps as equal intervals</td></tr>
            <tr><td><strong>Continuous</strong></td><td>WPA, Module marks, Attendance %, NSC aggregate</td><td>Mean, SD, Regression, Pearson correlation</td><td>Using mean for heavily skewed data</td></tr>
            <tr><td><strong>Time-Series</strong></td><td>Monthly attendance, Semester-by-semester WPA trends</td><td>Trend analysis, Survival analysis, ARIMA</td><td>Analysing each semester in isolation</td></tr>
            <tr><td><strong>Textual</strong></td><td>Counselling notes, SRS feedback, Emails</td><td>NLP, Sentiment analysis, Thematic coding</td><td>Ignoring it entirely — richest signals often live here</td></tr>
          </tbody></table>
        `},
        {title:"1.5 The ACCURATE Data Quality Framework",content:`
          <p>Data quality is the foundation of all analytics. The ACCURATE framework (adapted from Redman, 2001) provides eight critical dimensions:</p>
          <table class="data-table"><thead><tr><th>Dimension</th><th>What It Means</th><th>Student Analytics Example</th></tr></thead><tbody>
            <tr><td><strong>A</strong>ccuracy</td><td>Is the recorded value correct?</td><td>Is student 7654321 linked to the correct matric results?</td></tr>
            <tr><td><strong>C</strong>ompleteness</td><td>Are all required fields populated?</td><td>What % of first-year records have a valid home province?</td></tr>
            <tr><td><strong>C</strong>onsistency</td><td>Does data align across systems?</td><td>Does enrolment count in PeopleSoft match faculty records?</td></tr>
            <tr><td><strong>U</strong>niqueness</td><td>Are there duplicate records?</td><td>Is student 1234 enrolled twice under different IDs?</td></tr>
            <tr><td><strong>R</strong>elevance</td><td>Does data serve the question asked?</td><td>Is library swipe data a valid proxy for study engagement?</td></tr>
            <tr><td><strong>A</strong>ccessibility</td><td>Can authorised users access it when needed?</td><td>Is the at-risk dashboard available to advisors before Week 5?</td></tr>
            <tr><td><strong>T</strong>imeliness</td><td>Is data current enough to support decisions?</td><td>2021 attendance data cannot flag at-risk students in 2024.</td></tr>
            <tr><td><strong>E</strong>xplainability</td><td>Can the meaning and provenance be explained?</td><td>Can you explain what "LMS engagement score" actually measures?</td></tr>
          </tbody></table>
          <div class="case-study"><div class="cs-label">Wits Case Study</div><div class="cs-title">The Incomplete Dataset Problem (2022)</div><div class="cs-body"><p>A Wits faculty attempted to build an at-risk model using first-year data. The audit revealed: 34% of students had no NSC results recorded; 18% of attendance records were blank for Weeks 1–3 (system migration); the 'Financial Aid Flag' had three different coding conventions across years; 210 duplicate student IDs existed due to a re-registration error.</p><p><strong>Lesson:</strong> A data quality audit is non-negotiable before any analytics project.</p></div></div>
        `}
      ],
      lab:{
        title:"Lab 1.1: Data Quality Audit Exercise",
        duration:"30 minutes",
        objective:"Perform a systematic data quality audit on a sample student dataset using the ACCURATE framework.",
        dataset:"FY2023_FirstYear_Raw.xlsx — 500 anonymised student records: StudentID, Faculty, Programme, Gender, Race, HomeProvince, MatricNSC, MatricMaths, Semester1WPA, Attendance, ModulesFailed, FinancialAidType, LMS_Logins.",
        steps:[
          {n:"1",title:"Accuracy Check",desc:"Use Excel data validation. Are all MatricNSC values between 0–42? Are attendance values between 0–100? Flag any out-of-range values with conditional formatting."},
          {n:"2",title:"Completeness Check",desc:"Use COUNTBLANK() for each column. Which variables have >10% missing? Create a summary table ranking columns by % missing."},
          {n:"3",title:"Consistency Check",desc:"Compare Faculty field vs. Programme field. Are there programme–faculty mismatches (e.g., Nursing in Engineering)?"},
          {n:"4",title:"Uniqueness Check",desc:"Use COUNTIF() to find duplicate StudentIDs. How many duplicates exist? What are the implications for cohort analysis?"},
          {n:"5",title:"ACCURATE Scorecard",desc:"Rate each dimension 1 (poor) to 5 (excellent). Identify the top 3 quality issues: estimated impact, estimated fix effort, recommended action."},
          {n:"6",title:"Deliverable",desc:"Complete the Data Quality Audit Report (1 page) and submit before moving to the next unit."}
        ]
      },
      quiz:[
        {q:"According to Wolff et al. (2016), which level of data literacy involves using data evidence to challenge assumptions in stakeholder meetings?",opts:["Level 1 — Read Data","Level 2 — Work with Data","Level 3 — Analyse Data","Level 4 — Argue with Data"],ans:3,exp:"Level 4 'Argue with Data' is the highest competency — using data to construct evidence-based arguments and drive institutional decisions."},
        {q:"A student satisfaction survey uses a scale of 1 (Very Dissatisfied) to 5 (Very Satisfied). What type of data is this and what is the most appropriate measure of central tendency?",opts:["Continuous data — use the mean","Ordinal data — use the median","Nominal data — use the mode","Binary data — use a proportion"],ans:1,exp:"Satisfaction scales are ordinal — the intervals between categories are not equal, so the median is more appropriate than the mean."},
        {q:"The ACCURATE framework dimension 'Consistency' most directly refers to:",opts:["All required fields being populated with non-null values","Data values being factually correct and verifiable","Data aligning across multiple systems such as PeopleSoft and Faculty records","Data being accessible to all staff regardless of role"],ans:2,exp:"Consistency means the same data item has the same value across different systems — a common problem when data is maintained in multiple places."},
        {q:"In the DIKW hierarchy, 'Students who miss Week 3–5 tutorials rarely recover their WPA' represents which level?",opts:["Data","Information","Knowledge","Wisdom"],ans:2,exp:"Knowledge is the pattern-level understanding derived from information — knowing HOW things relate. Wisdom is knowing WHEN and WHY to act."},
        {q:"The 'FinancialAidFlag' field uses '1/0' in 2021, 'Yes/No' in 2022, and 'TRUE/FALSE' in 2023. Which ACCURATE dimension is violated?",opts:["Accuracy","Completeness","Consistency","Uniqueness"],ans:2,exp:"Different coding conventions for the same variable violates Consistency — data cannot be reliably merged across years without standardisation."},
        {q:"Which of the following is NOT part of the Data Champion role at Wits?",opts:["Interpreting analytics dashboards for faculty","Identifying data quality issues and escalating them","Making final academic decisions about student progression based on ARI scores alone","Designing and monitoring student success interventions"],ans:2,exp:"Data Champions inform and support decisions — they do not make final academic decisions unilaterally. Human judgement and governance processes remain essential."},
        {q:"Which analysis method is MOST appropriate for identifying a statistically significant difference in pass rates between NSFAS-funded and self-funded students?",opts:["Calculating mean WPA for both groups","Chi-square test comparing pass/fail counts across funding categories","Pearson correlation between funding type and WPA","Linear regression with funding type as the outcome variable"],ans:1,exp:"Pass/fail is a binary categorical outcome; funding type is also categorical. Chi-square tests the independence of two categorical variables."},
        {q:"A Wits faculty report shows the 'average race' of at-risk students. What is the fundamental problem with this metric?",opts:["Race data is never collected at Wits","Race is a nominal variable — calculating an average is mathematically meaningless and potentially harmful","The sample size is too small to calculate an average","The mean and median should both be reported"],ans:1,exp:"Race is a nominal (categorical) variable with no numerical value or ordering. Computing an 'average' is a category error — use frequency tables and proportions instead."}
      ]
    },
    {
      id:2, title:"Student Data Landscape at Wits",
      icon:"🗄️", hours:"2h", topics:5, quizCount:7,
      tagline:"Map Wits' student data ecosystem and understand what data is available, where it lives, and how to access it responsibly.",
      outcomes:["Map the major student data systems at Wits and their owners","Identify the most predictive student data variables for success modelling","Understand the student data lifecycle","Navigate the Wits data request process","Identify data gaps and argue for new data collection"],
      sections:[
        {title:"2.1 The Wits Student Data Ecosystem",content:`
          <p>Student data at Wits is distributed across multiple operational systems — each designed for a specific purpose, maintained by different teams, and governed by different policies.</p>
          <div class="diagram-box"><pre>  WITS STUDENT DATA ECOSYSTEM MAP
      ══════════════════════════════════════════════════════════
    
      TIER 1: CORE STUDENT INFORMATION SYSTEMS
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ PEOPLESOFT   │  │ APPLICATIONS │  │ FINANCE SYS  │
      │ (Oracle SIS) │  │ (Hobsons/AMS)│  │ (PS Finance) │
      │ Enrolment    │  │ Matric data  │  │ Fee account  │
      │ Academic rec │  │ Application  │  │ NSFAS status │
      │ Module reg.  │  │ School data  │  │ Bursary data │
      └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
             │                 │                  │
      TIER 2: LEARNING &amp; ENGAGEMENT SYSTEMS
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ ULWAZI (LMS) │  │ TURNITIN /   │  │ LIBRARY SYS  │
      │ (Moodle)     │  │ GRADEBOOK    │  │ Borrowing    │
      │ Login logs   │  │ Assignment   │  │ Resource acc │
      │ Quiz scores  │  │ submission   │  │ Study rooms  │
      │ Forum posts  │  │ Plagiarism   │  │              │
      └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
             └──────────────────┴──────────────────┘
      TIER 3: STUDENT SUPPORT SYSTEMS
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ STUDENT HLTH │  │ COUNSELLING  │  │ RES. MGMT    │
      │ Wellness     │  │ CRM          │  │ Residence    │
      │ Medical      │  │ Referrals    │  │ allocation   │
      │ visits       │  │ Appointments │  │ Incidents    │
      └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
             └──────────────────┴──────────────────┘
      TIER 4: ANALYTICS LAYER (BISO)
      ┌──────────────────────────────────────────────────┐
      │ DATA WAREHOUSE → Power BI / Qlik / Tableau       │
      │ Integrated student view | Dashboards | Ad-hoc    │
      │ AT-RISK INDEX | Cohort tracking | Equity reports │
      └──────────────────────────────────────────────────┘</pre></div>
        `},
        {title:"2.2 PeopleSoft & LMS as Data Sources",content:`
          <p>PeopleSoft is the authoritative record of all official student data. Understanding what it contains — and what it does not — is essential for every Data Champion.</p>
          <table class="data-table"><thead><tr><th>Data Domain</th><th>Key Variables</th><th>Access Level</th></tr></thead><tbody>
            <tr><td>Demographic</td><td>StudentID, Gender, Race, Nationality, Home Language, Province</td><td>L2 — Faculty Data Champion</td></tr>
            <tr><td>Academic History</td><td>Module codes, marks, WPA by semester, academic standing, year of study</td><td>L2 — Faculty Data Champion</td></tr>
            <tr><td>Enrolment</td><td>Registration date, programme, faculty, dropout date &amp; reason</td><td>L2 — Faculty Data Champion</td></tr>
            <tr><td>Qualification History</td><td>NSC aggregate &amp; subject grades, prior HE qualifications</td><td>L3 — Analytics Team</td></tr>
            <tr><td>Financial</td><td>Fee account status, NSFAS award, bursary type, outstanding fees</td><td>L4 — Restricted (Finance/FA)</td></tr>
          </tbody></table>
          <div class="info-box green"><div class="ib-title">🔬 LMS as a Behavioural Data Source</div><p>Ulwazi (Wits' Moodle-based LMS) generates rich behavioural data often overlooked. Macfadyen &amp; Dawson (2010) found LMS engagement variables can predict course outcomes with up to <strong>81% accuracy</strong>.</p><ul><li><strong>Login frequency</strong> — total logins per week; highly predictive of disengagement risk</li><li><strong>Assignment submission rate</strong> — non-submission is a leading indicator of failure</li><li><strong>Last login date</strong> — gap of >10 days in first 6 weeks is a critical at-risk indicator</li><li><strong>Quiz attempt rate</strong> — non-engagement with formative assessment predicts summative failure</li></ul></div>
        `},
        {title:"2.3 The Student Data Lifecycle",content:`
          <div class="diagram-box"><pre>  STUDENT DATA LIFECYCLE AT WITS
      ════════════════════════════════════════════════════
    
      1. COLLECTION — How is data first created?
         Application forms, registration, LMS activity, assessments,
         support visits, financial transactions, library use.
    
      2. STORAGE — Where does data live?
         Primary systems (PeopleSoft, Moodle), BISO data warehouse,
         faculty spreadsheets, support CRM, email archives.
    
      3. PROCESSING — How is data transformed and used?
         Reports, dashboards, at-risk models, HEMIS submissions,
         research studies, audit responses.
    
      4. SHARING — Who else receives the data?
         Within Wits (governed by Role-Based Access Controls),
         to approved researchers (IRB-approved, anonymised),
         to government (HEMIS — DHET statutory returns).
    
      5. RETENTION / DELETION
         Academic records: permanent retention.
         Support records: 7 years post-graduation (POPIA guidance).
         Analytics model training data: reviewed annually.
         Raw LMS logs: 3 years.</pre></div>
        `},
        {title:"2.4 Key Predictive Variables",content:`
          <p>Not all variables are equally predictive of student outcomes. The following have the strongest evidence base in South African and global HE research:</p>
          <table class="data-table"><thead><tr><th>Variable</th><th>Predictive Power</th><th>When Available</th><th>Key Research</th></tr></thead><tbody>
            <tr><td>NSC Mathematics grade</td><td>⬆⬆ Very High</td><td>Before registration</td><td>Scott et al. (2007)</td></tr>
            <tr><td>NSC aggregate (total points)</td><td>⬆⬆ Very High</td><td>Before registration</td><td>Balfour (2013)</td></tr>
            <tr><td>School quintile (SES proxy)</td><td>⬆ High</td><td>At registration</td><td>CHE (2013)</td></tr>
            <tr><td>First-generation student status</td><td>⬆ Medium-High</td><td>At registration</td><td>Tinto (1987)</td></tr>
            <tr><td>Semester 1, Week 4–6 WPA</td><td>⬆⬆ Very High</td><td>Week 4–6</td><td>Arnold &amp; Pistilli (2012)</td></tr>
            <tr><td>Module fail count by Week 6</td><td>⬆⬆ Very High</td><td>Week 6</td><td>Macfadyen &amp; Dawson (2010)</td></tr>
            <tr><td>LMS login frequency (Wk 1–4)</td><td>⬆ High</td><td>Week 4</td><td>Agudo-Peregrina et al. (2014)</td></tr>
            <tr><td>Financial aid / fee debt status</td><td>⬆ Medium-High</td><td>Semester start</td><td>Letseka &amp; Maile (2008)</td></tr>
          </tbody></table>
        `},
        {title:"2.5 The Data Request Process",content:`
          <p>Accessing student data must always follow the approved Data Request Process, governed by the Wits Data Governance Framework and POPIA. BISO plays a central role in stewarding these requests.</p>
          <table class="data-table"><thead><tr><th>Step</th><th>Action</th><th>Responsible</th><th>Timeframe</th></tr></thead><tbody>
            <tr><td>1</td><td>Identify data need: specify exact variables, time period, cohort, and analytical purpose.</td><td>Data Champion</td><td>1–2 days</td></tr>
            <tr><td>2</td><td>Submit Wits Data Request Form to BISO or faculty BI contact.</td><td>Data Champion + Line Manager</td><td>1 day</td></tr>
            <tr><td>3</td><td>Ethics review: IRB approval if publishable research; Line Manager sign-off for operational use.</td><td>IRB / Line Manager</td><td>2–20 days</td></tr>
            <tr><td>4</td><td>Data extraction by BISO: anonymised or pseudonymised as required.</td><td>BISO / IT</td><td>3–5 days</td></tr>
            <tr><td>5</td><td>Secure storage: university-approved platforms only. No personal laptops or USB drives.</td><td>Data Champion</td><td>Ongoing</td></tr>
            <tr><td>6</td><td>Use and analyse for specified purpose only. Scope change = new request.</td><td>Data Champion</td><td>Ongoing</td></tr>
            <tr><td>7</td><td>Dispose or archive per Wits Data Retention Schedule.</td><td>Data Champion + BISO</td><td>30 days post-project</td></tr>
          </tbody></table>
        `}
      ],
      lab:{
        title:"Lab 2.1: Data Mapping & Systems Navigation",
        duration:"30 minutes",
        objective:"Map all relevant data sources for a specific student success investigation scenario.",
        dataset:"Scenario: First-year African Languages pass rate dropped from 79% to 58% between 2022 and 2023. Dropout is 23% higher than the faculty average.",
        steps:[
          {n:"1",title:"Data Source Mapping",desc:"Using the Wits Data Ecosystem diagram, list every data source containing relevant information. For each: variable, system owner, and access level required."},
          {n:"2",title:"Data Request Draft",desc:"Complete a draft Data Request Form for the top 3 most critical data sources: purpose, variables needed, cohort, time period, and proposed storage location."},
          {n:"3",title:"Gap Analysis",desc:"Identify at least 2 pieces of data you wish you had but that are NOT currently collected. For each: (a) value; (b) ethical collection method; (c) POPIA implications."},
          {n:"4",title:"Stakeholder Map",desc:"Identify the 5 people/roles you need to contact to gather all the data. What is your strategy for each?"},
          {n:"5",title:"Group Debrief",desc:"Share your data maps. Which systems are most under-utilised? What surprised you about the data landscape?"}
        ]
      },
      quiz:[
        {q:"LMS engagement variables can predict final course outcomes with accuracy of up to (Macfadyen & Dawson, 2010):",opts:["45%","61%","81%","95%"],ans:2,exp:"Macfadyen & Dawson (2010) demonstrated that LMS engagement data alone could predict course outcomes with up to 81% accuracy."},
        {q:"In the Wits EBE Faculty pilot (2023), which combination of Week 1–3 indicators identified students with an 84% failure probability?",opts:["Low matric NSC AND no assignment submissions","No formative quiz attempts AND fewer than 4 LMS logins in Weeks 1–2","Fee debt outstanding AND low attendance rate","First-generation status AND low WPA at Week 6"],ans:1,exp:"The EBE pilot found zero quiz attempts AND fewer than 4 logins in Weeks 1–2 was the strongest early combined predictor."},
        {q:"Which student data variable has the EARLIEST availability AND among the highest predictive power?",opts:["Semester 1 WPA at Week 6","LMS login frequency in Week 1–4","NSC Mathematics grade (matric)","Assignment submission rate"],ans:2,exp:"NSC Mathematics grade is available before registration and has very high predictive power, particularly for STEM programmes (Scott et al., 2007)."},
        {q:"Under the Wits Data Request Process, which step typically requires IRB approval?",opts:["All analytical use of student data","Only when data will be used for publishable research","Only when data includes financial information","Only when data is shared externally"],ans:1,exp:"IRB approval is required when data use goes beyond internal operational purposes to become publishable research."},
        {q:"The recommended retention period for student support records (counselling, health) at Wits is:",opts:["1 year after the academic year","Duration of registration only","7 years post-graduation","Permanent, as with academic records"],ans:2,exp:"POPIA guidance recommends retaining support records for 7 years post-graduation — long enough for legal compliance but not indefinitely."},
        {q:"Which Wits system would contain student housing/residence allocation data?",opts:["PeopleSoft Student Information System","Ulwazi (LMS / Moodle)","Residence Management System","Financial System (PeopleSoft Financials)"],ans:2,exp:"Residence allocation and housing data is managed by the Residence Management System — a Tier 3 student support system."},
        {q:"'School quintile' is used in student analytics as a proxy for:",opts:["Academic preparedness for university study","Socioeconomic status (SES) of the student's background","Quality of the student's subject teacher","Distance from home to university"],ans:1,exp:"South African school quintiles are assigned based on the socioeconomic status of the surrounding community — making quintile a standard SES proxy in research."}
      ]
    },
    {
      id:3, title:"Data Analysis & Visualisation",
      icon:"📈", hours:"2h", topics:4, quizCount:7,
      tagline:"Master the statistical tools and visualisation principles to turn raw data into compelling, equity-conscious insights.",
      outcomes:["Select and apply appropriate descriptive statistical methods","Interpret correlation analysis and its limitations","Apply the CARE visualisation principles","Disaggregate data by equity dimensions","Build and present a multi-chart student success dashboard"],
      sections:[
        {title:"3.1 Descriptive Statistics Toolkit",content:`
          <h3>Measures of Central Tendency</h3>
          <table class="data-table"><thead><tr><th>Measure</th><th>When to Use</th><th>Important Caveat</th></tr></thead><tbody>
            <tr><td><strong>Mean</strong></td><td>WPA averages for comparing groups; module mark averages across years</td><td>Sensitive to outliers. A few very low scores can pull the mean down, masking bimodal distributions.</td></tr>
            <tr><td><strong>Median</strong></td><td>Use when WPA data is skewed; comparing equity groups with different distributions</td><td>More robust than the mean for skewed distributions — common in first-year cohorts.</td></tr>
            <tr><td><strong>Mode</strong></td><td>Most common module registration choice; most frequent home province</td><td>Less useful for continuous data; very useful for nominal categories.</td></tr>
          </tbody></table>
          <h3 style="margin-top:16px">Correlation Analysis</h3>
          <div class="key-concept"><div class="kc-label">Key Concept</div><div class="kc-term">Correlation Coefficient (r)</div><div class="kc-def">A measure of the strength and direction of the linear relationship between two continuous variables. Values: -1.0 (perfect negative) to +1.0 (perfect positive). Effect sizes: r=0.1 (small), r=0.3 (medium), r=0.5 (large).</div><div class="kc-src">Pearson (1895); Cohen (1988)</div></div>
          <div class="info-box red"><div class="ib-title">⚠️ Critical Warning</div><p><strong>Correlation does not imply causation.</strong> The fact that LMS logins correlate with pass rates does not mean forcing students to log in more will cause them to pass. Data Champions must never make causal claims from correlational data.</p></div>
          <table class="data-table"><thead><tr><th>Variable Pair</th><th>Typical r in SA HE</th><th>Interpretation</th></tr></thead><tbody>
            <tr><td>NSC Matric aggregate vs. Year 1 WPA</td><td>r = 0.35–0.55</td><td>Medium–large effect. Predictive but not deterministic.</td></tr>
            <tr><td>Attendance % vs. Module pass rate</td><td>r = 0.40–0.60</td><td>Strong — but causality is complex. Students may stop attending because they are already failing.</td></tr>
            <tr><td>LMS logins vs. Assignment grades</td><td>r = 0.30–0.45</td><td>Moderate. How students engage matters more than how often.</td></tr>
          </tbody></table>
        `},
        {title:"3.2 Disaggregating Data — The Equity Imperative",content:`
          <p>Disaggregation means breaking down aggregate statistics by subgroups to reveal differences that averages conceal. At Wits, disaggregation by race, gender, SES, and school quintile is a moral and institutional obligation.</p>
          <div class="case-study"><div class="cs-label">Wits Case Study</div><div class="cs-title">The Hidden Gap: When Averages Deceive</div><div class="cs-body"><p>A Wits Faculty reported a 'satisfactory' overall module pass rate of <strong>68%</strong>. The Dean was satisfied. No action was taken.</p><p><strong>What the aggregate hid:</strong></p><p>• Black African students: 54% pass rate | White students: 83% pass rate (29-point gap)<br>• NSFAS-funded: 49% pass rate | Self-funded: 79% pass rate (30-point gap)</p><p><strong>Lesson:</strong> Always disaggregate. A good overall average can hide deeply unequal outcomes. The South African equity mandate requires Data Champions to surface and act on these gaps.</p></div></div>
        `},
        {title:"3.3 Data Visualisation — The CARE Principles",content:`
          <p>Reference: Few, S. (2012). <em>Show Me the Numbers</em>. Analytics Press.</p>
          <table class="data-table"><thead><tr><th>Principle</th><th>What It Means</th><th>Student Analytics Application</th></tr></thead><tbody>
            <tr><td><strong>C</strong>larity</td><td>Every element serves the message. Title should state the finding, not just describe data.</td><td>"NSFAS students pass 28 points lower than self-funded students" not "Module Pass Rates by Funding Type"</td></tr>
            <tr><td><strong>A</strong>ccuracy</td><td>Never truncate axes. Avoid 3D charts. Percentages must add to 100%. Always show n=.</td><td>Y-axis starting at 0, not 50%, avoids exaggerating differences between groups.</td></tr>
            <tr><td><strong>R</strong>elevance</td><td>Choose the chart type that best answers the specific question.</td><td>Use scatter plot (not bar chart) to show relationship between matric NSC and Year 1 WPA.</td></tr>
            <tr><td><strong>E</strong>quity Lens</td><td>Always include equity disaggregation where relevant.</td><td>If your chart shows "all students", ask: Is this masking differential outcomes?</td></tr>
          </tbody></table>
          <h3 style="margin-top:16px">Chart Selection Guide</h3>
          <table class="data-table"><thead><tr><th>Question</th><th>Chart Type</th><th>Example</th></tr></thead><tbody>
            <tr><td>How do groups compare?</td><td>Clustered Bar Chart</td><td>Pass rates by Faculty and Gender, side by side</td></tr>
            <tr><td>How are values distributed?</td><td>Histogram / Box Plot</td><td>Distribution of Semester 1 WPA in first-year cohort</td></tr>
            <tr><td>What is the relationship between two variables?</td><td>Scatter Plot with trendline</td><td>Matric NSC vs. Year 1 WPA with R² displayed</td></tr>
            <tr><td>How has something changed over time?</td><td>Line Chart</td><td>Quarterly retention rate over 4 years</td></tr>
            <tr><td>What is the risk level across units?</td><td>Heat Map / Traffic Light</td><td>Module-level at-risk dashboard: Red/Amber/Green</td></tr>
          </tbody></table>
        `},
        {title:"3.4 The Data Story — SCQA Framework",content:`
          <p>Data and analytics only create value when they lead to action. The SCQA framework (Minto, 1987) structures compelling, actionable data narratives:</p>
          <table class="data-table"><thead><tr><th>Element</th><th>Purpose</th><th>Example</th></tr></thead><tbody>
            <tr><td><strong>S</strong>ituation</td><td>Set the scene. What do we know?</td><td>"We enrolled 1,247 first-year students in 2023."</td></tr>
            <tr><td><strong>C</strong>omplication</td><td>Introduce the tension or concerning finding.</td><td>"However, the Semester 1 pass rate for NSFAS-funded students dropped to 49% — a 15-point decline from 2022."</td></tr>
            <tr><td><strong>Q</strong>uestion</td><td>What question does this raise for leadership?</td><td>"What is driving this decline and what do we do about it?"</td></tr>
            <tr><td><strong>A</strong>nswer</td><td>What does the data suggest we should do?</td><td>"Three interventions: early fee-hold alert, Week 3 advisor outreach, and subsidised tutoring for at-risk NSFAS cohort."</td></tr>
          </tbody></table>
        `}
      ],
      lab:{
        title:"Lab 3.1: Building a Student Success Dashboard",
        duration:"40 minutes | Excel / Power BI",
        objective:"Create a 4-chart equity-focused student success dashboard.",
        dataset:"FY2023_Cohort_Analytics.xlsx — 500 anonymised students: Faculty, Gender, Race, SchoolQuintile, FinancialAidType, MatricNSC, S1_WPA, S1_Attendance, S1_LMS_Logins, S1_ModulesFailed, S1_Outcome.",
        steps:[
          {n:"1",title:"Equity Gap Bar Chart",desc:"Create a clustered bar showing pass rates by BOTH Race AND FinancialAidType. Apply traffic light conditional formatting: Green >75%, Amber 60–75%, Red <60%. Title the chart with the KEY FINDING."},
          {n:"2",title:"Scatter Plot",desc:"Plot MatricNSC (x-axis) vs. S1_WPA (y-axis). Colour-code dots by Faculty. Add a linear trendline and display R². What does the clustering reveal about faculty-specific effects?"},
          {n:"3",title:"Distribution Box Plot",desc:"Create box plots of S1_WPA separately for School Quintile 1–2 vs. Quintile 3–5. Where do the medians differ? What does the spread tell you about variance within groups?"},
          {n:"4",title:"Risk Heat Map",desc:"Create a pivot table of Faculty vs. S1_Outcome. Apply a green-amber-red heat map. Which faculty × outcome combination requires most urgent attention?"},
          {n:"5",title:"Dashboard Assembly",desc:"Arrange all 4 charts on one sheet. Add: (a) dashboard title, (b) data source note, (c) date range, (d) a text box with 3 key findings in plain language."},
          {n:"6",title:"Data Story (SCQA)",desc:"Using one finding, write a 3-minute stakeholder briefing using the SCQA framework. Present to a partner. Receive feedback: 'One thing that worked well... / One thing to improve...'"}
        ]
      },
      quiz:[
        {q:"A faculty's average module mark is 64% but the distribution is strongly left-skewed with a long tail of very low scores. Which measure of central tendency should you report?",opts:["Mean — it uses all data points","Median — more robust to the skewed tail of low scores","Mode — most frequently occurring mark","Range — shows the full spread"],ans:1,exp:"In skewed distributions, the median is not affected by extreme values and better represents the 'typical' student."},
        {q:"'There is a strong positive correlation (r = 0.62) between LMS logins and pass rate, therefore we should mandate 5 logins per week.' What is the fundamental error?",opts:["r = 0.62 is not statistically significant","The analyst is confusing correlation with causation","LMS login frequency is a nominal variable and cannot be correlated","The threshold for a strong correlation is r = 0.80"],ans:1,exp:"Correlation measures association, not causation. Students who log in more may be more motivated — it is the motivation, not the logins, that causes passing."},
        {q:"A faculty's overall first-year pass rate is 71%. Which action BEST reflects the equity imperative?",opts:["Present the 71% confidently — it exceeds the 70% benchmark","Disaggregate the 71% by race, gender, and financial aid status before presenting","Compare the 71% to the national average","Present the 71% alongside a 3-year trend line"],ans:1,exp:"The equity imperative requires disaggregation. An average of 71% can mask dramatic inequalities — as demonstrated in the case study where 68% hid a 34-point racial gap."},
        {q:"You want to show how Semester 1 WPA scores are DISTRIBUTED within the 2023 first-year cohort. Which chart is most appropriate?",opts:["Pie chart showing proportion in each faculty","Line chart showing WPA trend over four semesters","Histogram showing frequency of WPA score ranges","Scatter plot of matric NSC vs. WPA"],ans:2,exp:"A histogram is specifically designed to show the distribution (frequency) of a continuous variable across ranges."},
        {q:"Why should the y-axis of a bar chart NEVER be truncated (not start at zero)?",opts:["It makes charts harder to read on mobile devices","It violates the Accuracy principle — truncating exaggerates differences and misleads viewers","It reduces the number of gridlines visible","It violates the Clarity principle by adding unnecessary labels"],ans:1,exp:"Truncating the y-axis visually exaggerates differences between bars, misleading viewers about the actual magnitude. This is a common deceptive visualisation practice."},
        {q:"In the SCQA framework, what is the purpose of the 'Complication' (C) step?",opts:["To explain the statistical methods used","To present data in tabular format","To introduce the problem or concerning finding that makes the situation action-worthy","To recommend a specific intervention"],ans:2,exp:"The 'Complication' introduces the tension — the finding that disrupts the status quo and makes the question urgent."},
        {q:"An R-squared (R²) value of 0.42 on a scatter plot of Matric NSC vs. Year 1 WPA means:",opts:["42% of students with high matric marks will pass Year 1","The correlation coefficient r = 0.42","42% of the variation in Year 1 WPA is explained by matric NSC score","Students with matric marks above 42 points will succeed"],ans:2,exp:"R² (coefficient of determination) tells us the proportion of variance in the outcome explained by the predictor. R² = 0.42 means matric NSC explains 42% of Year 1 WPA variability."}
      ]
    },
    {
      id:4, title:"Predictive Modelling for Student Success",
      icon:"🤖", hours:"2h", topics:6, quizCount:7,
      tagline:"Understand how predictive models work, interpret the Wits At-Risk Index, and evaluate model fairness and bias.",
      outcomes:["Explain the purpose, workflow, and limitations of predictive modelling in HE","Describe how Logistic Regression, Decision Trees, and Random Forests work conceptually","Interpret model performance metrics: accuracy, precision, recall, F1-score, AUC-ROC","Apply the Wits At-Risk Index (ARI) framework","Identify and evaluate algorithmic bias"],
      sections:[
        {title:"4.1 What is Predictive Analytics?",content:`
          <p>Descriptive analytics asks 'What happened?' Predictive analytics asks: 'What is likely to happen next?' The value proposition is clear: if we can identify a student likely to fail in Week 4 of Semester 1 — before the mid-semester test — we have a window to intervene.</p>
          <div class="key-concept"><div class="kc-label">Key Concept</div><div class="kc-term">Predictive Analytics</div><div class="kc-def">The use of statistical algorithms and historical data to estimate the probability of a future outcome for an individual or group. In HE, this typically means estimating the probability that a specific student will fail a module, exit the institution, or fail to graduate within regulation time.</div><div class="kc-src">Shmueli & Koppius (2011); Arnold & Pistilli (2012)</div></div>
          <div class="case-study"><div class="cs-label">International Case Study</div><div class="cs-title">Purdue University's Course Signals — The Pioneer</div><div class="cs-body"><p>Course Signals (Arnold &amp; Pistilli, 2012) used LMS engagement data, assignment grades, and student characteristics to generate traffic-light risk indicators (Red/Amber/Green) for every student in real time.</p><p><strong>Results after 4 years:</strong> Students who received a 'Red' alert and were contacted by their instructor were 21% more likely to earn a C or better than comparable non-alerted students. DFW (Fail/Withdraw) rates reduced by 10.7%.</p><p>The Wits At-Risk Index (ARI) draws heavily on the Course Signals conceptual model, adapted for the South African institutional context and POPIA requirements.</p></div></div>
        `},
        {title:"4.2 The CRISP-DM Workflow",content:`
          <div class="diagram-box"><pre>  CRISP-DM: APPLIED TO STUDENT SUCCESS AT WITS
      ══════════════════════════════════════════════════════════
    
      PHASE 1: BUSINESS UNDERSTANDING
      Define the problem precisely:
      'Predict which first-year Wits students will fail >2 modules
       in Semester 1, with lead time for Week 5 intervention.'
      Output: Project charter, success criteria, intervention pathway.
    
      PHASE 2: DATA UNDERSTANDING
      Identify all data sources. Check availability, coverage, quality.
      Output: Data inventory, ACCURATE audit report.
    
      PHASE 3: DATA PREPARATION
      Clean, merge, transform. Handle missing values.
      Create features: e.g., attendance_ratio_week4 = attended/possible.
      Encode categorical variables. Split 70/30 train/test.
      Output: Clean analysis-ready dataset. Feature engineering report.
    
      PHASE 4: MODELLING
      Train candidate models: Logistic Regression, Decision Tree,
      Random Forest. Tune hyperparameters. Use cross-validation.
      Output: Trained model objects. Performance metrics table.
    
      PHASE 5: EVALUATION
      Assess model on held-out test data.
      Accuracy, AUC-ROC, precision, recall. Test for bias.
      Output: Model evaluation report. Fairness assessment.
    
      PHASE 6: DEPLOYMENT
      Embed in BISO dashboard. Set alert thresholds. Train staff.
      Define escalation pathways. Schedule model refresh.
      Output: Live at-risk dashboard. Intervention playbook.
    
      Reference: Chapman et al. (2000). CRISP-DM 1.0.</pre></div>
        `},
        {title:"4.3 Core Model Types",content:`
          <h3>Logistic Regression</h3>
          <div class="diagram-box"><pre>  LOGISTIC REGRESSION — CONCEPTUAL EXAMPLE
      ════════════════════════════════════════════
      Outcome: Probability of FAILING Semester 1 (0=Pass, 1=Fail)
    
      P(Fail) = 1 / (1 + e^-(β0 + β1*NSC + β2*Attend + β3*LMS))
    
      Illustrative coefficients:
      β0 (intercept)   = -3.2  (baseline log-odds)
      β1 (NSC)         = -0.08 (each NSC point reduces fail risk)
      β2 (Attendance)  = -0.05 (each % increase reduces fail risk)
      β3 (LMS_Logins)  = -0.12 (each additional login/week reduces risk)
    
      Student with NSC=28, Attendance=55%, LMS=3 logins/week
      → Estimated P(Fail) = 0.71 (71% probability of failing)
    
      WHY DATA CHAMPIONS LOVE IT: Outputs a probability (0–1);
      coefficients are directly interpretable.</pre></div>
          <h3 style="margin-top:16px">Decision Tree</h3>
          <div class="diagram-box"><pre>  DECISION TREE — WITS MODEL EXAMPLE (Simplified)
      ════════════════════════════════════════════════
                  [NSC Aggregate &lt; 26?]
                 /                    \\
               YES                     NO
                |                       |
         [Attend &lt; 55%?]        [LMS Logins &lt; 5/wk?]
         /            \\          /              \\
       YES             NO      YES              NO
        |               |       |                |
       HIGH           MOD      MOD              LOW
       RISK           RISK     RISK             RISK
       82% fail       44%      41%              12%
    
      READING: 'Students with NSC &lt; 26 AND attendance &lt; 55%
      have an 82% historical probability of failing Semester 1.'</pre></div>
          <h3 style="margin-top:16px">Random Forest</h3>
          <p>Random Forest combines hundreds of Decision Trees (an 'ensemble'), each trained on a random subset of data and features. The final prediction is the average vote of all trees. More robust and accurate than a single decision tree, but less directly interpretable.</p>
        `},
        {title:"4.4 Model Performance Metrics",content:`
          <div class="diagram-box"><pre>  CONFUSION MATRIX — THE FOUNDATION OF MODEL EVALUATION
      ══════════════════════════════════════════════════════
                         PREDICTED FAIL   PREDICTED PASS
      ACTUAL FAIL   |   True Positive  |  False Negative  |
                    |      (TP) ✓      |   (FN) ✗ Missed  |
      ACTUAL PASS   |  False Positive  |  True Negative   |
                    |  (FP) ✗ Overcall |      (TN) ✓      |
    
      KEY METRICS:
      Accuracy  = (TP + TN) / All        — Overall correct predictions
      Precision = TP / (TP + FP)         — Of flagged at-risk, what % actually fail?
      Recall    = TP / (TP + FN)         — Of students who fail, what % did we catch?
      F1-Score  = 2 × (P × R) / (P + R) — Harmonic mean of Precision &amp; Recall
      AUC-ROC   = Area under ROC curve   — Overall discriminative ability
                  (0.5=random; 1.0=perfect; &gt;0.75=good for HE use)</pre></div>
          <div class="info-box gold"><div class="ib-title">⚖️ The Critical Trade-Off</div><p><strong>Favour HIGH RECALL</strong> in student at-risk models. The cost of missing an at-risk student who drops out generally exceeds the cost of an unnecessary advisor conversation with a student who would have passed anyway. It is better to reach some students who didn't need help than to miss students who did.</p></div>
        `},
        {title:"4.5 The Wits At-Risk Index (ARI)",content:`
          <div class="diagram-box"><pre>  WITS AT-RISK INDEX (ARI) — COMPOSITION
      Semester 1, Week 5 Model | Version 2.1 (2024)
      ══════════════════════════════════════════════════════════
    
      COMPONENT                         WEIGHT   THRESHOLD
      ─────────────────────────────────────────────────────
      1. Module fail count (Week 5)       30%    >1 fail = high risk
      2. Lecture/tutorial attendance %    25%    <60% = high risk
      3. LMS engagement score             15%    <5 logins/week
         (logins + resource access
          + assignment submission rate)
      4. NSC Matric aggregate             15%    <25 pts = risk
      5. Financial stress indicator       10%    Fees >30d outstanding
         (outstanding fees / NSFAS                or NSFAS conditional
          conditional status)
      6. First-generation student flag     5%    No degree-holding parent
      ─────────────────────────────────────────────────────
      TOTAL ARI SCORE:  0 (lowest risk) ——→ 100 (highest risk)
    
      RISK BANDS &amp; REQUIRED RESPONSE:
      [0–30]   LOW      — Passive monitoring only
      [31–55]  MODERATE — Email / group invitation within 5 working days
      [56–75]  HIGH     — Personal advisor outreach within 3 working days
      [76–100] CRITICAL — Same-day multi-disciplinary response
    
      Model trained on 2020–2022 cohorts (n=14,847). AUC-ROC = 0.81
      Adapted from Arnold &amp; Pistilli (2012); Wits BISO, 2024.</pre></div>
        `},
        {title:"4.6 Algorithmic Bias",content:`
          <p>Predictive models trained on historical data inherit the biases embedded in that history. South African HEIs have a history of racially unequal access to quality schooling, financial resources, and social capital. A model that learns from this history will reproduce it.</p>
          <table class="data-table"><thead><tr><th>Bias Type</th><th>How It Enters the Model</th><th>Mitigation</th></tr></thead><tbody>
            <tr><td><strong>Historical Bias</strong></td><td>Training data reflects past inequalities, not student potential. Black students had lower pass rates due to under-resourced schools.</td><td>Include equity-adjusted features; audit model outcomes disaggregated by race.</td></tr>
            <tr><td><strong>Proxy Discrimination</strong></td><td>A neutral variable acts as a proxy for a protected attribute. School quintile correlates strongly with race in SA.</td><td>Assess variable correlations with protected attributes; consider adjusting or removing proxy variables.</td></tr>
            <tr><td><strong>Feedback Loop Bias</strong></td><td>Model outputs change behaviour, which reinforces the model. At-risk students receiving fewer resources → worse outcomes → model confirmed.</td><td>Design supportive (not limiting) interventions. Monitor whether interventions benefit all subgroups equally.</td></tr>
            <tr><td><strong>Measurement Bias</strong></td><td>Low LMS logins may reflect infrastructure inequality, not disengagement.</td><td>Audit features for infrastructure dependency; collect contextual data on access barriers.</td></tr>
          </tbody></table>
          <div class="info-box red"><div class="ib-title">⚠️ Fairness Checks Every Data Champion Must Apply</div><ul><li>Is the False Positive Rate significantly higher for any racial or gender group?</li><li>Can you explain every feature to a student in plain language without causing stigma?</li><li>After implementing interventions, did all subgroups benefit equally?</li><li>Has the model been reviewed by the Wits Ethics Committee before deployment?</li></ul></div>
        `}
      ],
      lab:{
        title:"Lab 4.1: Interpreting a Predictive Model",
        duration:"30 minutes",
        objective:"Interpret the outputs of a pre-built predictive model and make evidence-based intervention decisions.",
        dataset:"ARI_Predictions_2024S1_Week5.xlsx — 80 anonymised student records with: StudentID (pseudonymised), Faculty, ARI_Score, RiskBand, TopRiskFactor, NSC_Score, Attendance_Pct, LMS_Score, FinancialFlag, Race, Gender.",
        steps:[
          {n:"1",title:"Filter High-Risk Students",desc:"Filter to HIGH and CRITICAL risk bands. How many are there? What % of the total cohort does this represent?"},
          {n:"2",title:"Top Risk Factor Analysis",desc:"For each HIGH/CRITICAL student, identify their top contributing risk factor. Create a frequency table: which single factor is most common across high-risk students?"},
          {n:"3",title:"Equity Audit",desc:"Use a pivot table to compare the % of students in HIGH/CRITICAL risk band by Race and by Gender. Are any groups disproportionately represented? What could explain this?"},
          {n:"4",title:"Intervention Assignment",desc:"Using the Intervention Menu (provided), assign the most appropriate first intervention to each student in the HIGH/CRITICAL band. What support does each student most need?"},
          {n:"5",title:"Bias Check",desc:"Are students from Quintile 1–2 schools disproportionately flagged as CRITICAL? Cross-tabulate ARI band with school quintile. What do you find?"},
          {n:"6",title:"Reflection",desc:"Would you be comfortable acting on these model outputs? What additional information would change your confidence? What safeguards are needed?"}
        ]
      },
      quiz:[
        {q:"A student success model has Precision=0.68 and Recall=0.84. In the student at-risk context, which metric is more important to prioritise?",opts:["Precision — avoid wasting advisor time on students who would pass anyway","Recall — better to reach students who didn't need help than miss those who did","Both are equally important — F1-score balances them","Neither — Accuracy is the only metric that matters"],ans:1,exp:"In student at-risk modelling, a missed student (False Negative) who drops out is far more costly than an unnecessary contact (False Positive). High Recall ensures we catch most true at-risk students."},
        {q:"An AUC-ROC value of 0.81 indicates:",opts:["The model correctly predicts 81% of all students' outcomes","The model has good discriminative ability — above the 0.75 HE threshold","81% of flagged students will fail their semester","The model was trained on 81% of the available data"],ans:1,exp:"AUC-ROC measures the model's ability to discriminate between at-risk and not-at-risk students. 0.81 is considered good (above the 0.75 threshold recommended for HE use)."},
        {q:"During which CRISP-DM phase would a Data Champion create a variable called 'attendance_ratio_week4' from raw attendance records?",opts:["Phase 1 — Business Understanding","Phase 2 — Data Understanding","Phase 3 — Data Preparation (Feature Engineering)","Phase 4 — Modelling"],ans:2,exp:"Feature Engineering — creating new analytically meaningful variables from raw data — occurs in Phase 3 (Data Preparation)."},
        {q:"A Wits model flags 67% of Black African students as HIGH/CRITICAL risk vs. 22% of White students. This most likely indicates:",opts:["Measurement Bias — Black students have unreliable data","Feedback Loop Bias — previous interventions changed the data","Historical Bias or Proxy Discrimination — the model is learning from racially unequal historical outcomes","Sample Bias — insufficient White students in the training set"],ans:2,exp:"When a protected group is disproportionately flagged, it typically reflects Historical Bias or Proxy Discrimination. Both require intervention."},
        {q:"Which model type provides the MOST interpretable explanation for WHY a specific student was flagged?",opts:["Random Forest — hundreds of trees","Neural Network — learns complex patterns","Decision Tree — explicit if-then rules traceable to the student's data","Logistic Regression — provides probability estimates"],ans:2,exp:"Decision Trees create transparent, traceable rule paths. You can point to exactly which branch conditions apply to a specific student."},
        {q:"Under the Wits ARI framework, what is the required response for a student with an ARI score of 82?",opts:["Passive monitoring only","Email / group invitation within 5 working days","Personal advisor outreach within 3 working days","Same-day multi-disciplinary response"],ans:3,exp:"ARI scores of 76–100 are CRITICAL, requiring same-day multi-disciplinary response. These students are at the highest risk and require the most urgent, coordinated intervention."},
        {q:"What is 'Feedback Loop Bias' in student analytics models?",opts:["The model was tested on the same data it was trained on","Model outputs change behaviour, which then reinforces the model's original prediction","A proxy variable (like school quintile) correlates with race","Historical training data reflects past inequalities in educational access"],ans:1,exp:"Feedback Loop Bias occurs when model outputs change behaviour, which then reinforces the model. E.g., if at-risk students receive fewer resources, outcomes worsen — confirming the prediction."}
      ]
    },
    {
      id:5, title:"Ethics, Privacy & Data Governance",
      icon:"⚖️", hours:"2h", topics:5, quizCount:6,
      tagline:"Navigate POPIA compliance, ethical tensions in predictive analytics, and the Wits Data Governance Framework.",
      outcomes:["Apply POPIA's 8 conditions to student data analytics scenarios","Navigate the four ethical tensions of student analytics","Apply the Wits Data Governance Framework","Complete the Responsible Analytics Checklist","Communicate data ethics decisions clearly"],
      sections:[
        {title:"5.1 Why Ethics Are Not Optional",content:`
          <p>At a South African institution with Wits' history — built in a city deliberately segregated, whose student body was shaped by apartheid's spatial and educational inequalities — the ethics of data use carries particular moral weight. Data about students is not neutral. It is data about human beings whose trajectories have been profoundly shaped by forces beyond their control.</p>
          <div class="key-concept"><div class="kc-label">Key Concept</div><div class="kc-term">Information Ethics in Higher Education</div><div class="kc-def">The systematic application of moral principles to the collection, storage, processing, and communication of information about students and staff. Includes: respect for student autonomy and privacy; fairness and non-discrimination; transparency about how data is used; and accountability for the consequences of data-driven decisions.</div><div class="kc-src">Prinsloo & Slade (2017); Sclater (2014); Floridi (2014)</div></div>
        `},
        {title:"5.2 POPIA — The Legal Framework",content:`
          <p>The Protection of Personal Information Act (POPIA, Act 4 of 2013) came into full force on 1 July 2021. All student data processing at Wits must comply with POPIA's 8 Conditions for Lawful Processing.</p>
          <table class="data-table"><thead><tr><th>Condition</th><th>Core Obligation</th><th>Student Analytics Implication</th><th>Violation Risk</th></tr></thead><tbody>
            <tr><td><strong>1. Accountability</strong></td><td>Wits must appoint an Information Officer and ensure compliance.</td><td>Data Champions must know the Wits IO and report breaches within 72 hours.</td><td>Assuming someone else is responsible.</td></tr>
            <tr><td><strong>2. Processing Limitation</strong></td><td>Data processed only for a specific, explicit, lawful purpose.</td><td>All analytics projects must have a documented, approved purpose statement.</td><td>Using enrolment data for commercial research.</td></tr>
            <tr><td><strong>3. Purpose Specification</strong></td><td>Students notified of purpose at time of collection.</td><td>At-risk modelling must be disclosed in student privacy notices and LMS terms.</td><td>Retroactively using data for undisclosed purposes.</td></tr>
            <tr><td><strong>4. Further Processing</strong></td><td>Further processing must be compatible with original purpose.</td><td>ARI scores cannot be shared with employers or bursary providers.</td><td>Sharing de-identified datasets with researchers without ethics clearance.</td></tr>
            <tr><td><strong>5. Information Quality</strong></td><td>Data must be complete, accurate, and up to date.</td><td>Data Champions must escalate quality issues — acting on inaccurate data violates POPIA.</td><td>Acting on ARI scores without verifying data quality.</td></tr>
            <tr><td><strong>6. Openness</strong></td><td>Wits must publish a POPIA-compliant Privacy Notice.</td><td>At-risk flagging must be disclosed. Students may not be secretly monitored.</td><td>Operating an undisclosed early alert system.</td></tr>
            <tr><td><strong>7. Security Safeguards</strong></td><td>Appropriate technical measures to prevent loss or unlawful access.</td><td>No student records on personal USBs, personal Google Drives, or WhatsApp groups.</td><td>Emailing at-risk student names via personal email.</td></tr>
            <tr><td><strong>8. Data Subject Participation</strong></td><td>Students may request their personal information and correct inaccuracies.</td><td>A process must exist for students to request their ARI score and challenge inaccuracies.</td><td>Refusing a student's request to see their own ARI score.</td></tr>
          </tbody></table>
        `},
        {title:"5.3 The Four Ethical Tensions",content:`
          <div class="info-box gold"><div class="ib-title">⚖️ Tension 1: Care vs. Surveillance</div><p>The same data system that enables caring, personalised intervention can feel like institutional surveillance. If students feel monitored rather than supported, they may disengage from the very systems designed to help them.</p><p><strong>Navigate by asking:</strong> Are students informed? Can they opt out? Is the data used to support students or manage institutional liability?</p></div>
          <div class="info-box gold"><div class="ib-title">⚖️ Tension 2: Precision vs. Privacy</div><p>The more granular our data, the more accurately we can predict risk — but the more we intrude on student privacy. Knowing that a student visited counselling, has an overdue fee, and hasn't logged into Moodle for 8 days is powerful but ethically sensitive.</p><p><strong>Navigate by asking:</strong> Is each data element strictly necessary? Are we applying data minimisation?</p></div>
          <div class="info-box gold"><div class="ib-title">⚖️ Tension 3: Automation vs. Judgement</div><p>Models process data faster and more consistently than humans — but they lack context, empathy, and the capacity to recognise exceptional circumstances. A student whose attendance dropped due to a family bereavement looks identical in the data to a student who simply stopped attending.</p><p><strong>Principle: Predictive models should INFORM human judgement, never REPLACE it.</strong> Every model output is a prompt for a conversation, not a verdict.</p></div>
          <div class="info-box gold"><div class="ib-title">⚖️ Tension 4: Equity as Goal vs. Equity as Harm</div><p>We collect demographic data to monitor and close equity gaps — a social justice imperative. But the same data can be used to produce racially differentiated service levels or reinforce deficit thinking.</p><p><strong>Navigate by asking:</strong> Are we using demographic data to hold the INSTITUTION accountable — or to categorise students? The question 'Where is the institution failing?' is fundamentally different from 'Which students are failing?'</p></div>
        `},
        {title:"5.4 The Wits Data Governance Framework",content:`
          <div class="diagram-box"><pre>  WITS DATA GOVERNANCE FRAMEWORK — ANALYTICS PROJECTS
      ══════════════════════════════════════════════════════
    
      TIER 1: STRATEGIC GOVERNANCE
      Wits Senate / Executive Committee
      Approves institutional data strategy; sets risk appetite;
      ensures POPIA compliance at institutional level.
    
      TIER 2: OPERATIONAL GOVERNANCE
      Business Intelligence Services (BISO)
      Information Officer (IO)
      Approves data requests; maintains data inventory;
      conducts Privacy Impact Assessments for new analytics projects.
    
      TIER 3: FACULTY / DIVISIONAL GOVERNANCE
      DATA CHAMPIONS (this programme)
      Faculty-level stewardship of analytics projects;
      ensures access controls; escalates quality and ethics issues;
      liaises between front-line staff and BISO analytics team.
    
      TIER 4: TECHNICAL GOVERNANCE
      IT / BISO Analytics Team
      Role-based access controls; data platform security;
      model version control; dashboard access management.
    
      TIER 5: STUDENT VOICE
      Student Representative Council (SRC)
      Consulted on new data collection; representative on
      Analytics Ethics Advisory Group.</pre></div>
        `},
        {title:"5.5 Responsible Analytics Checklist",content:`
          <p>Before launching any student analytics project, complete the Wits Responsible Analytics Checklist in collaboration with BISO:</p>
          <table class="data-table"><thead><tr><th>#</th><th>Checklist Item</th><th>Evidence Required</th></tr></thead><tbody>
            <tr><td>1</td><td>Is the analytical purpose clearly defined and documented?</td><td>Purpose Statement approved by line manager</td></tr>
            <tr><td>2</td><td>Is POPIA compliance confirmed (all 8 conditions)?</td><td>POPIA Assessment Form, signed by Information Officer</td></tr>
            <tr><td>3</td><td>Has a Privacy Impact Assessment been conducted?</td><td>Required for new data collection or novel data use</td></tr>
            <tr><td>4</td><td>Are data sources limited to those strictly necessary?</td><td>Variable list reviewed — no 'nice to have' fields</td></tr>
            <tr><td>5</td><td>Is data access restricted to authorised roles only?</td><td>Access control matrix documented</td></tr>
            <tr><td>6</td><td>Is data stored on an approved, encrypted Wits platform?</td><td>Storage location confirmed with IT</td></tr>
            <tr><td>7</td><td>Have students been notified of the analytics use?</td><td>Privacy notice updated; student handbook reference added</td></tr>
            <tr><td>8</td><td>Has a bias/fairness check been designed in?</td><td>Fairness metrics defined; disaggregated evaluation planned</td></tr>
            <tr><td>9</td><td>Is there a human review step before automated student comms?</td><td>Intervention workflow with human approval gate documented</td></tr>
            <tr><td>10</td><td>Is there a process for students to access and challenge their data?</td><td>Student query process documented on Wits website</td></tr>
          </tbody></table>
        `}
      ],
      lab:{
        title:"Lab 5.1: Ethical Scenario Workshop",
        duration:"40 minutes | Group Discussion",
        objective:"Navigate genuine ethical tensions in student analytics scenarios and produce documented ethics decisions.",
        dataset:"Three realistic Wits scenarios (below). Groups of 3–4 participants. Each group selects one scenario and prepares a 5-minute presentation.",
        steps:[
          {n:"A",title:"The Shared Dashboard",desc:"A faculty administrator creates a Power BI dashboard showing all HIGH/CRITICAL risk students by name, student number, ARI score, and top risk factor — shared via a link accessible to all 45 academic staff. Discuss: (1) Which POPIA conditions are violated? (2) What are the specific harms? (3) How should the dashboard be redesigned? (4) What access control structure is appropriate?"},
          {n:"B",title:"The Automated Email",desc:"The student success team configures an automated email to all students with ARI > 70 stating: 'Our analytics system indicates you may be at significant risk of failing. Please contact your academic advisor immediately.' Discuss: (1) What are the benefits and harms? (2) What tone and content is more appropriate? (3) Should it be automated or human-initiated? (4) What POPIA disclosure requirements apply?"},
          {n:"C",title:"The Research Request",desc:"A postgraduate student from another university requests access to the anonymised 2020–2023 first-year cohort dataset (including race, gender, WPA, school quintile, dropout status) for a published study. Their supervisor has Wits IRB approval. Discuss: (1) What conditions govern this sharing? (2) How should data be further anonymised? (3) What if the study finds racial differences in dropout risk?"},
          {n:"D",title:"Ethics Decision Record",desc:"Each group completes a one-page Ethics Decision Record (template provided) covering: issue identified, ethical principles engaged, decision taken, safeguards put in place, and how the decision was communicated. Groups present to plenary."},
          {n:"E",title:"Reflection",desc:"As a full group: Which ethical tension (from Section 5.3) did your scenario most highlight? What institutional change would make navigating this tension easier at Wits?"}
        ]
      },
      quiz:[
        {q:"Under POPIA Condition 3 (Purpose Specification), a team uses enrolment data collected for registration to build a published dropout research model. This is a violation because:",opts:["The data was collected more than 2 years ago","The new purpose is incompatible with the original collection purpose without fresh consent or IRB approval","Research use of student data is always prohibited","Data must first be aggregated to faculty level"],ans:1,exp:"POPIA Condition 3 prohibits using data for purposes incompatible with the original purpose unless consent is obtained or a compatible legal basis exists."},
        {q:"A Data Champion sends a spreadsheet containing ARI scores and student names to a personal Gmail account to work on over the weekend. Which POPIA condition is most directly violated?",opts:["Condition 2 — Processing Limitation","Condition 6 — Openness","Condition 7 — Security Safeguards","Condition 8 — Data Subject Participation"],ans:2,exp:"POPIA Condition 7 requires appropriate technical safeguards. Storing identifiable student data on an unsecured personal email account violates this condition."},
        {q:"Ethical Tension 3 (Automation vs. Judgement) is best addressed by:",opts:["Removing all human involvement to ensure consistency","Using model outputs as prompts for human-initiated conversations, never as final automated decisions","Only running the model after midterm examinations","Sharing model outputs directly with students"],ans:1,exp:"Predictive models should inform human judgement, not replace it. Context, empathy, and understanding of individual circumstances require human involvement."},
        {q:"Under the Wits Data Governance Framework, which TIER is responsible for conducting Privacy Impact Assessments?",opts:["Tier 1 — Senate / Executive Committee","Tier 2 — BISO / Information Officer","Tier 3 — Data Champions (Faculty Level)","Tier 5 — Student Representative Council"],ans:1,exp:"Privacy Impact Assessments are an Operational Governance function conducted by BISO in collaboration with the Information Officer — Tier 2."},
        {q:"The ethical tension of using racial data in student analytics is best navigated by:",opts:["Removing race from all analytics to avoid any risk","Using race data only to disaggregate outcomes and hold the INSTITUTION accountable — not to categorise students as inherently higher risk","Sharing racial breakdown data widely so all staff can see equity gaps","Only using race data with IRB approval"],ans:1,exp:"Race data should be used to reveal where the institution is failing students — an equity accountability tool, not a student-categorisation tool."},
        {q:"A student requests to see their ARI score. Under POPIA Condition 8, Wits is obliged to:",opts:["Decline — model scores are proprietary institutional analytics","Provide the score within a reasonable timeframe and explain contributing factors in plain language","Only share the score with the student's parents or guardian","Provide the score only if the student can prove they are being disadvantaged"],ans:1,exp:"POPIA Condition 8 (Data Subject Participation) gives students the right to request their personal information and understand how it is being processed."}
      ]
    },
    {
      id:6, title:"From Insight to Intervention",
      icon:"🎯", hours:"2h", topics:5, quizCount:6,
      tagline:"Design a complete data-informed student support pipeline and build your personalised 90-Day Data Champion Action Plan.",
      outcomes:["Design a complete data-informed intervention pipeline","Apply the Tiered Intervention Framework to match interventions to risk levels","Build a 90-Day Data Champion Action Plan","Design a measurement framework to evaluate equity outcomes","Present a data-informed student success argument to senior leadership"],
      sections:[
        {title:"6.1 The Insight-to-Intervention Problem",content:`
          <p>The most common failure in educational analytics is not the quality of the data or the sophistication of the model. It is the gap between generating an insight and taking action on it. Research by Siemens et al. (2011) found that most HEIs generate reports that are read by senior leadership but rarely acted upon by front-line staff closest to students.</p>
          <div class="key-concept"><div class="kc-label">Key Concept</div><div class="kc-term">Actionable Analytics</div><div class="kc-def">Analytics designed from the outset to lead to a specific, measurable action by a named person within a defined timeframe. Starts with: 'What decision needs to be made, and by whom?' — and works backwards to determine what data is required.</div><div class="kc-src">Siemens et al. (2011); Bienkowski et al. (2012)</div></div>
        `},
        {title:"6.2 The Complete Pipeline",content:`
          <div class="diagram-box"><pre>  WITS INSIGHT-TO-INTERVENTION PIPELINE
      ══════════════════════════════════════════════════════════
    
      STAGE 1: DATA SIGNAL (Automated | Weekly)
      PeopleSoft + Ulwazi + Finance feeds ARI model.
      ARI score calculated for all enrolled first-year students.
      Students categorised into risk bands.
    
      STAGE 2: BISO / DATA CHAMPION REVIEW (Weekly | Tue EOD)
      Data Champion reviews HIGH/CRITICAL list.
      Cross-references with contextual knowledge (known circumstances).
      Adds qualitative notes; removes students with extenuating circumstances.
    
      STAGE 3: HUMAN DECISION (Wednesday | Named Advisor)
      Academic Advisor / SSO reviews curated list.
      Confirms appropriateness of intervention type.
      Assigns each student to a specific intervention action.
      Logs decision in CRM.
    
      STAGE 4: STUDENT CONTACT (Thursday–Friday | Named Advisor)
      Warm, supportive first contact — telephone preferred.
      Script: "We noticed you might be having a challenging time and
      wanted to check in — how are you doing?" NOT "Our data shows
      you are at risk of failing."
      Record outcome in CRM.
    
      STAGE 5: INTERVENTION DELIVERY (Following week onwards)
      Student enrolled in appropriate support: tutoring, counselling,
      financial aid assistance, supplemental instruction, mentoring.
      Advisor maintains fortnightly check-in for 6 weeks.
    
      STAGE 6: OUTCOME MONITORING (End of semester)
      Compare outcomes for intervened vs. non-intervened students.
      Disaggregate by race, gender, financial aid status.
      Report to Faculty Board and BISO.
    
      ► TARGET: Data signal → First student contact = MAX 5 working days</pre></div>
        `},
        {title:"6.3 The Tiered Intervention Framework",content:`
          <table class="data-table"><thead><tr><th>Risk Band</th><th>ARI</th><th>Core Interventions</th><th>Communication</th><th>Lead</th></tr></thead><tbody>
            <tr><td><strong>LOW</strong></td><td>0–30</td><td>Monthly cohort newsletter; optional skills workshop; peer mentoring invitation</td><td>Group/cohort email, opt-in, supportive tone</td><td>Faculty / Student Life</td></tr>
            <tr><td><strong>MODERATE</strong></td><td>31–55</td><td>Personalised email from tutor/advisor; Supplemental Instruction invitation; NSFAS check if financial flag</td><td>Personal email from known staff member</td><td>Academic Advisor</td></tr>
            <tr><td><strong>HIGH</strong></td><td>56–75</td><td>Personal phone call within 3 working days; academic development referral (CSLD); financial aid assistance; structured weekly check-in × 6 weeks</td><td>Direct, warm personal outreach; strengths-based; advisor-initiated</td><td>Data Champion + SSO</td></tr>
            <tr><td><strong>CRITICAL</strong></td><td>76–100</td><td>Same-day outreach; multi-disciplinary case conference within 48h; curriculum adjustment discussion; counselling same-week referral</td><td>Urgent personal contact; multi-channel</td><td>Dean of Students + Faculty + SSO</td></tr>
          </tbody></table>
        `},
        {title:"6.4 Communication Guidelines",content:`
          <p>The language of intervention matters enormously. A poorly worded first contact can cause more harm than no contact at all — triggering shame, anxiety, or disengagement. (Yeager &amp; Dweck, 2012; Stephens et al., 2012)</p>
          <table class="data-table"><thead><tr><th>Principle</th><th>❌ What NOT to Say</th><th>✅ What TO Say Instead</th></tr></thead><tbody>
            <tr><td>Lead with care, not data</td><td>"Our data shows you are at risk of failing."</td><td>"I wanted to check in and see how you're getting on this semester."</td></tr>
            <tr><td>Strengths-based framing</td><td>"You are struggling academically."</td><td>"Many strong students find the transition to first year challenging. What's been your experience?"</td></tr>
            <tr><td>Avoid deficit language</td><td>"Students from your background often struggle here."</td><td>"What support would be most useful for you right now?"</td></tr>
            <tr><td>Be transparent, not alarming</td><td>"You were flagged by our prediction system as high risk."</td><td>"We use a system to check in with students who might benefit from early support."</td></tr>
            <tr><td>Student agency</td><td>"You need to go to the CSLD immediately."</td><td>"There are great support options available — would any of these be useful for you?"</td></tr>
          </tbody></table>
        `},
        {title:"6.5 Measuring Intervention Effectiveness",content:`
          <table class="data-table"><thead><tr><th>Metric</th><th>Definition</th><th>Target</th></tr></thead><tbody>
            <tr><td><strong>Reach Rate</strong></td><td>% of HIGH/CRITICAL students successfully contacted within required timeframe</td><td>>90% HIGH; 100% CRITICAL</td></tr>
            <tr><td><strong>Uptake Rate</strong></td><td>% of those contacted who engaged with at least one offered intervention</td><td>>60%</td></tr>
            <tr><td><strong>WPA Improvement Rate</strong></td><td>% of intervened students who improved WPA by ≥5 points between Week 6 and end of semester</td><td>Compare to matched non-intervened cohort</td></tr>
            <tr><td><strong>Module Pass Rate Change</strong></td><td>Difference in S1 pass rate between intervened and comparable non-intervened students</td><td>Statistically significant positive difference</td></tr>
            <tr><td><strong>Retention Rate</strong></td><td>% of HIGH/CRITICAL intervened students who re-enrolled for Semester 2</td><td>Compare to historical non-intervened HIGH/CRITICAL</td></tr>
            <tr><td><strong>Equity Impact Index</strong></td><td>Did the intervention close or widen the equity gap across race, gender, SES groups?</td><td>Equal or equity-positive improvement across all groups</td></tr>
          </tbody></table>
          <div class="case-study"><div class="cs-label">Wits Case Study</div><div class="cs-title">Commerce Faculty Success Story (2024)</div><div class="cs-body"><p>Week 5 ARI identified 47 HIGH/CRITICAL students (15% of cohort). After removing 4 with known extenuating circumstances, 43 students were prioritised. <strong>Reach Rate: 95%</strong> (41/43 contacted within 3 days). <strong>Uptake Rate: 79%</strong> (34 students accepted at least one support element). <strong>Outcome: 85% of engaged students passed all modules</strong>, vs. historical non-intervened HIGH/CRITICAL pass rate of 38%.</p><p><em>"The model did not save these students. The advisor who made the call did. The model just told her who to call."</em></p></div></div>
        `}
      ],
      lab:{
        title:"Lab 6.1: 90-Day Data Champion Action Plan",
        duration:"40 minutes | Design Sprint",
        objective:"Develop a practical, specific, time-bound Data Champion Action Plan for your faculty or division.",
        dataset:"Your own faculty context. Data Champion 90-Day Plan Canvas template (provided). Each participant builds a personalised plan and presents in a 3-minute showcase.",
        steps:[
          {n:"1",title:"Problem Definition",desc:"State the specific student success challenge you are targeting, backed by a data point you already know. Which students? Which semester? Which outcome (retention, pass rate, throughput)? Why is this the priority?"},
          {n:"2",title:"Data Plan",desc:"List the 3–5 data variables most critical to your analysis. For each: Which Wits system? Who is the data owner? What access level do you need? Are there data gaps?"},
          {n:"3",title:"Analysis Plan",desc:"What type of analysis will you conduct? What visualisations will you produce? What equity disaggregations are essential?"},
          {n:"4",title:"Intervention Design",desc:"Which tier(s) of the Intervention Framework will you activate? Who will make first student contact? What script/guidelines will you use? What support options will you offer?"},
          {n:"5",title:"Measurement Framework",desc:"Define your success metrics: Reach Rate, Uptake Rate, WPA improvement, Retention. How will you disaggregate to check equity impact? When will you review and report?"},
          {n:"6",title:"Showcase",desc:"Present your plan in 3 minutes to the group. Peer feedback using: 'One strength... / One suggestion...' Facilitator provides overall synthesis."}
        ]
      },
      quiz:[
        {q:"According to the Insight-to-Intervention Pipeline, what is the MAXIMUM time from data signal to first student contact for a HIGH-risk student?",opts:["1 working day","3 working days","5 working days","10 working days"],ans:2,exp:"The pipeline target is: data signal to first student contact within 5 working days for HIGH risk. CRITICAL risk requires same-day outreach."},
        {q:"A Data Champion contacts a MODERATE-risk student and says: 'Our predictive system has identified you as being at elevated risk of academic failure.' What is the problem?",opts:["The communication should be in writing, not verbal","The language leads with alarming data rather than care, and may trigger shame or disengagement","MODERATE-risk students should not be contacted at all","The Data Champion should have sent this to the student's parents instead"],ans:1,exp:"Communication Guidelines recommend leading with care, using strengths-based language, and framing contact as a check-in. 'Our system flagged you as high risk' is deficit-framing."},
        {q:"The Equity Impact Index measures whether an intervention:",opts:["Was delivered to the same number of students in each racial group","Closed, maintained, or widened the performance gap between advantaged and disadvantaged student groups","Was approved by the Equity Office before implementation","Used only equity-neutral variables in the predictive model"],ans:1,exp:"The Equity Impact Index measures the differential impact of interventions across groups. An equity-positive intervention improves outcomes more for historically disadvantaged students."},
        {q:"From the Wits Commerce case study (2024), what was the key success factor in the 85% pass rate among the intervened HIGH/CRITICAL cohort?",opts:["The accuracy of the predictive model (AUC-ROC > 0.85)","Automated emails sent to all flagged students on the same day","Human-centred, warm, personal outreach combined with a structured 3-part support package","100% of students accepting all three support elements offered"],ans:2,exp:"'The model did not save these students. The advisor who made the call did. The model just told her who to call.' Human connection, enabled by data, was the success factor."},
        {q:"Which of the following BEST describes 'Actionable Analytics'?",opts:["Analytics using the largest available dataset for maximum accuracy","Analytics designed from the outset to lead to a specific, measurable action by a named person within a defined timeframe","Analytics using automated systems to remove human decision-making","Analytics accessible to all staff regardless of technical training"],ans:1,exp:"Actionable Analytics starts with 'What decision needs to be made, and by whom?' — ensuring every insight has a clear pathway to action."},
        {q:"For a CRITICAL risk student (ARI 76–100), which response is required under the Wits Tiered Intervention Framework?",opts:["A personal email within 5 days","An invitation to supplemental instruction the following week","Same-day personal outreach and a multi-disciplinary case conference within 48 hours","Automatic placement in an academic development track without prior student consultation"],ans:2,exp:"CRITICAL risk requires same-day personal outreach and a multi-disciplinary case conference within 48 hours — the most urgent and coordinated response level."}
      ]
    }
];
    
const REFS=[
      "Ackoff, R.L. (1989). From data to wisdom. Journal of Applied Systems Analysis, 16, 3–9.",
      "Arnold, K.E. & Pistilli, M.D. (2012). Course Signals at Purdue: Using learning analytics to increase student success. LAK '12. ACM.",
      "Balfour, R. (2013). Higher education and the public good. South African Journal of Higher Education, 27(1), 8–24.",
      "Bandura, A. (1997). Self-efficacy: The exercise of control. W.H. Freeman.",
      "Barocas, S. & Moritz, H. (2016). Big data's disparate impact. California Law Review, 104, 671–732.",
      "Bean, J. & Eaton, S.B. (2000). The psychology underlying successful retention practices. Journal of College Student Retention, 3(1), 73–89.",
      "Bienkowski, M., Feng, M. & Means, B. (2012). Enhancing teaching and learning through educational data mining and learning analytics. US Department of Education.",
      "Calzada Prado, F.J. & Marzal, M.Á. (2013). Incorporating data literacy into information literacy programs. Libri, 63(2), 123–134.",
      "Chapman, P. et al. (2000). CRISP-DM 1.0: Step-by-step data mining guide. SPSS Inc.",
      "Cohen, J. (1988). Statistical power analysis for the behavioural sciences (2nd ed.). Lawrence Erlbaum.",
      "Council on Higher Education (CHE). (2013). A proposal for undergraduate curriculum reform in South Africa. CHE, Pretoria.",
      "Council on Higher Education (CHE). (2022). Vital Stats: Public Higher Education 2020. CHE, Pretoria.",
      "Department of Higher Education and Training (DHET). (2020). Post-school education and training monitor. DHET, Pretoria.",
      "Few, S. (2012). Show me the numbers: Designing tables and graphs to enlighten (2nd ed.). Analytics Press.",
      "Floridi, L. (2014). The ethics of artificial intelligence. Oxford University Press.",
      "Kuh, G.D. et al. (2006). What matters to student success: A review of the literature. NPEC, NCES.",
      "Letseka, M. & Maile, S. (2008). High university dropout rates: A threat to South Africa's future. HSRC Policy Brief.",
      "Macfadyen, L.P. & Dawson, S. (2010). Mining LMS data to develop an 'early warning system' for educators. Computers & Education, 54(2), 588–599.",
      "Minto, B. (1987). The pyramid principle: Logic in writing and thinking. Minto International.",
      "Prinsloo, P. & Slade, S. (2017). An elephant in the learning analytics room: The obligation to act. LAK17. ACM.",
      "Redman, T.C. (2001). Data quality: The field guide. Digital Press.",
      "Rowley, J. (2007). The wisdom hierarchy: Representations of the DIKW hierarchy. Journal of Information Science, 33(2), 163–180.",
      "Scott, I., Yeld, N. & Hendry, J. (2007). A case for improving teaching and learning in South African higher education. CHE Monitor No. 6.",
      "Sclater, N. (2014). Code of practice for learning analytics. JISC.",
      "Seidman, A. (2005). College student retention: Formula for student success. Praeger.",
      "Shmueli, G. & Koppius, O.R. (2011). Predictive analytics in information systems research. MIS Quarterly, 35(3), 553–572.",
      "Siemens, G. et al. (2011). Open Learning Analytics: An integrated and modularised platform. SOLAR.",
      "Stephens, N.M. et al. (2012). Unseen disadvantage. Journal of Personality and Social Psychology, 102(6), 1178–1197.",
      "Tinto, V. (1987). Leaving college. University of Chicago Press.",
      "Tinto, V. (2012). Completing college. University of Chicago Press.",
      "Wolff, A., Kortuem, G. & Cavero, J. (2015). Towards data-literate citizens. ACM UbiComp.",
      "Wolff, A., Wermelinger, M. & Petre, M. (2016). Exploring design principles for data literacy activities. IJHCS, 95, 1–12.",
      "Yeager, D.S. & Dweck, C.S. (2012). Mindsets that promote resilience. Educational Psychologist, 47(4), 302–314."
];
    
const LAB_DATA = {
        // Unit 1 — 30 student records for data quality audit
        unit1: (()=>{
          const faculties=['Commerce','Engineering','Humanities','Science','Law'];
          const progs={Commerce:['BCom Accounting','BCom Finance','BCom Economics'],Engineering:['BSc Eng Civil','BSc Eng Mechanical','BSc Eng Electrical'],Humanities:['BA English','BA History','BA Sociology'],Science:['BSc Computer Science','BSc Maths','BSc Physics'],Law:['LLB']};
          const races=['African','Coloured','Indian','White'];
          const aids=['NSFAS','Bursary','Self-funded','Partial Aid'];
          const provinces=['Gauteng','KZN','Western Cape','Limpopo','Mpumalanga','Eastern Cape','Free State'];
          const rows=[];
          const issues={};
          for(let i=1;i<=30;i++){
            const fac=faculties[i%5];
            const prog=progs[fac][i%progs[fac].length];
            const nsc = i<=3 ? null : (i===8 ? 55 : Math.floor(20+Math.random()*22)); // nulls + out-of-range
            const attend = i===12 ? 115 : (i<=2?null: Math.floor(40+Math.random()*55));
            const wpa = i<=2 ? null : +(45+Math.random()*35).toFixed(1);
            const mfailed = i===20 ? -1 : Math.floor(Math.random()*4);
            const sid = i===15 ? '2023001' : `202300${String(i).padStart(2,'0')}`; // duplicate for #15 = #1
            rows.push({
              StudentID: sid, Faculty:fac, Programme:prog,
              Gender:i%2===0?'Female':'Male', Race:races[i%4],
              HomeProvince:i%7===0?null:provinces[i%7],
              MatricNSC:nsc, Attendance:attend, WPA:wpa,
              FinancialAid:aids[i%4], ModulesFailed:mfailed,
              LMS_Logins:i%3===0?null:Math.floor(2+Math.random()*18)
            });
          }
          return rows;
        })(),
      
        // Unit 3 — 40 student records for dashboard building
        unit3: (()=>{
          const rows=[];
          const faculties=['Commerce','Engineering','Humanities','Science'];
          const races=['African','Coloured','Indian','White'];
          const aids=['NSFAS','Self-funded','Bursary','Partial'];
          const quintiles=[1,2,3,4,5];
          for(let i=1;i<=40;i++){
            const race=races[i%4];
            const aid=aids[i%4];
            const fac=faculties[i%4];
            const quint=quintiles[i%5];
            // Simulate equity gaps
            const baseNSC = race==='African'?(18+Math.random()*10):(race==='White'?(26+Math.random()*10):(22+Math.random()*10));
            const nsc=Math.floor(baseNSC);
            const baseWPA = race==='African'?(48+Math.random()*18):(race==='White'?(65+Math.random()*18):(55+Math.random()*18));
            const wpa=+(baseWPA).toFixed(1);
            const attend=Math.floor(50+Math.random()*45);
            const lms=Math.floor(2+Math.random()*16);
            const outcome=wpa>=50?'Pass':'Fail';
            rows.push({
              StudentID:`ST${String(i).padStart(3,'0')}`,Faculty:fac,
              Gender:i%2===0?'Female':'Male',Race:race,
              SchoolQuintile:quint,FinancialAid:aid,
              MatricNSC:nsc,S1_WPA:wpa,
              S1_Attendance:attend,S1_LMS_Logins:lms,
              S1_Outcome:outcome
            });
          }
          return rows;
        })(),
      
        // Unit 4 — ARI predictions
        unit4: (()=>{
          const rows=[];
          const faculties=['Commerce','Engineering','Humanities','Science'];
          const races=['African','Coloured','Indian','White'];
          const riskFactors=['Low attendance','Missing assignments','No LMS logins','Financial stress','Low matric NSC'];
          for(let i=1;i<=25;i++){
            const race=races[i%4];
            const fac=faculties[i%4];
            const ari=Math.floor(20+Math.random()*75);
            const band=ari<31?'LOW':ari<56?'MODERATE':ari<76?'HIGH':'CRITICAL';
            const topFactor=riskFactors[i%5];
            rows.push({
              StudentID:`ARI${String(i).padStart(3,'0')}`,Faculty:fac,
              Race:race,Gender:i%2===0?'Female':'Male',
              ARI_Score:ari,RiskBand:band,
              NSC_Score:Math.floor(16+Math.random()*14),
              Attendance_Pct:Math.floor(30+Math.random()*60),
              LMS_Score:Math.floor(1+Math.random()*15),
              FinancialFlag:i%3===0?'Yes':'No',
              TopRiskFactor:topFactor
            });
          }
          return rows;
        })()
};