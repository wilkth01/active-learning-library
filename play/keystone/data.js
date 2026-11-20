// All content is fictional. Tessera Environmental Services, Delmont County and the
// four neighborhoods below are invented for PHIL 352.

window.COMPANY = {
  name: "Tessera Environmental Services",
  project: "Project Keystone",
  facility: "Soil remediation & waste transfer facility",
  capacity: "1,200 tons/day",
  acres: 12,
  jobs: 38,
  revenue: "$6.4M/yr at capacity",
  delayCostPerMonth: 180000, // revenue lost for each month the facility isn't operating
  horizonYears: 10,
};

window.SITES = [
  {
    id: "riverside",
    letter: "A",
    name: "Riverside Flats",
    place: "City of Delmont, 3rd Ward",
    color: "#e0703a",
    tagline: "Existing industrial corridor on the Delmont River, with rail and interstate access.",
    headline: [
      ["Land cost", "$38,000 / acre"],
      ["Zoning", "I-2 Heavy Industrial (by-right)"],
      ["Est. permitting", "4 months"],
      ["Opposition risk (consultant)", "Low"],
    ],
    map: { river: true, rail: true, highway: true, homes: "dense", industry: 2, landmarks: ["Mt. Olive AME Church", "Frederick Douglass Elementary"] },
    cost: { land: 38000, prep: 1200000, infra: 200000, permitMonths: 4, challengeProb: 0.10, challengeMonths: 8, trucking: 900000 },
    dossier: [
      { title: "Parcel & land", rows: [
        ["Parcel", "Former Delmont Paperboard mill yard, 14.2 acres (12 needed)"],
        ["Asking price", "$38,000 / acre — seller motivated; the city's redevelopment authority holds a tax lien"],
        ["Site condition", "Brownfield. Phase I shows petroleum staining; remediation est. $1.2M, partly offset by state brownfield credits"],
        ["Median home value (1-mile radius)", "$71,000"],
      ]},
      { title: "Zoning & permitting", rows: [
        ["Current zoning", "I-2 Heavy Industrial — waste processing is a permitted use; no hearing required"],
        ["State permit", "Standard major-facility permit, ~4 months. Two similar permits were issued in this corridor since 2015"],
        ["Precedent", "Existing industrial use nearby simplifies the environmental review; regulators are familiar with the corridor"],
      ]},
      { title: "Logistics", rows: [
        ["Road access", "0.6 mi to the Delmont Expressway interchange"],
        ["Rail", "Active Delmont Valley Railroad spur runs along the parcel's north edge"],
        ["Trucking cost", "$0.9M / yr (lowest of the four sites)"],
      ]},
      { title: "Community & political landscape", rows: [
        ["Organized groups", "Riverside Neighbors United (formed 2024), volunteer-run, no legal counsel. Mt. Olive AME and Bethel Baptist are the largest civic institutions"],
        ["Hearing history", "The 2017 and 2021 facility permits drew 6 and 11 public comments; no appeals were filed"],
        ["Local officials", "Ward Councilmember D. Pruitt publicly supports “any project that brings jobs to the 3rd Ward”"],
        ["Voter turnout, last municipal election", "19%"],
        ["Unemployment", "14.2% (county: 4.6%)"],
      ]},
      { title: "Consultant's note", note: "Riverside Flats is the path of least regulatory and community resistance. Residents have historically not mobilized against industrial uses, and local leadership frames new facilities as economic development. We rate opposition risk as LOW. A modest community benefits package (a job-training pledge, a park donation) is recommended to secure the councilmember's continued support." },
      { title: "Historical land use", rows: [
        ["1937 federal lending survey", "Area graded “D — Hazardous”; the survey notes “infiltration of undesirable elements”"],
        ["1960s", "Delmont Expressway connector built through the ward; approx. 300 homes cleared"],
        ["1970s to now", "The paper mill, a scrap yard and a sewage treatment expansion were sited in the corridor"],
      ]},
    ],
  },
  {
    id: "hollins",
    letter: "B",
    name: "Hollins Township",
    place: "Hollins Township (unincorporated farmland, west county)",
    color: "#5f8f4e",
    tagline: "Cheapest land in the county, on open farmland far from the interstate.",
    headline: [
      ["Land cost", "$22,000 / acre"],
      ["Zoning", "A-1 Agricultural (rezoning required)"],
      ["Est. permitting", "16 months"],
      ["Opposition risk (consultant)", "High"],
    ],
    map: { river: false, rail: false, highway: false, homes: "sparse", industry: 0, landmarks: ["Hollins Grange Hall", "Township Building"] },
    cost: { land: 22000, prep: 400000, infra: 3100000, permitMonths: 16, challengeProb: 0.60, challengeMonths: 18, trucking: 1800000 },
    dossier: [
      { title: "Parcel & land", rows: [
        ["Parcel", "Kessler family farm, 40 acres (seller will subdivide 12)"],
        ["Asking price", "$22,000 / acre — lowest in the county"],
        ["Site condition", "Greenfield; minimal site prep ($0.4M)"],
        ["Median home value (1-mile radius)", "$164,000"],
      ]},
      { title: "Zoning & permitting", rows: [
        ["Current zoning", "A-1 Agricultural. The township must rezone or grant a conditional use, which requires a public hearing and a vote by the Board of Supervisors"],
        ["State permit", "Major-facility permit, plus a farmland-preservation review, ~16 months in total"],
        ["Township control", "Hollins has its own zoning board and planning commission, independent of the county"],
      ]},
      { title: "Logistics", rows: [
        ["Road access", "14 miles of two-lane state road to the Delmont Expressway; the state DOT would require $3.1M in widening and turn lanes"],
        ["Rail", "None"],
        ["Trucking cost", "$1.8M / yr (highest)"],
      ]},
      { title: "Community & political landscape", rows: [
        ["Organized groups", "Hollins Township Farm Bureau (412 members); Friends of Hollins Creek; the Grange"],
        ["Hearing history", "A 2019 landfill proposal drew 400+ residents to the hearing. The supervisors denied it 3–0, and the applicant withdrew after a zoning appeal"],
        ["Local officials", "All three supervisors campaigned on “protecting rural character”"],
        ["Voter turnout, last municipal election", "58%"],
        ["Legal resources", "The Farm Bureau retains a land-use attorney; residents raised $60K for the 2019 appeal"],
      ]},
      { title: "Consultant's note", note: "The land is cheap, but everything else is expensive. This community has defeated a comparable project in the past five years and controls its own zoning. Expect a contested hearing and a likely appeal. We rate opposition risk as HIGH." },
    ],
  },
  {
    id: "westbrook",
    letter: "C",
    name: "Westbrook Commons",
    place: "Borough of Westbrook",
    color: "#3f7cac",
    tagline: "A half-vacant light-industrial park with good highway access.",
    headline: [
      ["Land cost", "$95,000 / acre"],
      ["Zoning", "I-1 Light Industrial (special exception)"],
      ["Est. permitting", "8 months"],
      ["Opposition risk (consultant)", "Moderate"],
    ],
    map: { river: false, rail: false, highway: true, homes: "medium", industry: 1, landmarks: ["Centro Comunitario Westbrook", "Westbrook Middle School"] },
    cost: { land: 95000, prep: 600000, infra: 300000, permitMonths: 8, challengeProb: 0.35, challengeMonths: 12, trucking: 1000000 },
    dossier: [
      { title: "Parcel & land", rows: [
        ["Parcel", "Lot 7, Westbrook Commerce Park, 12.5 acres, vacant since 2011"],
        ["Asking price", "$95,000 / acre"],
        ["Site condition", "Graded pad; some fill; site prep est. $0.6M"],
        ["Median home value (1-mile radius)", "$118,000"],
      ]},
      { title: "Zoning & permitting", rows: [
        ["Current zoning", "I-1 Light Industrial. Waste transfer requires a special exception from the Borough Zoning Hearing Board"],
        ["State permit", "Major-facility permit, ~8 months including the zoning hearing"],
      ]},
      { title: "Logistics", rows: [
        ["Road access", "1.2 mi to State Route 12; 4 mi to the Delmont Expressway"],
        ["Rail", "None"],
        ["Trucking cost", "$1.0M / yr"],
      ]},
      { title: "Community & political landscape", rows: [
        ["Organized groups", "Centro Comunitario Westbrook; Westbrook Tenants' Association. A university environmental law clinic has represented residents before"],
        ["Hearing history", "A 2022 asphalt plant application drew 90 speakers (interpretation was requested) and was approved with conditions after a 5-month delay"],
        ["Local officials", "The Borough Council is split 4–3 on new industrial uses"],
        ["Voter turnout, last municipal election", "27%"],
      ]},
      { title: "Consultant's note", note: "A workable middle option. Expect a contested zoning hearing and possible legal involvement by the university clinic. Bilingual outreach would be needed. We rate opposition risk as MODERATE." },
    ],
  },
  {
    id: "crestview",
    letter: "D",
    name: "Crestview Heights",
    place: "Crestview Township (east county suburbs)",
    color: "#8a6bb0",
    tagline: "A stalled office-park parcel next to the county's fastest-growing suburb.",
    headline: [
      ["Land cost", "$410,000 / acre"],
      ["Zoning", "OC Office-Commercial (rezoning required)"],
      ["Est. permitting", "18 months"],
      ["Opposition risk (consultant)", "Very high"],
    ],
    map: { river: false, rail: false, highway: true, homes: "suburban", industry: 0, landmarks: ["Crestview Country Club", "Crestview Commons Mall"] },
    cost: { land: 410000, prep: 500000, infra: 400000, permitMonths: 18, challengeProb: 0.85, challengeMonths: 24, trucking: 1100000 },
    dossier: [
      { title: "Parcel & land", rows: [
        ["Parcel", "Crestview Corporate Center Phase II, 12 acres, never built"],
        ["Asking price", "$410,000 / acre"],
        ["Site condition", "Graded, utilities stubbed; site prep est. $0.5M"],
        ["Median home value (1-mile radius)", "$486,000"],
      ]},
      { title: "Zoning & permitting", rows: [
        ["Current zoning", "OC Office-Commercial. Requires rezoning by the Township Commissioners, plus a hearing"],
        ["State permit", "Major-facility permit, ~18 months including rezoning"],
      ]},
      { title: "Logistics", rows: [
        ["Road access", "2 mi to the Delmont Expressway via Crestview Pkwy (the township restricts truck routes)"],
        ["Rail", "None"],
        ["Trucking cost", "$1.1M / yr"],
      ]},
      { title: "Community & political landscape", rows: [
        ["Organized groups", "Crestview Civic Association (HOA federation, 3,100 households) keeps a standing legal fund"],
        ["Hearing history", "In 2020 the Civic Association sued and blocked a 120-ft cell tower; in 2023 it defeated an affordable-housing overlay"],
        ["Local officials", "Two commissioners sit on the Civic Association board"],
        ["Voter turnout, last municipal election", "71%"],
      ]},
      { title: "Consultant's note", note: "Not recommended. Expect immediate, well-funded, lawyered opposition, a likely denial, and reputational exposure in regional media. We rate opposition risk as VERY HIGH." },
    ],
  },
];

window.DRIVERS = [
  "Land & construction cost",
  "Speed to permit",
  "Transportation / logistics",
  "Risk of community opposition",
  "Risk of litigation",
  "Existing industrial zoning",
  "Jobs for the local community",
  "Environmental impact on residents",
  "Company reputation",
];

window.ROLES = [
  ["CFO", "Protect the budget. You own the 10-year cost model."],
  ["VP, Operations", "Can trucks get in and out? Can we be running by next fall?"],
  ["Director, Government Affairs", "What will it take to get this permitted, and who could stop us?"],
  ["Community Relations Lead", "What will the neighbors say, and what will we tell them?"],
  ["General Counsel (if 5)", "What is our litigation exposure?"],
];

window.tenYearCost = function (c, overrides = {}) {
  const k = { ...c, ...overrides };
  const C = window.COMPANY;
  const land = k.land * C.acres;
  const capital = land + k.prep + k.infra;
  const operating = k.trucking * C.horizonYears;
  const expectedDelay = k.permitMonths + k.challengeProb * k.challengeMonths;
  const delay = expectedDelay * C.delayCostPerMonth;
  return { land, capital, operating, expectedDelay, delay, total: capital + operating + delay };
};

// Census appendix. In the classroom server version this lives only on the server until
// the instructor presses Reveal; in this single-device version it ships with the page.
window.REVEAL = {
  riverside: { black: 71, hispanic: 9, white: 17, income: 31400, poverty: 34, owner: 38, facilities: 3, asthma: 212, turnout: 19 },
  hollins:   { black: 1,  hispanic: 2, white: 95, income: 34800, poverty: 22, owner: 84, facilities: 0, asthma: 61,  turnout: 58 },
  westbrook: { black: 14, hispanic: 52, white: 29, income: 44100, poverty: 21, owner: 47, facilities: 1, asthma: 118, turnout: 27 },
  crestview: { black: 4,  hispanic: 4, white: 84, income: 128500, poverty: 3, owner: 91, facilities: 0, asthma: 38,  turnout: 71 },
};
window.COUNTY = { black: 11, hispanic: 7, white: 77, income: 71200, poverty: 10, owner: 69, asthma: 74, turnout: 49 };
