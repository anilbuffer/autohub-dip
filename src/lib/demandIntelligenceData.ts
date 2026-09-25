export interface TopModelDemand {
  id: string;
  name: string;
  fullName: string;
  make: string;
  segment: 'SUV' | 'Compact' | 'Sedan/Wagon' | 'Hybrid';
  fuel: string;
  demandCount: number;
  dealersCount: number;
  turnDays: number;
  avgMarginNzd: number;
  color: string;
}

export interface SupplyGapItem {
  id: string;
  model: string;
  make: string;
  segment: 'SUV' | 'Compact' | 'Sedan/Wagon' | 'Hybrid';
  badge: string;
  image: string;
  demandUnits: number;
  currentStockUnits: number;
  coveragePct: number;
  avgDaysToSell: number;
  avgDealerMarginNzd: number;
  avgDealerMarginJpy: number;
  recommendation: 'Source more' | 'Balanced' | 'Oversupplied';
  immediateSeller: boolean;
  unmetGap: number;
}

export interface MatchedDealerInfo {
  dealerId: number;
  name: string;
  region: string;
  matchScore: number;
  wishlistCriteria: string;
  targetBudgetNzd: number;
  lastActive: string;
  avatarBg: string;
}

export interface AuctionMatchVehicle {
  id: string;
  model: string;
  year: number;
  badge: string;
  km: number;
  grade: string;
  interiorGrade: string;
  auctionHouse: string;
  lotNumber: string;
  auctionDate: string;
  timeLeft: string;
  fobPriceNzd: number;
  fobPriceJpy: number;
  estLandedNzd: number;
  image: string;
  matchedDealersCount: number;
  matchedDealers: MatchedDealerInfo[];
}

export interface RegionDemand {
  region: string;
  units: number;
  pct: number;
  activeDealers: number;
  topSegment: string;
  segments: {
    hybrid: number;
    suv: number;
    compact: number;
    sedan: number;
  };
}

export interface SparklinePoint {
  val: number;
}

export interface TrendModel {
  name: string;
  pctChange: number;
  direction: 'up' | 'down';
  sparkline: number[];
  driver: string;
  driverJp: string;
  segment: string;
}

// Top 10 Most Wanted Models
export const TOP_WANTED_MODELS: TopModelDemand[] = [
  {
    id: 'aqua',
    name: 'Aqua',
    fullName: 'Toyota Aqua',
    make: 'Toyota',
    segment: 'Compact',
    fuel: 'Hybrid',
    demandCount: 184,
    dealersCount: 68,
    turnDays: 12,
    avgMarginNzd: 4000,
    color: '#0284c7'
  },
  {
    id: 'chr',
    name: 'C-HR',
    fullName: 'Toyota C-HR',
    make: 'Toyota',
    segment: 'SUV',
    fuel: 'Hybrid',
    demandCount: 162,
    dealersCount: 61,
    turnDays: 14,
    avgMarginNzd: 4100,
    color: '#B30D12'
  },
  {
    id: 'prius',
    name: 'Prius',
    fullName: 'Toyota Prius',
    make: 'Toyota',
    segment: 'Sedan/Wagon',
    fuel: 'Hybrid',
    demandCount: 148,
    dealersCount: 54,
    turnDays: 22,
    avgMarginNzd: 3400,
    color: '#0d9488'
  },
  {
    id: 'vezel',
    name: 'Vezel',
    fullName: 'Honda Vezel',
    make: 'Honda',
    segment: 'SUV',
    fuel: 'Hybrid',
    demandCount: 139,
    dealersCount: 49,
    turnDays: 15,
    avgMarginNzd: 3850,
    color: '#6366f1'
  },
  {
    id: 'fit',
    name: 'Fit Hybrid',
    fullName: 'Honda Fit Hybrid',
    make: 'Honda',
    segment: 'Compact',
    fuel: 'Hybrid',
    demandCount: 125,
    dealersCount: 44,
    turnDays: 21,
    avgMarginNzd: 3200,
    color: '#8b5cf6'
  },
  {
    id: 'cx5',
    name: 'CX-5',
    fullName: 'Mazda CX-5',
    make: 'Mazda',
    segment: 'SUV',
    fuel: 'Petrol/Diesel',
    demandCount: 112,
    dealersCount: 38,
    turnDays: 19,
    avgMarginNzd: 3600,
    color: '#d97706'
  },
  {
    id: 'note',
    name: 'Note e-Power',
    fullName: 'Nissan Note e-Power',
    make: 'Nissan',
    segment: 'Compact',
    fuel: 'Hybrid',
    demandCount: 98,
    dealersCount: 35,
    turnDays: 18,
    avgMarginNzd: 3100,
    color: '#0891b2'
  },
  {
    id: 'fielder',
    name: 'Corolla Fielder',
    fullName: 'Toyota Corolla Fielder',
    make: 'Toyota',
    segment: 'Sedan/Wagon',
    fuel: 'Hybrid',
    demandCount: 86,
    dealersCount: 31,
    turnDays: 31,
    avgMarginNzd: 2450,
    color: '#475569'
  },
  {
    id: 'swift',
    name: 'Swift',
    fullName: 'Suzuki Swift',
    make: 'Suzuki',
    segment: 'Compact',
    fuel: 'Petrol',
    demandCount: 79,
    dealersCount: 28,
    turnDays: 25,
    avgMarginNzd: 2700,
    color: '#ec4899'
  },
  {
    id: 'axela',
    name: 'Axela',
    fullName: 'Mazda Axela',
    make: 'Mazda',
    segment: 'Sedan/Wagon',
    fuel: 'Petrol',
    demandCount: 65,
    dealersCount: 24,
    turnDays: 39,
    avgMarginNzd: 2100,
    color: '#64748b'
  }
];

// 12-Week Demand Trend for Top 5 Models
export const WEEKS_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];

export const TREND_TOP_5 = [
  {
    id: 'aqua',
    name: 'Toyota Aqua',
    color: '#0284c7',
    values: [120, 126, 134, 142, 148, 155, 160, 166, 172, 175, 180, 184]
  },
  {
    id: 'chr',
    name: 'Toyota C-HR',
    color: '#B30D12',
    values: [88, 94, 102, 110, 118, 125, 134, 140, 148, 153, 158, 162]
  },
  {
    id: 'prius',
    name: 'Toyota Prius',
    color: '#0d9488',
    values: [130, 132, 135, 138, 140, 142, 144, 145, 146, 147, 147, 148]
  },
  {
    id: 'vezel',
    name: 'Honda Vezel',
    color: '#6366f1',
    values: [62, 68, 72, 80, 89, 97, 105, 114, 122, 128, 134, 139]
  },
  {
    id: 'cx5',
    name: 'Mazda CX-5',
    color: '#d97706',
    values: [75, 78, 82, 86, 89, 93, 98, 101, 105, 108, 110, 112]
  }
];

// Rising and Cooling Models
export const RISING_MODELS: TrendModel[] = [
  {
    name: 'Honda Vezel',
    pctChange: 40,
    direction: 'up',
    sparkline: [25, 29, 34, 42, 50, 62, 75, 88, 100],
    driver: 'Search surge +40% this month; prime suburban family demand',
    driverJp: '今月検索数+40%急増。郊外ファミリー層の需要が極めて旺盛',
    segment: 'Hybrid SUV'
  },
  {
    name: 'Nissan Note e-Power',
    pctChange: 22,
    direction: 'up',
    sparkline: [38, 42, 45, 52, 60, 66, 74, 82, 94],
    driver: 'Urban rideshare & commuter fuel-efficiency preference',
    driverJp: '都市部通勤およびライドシェア需要による燃費重視の引き合い',
    segment: 'Compact Hybrid'
  },
  {
    name: 'Mazda CX-5',
    pctChange: 15,
    direction: 'up',
    sparkline: [52, 55, 58, 63, 69, 75, 81, 87, 95],
    driver: 'High winter AWD interest across Waikato and Canterbury',
    driverJp: 'ワイカトおよびカンタベリー地域でのAWD仕様への関心増加',
    segment: 'Mid SUV'
  }
];

export const COOLING_MODELS: TrendModel[] = [
  {
    name: 'Mazda Axela',
    pctChange: -18,
    direction: 'down',
    sparkline: [98, 92, 85, 78, 70, 64, 56, 48, 40],
    driver: 'Yard inventory aging; dealer demand pivoting to hybrid compacts',
    driverJp: '店頭在庫の長期化。ディーラー需要がハイブリッド小型車へ完全移行',
    segment: 'Sedan/Hatch'
  },
  {
    name: 'Toyota Corolla Fielder',
    pctChange: -9,
    direction: 'down',
    sparkline: [88, 86, 84, 80, 76, 74, 71, 68, 62],
    driver: 'Ample local yard inventory in Waikato and Bay of Plenty',
    driverJp: 'ワイカトおよびベイオブプレンティでの既存在庫充足による軟化',
    segment: 'Hybrid Wagon'
  },
  {
    name: 'Toyota Noah / Voxy',
    pctChange: -6,
    direction: 'down',
    sparkline: [80, 78, 76, 73, 71, 69, 68, 66, 64],
    driver: 'Seasonal lull in commercial 8-seater van demand',
    driverJp: '商用8人乗りミニバンの季節的需要端境期',
    segment: 'Minivan'
  }
];

// Supply vs Demand Gap Table (Primary Table)
export const SUPPLY_DEMAND_GAP: SupplyGapItem[] = [
  {
    id: 'chr',
    model: 'Toyota C-HR',
    make: 'Toyota',
    segment: 'SUV',
    badge: '1.8L G LED Hybrid',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
    demandUnits: 162,
    currentStockUnits: 57,
    coveragePct: 35,
    avgDaysToSell: 14,
    avgDealerMarginNzd: 4100,
    avgDealerMarginJpy: 374084,
    recommendation: 'Source more',
    immediateSeller: true,
    unmetGap: 105
  },
  {
    id: 'vezel',
    model: 'Honda Vezel',
    make: 'Honda',
    segment: 'SUV',
    badge: '1.5L e:HEV / Hybrid Z',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    demandUnits: 139,
    currentStockUnits: 42,
    coveragePct: 30,
    avgDaysToSell: 15,
    avgDealerMarginNzd: 3850,
    avgDealerMarginJpy: 351274,
    recommendation: 'Source more',
    immediateSeller: true,
    unmetGap: 97
  },
  {
    id: 'aqua',
    model: 'Toyota Aqua',
    make: 'Toyota',
    segment: 'Compact',
    badge: '1.5L S / G Package',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
    demandUnits: 184,
    currentStockUnits: 88,
    coveragePct: 48,
    avgDaysToSell: 12,
    avgDealerMarginNzd: 4000,
    avgDealerMarginJpy: 364960,
    recommendation: 'Source more',
    immediateSeller: true,
    unmetGap: 96
  },
  {
    id: 'cx5',
    model: 'Mazda CX-5',
    make: 'Mazda',
    segment: 'SUV',
    badge: '2.5L / 2.2D L-Package AWD',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    demandUnits: 112,
    currentStockUnits: 45,
    coveragePct: 40,
    avgDaysToSell: 19,
    avgDealerMarginNzd: 3600,
    avgDealerMarginJpy: 328464,
    recommendation: 'Source more',
    immediateSeller: true,
    unmetGap: 67
  },
  {
    id: 'note',
    model: 'Nissan Note',
    make: 'Nissan',
    segment: 'Compact',
    badge: '1.2L e-POWER X / Medalist',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
    demandUnits: 98,
    currentStockUnits: 34,
    coveragePct: 35,
    avgDaysToSell: 18,
    avgDealerMarginNzd: 3100,
    avgDealerMarginJpy: 282844,
    recommendation: 'Source more',
    immediateSeller: true,
    unmetGap: 64
  },
  {
    id: 'prius',
    model: 'Toyota Prius',
    make: 'Toyota',
    segment: 'Sedan/Wagon',
    badge: '1.8L S Touring / A Premium',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    demandUnits: 148,
    currentStockUnits: 102,
    coveragePct: 69,
    avgDaysToSell: 22,
    avgDealerMarginNzd: 3400,
    avgDealerMarginJpy: 310216,
    recommendation: 'Balanced',
    immediateSeller: false,
    unmetGap: 46
  },
  {
    id: 'fit',
    model: 'Honda Fit Hybrid',
    make: 'Honda',
    segment: 'Compact',
    badge: '1.5L e:HEV Home / Ness',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    demandUnits: 125,
    currentStockUnits: 94,
    coveragePct: 75,
    avgDaysToSell: 21,
    avgDealerMarginNzd: 3200,
    avgDealerMarginJpy: 291968,
    recommendation: 'Balanced',
    immediateSeller: false,
    unmetGap: 31
  },
  {
    id: 'swift',
    model: 'Suzuki Swift',
    make: 'Suzuki',
    segment: 'Compact',
    badge: '1.2L DualJet / Hybrid RS',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    demandUnits: 79,
    currentStockUnits: 62,
    coveragePct: 78,
    avgDaysToSell: 25,
    avgDealerMarginNzd: 2700,
    avgDealerMarginJpy: 246348,
    recommendation: 'Balanced',
    immediateSeller: false,
    unmetGap: 17
  },
  {
    id: 'fielder',
    model: 'Toyota Corolla Fielder',
    make: 'Toyota',
    segment: 'Sedan/Wagon',
    badge: '1.5L Hybrid G Edition',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    demandUnits: 86,
    currentStockUnits: 92,
    coveragePct: 107,
    avgDaysToSell: 31,
    avgDealerMarginNzd: 2450,
    avgDealerMarginJpy: 223538,
    recommendation: 'Balanced',
    immediateSeller: false,
    unmetGap: -6
  },
  {
    id: 'axela',
    model: 'Mazda Axela',
    make: 'Mazda',
    segment: 'Sedan/Wagon',
    badge: '20S Proactive Touring',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    demandUnits: 65,
    currentStockUnits: 88,
    coveragePct: 135,
    avgDaysToSell: 39,
    avgDealerMarginNzd: 2100,
    avgDealerMarginJpy: 191604,
    recommendation: 'Oversupplied',
    immediateSeller: false,
    unmetGap: -23
  }
];

// Upcoming Auction Vehicles: Dealer Match & Notify
export const UPCOMING_AUCTION_MATCHES: AuctionMatchVehicle[] = [
  {
    id: 'auc-1',
    model: 'Toyota C-HR G LED Hybrid',
    year: 2020,
    badge: '2WD · Sensing · Two-Tone',
    km: 48200,
    grade: '4.5',
    interiorGrade: 'A',
    auctionHouse: 'USS Tokyo',
    lotNumber: '48201',
    auctionDate: 'Tomorrow, 11:20 AM JST',
    timeLeft: '03h 15m',
    fobPriceNzd: 18400,
    fobPriceJpy: 1680000,
    estLandedNzd: 22350,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 14,
    matchedDealers: [
      {
        dealerId: 1,
        name: 'Auckland Auto Group',
        region: 'Auckland',
        matchScore: 98,
        wishlistCriteria: 'Toyota C-HR 2019+, <55k km, Hybrid, Black roof preferred',
        targetBudgetNzd: 23500,
        lastActive: '12m ago',
        avatarBg: 'bg-blue-600'
      },
      {
        dealerId: 2,
        name: 'Hamilton Motors',
        region: 'Waikato',
        matchScore: 94,
        wishlistCriteria: 'Compact SUV Hybrid, Grade 4.5+, Target retail under $28k',
        targetBudgetNzd: 22800,
        lastActive: '35m ago',
        avatarBg: 'bg-emerald-600'
      },
      {
        dealerId: 4,
        name: 'North Shore Hybrid Centre',
        region: 'Auckland',
        matchScore: 92,
        wishlistCriteria: 'Grade 4.5 C-HR or Vezel, <60,000 km, Pearl White',
        targetBudgetNzd: 24000,
        lastActive: '1h ago',
        avatarBg: 'bg-purple-600'
      },
      {
        dealerId: 5,
        name: 'Wellington City Direct',
        region: 'Wellington',
        matchScore: 89,
        wishlistCriteria: 'Fuel efficient hybrid SUV, max budget $23,000 landed',
        targetBudgetNzd: 23000,
        lastActive: '2h ago',
        avatarBg: 'bg-amber-600'
      },
      {
        dealerId: 3,
        name: 'Christchurch Cars',
        region: 'Canterbury',
        matchScore: 86,
        wishlistCriteria: 'Toyota Hybrid 2018+, Grade 4.0+, retail margin $3.5k+',
        targetBudgetNzd: 22000,
        lastActive: '4h ago',
        avatarBg: 'bg-slate-700'
      }
    ]
  },
  {
    id: 'auc-2',
    model: 'Honda Vezel Hybrid Z Sensing',
    year: 2019,
    badge: 'e:HEV Tech · Honda Sensing',
    km: 52100,
    grade: '4.5',
    interiorGrade: 'B',
    auctionHouse: 'USS Yokohama',
    lotNumber: '29114',
    auctionDate: 'Tomorrow, 01:45 PM JST',
    timeLeft: '05h 40m',
    fobPriceNzd: 16800,
    fobPriceJpy: 1530000,
    estLandedNzd: 20600,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 12,
    matchedDealers: [
      {
        dealerId: 2,
        name: 'Hamilton Motors',
        region: 'Waikato',
        matchScore: 97,
        wishlistCriteria: 'Honda Vezel Hybrid 2018+, <60k km, Sensing Package',
        targetBudgetNzd: 21500,
        lastActive: '35m ago',
        avatarBg: 'bg-emerald-600'
      },
      {
        dealerId: 1,
        name: 'Auckland Auto Group',
        region: 'Auckland',
        matchScore: 93,
        wishlistCriteria: 'Honda / Toyota SUV, high retail turnover < 20 days',
        targetBudgetNzd: 21000,
        lastActive: '12m ago',
        avatarBg: 'bg-blue-600'
      },
      {
        dealerId: 6,
        name: 'Tauranga Car Hub',
        region: 'Bay of Plenty',
        matchScore: 90,
        wishlistCriteria: 'Vezel Hybrid, Grade 4.0+, under $21,000 landed',
        targetBudgetNzd: 20800,
        lastActive: '55m ago',
        avatarBg: 'bg-indigo-600'
      }
    ]
  },
  {
    id: 'auc-3',
    model: 'Toyota Aqua S Hybrid',
    year: 2020,
    badge: '1.5L · Safety Sense · Smart Key',
    km: 44000,
    grade: '4.5',
    interiorGrade: 'A',
    auctionHouse: 'CAA Chubu',
    lotNumber: '61830',
    auctionDate: 'Tomorrow, 03:00 PM JST',
    timeLeft: '07h 00m',
    fobPriceNzd: 14200,
    fobPriceJpy: 1295000,
    estLandedNzd: 17750,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 18,
    matchedDealers: [
      {
        dealerId: 1,
        name: 'Auckland Auto Group',
        region: 'Auckland',
        matchScore: 99,
        wishlistCriteria: 'Toyota Aqua 2019-2021, Grade 4.5, Pearl/Silver, <50k km',
        targetBudgetNzd: 18500,
        lastActive: '12m ago',
        avatarBg: 'bg-blue-600'
      },
      {
        dealerId: 3,
        name: 'Christchurch Cars',
        region: 'Canterbury',
        matchScore: 95,
        wishlistCriteria: 'High volume Aqua batch order, margin target $3,500',
        targetBudgetNzd: 18000,
        lastActive: '4h ago',
        avatarBg: 'bg-slate-700'
      },
      {
        dealerId: 7,
        name: 'Dunedin Metro Autos',
        region: 'Otago',
        matchScore: 91,
        wishlistCriteria: 'Aqua Hybrid with Safety Sense, Low km reliable inventory',
        targetBudgetNzd: 18200,
        lastActive: '1d ago',
        avatarBg: 'bg-teal-600'
      }
    ]
  },
  {
    id: 'auc-4',
    model: 'Mazda CX-5 25S L-Package AWD',
    year: 2019,
    badge: 'AWD · Leather · Sunroof · Bose',
    km: 59000,
    grade: '4.0',
    interiorGrade: 'B',
    auctionHouse: 'HAA Kobe',
    lotNumber: '10492',
    auctionDate: 'In 2 days, 10:30 AM JST',
    timeLeft: '1d 02h',
    fobPriceNzd: 19500,
    fobPriceJpy: 1780000,
    estLandedNzd: 23800,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 9,
    matchedDealers: [
      {
        dealerId: 3,
        name: 'Christchurch Cars',
        region: 'Canterbury',
        matchScore: 94,
        wishlistCriteria: 'Mazda CX-5 AWD, Leather interior, Grade 4.0+, retail $29k',
        targetBudgetNzd: 24500,
        lastActive: '4h ago',
        avatarBg: 'bg-slate-700'
      },
      {
        dealerId: 2,
        name: 'Hamilton Motors',
        region: 'Waikato',
        matchScore: 89,
        wishlistCriteria: 'Mid SUV AWD, SkyActiv Petrol, premium package',
        targetBudgetNzd: 24000,
        lastActive: '35m ago',
        avatarBg: 'bg-emerald-600'
      }
    ]
  },
  {
    id: 'auc-5',
    model: 'Nissan Note e-POWER Medalist',
    year: 2020,
    badge: 'Series Hybrid · Surround View',
    km: 39500,
    grade: '4.5',
    interiorGrade: 'B',
    auctionHouse: 'USS Nagoya',
    lotNumber: '33841',
    auctionDate: 'In 2 days, 02:15 PM JST',
    timeLeft: '1d 06h',
    fobPriceNzd: 12900,
    fobPriceJpy: 1180000,
    estLandedNzd: 16100,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 11,
    matchedDealers: [
      {
        dealerId: 1,
        name: 'Auckland Auto Group',
        region: 'Auckland',
        matchScore: 96,
        wishlistCriteria: 'Nissan Note e-Power 2019+, Medalist trim, <45k km',
        targetBudgetNzd: 16800,
        lastActive: '12m ago',
        avatarBg: 'bg-blue-600'
      },
      {
        dealerId: 5,
        name: 'Wellington City Direct',
        region: 'Wellington',
        matchScore: 91,
        wishlistCriteria: 'Sub-compact electric feel commuter, budget $16,500',
        targetBudgetNzd: 16500,
        lastActive: '2h ago',
        avatarBg: 'bg-amber-600'
      }
    ]
  },
  {
    id: 'auc-6',
    model: 'Lexus NX300h F-Sport AWD',
    year: 2019,
    badge: 'Luxury Hybrid · Mark Levinson',
    km: 42100,
    grade: '4.5',
    interiorGrade: 'A',
    auctionHouse: 'USS Tokyo',
    lotNumber: '91204',
    auctionDate: 'Tomorrow, 04:45 PM JST',
    timeLeft: '08h 45m',
    fobPriceNzd: 34500,
    fobPriceJpy: 3150000,
    estLandedNzd: 41200,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    matchedDealersCount: 7,
    matchedDealers: [
      {
        dealerId: 1,
        name: 'Auckland Auto Group',
        region: 'Auckland',
        matchScore: 97,
        wishlistCriteria: 'Lexus NX300h F-Sport, <50k km, Grade 4.5, Target margin $5k+',
        targetBudgetNzd: 42500,
        lastActive: '12m ago',
        avatarBg: 'bg-blue-600'
      },
      {
        dealerId: 4,
        name: 'North Shore Hybrid Centre',
        region: 'Auckland',
        matchScore: 93,
        wishlistCriteria: 'Premium Japanese luxury SUV, suburban Takapuna market',
        targetBudgetNzd: 43000,
        lastActive: '1h ago',
        avatarBg: 'bg-purple-600'
      }
    ]
  }
];

// Demand by NZ Region
export const DEMAND_BY_REGION: RegionDemand[] = [
  {
    region: 'Auckland',
    units: 520,
    pct: 46,
    activeDealers: 68,
    topSegment: 'Hybrid SUV (48%)',
    segments: { hybrid: 52, suv: 28, compact: 12, sedan: 8 }
  },
  {
    region: 'Waikato',
    units: 215,
    pct: 19,
    activeDealers: 31,
    topSegment: 'Compact Hybrid (45%)',
    segments: { hybrid: 45, suv: 35, compact: 12, sedan: 8 }
  },
  {
    region: 'Wellington',
    units: 168,
    pct: 15,
    activeDealers: 22,
    topSegment: 'Hybrid Compact (48%)',
    segments: { hybrid: 48, suv: 24, compact: 18, sedan: 10 }
  },
  {
    region: 'Canterbury',
    units: 145,
    pct: 13,
    activeDealers: 14,
    topSegment: 'AWD Mid SUV (42%)',
    segments: { hybrid: 38, suv: 42, compact: 12, sedan: 8 }
  },
  {
    region: 'Otago',
    units: 72,
    pct: 7,
    activeDealers: 7,
    topSegment: 'AWD SUV & Wagons (55%)',
    segments: { hybrid: 25, suv: 55, compact: 10, sedan: 10 }
  }
];

// AI Weekly Brief Text
export const AI_WEEKLY_BRIEF = {
  en: {
    title: 'AI Weekly Brief for AutoHub Sourcing',
    subtitle: 'Generated from 4,860 dealer search queries, 318 active wish lists, and NZ retail sales demand telemetry.',
    badge: 'AutoHub DIP Autonomous Sourcing Intelligence',
    confidenceText: 'Data confidence: High',
    timestamp: 'Today at 07:00 JST / 11:00 NZST (Pre-Auction USS Tokyo Dispatch)',
    body: 'Demand for hybrid SUVs is rising sharply among NZ dealers. Vezel searches are up 40% this month and C-HR remains the most-requested model. Current AutoHub stock covers only 35% of C-HR demand. Sourcing an additional 60–80 C-HR and Vezel units for the next two auctions is recommended.',
    targets: [
      { model: 'Toyota C-HR', recommendation: '+40–50 units', priority: 'Critical', house: 'USS Tokyo / Yokohama' },
      { model: 'Honda Vezel', recommendation: '+25–35 units', priority: 'High', house: 'USS Tokyo / Nagoya' },
      { model: 'Toyota Aqua', recommendation: '+30–40 units', priority: 'Sustained', house: 'CAA Chubu / HAA' }
    ]
  },
  jp: {
    title: 'AutoHub仕入れ向けAI週次ブリーフ',
    subtitle: 'NZディーラーの4,860件の検索データ、318件の希望リスト、およびNZ国内販売速度から自動生成された調達推奨レポート。',
    badge: 'AutoHub DIP 自律調達インテリジェンス',
    confidenceText: 'データ信頼度: 高',
    timestamp: '本日 07:00 JST / 11:00 NZST 更新（USS東京オークション直前ブリーフィング）',
    body: 'NZディーラー間においてハイブリッドSUVの需要が急増しています。今月ヴェゼルの検索数は40%増加し、C-HRは依然として最も要望の多いモデルです。現在のAutoHubの在庫はC-HR需要の35%しかカバーできていません。次回2回のオークションに向けて、C-HRおよびヴェゼルをさらに60〜80台仕入れることを強く推奨します。',
    targets: [
      { model: 'トヨタ C-HR', recommendation: '+40〜50台 追加仕入れ', priority: '最重要', house: 'USS東京 / 横浜' },
      { model: 'ホンダ ヴェゼル', recommendation: '+25〜35台 追加仕入れ', priority: '高優先', house: 'USS東京 / 名古屋' },
      { model: 'トヨタ アクア', recommendation: '+30〜40台 継続確保', priority: '高回転', house: 'CAA中部 / HAA神戸' }
    ]
  }
};

// ==========================================
// 1. DEMAND SIGNALS DATA & TYPES
// ==========================================
export interface IngestedDealerActivity {
  id: string;
  timestamp: string;
  dealerId: number;
  dealerName: string;
  region: string;
  type: 'wishlist' | 'search_spike' | 'filter_drop' | 'repeat_bid';
  modelTarget: string;
  rawQueryOrCriteria: string;
  urgency: 'high' | 'medium' | 'normal';
  targetBudgetNzd: number;
  marginTargetNzd: number;
  convertedToSignalId: string;
}

export interface SynthesizedDemandSignal {
  id: string;
  model: string;
  make: string;
  segment: 'SUV' | 'Compact' | 'Sedan/Wagon' | 'Hybrid';
  badge: string;
  fuel: string;
  signalScore: number; // 0-100
  momentum: 'Surging (+40%)' | 'Accelerating (+25%)' | 'Steady (+8%)' | 'Cooling (-12%)';
  momentumDirection: 'up' | 'down' | 'steady';
  
  // Signal Sources Breakdown
  wishlistCount: number;
  searchQueriesCount: number;
  savedAlertsCount: number;
  activeDealerCount: number;
  
  // Synthesized specifications desired by dealers
  yearRange: string;
  maxMileageKm: number;
  gradePreference: string;
  avgTargetBudgetNzd: number;
  avgExpectedMarginNzd: number;
  topRequestingRegion: string;
  topRequestingDealers: string[];
  
  // Status
  supplyStatus: 'Severe Deficit' | 'Moderate Gap' | 'Covered' | 'Oversupplied';
  unmetDemandUnits: number;
}

// Ingested Real-Time Dealer Activities (Wishlists & Search queries)
export const INGESTED_DEALER_ACTIVITIES: IngestedDealerActivity[] = [
  {
    id: 'act-101',
    timestamp: '4 mins ago',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    region: 'Auckland',
    type: 'wishlist',
    modelTarget: 'Toyota C-HR Hybrid',
    rawQueryOrCriteria: 'Toyota C-HR 2019+, Grade 4.5+, <55k km, Black roof / Pearl White, max $23,500 landed',
    urgency: 'high',
    targetBudgetNzd: 23500,
    marginTargetNzd: 4200,
    convertedToSignalId: 'sig-chr'
  },
  {
    id: 'act-102',
    timestamp: '11 mins ago',
    dealerId: 2,
    dealerName: 'Hamilton Motors',
    region: 'Waikato',
    type: 'search_spike',
    modelTarget: 'Honda Vezel e:HEV',
    rawQueryOrCriteria: 'Honda Vezel Hybrid Sensing 2019-2022 <60,000km Hamilton delivery',
    urgency: 'high',
    targetBudgetNzd: 21500,
    marginTargetNzd: 3800,
    convertedToSignalId: 'sig-vezel'
  },
  {
    id: 'act-103',
    timestamp: '19 mins ago',
    dealerId: 3,
    dealerName: 'Christchurch Cars',
    region: 'Canterbury',
    type: 'wishlist',
    modelTarget: 'Toyota Aqua S / G',
    rawQueryOrCriteria: 'Aqua Hybrid 2019-2021, Grade 4.5, <50k km, 5-unit batch order, target margin $3.5k',
    urgency: 'high',
    targetBudgetNzd: 18000,
    marginTargetNzd: 3500,
    convertedToSignalId: 'sig-aqua'
  },
  {
    id: 'act-104',
    timestamp: '28 mins ago',
    dealerId: 4,
    dealerName: 'North Shore Hybrid Centre',
    region: 'Auckland',
    type: 'search_spike',
    modelTarget: 'Lexus NX300h F-Sport',
    rawQueryOrCriteria: 'Lexus NX300h AWD Sunroof Leather Takapuna retail <$45,000',
    urgency: 'medium',
    targetBudgetNzd: 42500,
    marginTargetNzd: 5200,
    convertedToSignalId: 'sig-nx300h'
  },
  {
    id: 'act-105',
    timestamp: '35 mins ago',
    dealerId: 5,
    dealerName: 'Wellington City Direct',
    region: 'Wellington',
    type: 'filter_drop',
    modelTarget: 'Nissan Note e-Power',
    rawQueryOrCriteria: 'Nissan Note e-Power Medalist <45k km under $16,500 (0 results found in yard stock)',
    urgency: 'high',
    targetBudgetNzd: 16500,
    marginTargetNzd: 3100,
    convertedToSignalId: 'sig-note'
  },
  {
    id: 'act-106',
    timestamp: '42 mins ago',
    dealerId: 3,
    dealerName: 'Christchurch Cars',
    region: 'Canterbury',
    type: 'wishlist',
    modelTarget: 'Mazda CX-5 AWD',
    rawQueryOrCriteria: 'Mazda CX-5 25S L-Package AWD, Leather interior, Grade 4.0+, retail $29k',
    urgency: 'high',
    targetBudgetNzd: 24500,
    marginTargetNzd: 3900,
    convertedToSignalId: 'sig-cx5'
  },
  {
    id: 'act-107',
    timestamp: '58 mins ago',
    dealerId: 6,
    dealerName: 'Tauranga Car Hub',
    region: 'Bay of Plenty',
    type: 'search_spike',
    modelTarget: 'Honda Vezel Hybrid',
    rawQueryOrCriteria: 'Vezel Hybrid e:HEV Grade 4.5 under $21,000 landed',
    urgency: 'medium',
    targetBudgetNzd: 20800,
    marginTargetNzd: 3600,
    convertedToSignalId: 'sig-vezel'
  }
];

// Synthesized Demand Signals (Aggregation of 4,860 searches + 318 wish lists)
export const SYNTHESIZED_DEMAND_SIGNALS: SynthesizedDemandSignal[] = [
  {
    id: 'sig-chr',
    model: 'Toyota C-HR',
    make: 'Toyota',
    segment: 'SUV',
    badge: '1.8L G LED Hybrid',
    fuel: 'Hybrid',
    signalScore: 98,
    momentum: 'Surging (+40%)',
    momentumDirection: 'up',
    wishlistCount: 42,
    searchQueriesCount: 680,
    savedAlertsCount: 38,
    activeDealerCount: 61,
    yearRange: '2019 – 2022',
    maxMileageKm: 55000,
    gradePreference: 'Grade 4.5+ / Int A-B',
    avgTargetBudgetNzd: 23200,
    avgExpectedMarginNzd: 4100,
    topRequestingRegion: 'Auckland & Waikato',
    topRequestingDealers: ['Auckland Auto Group', 'Hamilton Motors', 'North Shore Hybrid Centre'],
    supplyStatus: 'Severe Deficit',
    unmetDemandUnits: 105
  },
  {
    id: 'sig-vezel',
    model: 'Honda Vezel',
    make: 'Honda',
    segment: 'SUV',
    badge: '1.5L e:HEV / Hybrid Z',
    fuel: 'Hybrid',
    signalScore: 95,
    momentum: 'Surging (+40%)',
    momentumDirection: 'up',
    wishlistCount: 36,
    searchQueriesCount: 540,
    savedAlertsCount: 31,
    activeDealerCount: 49,
    yearRange: '2019 – 2022',
    maxMileageKm: 60000,
    gradePreference: 'Grade 4.5 (Honda Sensing)',
    avgTargetBudgetNzd: 21200,
    avgExpectedMarginNzd: 3850,
    topRequestingRegion: 'Auckland & Bay of Plenty',
    topRequestingDealers: ['Hamilton Motors', 'Auckland Auto Group', 'Tauranga Car Hub'],
    supplyStatus: 'Severe Deficit',
    unmetDemandUnits: 97
  },
  {
    id: 'sig-aqua',
    model: 'Toyota Aqua',
    make: 'Toyota',
    segment: 'Compact',
    badge: '1.5L S / G Package',
    fuel: 'Hybrid',
    signalScore: 96,
    momentum: 'Accelerating (+25%)',
    momentumDirection: 'up',
    wishlistCount: 58,
    searchQueriesCount: 890,
    savedAlertsCount: 45,
    activeDealerCount: 68,
    yearRange: '2019 – 2021',
    maxMileageKm: 50000,
    gradePreference: 'Grade 4.5 (Safety Sense)',
    avgTargetBudgetNzd: 18200,
    avgExpectedMarginNzd: 4000,
    topRequestingRegion: 'Canterbury & Auckland',
    topRequestingDealers: ['Christchurch Cars', 'Auckland Auto Group', 'Dunedin Metro Autos'],
    supplyStatus: 'Severe Deficit',
    unmetDemandUnits: 96
  },
  {
    id: 'sig-cx5',
    model: 'Mazda CX-5',
    make: 'Mazda',
    segment: 'SUV',
    badge: '2.5L / 2.2D L-Package AWD',
    fuel: 'Petrol/Diesel',
    signalScore: 89,
    momentum: 'Accelerating (+25%)',
    momentumDirection: 'up',
    wishlistCount: 29,
    searchQueriesCount: 420,
    savedAlertsCount: 24,
    activeDealerCount: 38,
    yearRange: '2018 – 2021',
    maxMileageKm: 65000,
    gradePreference: 'Grade 4.0+ (AWD Leather)',
    avgTargetBudgetNzd: 24200,
    avgExpectedMarginNzd: 3600,
    topRequestingRegion: 'Canterbury & Otago',
    topRequestingDealers: ['Christchurch Cars', 'Hamilton Motors'],
    supplyStatus: 'Severe Deficit',
    unmetDemandUnits: 67
  },
  {
    id: 'sig-note',
    model: 'Nissan Note e-Power',
    make: 'Nissan',
    segment: 'Compact',
    badge: '1.2L e-POWER X / Medalist',
    fuel: 'Hybrid',
    signalScore: 86,
    momentum: 'Accelerating (+25%)',
    momentumDirection: 'up',
    wishlistCount: 24,
    searchQueriesCount: 380,
    savedAlertsCount: 19,
    activeDealerCount: 35,
    yearRange: '2019 – 2021',
    maxMileageKm: 45000,
    gradePreference: 'Grade 4.5 (Medalist trim)',
    avgTargetBudgetNzd: 16400,
    avgExpectedMarginNzd: 3100,
    topRequestingRegion: 'Auckland & Wellington',
    topRequestingDealers: ['Wellington City Direct', 'Auckland Auto Group'],
    supplyStatus: 'Severe Deficit',
    unmetDemandUnits: 64
  },
  {
    id: 'sig-prius',
    model: 'Toyota Prius',
    make: 'Toyota',
    segment: 'Sedan/Wagon',
    badge: '1.8L S Touring / A Premium',
    fuel: 'Hybrid',
    signalScore: 78,
    momentum: 'Steady (+8%)',
    momentumDirection: 'steady',
    wishlistCount: 38,
    searchQueriesCount: 520,
    savedAlertsCount: 27,
    activeDealerCount: 54,
    yearRange: '2017 – 2020',
    maxMileageKm: 80000,
    gradePreference: 'Grade 4.0+',
    avgTargetBudgetNzd: 19800,
    avgExpectedMarginNzd: 3400,
    topRequestingRegion: 'Auckland & Wellington',
    topRequestingDealers: ['Auckland Auto Group', 'Wellington City Direct'],
    supplyStatus: 'Moderate Gap',
    unmetDemandUnits: 46
  }
];

// ==========================================
// 2. DEMAND FORECAST & UNMET DEMAND TYPES
// ==========================================
export interface DemandForecastItem {
  id: string;
  model: string;
  make: string;
  segment: string;
  currentMonthlyDemand: number;
  forecast30d: number;
  forecast60d: number;
  forecast90d: number;
  trendPct: number;
  confidenceScore: number;
  seasonalityDriver: string;
  projectedSupplyUnits: number;
  unmetForecastGap: number;
  recommendedAuctionIntake: number;
  targetAuctionHouses: string[];
  procurementDeadline: string;
}

export interface UnmetDemandMetric {
  totalUnmetUnits: number;
  lostGmvNzd: number;
  lostGmvJpy: number;
  unfulfilledDealersCount: number;
  criticalDeficitModelsCount: number;
  avgTurnDaysForShortageModels: number;
}

export interface UnmetDealerRequest {
  id: string;
  dealerId: number;
  dealerName: string;
  region: string;
  model: string;
  specRequirements: string;
  daysWaiting: number;
  maxBudgetNzd: number;
  priorityScore: number;
  status: 'Waiting for Stock' | 'Partially Matched' | 'Auction Proxy Set';
}

// 30 / 60 / 90 Day Demand Forecast Data
export const DEMAND_FORECAST_ITEMS: DemandForecastItem[] = [
  {
    id: 'fc-chr',
    model: 'Toyota C-HR',
    make: 'Toyota',
    segment: 'Hybrid SUV',
    currentMonthlyDemand: 162,
    forecast30d: 190,
    forecast60d: 215,
    forecast90d: 238,
    trendPct: 28,
    confidenceScore: 96,
    seasonalityDriver: 'Rapid transition to compact hybrid crossovers across Auckland suburban dealerships',
    projectedSupplyUnits: 65,
    unmetForecastGap: 125,
    recommendedAuctionIntake: 60,
    targetAuctionHouses: ['USS Tokyo', 'USS Yokohama'],
    procurementDeadline: 'Next 10 days'
  },
  {
    id: 'fc-vezel',
    model: 'Honda Vezel',
    make: 'Honda',
    segment: 'Hybrid SUV',
    currentMonthlyDemand: 139,
    forecast30d: 172,
    forecast60d: 198,
    forecast90d: 220,
    trendPct: 34,
    confidenceScore: 94,
    seasonalityDriver: 'Strong search volume spike (+40% MoM) driven by family buyers and suburban commuters',
    projectedSupplyUnits: 50,
    unmetForecastGap: 122,
    recommendedAuctionIntake: 50,
    targetAuctionHouses: ['USS Tokyo', 'USS Nagoya'],
    procurementDeadline: 'Next 10 days'
  },
  {
    id: 'fc-aqua',
    model: 'Toyota Aqua',
    make: 'Toyota',
    segment: 'Compact Hybrid',
    currentMonthlyDemand: 184,
    forecast30d: 205,
    forecast60d: 225,
    forecast90d: 240,
    trendPct: 18,
    confidenceScore: 97,
    seasonalityDriver: 'Sustained retail kingpin; consistent 12-day inventory turnover on dealer yards',
    projectedSupplyUnits: 105,
    unmetForecastGap: 100,
    recommendedAuctionIntake: 55,
    targetAuctionHouses: ['CAA Chubu', 'HAA Kobe'],
    procurementDeadline: 'Continuous'
  },
  {
    id: 'fc-cx5',
    model: 'Mazda CX-5',
    make: 'Mazda',
    segment: 'Mid SUV AWD',
    currentMonthlyDemand: 112,
    forecast30d: 130,
    forecast60d: 148,
    forecast90d: 160,
    trendPct: 22,
    confidenceScore: 91,
    seasonalityDriver: 'Winter AWD buying surge across South Island (Canterbury and Otago dealerships)',
    projectedSupplyUnits: 55,
    unmetForecastGap: 75,
    recommendedAuctionIntake: 35,
    targetAuctionHouses: ['HAA Kobe', 'USS Tokyo'],
    procurementDeadline: 'Next 14 days'
  },
  {
    id: 'fc-note',
    model: 'Nissan Note e-Power',
    make: 'Nissan',
    segment: 'Compact Hybrid',
    currentMonthlyDemand: 98,
    forecast30d: 118,
    forecast60d: 135,
    forecast90d: 145,
    trendPct: 26,
    confidenceScore: 92,
    seasonalityDriver: 'High urban rideshare & commuter fuel-efficiency preference in Wellington and Auckland',
    projectedSupplyUnits: 42,
    unmetForecastGap: 76,
    recommendedAuctionIntake: 30,
    targetAuctionHouses: ['USS Nagoya', 'USS Yokohama'],
    procurementDeadline: 'Next 14 days'
  }
];

export const UNMET_DEMAND_METRICS: UnmetDemandMetric = {
  totalUnmetUnits: 1120,
  lostGmvNzd: 1720000,
  lostGmvJpy: 156900000,
  unfulfilledDealersCount: 78,
  criticalDeficitModelsCount: 5,
  avgTurnDaysForShortageModels: 14.8
};

export const UNMET_DEALER_REQUESTS: UnmetDealerRequest[] = [
  {
    id: 'unmet-01',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    region: 'Auckland',
    model: 'Toyota C-HR Hybrid (2019-2022)',
    specRequirements: 'Grade 4.5, <55k km, 2WD Sensing, White/Black Two-tone',
    daysWaiting: 12,
    maxBudgetNzd: 23500,
    priorityScore: 98,
    status: 'Partially Matched'
  },
  {
    id: 'unmet-02',
    dealerId: 2,
    dealerName: 'Hamilton Motors',
    region: 'Waikato',
    model: 'Honda Vezel Hybrid Z',
    specRequirements: 'e:HEV Sensing, <60k km, Grade 4.5, Black/Grey',
    daysWaiting: 9,
    maxBudgetNzd: 21500,
    priorityScore: 95,
    status: 'Waiting for Stock'
  },
  {
    id: 'unmet-03',
    dealerId: 3,
    dealerName: 'Christchurch Cars',
    region: 'Canterbury',
    model: 'Toyota Aqua S / G (Batch of 5)',
    specRequirements: 'Grade 4.5+, <50k km, Push start, Safety Sense',
    daysWaiting: 15,
    maxBudgetNzd: 18000,
    priorityScore: 94,
    status: 'Auction Proxy Set'
  },
  {
    id: 'unmet-04',
    dealerId: 4,
    dealerName: 'North Shore Hybrid Centre',
    region: 'Auckland',
    model: 'Lexus NX300h F-Sport AWD',
    specRequirements: 'Grade 4.5, <50k km, Sunroof, Mark Levinson, Pearl White',
    daysWaiting: 18,
    maxBudgetNzd: 43000,
    priorityScore: 92,
    status: 'Waiting for Stock'
  },
  {
    id: 'unmet-05',
    dealerId: 5,
    dealerName: 'Wellington City Direct',
    region: 'Wellington',
    model: 'Nissan Note e-POWER Medalist',
    specRequirements: 'Grade 4.5, <45k km, 360 Camera, Dual Airbags',
    daysWaiting: 7,
    maxBudgetNzd: 16500,
    priorityScore: 90,
    status: 'Waiting for Stock'
  }
];

// ==========================================
// 3. MULTI-TIER SUPPLY MATCHING TYPES
// ==========================================
export interface InTransitRoRoShipment {
  id: string;
  vesselName: string;
  shippingLine: string;
  originPort: string;
  destinationPort: string;
  departureDate: string;
  etaDate: string;
  daysToArrival: number;
  totalUnitsOnboard: number;
  manifestModels: {
    model: string;
    units: number;
    availableUnreserved: number;
  }[];
}

export interface MultiTierSupplyMatch {
  id: string;
  dealerId: number;
  dealerName: string;
  region: string;
  wishlistCriteria: string;
  targetBudgetNzd: number;
  
  // Supply Matched
  supplyTier: 'Yard Stock' | 'In-Transit Ro-Ro' | 'Upcoming Auction';
  supplyAssetTitle: string;
  supplyIdentifier: string; // e.g. VIN / Lot # / Ro-Ro Vessel
  supplyLocation: string; // e.g. "Auckland Yard, Penrose" / "MV Trans Future 7 (ETA 8d)" / "USS Tokyo Lot #48201"
  year: number;
  grade: string;
  km: number;
  landedCostNzd: number;
  estimatedMarginNzd: number;
  matchScore: number; // 0-100%
  status: 'Available to Assign' | 'Pre-Allocated' | 'Dealer Notified';
  image: string;
}

// Active In-Transit Ro-Ro Ships Sailing from Japan to NZ
export const IN_TRANSIT_RORO_SHIPMENTS: InTransitRoRoShipment[] = [
  {
    id: 'vessel-tf7',
    vesselName: 'MV Trans Future 7',
    shippingLine: 'Toyofuji Shipping',
    originPort: 'Yokohama, Japan',
    destinationPort: 'Port of Auckland, NZ',
    departureDate: '14 Sept 2026',
    etaDate: '03 Oct 2026',
    daysToArrival: 8,
    totalUnitsOnboard: 124,
    manifestModels: [
      { model: 'Toyota C-HR Hybrid', units: 18, availableUnreserved: 6 },
      { model: 'Toyota Aqua', units: 34, availableUnreserved: 12 },
      { model: 'Honda Vezel Hybrid', units: 14, availableUnreserved: 4 },
      { model: 'Nissan Note e-Power', units: 12, availableUnreserved: 5 },
      { model: 'Mazda CX-5', units: 10, availableUnreserved: 3 }
    ]
  },
  {
    id: 'vessel-mc',
    vesselName: 'MV Morning Chorus',
    shippingLine: 'EUKOR Car Carriers',
    originPort: 'Nagoya, Japan',
    destinationPort: 'Lyttelton / Christchurch, NZ',
    departureDate: '19 Sept 2026',
    etaDate: '11 Oct 2026',
    daysToArrival: 16,
    totalUnitsOnboard: 98,
    manifestModels: [
      { model: 'Mazda CX-5 AWD', units: 22, availableUnreserved: 9 },
      { model: 'Toyota Aqua Hybrid', units: 28, availableUnreserved: 11 },
      { model: 'Subaru Forester AWD', units: 14, availableUnreserved: 6 }
    ]
  },
  {
    id: 'vessel-ph',
    vesselName: 'MV Poseidon Highway',
    shippingLine: 'K-Line Ro-Ro',
    originPort: 'Kobe, Japan',
    destinationPort: 'Port of Auckland, NZ',
    departureDate: '24 Sept 2026',
    etaDate: '19 Oct 2026',
    daysToArrival: 24,
    totalUnitsOnboard: 160,
    manifestModels: [
      { model: 'Toyota C-HR Hybrid', units: 25, availableUnreserved: 20 },
      { model: 'Honda Vezel Hybrid', units: 20, availableUnreserved: 16 },
      { model: 'Toyota Prius', units: 30, availableUnreserved: 24 }
    ]
  }
];

// Multi-Tier Supply Matching (Connecting Wishlists & Demand Signals to Yard, Ro-Ro, and Japan Auction Lots)
export const MULTI_TIER_SUPPLY_MATCHES: MultiTierSupplyMatch[] = [
  {
    id: 'match-01',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    region: 'Auckland',
    wishlistCriteria: 'Toyota C-HR 2019+, <55k km, Hybrid, Black roof, max $23,500',
    targetBudgetNzd: 23500,
    supplyTier: 'Upcoming Auction',
    supplyAssetTitle: '2020 Toyota C-HR G LED Hybrid (Two-Tone)',
    supplyIdentifier: 'USS Tokyo · Lot #48201',
    supplyLocation: 'Tomorrow 11:20 AM JST',
    year: 2020,
    grade: '4.5 / A',
    km: 48200,
    landedCostNzd: 22350,
    estimatedMarginNzd: 4100,
    matchScore: 98,
    status: 'Available to Assign',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-02',
    dealerId: 2,
    dealerName: 'Hamilton Motors',
    region: 'Waikato',
    wishlistCriteria: 'Honda Vezel Hybrid 2018+, <60k km, Sensing Package, under $21.5k',
    targetBudgetNzd: 21500,
    supplyTier: 'In-Transit Ro-Ro',
    supplyAssetTitle: '2019 Honda Vezel Hybrid Z Sensing',
    supplyIdentifier: 'MV Trans Future 7 · Unit #TF7-042',
    supplyLocation: 'Arriving Auckland Port in 8 days',
    year: 2019,
    grade: '4.5 / B',
    km: 51200,
    landedCostNzd: 20450,
    estimatedMarginNzd: 3850,
    matchScore: 97,
    status: 'Pre-Allocated',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-03',
    dealerId: 3,
    dealerName: 'Christchurch Cars',
    region: 'Canterbury',
    wishlistCriteria: 'Toyota Aqua 2019-2021, Grade 4.5, <50k km, Batch order',
    targetBudgetNzd: 18000,
    supplyTier: 'In-Transit Ro-Ro',
    supplyAssetTitle: '2020 Toyota Aqua S Hybrid (Safety Sense)',
    supplyIdentifier: 'MV Morning Chorus · Unit #MC-019',
    supplyLocation: 'Arriving Lyttelton Port in 16 days',
    year: 2020,
    grade: '4.5 / A',
    km: 44100,
    landedCostNzd: 17650,
    estimatedMarginNzd: 3500,
    matchScore: 96,
    status: 'Available to Assign',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-04',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    region: 'Auckland',
    wishlistCriteria: 'Lexus NX300h F-Sport, <50k km, Grade 4.5, Target margin $5k+',
    targetBudgetNzd: 42500,
    supplyTier: 'Upcoming Auction',
    supplyAssetTitle: '2019 Lexus NX300h F-Sport AWD (Sunroof)',
    supplyIdentifier: 'USS Tokyo · Lot #91204',
    supplyLocation: 'Tomorrow 04:45 PM JST',
    year: 2019,
    grade: '4.5 / A',
    km: 42100,
    landedCostNzd: 41200,
    estimatedMarginNzd: 5200,
    matchScore: 95,
    status: 'Dealer Notified',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-05',
    dealerId: 5,
    dealerName: 'Wellington City Direct',
    region: 'Wellington',
    wishlistCriteria: 'Nissan Note e-Power 2019+, Medalist, <45k km, budget $16.5k',
    targetBudgetNzd: 16500,
    supplyTier: 'Upcoming Auction',
    supplyAssetTitle: '2020 Nissan Note e-POWER Medalist (Surround View)',
    supplyIdentifier: 'USS Nagoya · Lot #33841',
    supplyLocation: 'In 2 days 02:15 PM JST',
    year: 2020,
    grade: '4.5 / B',
    km: 39500,
    landedCostNzd: 16100,
    estimatedMarginNzd: 3100,
    matchScore: 94,
    status: 'Available to Assign',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-06',
    dealerId: 3,
    dealerName: 'Christchurch Cars',
    region: 'Canterbury',
    wishlistCriteria: 'Mazda CX-5 AWD, Leather interior, Grade 4.0+, retail $29k',
    targetBudgetNzd: 24500,
    supplyTier: 'In-Transit Ro-Ro',
    supplyAssetTitle: '2019 Mazda CX-5 25S L-Package AWD',
    supplyIdentifier: 'MV Morning Chorus · Unit #MC-008',
    supplyLocation: 'Arriving Lyttelton Port in 16 days',
    year: 2019,
    grade: '4.0 / B',
    km: 58000,
    landedCostNzd: 23400,
    estimatedMarginNzd: 3900,
    matchScore: 93,
    status: 'Available to Assign',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'match-07',
    dealerId: 4,
    dealerName: 'North Shore Hybrid Centre',
    region: 'Auckland',
    wishlistCriteria: 'Grade 4.5 C-HR or Vezel, <60,000 km, Pearl White',
    targetBudgetNzd: 24000,
    supplyTier: 'Yard Stock',
    supplyAssetTitle: '2019 Toyota C-HR G LED Hybrid (Pearl White)',
    supplyIdentifier: 'Auckland Yard · VIN #ZYX10-204911',
    supplyLocation: 'Penrose Yard, Auckland (Ready for Delivery)',
    year: 2019,
    grade: '4.5 / B',
    km: 53400,
    landedCostNzd: 22800,
    estimatedMarginNzd: 3950,
    matchScore: 92,
    status: 'Available to Assign',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80'
  }
];

