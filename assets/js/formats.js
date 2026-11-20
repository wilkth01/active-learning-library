/* Active Learning Library — the curated catalog.
   One source of truth: the site renders it, and the brainstorm Worker imports it
   so the prompt is built server-side from these entries, never from client text. */

export const COURSES = {
  "PHIL 350": "Ethics cases from clinical care and medical technology",
  "PHIL 352": "Business ethics and corporate power",
  "NURS 702": "Graduate nursing seminar on knowledge and evidence",
  "Any course": "Runs anywhere"
};

export const FAMILIES = [
  { id: "reveal", name: "Decide, then reveal", blurb: "Students commit to a choice with ordinary criteria. Then something they couldn’t see changes what the choice meant." },
  { id: "rule", name: "Run the rule", blurb: "Students apply a test exactly as written and find out what it misses — or carry it away as a tool." },
  { id: "sort", name: "Sort, score, build", blurb: "Students put the reading’s distinctions to work with their hands: piles, scores, cages." },
  { id: "roles", name: "Roles and verdicts", blurb: "A seat, a theory or a side to argue from, and a verdict that has to land somewhere." },
  { id: "discuss", name: "Discussion structures", blurb: "Ways to make a whole-room conversation do philosophical work." },
  { id: "oral", name: "Oral assessment", blurb: "Exams and panels where reasoning out loud is the thing being graded." },
  { id: "moves", name: "Small moves", blurb: "Five-minute techniques that open, close or turn a session." }
];

export const FORMATS = [
/* ------------------------------------------------------------ DECIDE, THEN REVEAL */
{
  id: "blind-reveal", family: "reveal", kind: "both", featured: true,
  name: "Decide Blind, Then Reveal",
  one: "Students make an ordinary decision in role, using ordinary criteria. Then a reveal shows what the decision did that nobody intended.",
  why: "Students reproduce a structural mechanism with their own hands and no bad intent. The debrief then has to locate a wrong that no individual chose, which is exactly the problem the reading is about.",
  steps: [
    ["Under 1 min", "Frame the role and stay in character. Give it a strong business or institutional goal so students do the job instead of hunting for the trick."],
    ["10–15 min", "Groups decide using only the packet’s criteria. Answer questions in role; give no hints."],
    ["3 min", "Commit before the reveal: each group’s choice and its one deciding reason go on the board in its own words."],
    ["Reveal", "Show the hidden variable. Say nothing for thirty seconds."],
    ["15–20 min", "Debrief in movements, each one step further from individual intent: your decision, the rating, the history behind it, what the model left out, who gets to decide."],
    ["Close", "Leave the hardest question open for the next session."]
  ],
  slots: ["The role and its goal", "The decision and the ordinary criteria", "The hidden variable", "Debrief movements", "The question you carry forward"],
  watch: [
    "The trick spends after one use. After the first reveal of the term, tell students the trap up front and ask them to beat it — that version teaches something new.",
    "Invented numbers illustrate a claim; they don’t prove it. Say so once.",
    "Don’t let the reveal become a verdict on the students. Most careful people make the same choice.",
    "If a group avoids the trap, show where the burden moved instead of congratulating them."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 6", title: "Project Keystone siting meeting", note: "Groups at a waste-transfer company pick one of four sites in fifteen minutes, lock in, then open the census appendix. A five-movement debrief and a mechanism map that runs Bullard’s pipeline onto Chester, PA.", play: "play/keystone/" },
    { course: "PHIL 350", when: "Obermeyer week", title: "Three Slots", note: "An analytics team fills three care-management slots from twelve patients’ claims. Half the room gets a cost brief, half a sickest-first brief. The reveal shows conditions and race, then a cost-versus-conditions chart.", play: "play/three-slots.html" },
    { course: "PHIL 352", when: "Week 8", title: "Build the Screener", note: "Triads write a four-rule hiring screener from twenty past hires and pick two of six applicants. The reveal: genders, the manager-rated label the history was built on, and the coding scores nobody used." }
  ]
},
{
  id: "live-under-rule", family: "reveal", kind: "app", featured: true,
  name: "Live Under the Rule",
  one: "A short phone simulation puts students under a rule — a quota, a score — and then they sort what was wrong with it into harm and something else.",
  why: "The simulation can’t injure anyone, so whatever students object to afterward is a wrong that doesn’t need injury. That separates harm from domination without a lecture.",
  steps: [
    ["Opening", "Post the link. Nothing leaves the phone and no names are collected."],
    ["~9 min", "Round one trains; round two runs under the rule and ends in an automatic notice with an appeal that goes nowhere."],
    ["8 min", "Debrief by show of hands, then the matching lines from the reading."],
    ["11 min", "Triads sort their complaints. Column A: wrong because someone got hurt. Column B: wrong even if nobody did."],
    ["Then", "Bring in the concept that names Column B, and a new fact: which column does each real law address?"]
  ],
  slots: ["The rule being simulated", "What the student can and cannot control", "The two columns", "The concept that names Column B", "One real law or ruling for each column"],
  watch: [
    "Keep conditions identical for everyone — same heavy items, same order — so nobody gets a harder shift.",
    "If the wifi fails, skip the simulation and open with the strongest line from the reading."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 8", title: "Making Rate", note: "Two stow shifts under a quota set from each student’s own best fifteen seconds, with Time Off Task, a restroom prompt and team lifts. Then Anderson on private government, and a European data-protection fine set against California’s warehouse-quota law.", play: "play/making-rate.html" }
  ]
},
{
  id: "split-points", family: "reveal", kind: "paper",
  name: "Split 100 Points",
  one: "Before class, students divide 100 points of responsibility among the parties to a harm. In class you show the averages and ask what splitting assumed.",
  why: "The exercise builds in a fixed pie, so every point given to one party lowers another’s. Naming that assumption is what motivates a model of shared responsibility.",
  steps: [
    ["Before class", "A short quiz: split 100 points, with a sentence for two of the parties."],
    ["4 min", "Show the class averages. Read one high and one near-zero sentence, without names."],
    ["3 min", "“What did you assume when you agreed to split 100 points?” Wait for it."],
    ["Then", "Bring in the model that drops the fixed pie."]
  ],
  slots: ["The harm", "The parties", "The model that follows"],
  watch: ["Don’t comment on the numbers until the assumption is on the table."],
  runs: [
    { course: "PHIL 352", when: "Week 7", title: "Rana Plaza, then Young", note: "Assigned at the end of Monday. Wednesday opens on the averages and the fixed-pie question, before Young’s liability and social-connection models." }
  ]
},
{
  id: "writing-reveal", family: "reveal", kind: "paper",
  name: "Essay with a Friday Reveal",
  one: "Students draft an essay in class across two sessions. On the third, a new objection or fact is released and they revise before submitting.",
  why: "The reveal tests whether a position moves in proportion to new evidence. Writing in a supervised session keeps the work the student’s own.",
  steps: [
    ["Sunday before", "A quotation bank is due: eight to twelve passages, gathered with reading history on."],
    ["Monday", "Release the case; students write."],
    ["Wednesday", "Keep writing; save a snapshot named Pre-reveal."],
    ["Friday", "Release the objection or further fact. Students revise and submit before leaving."]
  ],
  slots: ["The case", "The Friday objection or fact", "Writing tool and AI settings"],
  watch: ["The Friday release should cut against a common position without settling the case."],
  runs: [
    { course: "PHIL 350", when: "Week 8", title: "The Framework Essay", note: "Five frameworks, one predictive algorithm for discharge calls, and an objection released on Friday." },
    { course: "PHIL 350", when: "Week 15", title: "The Structural Essay", note: "One framework plus one concept from the second half on a missed endometriosis diagnosis; a further practice-level fact released Friday." }
  ]
},

/* ------------------------------------------------------------ RUN THE RULE */
{
  id: "run-the-test", family: "rule", kind: "paper", featured: true,
  name: "Run the Rule, Then Flip It",
  one: "Students apply an institution’s or an author’s own test exactly as written, see what it misses, then run it on a case where nobody would accept the result.",
  why: "Running the test mechanically shows that the failure comes from the test, not from bad judges. The flip exposes the default case the test was built around.",
  steps: [
    ["Setup", "Each group becomes the decision-maker, with the rulebook restated as numbered instructions."],
    ["8 min", "Rule on the case, one sentence per ruling. Last box: is there anything your rulings missed? Point to it."],
    ["6 min", "Report rulings and put them beside what they missed."],
    ["Reveal", "Read the actual decision-maker’s words."],
    ["10 min", "The flip: same rules, the plaintiff or case the rule was built around. Why does nobody treat this one the same way?"]
  ],
  slots: ["The rule, restated as steps", "The case", "The flip case", "The question the flip raises"],
  watch: ["Students find the original decision obviously wrong in seconds. Follow it with a steelman of the rule (see Charity First)."],
  runs: [
    { course: "PHIL 352", when: "Week 12", title: "DeGraffenreid, then the white male plaintiff", note: "Handout A runs the court’s test: sex discrimination, race discrimination, no combinations. Handout B is the flip from Crenshaw’s note 12. The question that lands: compound relative to what?" },
    { course: "PHIL 350", when: "Week 3", title: "Kant’s good-will test", note: "A twenty-minute close reading: Kant’s own defeat test run mechanically in a four-row table, then the subtraction on the board — strip out everything that can’t determine a good will and see what’s left." },
    { course: "NURS 702", when: "Session 2", title: "Mill’s methods on clinical scenarios", note: "Four scenarios with Mill’s five canons on the back; two worked in the room, two online." }
  ]
},
{
  id: "veil", family: "rule", kind: "paper",
  name: "Deal the Seats",
  one: "Groups vote on a rule from the seat each was dealt, rewrite it without knowing which seat they’ll get, then draw and test it.",
  why: "It turns the original position into a procedure students can run on rules they already know. Most groups reinvent the difference principle on their own: keep the inequality, attach a floor.",
  steps: [
    ["2 min", "One rule card and three face-down seat cards per triad."],
    ["5 min", "Eyes open: each student reads a seat and votes keep, change or scrap from that seat."],
    ["8 min", "Behind the veil: shuffle the seats face down. Write one version all three would accept without knowing their seat. Cite one page of the reading."],
    ["3 min", "Draw. Read the new rule from your seat; thumbs up or down."],
    ["12 min", "Report in three columns — scrapped, kept with conditions, kept as is — and name the principle they just reinvented."]
  ],
  slots: ["Seven rules from the course", "Three seats per rule, including people not at the table", "The reading’s page for the principle"],
  watch: [
    "A known one-in-three draw invites expected-value reasoning — Harsanyi’s veil, not Rawls’s. Ask “did anyone gamble?”",
    "Equal seat cards misrepresent real proportions. Have the answer ready.",
    "Some cards are easy wins; spend the time on the contested ones.",
    "If a triad is short, the third seat stays face down. Someone holds it whether or not they’re in the room."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 13", title: "Rawls: Rules Before Seats", note: "Seven rules from the course, including a trap card — a bank’s bonus plan isn’t the basic structure. Ends in the Veil Test card." }
  ]
},
{
  id: "doors", family: "rule", kind: "paper",
  name: "Doors and Response Cards",
  one: "Groups represent a party facing an institution, choose one of three ways to proceed, then hear the institution’s actual response to that door.",
  why: "Every door costs something. The grid of what each one keeps and loses shows that the cost comes from the structure, not the choice.",
  steps: [
    ["5 min", "Each group picks a door and writes one sentence on why it’s the best bet."],
    ["6 min", "Read the response card for each door picked; groups get one more pick."],
    ["6 min", "Build a keep / lose grid on the board from what happened."],
    ["Debrief", "Was there a door you would have won through?"]
  ],
  slots: ["The party and its situation", "Three doors", "A real response for each door", "The keep / lose columns"],
  watch: ["Read the response cards aloud. Don’t hand them out."],
  runs: [
    { course: "PHIL 352", when: "Week 12", title: "Plead the case: Moore and Payne", note: "Four triads as one plaintiff’s lawyers, three as the other’s. Then the line “But I cannot say both,” Crenshaw’s intersection drawing, and the basement." }
  ]
},
{
  id: "portable-check", family: "rule", kind: "paper",
  name: "The Portable Check",
  one: "A four-question test built one question at a time across a week, then handed out as a card students reuse on new cases.",
  why: "Students leave a unit with a tool rather than a summary, and the checks double as targeting moves in the oral assessments.",
  steps: [
    ["Across the week", "Each session earns one question on the board."],
    ["Last session", "Hand out the assembled card."],
    ["Exit ticket", "Run the check on one new case."],
    ["Later", "Point back to it as a move in briefs and panels."]
  ],
  checks: [
    ["Calculation Audit", "Scope · Currency · Horizon · Counter"],
    ["Crenshaw Check", "Baseline · Gap · Fix · Remedy"],
    ["Veil Test", "Rule or choice? · Seats · Blind vote · Worst seat"]
  ],
  slots: ["The concept", "Four questions", "A page reference for each"],
  watch: ["Each check needs a guardrail against its classic misreading: cost-benefit analysis for Mill, rule utilitarianism, “more boxes” for Crenshaw."],
  runs: [
    { course: "PHIL 352", when: "Week 12", title: "The Crenshaw Check", note: "Whose experience was the rule built on? Who has a harm it can’t see? New box, or rebuilt test? Does the remedy let the worst-off challenge the hierarchy?" },
    { course: "PHIL 352", when: "Week 13", title: "The Veil Test", note: "Rule or choice? List every seat. Would you agree blind? Does the inequality raise the worst seat, and who has to show it?" }
  ]
},

/* ------------------------------------------------------------ SORT, SCORE, BUILD */
{
  id: "card-sort", family: "sort", kind: "both", featured: true,
  name: "Sort with a “Can’t Tell” Pile",
  one: "Groups sort fact cards into labeled piles — including one for what the text doesn’t establish — or score a case on fixed dimensions, then debrief only where groups disagreed.",
  why: "Sorting makes students find a distinction the reading draws instead of being told it. The can’t-tell pile trains them to claim only what the text supports.",
  steps: [
    ["8–12 min", "Groups sort ten cards into the piles."],
    ["3 min", "A mini-lecture on the fact that settles the piles."],
    ["Debrief", "Take the hardest cards first. Then: what do the cards in each pile have in common?"]
  ],
  slots: ["Pile labels", "Ten cards with a key", "The two or three cards you expect to split groups"],
  watch: [
    "Hold the line where the text is silent: “we don’t know from this text.”",
    "Some cards bundle two acts — legal targeting, illegal claims. Students should split them."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 9", title: "Sort the Conduct", note: "Ten Purdue Pharma conduct cards from Keefe’s article: illegal for the company, legal but contested, legal and uncontested, or the article doesn’t say. The debrief finds that the law reached false statements, not the system or the owners.", play: "play/sort-the-conduct.html" },
    { course: "NURS 702", when: "Session 3", title: "Popper card sort", note: "Eight statements — nursing theories, a practice claim, one trap. Which bin, what would refute it, what move would rescue it? Debrief only the cards groups disagreed on." },
    { course: "PHIL 350", when: "Week 4", title: "Bentham’s calculus lab", note: "Groups run all seven dimensions on one drug-safety case under different framings. The disagreement lives in certainty, fecundity and extent — never in the arithmetic." }
  ]
},
{
  id: "build-a-cage", family: "sort", kind: "both",
  name: "Build-a-Cage",
  one: "Groups map a structure as a set of wires: rules or practices that each look harmless alone and together leave no way out.",
  why: "Students stop looking for a villain and look at the practice. Four test questions then check whether what they built is oppression in Frye’s sense or something else.",
  steps: [
    ["Setup", "Each group gets one case. The cage is built around a group of people, not one person."],
    ["15 min", "List the wires — a rule, practice or habit, not an attitude. For each: why it looks harmless, and what it runs into."],
    ["5 min", "Draw arrows: getting around one wire puts you in another. Label at least one double bind."],
    ["5 min", "Answer four questions for the whole cage: who maintains it, whose interests it serves, does it confine a group, is this person a member? Mark assumptions with “?”."],
    ["Report", "Include one case that tests the concept’s limit."]
  ],
  slots: ["The structural concept", "Three or four cases", "One limit case", "The test questions"],
  watch: [
    "Weak cages name attitudes (“the nurse was racist”). Ask what the practice is.",
    "Expect a student to put your own policies on a sticky note. Treat it as a good catch."
  ],
  runs: [
    { course: "PHIL 350", when: "Week 11", title: "Frye’s birdcage", note: "Four cages: a patient with limited English, a home health aide, a student parent — and men as men, the limit case." },
    { course: "PHIL 352", when: "Week 6", title: "Mechanism map", note: "Part of Project Keystone: mark up Bullard’s pipeline, map each link onto Chester, and name the link where the moral wrong happens.", play: "play/keystone/map.html" }
  ]
},
{
  id: "on-the-line", family: "sort", kind: "paper",
  name: "Place It on the Line",
  one: "A labeled continuum goes on the board. The room votes where each case falls, then argues the placements that split.",
  why: "A line forces degree where students want yes or no, and the contested placements show which feature is doing the classifying.",
  steps: [
    ["Before", "Draw the line with its labeled points; keep it covered until you need it."],
    ["Per case", "Poll, reveal, two or three minutes each."],
    ["Close", "Is there any spot on this line that’s safe, or clean?"]
  ],
  slots: ["The line’s endpoints and middle", "Four cases", "The closing question"],
  watch: ["Save the hottest case for last, and make it optional."],
  runs: [
    { course: "PHIL 350", when: "Week 12", title: "Merely racial — insensitive — racist", note: "Anderson’s three tiers, polled case by case." },
    { course: "PHIL 350", when: "Week 13", title: "Race out — race in", note: "A kidney-function equation, the Obermeyer algorithm, the pulse oximeter. Is there any spot where a tool is safe?" }
  ]
},

/* ------------------------------------------------------------ ROLES AND VERDICTS */
{
  id: "case-lab", family: "roles", kind: "paper", featured: true,
  name: "Same Questions, Different Cases",
  one: "Every group runs the same three- or four-step protocol on a different case, then reports in ninety seconds while you fill one board.",
  why: "The shared protocol makes the reports comparable, so the board shows where a theory works and where it runs out. It was the format I used most this semester.",
  steps: [
    ["Handout", "Page one: the protocol — three or four numbered questions with page references. One case page per group."],
    ["7–12 min", "Groups answer for their own case only."],
    ["~6 min", "Ninety seconds per group while you fill a grid on the board. Push once per group with one prepared question."],
    ["Debrief", "Ask which step each group argued about, or read the grid for where the cases came apart."]
  ],
  slots: ["The protocol questions", "Four cases, easiest to hardest", "One push question per case", "The board grid"],
  watch: [
    "Put your quietest group on the clearest case and your strongest on the case with no clean answer.",
    "“None found” in a cell is a finding. Don’t rescue the group.",
    "Cases built on one person — an interpreter, a patient — can slide into stereotype. Keep the push on what the institution did.",
    "Behind schedule: report out only the two clearest cases and fill the others yourself, thirty seconds each."
  ],
  runs: [
    { course: "PHIL 350", when: "Week 3", title: "The Formula of Humanity: six cases", note: "A four-step protocol from O’Neill — the real maxim; could they consent in principle; deception, coercion or neither; beyond justice — on cases from a phase I trial to a readmission model." },
    { course: "PHIL 350", when: "Week 5", title: "Virtue verdict cases", note: "Four clinical cases: the feeling or action, the mean for this agent, what Dr. B notices that Dr. A misses, and what the verdict rests on that Aristotle doesn’t settle." },
    { course: "PHIL 350", when: "Week 11", title: "Four Inquirers", note: "Kukla’s conditions for competent inquiry run on four patients. Which condition is missing; is it about the person or where they stand; what one change would supply it?" },
    { course: "PHIL 352", when: "Week 7", title: "Score your actor on Young’s parameters", note: "Half the groups score a fast-fashion retailer, half a student who buys fast fashion: power, privilege, interest, collective ability, 0–3 with evidence. Then the jobs objection." },
    { course: "NURS 702", when: "Session 7", title: "Epistemic injustice case clinic", note: "Three cases drawn from the seminar’s own discussion, eight minutes each, four clinic questions; then the proposed fixes sorted into three columns." }
  ]
},
{
  id: "framework-jigsaw", family: "roles", kind: "paper",
  name: "Framework Jigsaw: What Does It Ignore?",
  one: "Each group gets one framework and one stakeholder, applies it to a shared case, and has to say what the framework tells them to ignore.",
  why: "The ignore question separates students who use a framework as a tool from students who use it as a label. It is also the most diagnostic follow-up in an oral exam, practiced early.",
  steps: [
    ["5 min", "Groups work with a framework card and a stakeholder card."],
    ["12 min", "Report. Each ends with two sentences: what justice requires per this framework, and what it tells me to ignore. Each needs one specific fact from the reading."],
    ["Cross-examine", "The class asks every report the same question: what does your framework tell you to ignore?"]
  ],
  slots: ["The case", "Four or five frameworks", "A stakeholder card for each"],
  watch: ["When a reading is too hard to flatten into a ninety-second report, give it to the instructor, not a triad."],
  runs: [
    { course: "PHIL 352", when: "Week 9", title: "Four frameworks on the Sacklers", note: "Friedman, Mill’s Calculation Audit, Kant, Solomon and Bullard’s mechanism, each paired with a stakeholder." },
    { course: "PHIL 350", when: "Week 6", title: "“The Semester”: Maya’s family", note: "Kant, Bentham and two readings of Held each tell Maya what to do, what the framework makes visible, and what it leaves out. Her brother is held back for Friday." },
    { course: "NURS 702", when: "Session 1", title: "Carper’s patterns, assigned deliberately", note: "Patterns of knowing assigned by what each student wrote in a pre-course reflection, not at random." }
  ]
},
{
  id: "tribunal", family: "roles", kind: "paper",
  name: "Theory Tribunal: Bite or Concede",
  one: "Each group gets one theory and the counterexample against it, rules on a shared docket of cases, then bites the bullet or concedes what the theory would need.",
  why: "Reading the grid of theories against cases shows where they disagree most, which is usually where intention and effect come apart.",
  steps: [
    ["Board", "Theories as columns, docket cases as rows, empty."],
    ["8 min", "Each group states its theory in one sentence a first-year could follow, rules on every docket case (no third answer, but write down why you wanted one), and bites or concedes on the counterexample."],
    ["6 min", "Ninety seconds a group; each fills its column."],
    ["3 min", "Read the grid: where do the theories split, and who wanted a third answer?"]
  ],
  slots: ["Four theories", "Each theory’s counterexample", "Four docket cases"],
  watch: [
    "Put the strongest group on the theory with the hardest bullet.",
    "Set room norms first when the cases are charged: describe, don’t repeat."
  ],
  runs: [
    { course: "PHIL 350", when: "Week 12", title: "Anderson, “Racist Humor”", note: "Four theories of what makes a joke racist against four docket cases. Then Anderson’s three-tier continuum and the person who objects." }
  ]
},
{
  id: "on-trial", family: "roles", kind: "paper",
  name: "On Trial: Split the Room",
  one: "Two sides prepare from assigned passages and argue in short alternating turns. A judge asks only which passage and which premise, then rules.",
  why: "Students have to anchor every move in the text, and a ruling with a stated reason makes the disagreement end somewhere.",
  steps: [
    ["~10 min", "Prep with assigned passages."],
    ["~12 min", "Alternating two-minute arguments, or two openings and a moderated exchange."],
    ["Judge", "Asks only: which passage, which premise? Pushes each side with the other’s best case."],
    ["2–3 min", "A ruling, with a reason that cites a text."]
  ],
  slots: ["The motion or case", "Each side’s passages", "Who judges"],
  watch: ["Small rooms: one for, one against, one judge. You take the losing side or co-judge."],
  runs: [
    { course: "PHIL 350", when: "Week 4", title: "Um-Helat on trial", note: "Jemisin’s city against On Liberty chapter 3, then the narrator’s “don’t walk away.”" },
    { course: "PHIL 350", when: "Week 6", title: "Aristotle and Vallor vs. Held", note: "Is care a skill or a relation? Both sides answer: where is the failure, and whose is it?" },
    { course: "NURS 702", when: "Session 5", title: "“Value-laden science can still be objective”", note: "One for, one against, one judge who must cite a text." }
  ]
},
{
  id: "the-table", family: "roles", kind: "paper",
  name: "The Table",
  one: "Students argue a real case from a role drawn at random at the door, and partway through each role gets a fact that cuts against its position.",
  why: "Students can prepare the case but not a position, so the session shows how they reason when the evidence moves.",
  steps: [
    ["Before", "Everyone reads the whole packet, since nobody knows their seat."],
    ["At the door", "Draw one of four roles."],
    ["Discussion", "Argue from the role."],
    ["Midway", "Hand each role its complicating fact."],
    ["After", "A response paper built from the exercise."]
  ],
  slots: ["The case packet", "Four roles", "Four complicating facts", "The follow-up paper prompt"],
  watch: ["Pick a case that is legible in fifty minutes. Wells Fargo replaced a more sprawling case for exactly that reason."],
  runs: [
    { course: "PHIL 352", when: "Week 5", title: "Wells Fargo cross-selling", note: "The first round of the course’s three assessments: Table, then Hearing, then Board of Review." },
    { course: "PHIL 352", when: "Week 5", title: "Four Years at the Branch", note: "Dana’s four years under the sales quota: what did it make her, what would practical wisdom have said at month six, and which feature of the institution did the habituating?" }
  ]
},
{
  id: "steelman-first", family: "roles", kind: "paper",
  name: "Charity First (the Banned Word)",
  one: "A house rule bans the easy verdict word until the strongest defense — or the rule’s own failure — is on paper.",
  why: "When a reading or case does the moral work for students, they agree in thirty seconds and spend forty minutes saying nothing philosophical. Banning the word — “greed,” “intersectionality,” “intentions” — forces them to build the argument the word would have skipped.",
  steps: [
    ["1 min", "State the house rule and the banned word."],
    ["5–8 min", "Groups write the strongest defense of the party they’re about to condemn: three sentences, one specific fact."],
    ["3 min", "Three groups read out."],
    ["Then", "Critique begins, and it must answer the defenses on the board."]
  ],
  slots: ["The banned word", "The party being defended", "Sentences and facts required"],
  watch: [
    "A strawman defense defeats the purpose. Ask “is that really the strongest?” once.",
    "Collect the written defenses when a later session — a hot seat, a panel — needs them."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 9", title: "The Sacklers’ strongest defense", note: "Nobody says “greed” until the defense is on paper. Six groups, three sentences each." },
    { course: "PHIL 352", when: "Week 12", title: "Steelman the court", note: "Nobody says “intersectionality” until the court’s test has failed on the board. Then each triad writes the strongest objection to Crenshaw, using one fact from the week." },
    { course: "PHIL 350", when: "Week 3", title: "Kant exit question", note: "One sentence on the good will that may not use “intentions” or “meaning well.”" }
  ]
},

/* ------------------------------------------------------------ DISCUSSION */
{
  id: "socratic-circles", family: "discuss", kind: "paper",
  name: "Socratic Circles",
  one: "A small inner circle discusses. A larger outer circle analyzes how the discussion is going, reports out, then the circles switch.",
  why: "The inner circle gets room to speak, and being watched encourages considerate behavior. The outer circle learns to see a discussion as a discussion instead of waiting to add an opinion. It’s the most successful discussion exercise I’ve run, and my smaller ethics courses now use it as standard.",
  steps: [
    ["Setup", "Chairs in two rings, a smaller one inside a larger one."],
    ["15–20 min", "Inner circle: a guided discussion of the day’s topic."],
    ["Same time", "The outer circle analyzes the discussion itself, not the content. Is it flowing? Is someone dominating? Debate or agreement? What would you repeat or avoid when it’s your turn?"],
    ["5 min", "The outer circle reports its analysis aloud while the inner circle listens."],
    ["Repeat", "Switch circles and run again."]
  ],
  slots: ["Discussion question or text", "Observation prompts for the outer circle", "Minutes per round", "Number of rounds"],
  watch: [
    "Outer-circle reports drift into who was right. Point them back to the process questions.",
    "Pairs well with the keyword roles: the outer circle can tally which moves the inner circle made and which it never touched."
  ],
  runs: [
    { course: "Any course", when: "Standard practice", title: "Socratic circles, as I run them", note: "The name comes from a favorite undergraduate professor." },
    { course: "PHIL 352", when: "Week 14", title: "Board of Review rehearsal fishbowl", note: "The instructor defends a specimen brief in character while three volunteers question for seven minutes. Everyone else tallies who asked, in three words, on first or second turn." }
  ]
},
{
  id: "keyword-roles", family: "discuss", kind: "paper",
  name: "Keyword Discussion Roles",
  one: "Eight named moves students choose from for each post or contribution, until by the end of the term they have used all eight.",
  why: "Expressing an opinion isn’t the only way to contribute. Named moves show quieter students how to enter, and give everyone a vocabulary for what a good contribution does to an argument.",
  roles: [
    ["Excavator", "Surfaces an unstated assumption the argument depends on."],
    ["Contrarian", "Disagrees and gives a reason, testing whether the argument holds."],
    ["Complexifier", "Draws a new distinction, or shows that a binary or a shared term hides more than one thing."],
    ["Clarifier", "Asks what a claim means, or restates it to check understanding before anyone responds."],
    ["Experimenter", "Introduces a hypothetical or thought experiment that puts pressure on the claim."],
    ["Implicator", "Spells out what follows if the claim is true, including consequences the speaker may not welcome."],
    ["Connector", "Links contributions from different speakers; agrees only by adding a new reason."],
    ["Chronicler", "Summarizes the last few moves and names where the group agrees and disagrees."]
  ],
  steps: [
    ["Day 1", "Post the eight roles with one-line definitions alongside the participation policy."],
    ["Online", "Students name the role at the top of each post."],
    ["In class", "Students reach for the roles when they contribute; name the move back to them when they make it."],
    ["End of term", "Each student should have used all eight at least once."]
  ],
  slots: ["Which roles count for this course", "Posts per week", "Whether in-class contributions are logged by role"],
  watch: [
    "Five of the eight roles pressure an argument and only Connector builds on it. Consider swapping in a Builder: agree, and add a reason.",
    "Connector and Chronicler overlap. If students blur them, merge the two and use the slot for Builder.",
    "Excavator, Contrarian and Complexifier are my own; the other five are adapted from a common conversational-moves chart."
  ],
  runs: [
    { course: "Any course", when: "Standing practice", title: "Keyword discussions", note: "Used for online posts and as a guide for in-class contributions." }
  ]
},
{
  id: "field-first", family: "discuss", kind: "paper",
  name: "Build the Field First",
  one: "Before the author’s answer, students generate their own explanations or defenses cold. The author then enters as one competitor in a field they built.",
  why: "Students read with a question instead of hunting for a thesis, and an argument to the best explanation gets tested the right way: against better explanations.",
  steps: [
    ["5–9 min", "Pose the puzzle; collect answers on the board without ranking them."],
    ["Then", "Introduce the author’s answer as one more entry on the board."],
    ["Debrief", "Which explanation does the evidence favor, and what would decide it?"]
  ],
  slots: ["The puzzle", "The author’s answer", "What evidence would decide between explanations"],
  watch: ["Name the genre: a pattern argument is beaten by a better explanation, not by attacking one premise."],
  runs: [
    { course: "PHIL 352", when: "Week 2", title: "Why does American capitalism look like this?", note: "Students list explanations cold — the frontier, immigration, scale, ideology — then Desmond’s plantation-inheritance thesis enters as one competitor." },
    { course: "PHIL 350", when: "Week 12", title: "“It was just a joke” = ___", note: "Ninety seconds of silent writing fills the board with defenses — intent, harm, belief, pretense, uptake — before any theory appears." }
  ]
},

/* ------------------------------------------------------------ ORAL ASSESSMENT */
{
  id: "hearing", family: "oral", kind: "paper",
  name: "The Hearing",
  one: "An individual oral exam: draw an unseen case and a stakeholder, eight minutes to prepare, then three fixed probes in eight minutes.",
  why: "The three probes test generating a position, answering the best objection to it, and calibrating when a new fact arrives. The gate — every claim has to touch a specific fact — separates reasoning about this case from fluent talk about cases of its kind.",
  steps: [
    ["Draw", "A case and a perspective from a face-down set, in front of the instructor or a proctor."],
    ["8 min", "Prep. No devices; one handwritten page of the student’s own notes."],
    ["~2:30", "Probe 1, the Position: what does justice require here, from which framework? Follow-up: what does it tell you to ignore?"],
    ["~2:30", "Probe 2, the Best Objection: state the strongest one, then answer it."],
    ["~2:30", "Probe 3, the New Fact: a sealed fact that cuts against the position. Does your answer change?"],
    ["4 min", "Record the rubric before the next student."]
  ],
  slots: ["A bank of ten cases, each with sealed new facts", "Rubric dimensions", "How students practice"],
  watch: [
    "The new-fact variants are the real build cost.",
    "A practice demo on a course case you won’t use burns no exam case.",
    "Check that course material doesn’t hand students a sealed fact or a buried tension in advance."
  ],
  runs: [
    { course: "PHIL 352", when: "Week 10", title: "The Hearing", note: "The second of the course’s three assessments." },
    { course: "PHIL 352", when: "Week 9", title: "Briefing and practice", note: "A live demo on the Purdue case with the class scoring silently, then peer-run practice triads: examinee, examiner, observer." }
  ]
},
{
  id: "board-review", family: "oral", kind: "paper",
  name: "Board of Review",
  one: "Panels of four: each student defends a written brief in the hot seat and questions their panel-mates — and the questioning is graded too.",
  why: "Building the strongest objection moves across the table. The question opens the exchange; what you do with the answer is the assessment.",
  steps: [
    ["Week before", "Briefs of 1,200–1,500 words go to panel-mates."],
    ["Panel", "Hot seat, then questioning. Floor rule: everyone once before anyone twice. The instructor questions too."],
    ["Rubrics", "Hot seat: determinacy, framework fidelity, responsiveness, appropriate revision. Questioning: preparation, targeting, construction, follow-through."],
    ["Rehearsal", "Calibrate eight sample questions against a specimen brief, watch a fishbowl, then triads where the author says “That’s my answer. Now what?” after every answer."]
  ],
  slots: ["The case packet", "Panel size", "Rubric wording"],
  watch: [
    "Follow-through is the dimension most likely to come back weak. Rehearse the second turn.",
    "Don’t let anyone practice out loud on a real panel-mate’s brief."
  ],
  runs: [
    { course: "PHIL 352", when: "Weeks 14–15", title: "Board of Review", note: "The third assessment, on the East Palestine derailment." },
    { course: "PHIL 352", when: "Week 12", title: "Put the court in the hot seat", note: "A low-stakes preview: the instructor plays the DeGraffenreid court, answering the class’s steelman cards, and each triad sends one questioner." },
    { course: "NURS 702", when: "Session 7", title: "Framing-statement hot seat", note: "Three minutes, no notes: position, two assumptions, the limitation you accept. One question from a peer, then one from the instructor." }
  ]
},

/* ------------------------------------------------------------ SMALL MOVES */
{
  id: "exit-split", family: "moves", kind: "paper",
  name: "Exit Ticket Split",
  one: "A one-sentence exit ticket that forces a choice, sorted that night into two piles, so the next class opens on the split.",
  why: "The sort tells you who has the session’s main idea and who has its tempting misreading, and it gives the next class a real opening question instead of a recap.",
  steps: [
    ["Last 3 min", "One sentence with a forced choice, or a blank that only one reading fills well."],
    ["That night", "Sort into two piles: the reading you want and the tempting one."],
    ["Next class, 3–5 min", "Read one anonymized ticket from each pile and ask the one question that discriminates between them."]
  ],
  slots: ["The fill-in sentence", "The two piles you expect", "The discriminating question"],
  watch: ["If more than a handful land in the wrong pile, spend the next opening on it before moving on."],
  runs: [
    { course: "PHIL 352", when: "Week 12", title: "“The court’s test failed these plaintiffs because ___”", note: "Sorted into intent answers and mechanism answers. The next class opens: if the judge had been a committed feminist applying the same test, would the plaintiffs have won?" },
    { course: "PHIL 352", when: "Week 8", title: "“Column A or Column B?”", note: "Which is the real wrong of the warehouse quota: harm or domination? One sentence, one piece of evidence." }
  ]
},
{
  id: "board-spine", family: "moves", kind: "paper",
  name: "The Board as Spine",
  one: "An opening list or two empty columns go on the board early, stay up all session, and get pointed back to at planned moments.",
  why: "Students’ own words become the evidence the session argues from. A photograph of the board can open the next class.",
  steps: [
    ["Opening", "Ask a question whose answers are claims students already hold. Write them verbatim; don’t comment or correct."],
    ["Planned callbacks", "Point back to the list two or three times, each time naming what the new material shows about it."],
    ["Close", "“That board is the course.” Photograph it before erasing."]
  ],
  slots: ["The opening question", "Two or three callback moments", "Column headings, if using columns"],
  watch: ["If answers are thin, reframe immediately with a different door into the same question."],
  runs: [
    { course: "NURS 702", when: "Session 1", title: "“Something you were taught was evidence-based that you have quietly stopped believing”", note: "Two answers each from the room, pointed back to three times across the evening." },
    { course: "PHIL 352", when: "Week 6", title: "“Did anyone intend it?” / “Did it happen?”", note: "Two empty columns before the siting meeting, filled during the debrief, left up and photographed for Friday." }
  ]
},
{
  id: "predict-reveal", family: "moves", kind: "paper",
  name: "Vote, Then Reveal",
  one: "A show-of-hands vote on a factual or legal question, the count left in the corner of the board, then the answer.",
  why: "A committed prediction makes the answer land, and a count left in the corner lets you return to it after the activity has changed minds.",
  steps: [
    ["1 min", "Pose the question; take hands; write the count in the corner."],
    ["Reveal", "Give the answer with its source."],
    ["Turn", "Ask why the answer differs from the room’s guess, or what it means for the case."]
  ],
  slots: ["The question", "The answer and its source", "The follow-up"],
  watch: ["Use true / false / can’t tell from the record when the honest answer is the third one."],
  runs: [
    { course: "PHIL 352", when: "Week 12", title: "“Do they have a case?”", note: "Five Black women sue General Motors. Nearly everyone says yes; the count stays up while the court’s test fails them." },
    { course: "PHIL 350", when: "Week 5", title: "The two doctors", note: "Which one do you want treating your mother? Nearly everyone picks Dr. B. “Now state the rule Dr. B is following.”" },
    { course: "PHIL 350", when: "Week 11", title: "Is deferring a failure of autonomy?", note: "A 1–5 vote, then Hardwig as Kukla quotes him, then a re-vote. Ask someone who moved what changed." }
  ]
},
{
  id: "reflection-intros", family: "moves", kind: "paper",
  name: "Introductions from Their Own Writing",
  one: "Introduce each student by reading one sentence from their pre-course reflection aloud, then hand it back: “Say more about that.”",
  why: "In the first half hour everyone sees their written words read closely and accurately, which sets every later expectation about written work — including AI use.",
  steps: [
    ["Before class", "Pick one sentence from each reflection."],
    ["~6 min each", "“This is [name], [setting, years]. In your reflection you wrote [sentence]. Say more about that.” Ask a real follow-up, then invite others in."],
    ["End of round", "Name the themes in thirty seconds."]
  ],
  slots: ["The pre-course prompt", "Class size (best under about twelve)"],
  watch: ["Introduce a student who didn’t post the same way, from what you know, so no difference in handling sets the tone."],
  runs: [
    { course: "NURS 702", when: "Session 1", title: "Introductions keyed to reflections", note: "A small seminar; two of the exchanges turned into real conversation." }
  ]
}
];

export const byId = Object.fromEntries(FORMATS.map((f) => [f.id, f]));
