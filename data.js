// campuses + streets with prototype sensitivity values (higher => more flood-prone)
const campuses = [
  {
    id: "dlsu",
    name: "De La Salle University (DLSU - Taft)",
    coords: [14.5647, 120.9939],
    historical: [
      { year: 2020, rainMM: 200, floodCM: 80 }, // Typhoon Ulysses
      { year: 2018, rainMM: 150, floodCM: 60 }, // Typhoon Rosita
      { year: 2012, rainMM: 180, floodCM: 70 }  // Habagat
    ],
    streets: [
      { name: "Taft Avenue", sensitivity: 1.5, path: [[14.563, 120.994], [14.564, 120.994], [14.565, 120.994], [14.566, 120.994], [14.567, 120.994]] }, // N-S along Taft Ave east boundary of DLSU
      { name: "Agno Street", sensitivity: 1.4, path: [[14.5655, 120.992], [14.5655, 120.9925], [14.5655, 120.993]] }, // E-W through campus, west of Taft
      { name: "Castro Street", sensitivity: 1.3, path: [[14.563, 120.993], [14.564, 120.993], [14.565, 120.993], [14.566, 120.993]] }, // N-S parallel inside campus
      { name: "Fidel Reyes St", sensitivity: 1.35, path: [[14.563, 120.9925], [14.5635, 120.993], [14.564, 120.9935], [14.5645, 120.994], [14.565, 120.9945]] }, // Diagonal south
      { name: "P. Ocampo St", sensitivity: 1.45, path: [[14.563, 120.9928], [14.563, 120.9933], [14.563, 120.9938], [14.563, 120.9943], [14.563, 120.9948]] } // E-W south boundary
    ]
  },
  {
    id: "ust",
    name: "University of Santo Tomas (UST - España)",
    coords: [14.6098, 120.9894],
    historical: [
      { year: 2020, rainMM: 220, floodCM: 100 }, // Severe flooding near Pasig tributaries
      { year: 2019, rainMM: 140, floodCM: 50 },
      { year: 2013, rainMM: 190, floodCM: 85 }
    ],
    streets: [
      { name: "España Boulevard", sensitivity: 1.9, path: [[14.6095, 120.9872], [14.6095, 120.9882], [14.6095, 120.9892], [14.6095, 120.9902], [14.6095, 120.9912]] },   // E-W north along España Blvd
      { name: "Dapitan St", sensitivity: 1.55, path: [[14.6082, 120.9888], [14.6092, 120.9888], [14.6102, 120.9888], [14.6112, 120.9888], [14.6122, 120.9888]] }, // N-S east boundary
      { name: "A.H. Lacson Ave", sensitivity: 1.45, path: [[14.6082, 120.9898], [14.6082, 120.9908], [14.6082, 120.9918], [14.6082, 120.9928]] }, // E-W south
      { name: "P. Noval St", sensitivity: 1.35, path: [[14.6092, 120.9878], [14.6102, 120.9878], [14.6112, 120.9878], [14.6122, 120.9878]] }, // N-S parallel west of Dapitan
      { name: "Laong Laan Rd", sensitivity: 1.35, path: [[14.6072, 120.9888], [14.6072, 120.9898], [14.6072, 120.9908], [14.6072, 120.9918]] } // E-W west boundary
    ]
  },
  {
    id: "mapua_manila",
    name: "Mapúa (Intramuros, Manila)",
    coords: [14.5900, 120.9775],
    historical: [
      { year: 2020, rainMM: 210, floodCM: 90 }, // Pasig overflow
      { year: 2017, rainMM: 160, floodCM: 65 },
      { year: 2011, rainMM: 175, floodCM: 75 }
    ],
    streets: [
      { name: "Muralla St.", sensitivity: 1.5, path: [[14.589, 120.977], [14.590, 120.977], [14.591, 120.977], [14.592, 120.977]] }, // N-S west wall of Intramuros
      { name: "Gen. Luna St.", sensitivity: 1.4, path: [[14.590, 120.978], [14.591, 120.978], [14.592, 120.978], [14.593, 120.978]] }, // N-S central
      { name: "Victoria St.", sensitivity: 1.3, path: [[14.589, 120.976], [14.589, 120.977], [14.589, 120.978]] }, // E-W south
      { name: "Anda St.", sensitivity: 1.5, path: [[14.592, 120.979], [14.593, 120.979], [14.594, 120.979]] }, // N-S north
      { name: "Real St.", sensitivity: 1.35, path: [[14.589, 120.976], [14.589, 120.977], [14.589, 120.978]] } // E-W parallel to Victoria
    ]
  },
  {
    id: "mapua_makati",
    name: "Mapúa (Makati, Pablo Ocampo)",
    coords: [14.5660, 121.0150],
    historical: [
      { year: 2020, rainMM: 180, floodCM: 70 },
      { year: 2018, rainMM: 130, floodCM: 45 },
      { year: 2014, rainMM: 155, floodCM: 55 }
    ],
    streets: [
      { name: "Pablo Ocampo St.", sensitivity: 1.45, path: [[14.566, 121.014], [14.566, 121.015], [14.566, 121.016], [14.566, 121.017], [14.566, 121.018]] }, // E-W along Pablo Ocampo
      { name: "Chino Roces Ave", sensitivity: 1.15, path: [[14.567, 121.015], [14.567, 121.016], [14.567, 121.017], [14.567, 121.018]] }, // E-W parallel north
      { name: "Ayala Ave Ext", sensitivity: 1.1, path: [[14.565, 121.015], [14.566, 121.015], [14.567, 121.015], [14.568, 121.015]] }, // N-S south
      { name: "Filmore St", sensitivity: 1.1, path: [[14.567, 121.016], [14.567, 121.017]] }, // Short E-W
      { name: "Zobel Roxas St", sensitivity: 1.15, path: [[14.564, 121.014], [14.564, 121.015]] } // E-W parallel south
    ]
  },
  {
    id: "upd",
    name: "UP Diliman (Quezon City)",
    coords: [14.6538, 121.0682],
    historical: [
      { year: 2020, rainMM: 150, floodCM: 40 }, // Less Pasig impact
      { year: 2019, rainMM: 90, floodCM: 20 },
      { year: 2012, rainMM: 200, floodCM: 60 }
    ],
    streets: [
      { name: "University Ave", sensitivity: 1.0, path: [[14.653, 121.067], [14.653, 121.068], [14.653, 121.069]] }, // E-W main entrance
      { name: "C.P. Garcia Ave", sensitivity: 1.2, path: [[14.654, 121.069], [14.655, 121.069], [14.656, 121.069]] }, // N-S east
      { name: "Katipunan Ave", sensitivity: 1.4, path: [[14.652, 121.067], [14.653, 121.067]] }, // N-S west boundary
      { name: "Roces Ave", sensitivity: 1.05, path: [[14.655, 121.068], [14.655, 121.069]] }, // E-W north
      { name: "Commonwealth Ave", sensitivity: 1.0, path: [[14.651, 121.070], [14.651, 121.071]] } // E-W south
    ]
  }
];

// configuration for demo scaling
const SIM_CONFIG = {
  // multiply totalRainfall * sensitivity * HEIGHT_SCALE -> cm
  HEIGHT_SCALE: 0.7,   // chosen so flood heights fall into realistic demo cm range
  MAX_HEIGHT_CM: 150   // cap for display
};
