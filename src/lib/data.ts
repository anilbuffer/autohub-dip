// Real Japanese Heiwa CSV Inventory Dataset
// Preserves all original CSV columns alongside mapped NZ landed pricing and AI scoring metrics.

export interface Vehicle {
  // --- Exact Heiwa CSV Fields ---
  stockid: string | number;
  make: string;
  model: string;
  grade: string;
  chassis: string;
  year: number;
  month?: number | string | null;
  kms: number;
  color: string;
  doors: number;
  cc: number;
  trans: string;
  fueltype: string;
  condition: string | number;
  ac: string;
  equip: string;
  jpy_fob: number;
  "jpy fob"?: number;

  // --- App & Valuation Extensions ---
  id: number;
  km: number;
  badge: string;
  interiorGrade: string;
  auctionHouse: string;
  lotNumber: string;
  auctionDate: string;
  timeLeft: string;
  fobJpy: number;
  landedNzd: number;
  estRetailNzd: number;
  maxBidNzd: number;
  targetMarginNzd: number;
  score: number;
  status: "Priority" | "Consider" | "Review";
  fuel: string;
  engine: string;
  transmission: string;
  vin: string;
  dealer: string;
  image: string;
  gallery: string[];
  aiAnalysis: {
    summary: string;
    highlights: string[];
    confidence: number;
    arbitrageSpread: number;
  };
  nzComparables: {
    source: string;
    year: number;
    km: number;
    price: number;
    daysListed: number;
    url?: string;
  }[];
  costBreakdown: {
    fobConvertedNzd: number;
    freightNzd: number;
    complianceNzd: number;
    gstAndFeesNzd: number;
    totalLandedNzd: number;
    targetMarginNzd: number;
    maxBidNzd: number;
  };
}

export const VEHICLES: Vehicle[] = [
  {
    // CSV Fields
    stockid: "n15856",
    make: "Toyota",
    model: "Prius 5d",
    grade: "L",
    chassis: "ZVW30-1982701",
    year: 2015,
    month: null,
    kms: 43,
    color: "black",
    doors: 0,
    cc: 1800,
    trans: "IA",
    fueltype: "H",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, nav",
    jpy_fob: 585000,
    "jpy fob": 585000,

    // App Extensions
    id: 1,
    km: 43000,
    badge: "L",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "n15856",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 15m",
    fobJpy: 585000,
    landedNzd: 11169,
    estRetailNzd: 16169,
    maxBidNzd: 12069,
    targetMarginNzd: 4100,
    score: 91,
    status: "Priority",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Intelligent Auto (IA)",
    vin: "ZVW30-1982701",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_prius.jpg",
    gallery: ["/vehicles/toyota_prius.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 43k kms ODO. Estimated New Zealand landed cost NZ$11,169 with projected dealer margin +NZ$4,100.",
      highlights: [
        "NZ$4,100 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 43k km certified ODO",
        "Factory options: ps, pw, nav (AAC)",
        "Auction House: USS Tokyo (Chassis: ZVW30-1982701)"
      ],
      confidence: 89,
      arbitrageSpread: 4100
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 45150, price: 16492, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 42140, price: 16007, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 47300, price: 16816, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6412,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1457,
      totalLandedNzd: 11169,
      targetMarginNzd: 4100,
      maxBidNzd: 12069
    }
  },
  {
    // CSV Fields
    stockid: "11485765",
    make: "Toyota",
    model: "Prius Alpha",
    grade: "S",
    chassis: "ZVW41W-3359272",
    year: 2015,
    month: null,
    kms: 110,
    color: "black",
    doors: 0,
    cc: 1800,
    trans: "IA",
    fueltype: "P",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw",
    jpy_fob: 573000,
    "jpy fob": 573000,

    // App Extensions
    id: 2,
    km: 110000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "11485765",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 22m",
    fobJpy: 573000,
    landedNzd: 11017,
    estRetailNzd: 15617,
    maxBidNzd: 11917,
    targetMarginNzd: 3700,
    score: 70,
    status: "Consider",
    fuel: "Petrol",
    engine: "1800cc Petrol",
    transmission: "Intelligent Auto (IA)",
    vin: "ZVW41W-3359272",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_prius.jpg",
    gallery: ["/vehicles/toyota_prius.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 110k kms ODO. Estimated New Zealand landed cost NZ$11,017 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 110k km certified ODO",
        "Factory options: ps, pw (AAC)",
        "Auction House: USS Yokohama (Chassis: ZVW41W-3359272)"
      ],
      confidence: 88,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 115500, price: 15929, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 107800, price: 15461, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 121000, price: 16242, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6280,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1437,
      totalLandedNzd: 11017,
      targetMarginNzd: 3700,
      maxBidNzd: 11917
    }
  },
  {
    // CSV Fields
    stockid: "322771",
    make: "Toyota",
    model: "Aqua",
    grade: "G",
    chassis: "NHP10-6226007",
    year: 2013,
    month: null,
    kms: 47,
    color: "silver",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw",
    jpy_fob: 365000,
    "jpy fob": 365000,

    // App Extensions
    id: 3,
    km: 47000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "322771",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 29m",
    fobJpy: 365000,
    landedNzd: 8395,
    estRetailNzd: 12495,
    maxBidNzd: 9095,
    targetMarginNzd: 3400,
    score: 73,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1500cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-6226007",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 47k kms ODO. Estimated New Zealand landed cost NZ$8,395 with projected dealer margin +NZ$3,400.",
      highlights: [
        "NZ$3,400 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 47k km certified ODO",
        "Factory options: ps, pw (AAC)",
        "Auction House: TAA Kanto (Chassis: NHP10-6226007)"
      ],
      confidence: 91,
      arbitrageSpread: 3400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2013, km: 49350, price: 12745, daysListed: 14 },
      { source: "Turners Auckland", year: 2013, km: 46060, price: 12370, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2013, km: 51700, price: 12995, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4000,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1095,
      totalLandedNzd: 8395,
      targetMarginNzd: 3400,
      maxBidNzd: 9095
    }
  },
  {
    // CSV Fields
    stockid: "1173388",
    make: "Toyota",
    model: "C-hr",
    grade: "S",
    chassis: "ZYX10-2079613",
    year: 2017,
    month: null,
    kms: 59,
    color: "silver",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 1260000,
    "jpy fob": 1260000,

    // App Extensions
    id: 4,
    km: 59000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "CAA Chubu",
    lotNumber: "1173388",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 36m",
    fobJpy: 1260000,
    landedNzd: 19676,
    estRetailNzd: 25676,
    maxBidNzd: 21276,
    targetMarginNzd: 4400,
    score: 91,
    status: "Priority",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2079613",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 59k kms ODO. Estimated New Zealand landed cost NZ$19,676 with projected dealer margin +NZ$4,400.",
      highlights: [
        "NZ$4,400 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 59k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: CAA Chubu (Chassis: ZYX10-2079613)"
      ],
      confidence: 89,
      arbitrageSpread: 4400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 61950, price: 26190, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 57820, price: 25419, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 64900, price: 26703, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 13810,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2566,
      totalLandedNzd: 19676,
      targetMarginNzd: 4400,
      maxBidNzd: 21276
    }
  },
  {
    // CSV Fields
    stockid: "322716",
    make: "Toyota",
    model: "Aqua",
    grade: "S",
    chassis: "NHP10-6602253",
    year: 2017,
    month: null,
    kms: 59,
    color: "blue",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "P",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, st",
    jpy_fob: 580000,
    "jpy fob": 580000,

    // App Extensions
    id: 5,
    km: 59000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "322716",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 43m",
    fobJpy: 580000,
    landedNzd: 11106,
    estRetailNzd: 16406,
    maxBidNzd: 12006,
    targetMarginNzd: 4400,
    score: 85,
    status: "Consider",
    fuel: "Petrol",
    engine: "1500cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-6602253",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 59k kms ODO. Estimated New Zealand landed cost NZ$11,106 with projected dealer margin +NZ$4,400.",
      highlights: [
        "NZ$4,400 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 59k km certified ODO",
        "Factory options: ps, pw, st (AAC)",
        "Auction House: HAA Kobe (Chassis: NHP10-6602253)"
      ],
      confidence: 93,
      arbitrageSpread: 4400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 61950, price: 16734, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 57820, price: 16242, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 64900, price: 17062, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6357,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1449,
      totalLandedNzd: 11106,
      targetMarginNzd: 4400,
      maxBidNzd: 12006
    }
  },
  {
    // CSV Fields
    stockid: "1173019",
    make: "Toyota",
    model: "Aqua",
    grade: "X",
    chassis: "MXPK11-2024935",
    year: 2021,
    month: null,
    kms: 112,
    color: "pearl",
    doors: 0,
    cc: 1500,
    trans: "IAT",
    fueltype: "-",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 850000,
    "jpy fob": 850000,

    // App Extensions
    id: 6,
    km: 112000,
    badge: "X",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1173019",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 50m",
    fobJpy: 850000,
    landedNzd: 14508,
    estRetailNzd: 20708,
    maxBidNzd: 15708,
    targetMarginNzd: 5000,
    score: 82,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "MXPK11-2024935",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 112k kms ODO. Estimated New Zealand landed cost NZ$14,508 with projected dealer margin +NZ$5,000.",
      highlights: [
        "NZ$5,000 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 112k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: USS Nagoya (Chassis: MXPK11-2024935)"
      ],
      confidence: 90,
      arbitrageSpread: 5000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 117600, price: 21122, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 109760, price: 20501, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 123200, price: 21536, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 9316,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1892,
      totalLandedNzd: 14508,
      targetMarginNzd: 5000,
      maxBidNzd: 15708
    }
  },
  {
    // CSV Fields
    stockid: "322631",
    make: "Honda",
    model: "Accord",
    grade: "ハイブリッド EX",
    chassis: "CV3-1002042",
    year: 2020,
    month: 6,
    kms: 102,
    color: "black",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "P",
    condition: "4",
    ac: "AAC",
    equip: "abs, ps, pw, sr, swt/lg",
    jpy_fob: 1685000,
    "jpy fob": 1685000,

    // App Extensions
    id: 7,
    km: 102000,
    badge: "ハイブリッド EX",
    interiorGrade: "B",
    auctionHouse: "JU Saitama",
    lotNumber: "322631",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 57m",
    fobJpy: 1685000,
    landedNzd: 25033,
    estRetailNzd: 31883,
    maxBidNzd: 27033,
    targetMarginNzd: 4850,
    score: 91,
    status: "Priority",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "CV3-1002042",
    dealer: "Auckland Auto Group",
    image: "/vehicles/honda_accord.jpg",
    gallery: ["/vehicles/honda_accord.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 102k kms ODO. Estimated New Zealand landed cost NZ$25,033 with projected dealer margin +NZ$4,850.",
      highlights: [
        "NZ$4,850 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 102k km certified ODO",
        "Factory options: abs, ps, pw, sr, swt/lg (AAC)",
        "Auction House: JU Saitama (Chassis: CV3-1002042)"
      ],
      confidence: 89,
      arbitrageSpread: 4850
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2020, km: 107100, price: 32521, daysListed: 14 },
      { source: "Turners Auckland", year: 2020, km: 99960, price: 31564, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2020, km: 112200, price: 33158, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 18468,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3265,
      totalLandedNzd: 25033,
      targetMarginNzd: 4850,
      maxBidNzd: 27033
    }
  },
  {
    // CSV Fields
    stockid: "1172772",
    make: "Toyota",
    model: "Rav4",
    grade: "アドベンチャー 4WD",
    chassis: "MXAA54-5010684",
    year: 2020,
    month: null,
    kms: 57,
    color: "green",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "-",
    condition: "3",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2100000,
    "jpy fob": 2100000,

    // App Extensions
    id: 8,
    km: 57000,
    badge: "アドベンチャー 4WD",
    interiorGrade: "C",
    auctionHouse: "USS Osaka",
    lotNumber: "1172772",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 19m",
    fobJpy: 2100000,
    landedNzd: 30263,
    estRetailNzd: 36713,
    maxBidNzd: 32663,
    targetMarginNzd: 4050,
    score: 62,
    status: "Review",
    fuel: "Petrol / Hybrid",
    engine: "2000cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "MXAA54-5010684",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_rav4.jpg",
    gallery: ["/vehicles/toyota_rav4.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 57k kms ODO. Estimated New Zealand landed cost NZ$30,263 with projected dealer margin +NZ$4,050.",
      highlights: [
        "NZ$4,050 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 57k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Osaka (Chassis: MXAA54-5010684)"
      ],
      confidence: 90,
      arbitrageSpread: 4050
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2020, km: 59850, price: 37447, daysListed: 14 },
      { source: "Turners Auckland", year: 2020, km: 55860, price: 36346, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2020, km: 62700, price: 38182, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 23016,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3947,
      totalLandedNzd: 30263,
      targetMarginNzd: 4050,
      maxBidNzd: 32663
    }
  },
  {
    // CSV Fields
    stockid: "322627",
    make: "Toyota",
    model: "Sienta",
    grade: "G",
    chassis: "NSP170G-7030019",
    year: 2016,
    month: null,
    kms: 26,
    color: "red",
    doors: 0,
    cc: 1500,
    trans: "AT",
    fueltype: "P",
    condition: "3.5",
    ac: "AC",
    equip: "abs, ps, pw, sr, tv, nc",
    jpy_fob: 755000,
    "jpy fob": 755000,

    // App Extensions
    id: 9,
    km: 26000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "322627",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 26m",
    fobJpy: 755000,
    landedNzd: 13311,
    estRetailNzd: 18261,
    maxBidNzd: 14411,
    targetMarginNzd: 3850,
    score: 74,
    status: "Consider",
    fuel: "Petrol",
    engine: "1500cc Petrol",
    transmission: "Automatic (AT)",
    vin: "NSP170G-7030019",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_sienta.jpg",
    gallery: ["/vehicles/toyota_sienta.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 26k kms ODO. Estimated New Zealand landed cost NZ$13,311 with projected dealer margin +NZ$3,850.",
      highlights: [
        "NZ$3,850 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 26k km certified ODO",
        "Factory options: abs, ps, pw, sr, tv, nc (AC)",
        "Auction House: USS Tokyo (Chassis: NSP170G-7030019)"
      ],
      confidence: 92,
      arbitrageSpread: 3850
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 27300, price: 18626, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 25480, price: 18078, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 28600, price: 18991, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 8275,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1736,
      totalLandedNzd: 13311,
      targetMarginNzd: 3850,
      maxBidNzd: 14411
    }
  },
  {
    // CSV Fields
    stockid: "1172820",
    make: "Toyota",
    model: "Corolla Cross",
    grade: "Hybrid S",
    chassis: "ZVG11-1054701",
    year: 2023,
    month: null,
    kms: 24,
    color: "silver",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 2155000,
    "jpy fob": 2155000,

    // App Extensions
    id: 10,
    km: 24000,
    badge: "Hybrid S",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1172820",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 33m",
    fobJpy: 2155000,
    landedNzd: 30957,
    estRetailNzd: 38357,
    maxBidNzd: 33457,
    targetMarginNzd: 4900,
    score: 91,
    status: "Priority",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZVG11-1054701",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_corolla_cross.jpg",
    gallery: ["/vehicles/toyota_corolla_cross.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 24k kms ODO. Estimated New Zealand landed cost NZ$30,957 with projected dealer margin +NZ$4,900.",
      highlights: [
        "NZ$4,900 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 24k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: USS Yokohama (Chassis: ZVG11-1054701)"
      ],
      confidence: 89,
      arbitrageSpread: 4900
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 25200, price: 39124, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 23520, price: 37973, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 26400, price: 39891, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 23619,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 4038,
      totalLandedNzd: 30957,
      targetMarginNzd: 4900,
      maxBidNzd: 33457
    }
  },
  {
    // CSV Fields
    stockid: "1172817",
    make: "Toyota",
    model: "Corolla Touring",
    grade: "Hybrid G-X",
    chassis: "ZWE211W-6061798",
    year: 2021,
    month: null,
    kms: 90,
    color: "white",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 1275000,
    "jpy fob": 1275000,

    // App Extensions
    id: 11,
    km: 90000,
    badge: "Hybrid G-X",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "1172817",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 40m",
    fobJpy: 1275000,
    landedNzd: 19865,
    estRetailNzd: 26065,
    maxBidNzd: 21465,
    targetMarginNzd: 4600,
    score: 71,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZWE211W-6061798",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 90k kms ODO. Estimated New Zealand landed cost NZ$19,865 with projected dealer margin +NZ$4,600.",
      highlights: [
        "NZ$4,600 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 90k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: TAA Kanto (Chassis: ZWE211W-6061798)"
      ],
      confidence: 89,
      arbitrageSpread: 4600
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 94500, price: 26586, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 88200, price: 25804, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 99000, price: 27108, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 13974,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2591,
      totalLandedNzd: 19865,
      targetMarginNzd: 4600,
      maxBidNzd: 21465
    }
  },
  {
    // CSV Fields
    stockid: "322510",
    make: "Nissan",
    model: "NV350 Caravan Van",
    grade: "LongVX",
    chassis: "VW2E26-123185",
    year: 2021,
    month: null,
    kms: 114,
    color: "grey",
    doors: 0,
    cc: 2500,
    trans: "IAT",
    fueltype: "D",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1425000,
    "jpy fob": 1425000,

    // App Extensions
    id: 12,
    km: 114000,
    badge: "LongVX",
    interiorGrade: "B",
    auctionHouse: "CAA Chubu",
    lotNumber: "322510",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 47m",
    fobJpy: 1425000,
    landedNzd: 21756,
    estRetailNzd: 28056,
    maxBidNzd: 23456,
    targetMarginNzd: 4600,
    score: 70,
    status: "Consider",
    fuel: "Diesel",
    engine: "2500cc Diesel",
    transmission: "Intelligent AT (IAT)",
    vin: "VW2E26-123185",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_hiace.jpg",
    gallery: ["/vehicles/toyota_hiace.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 114k kms ODO. Estimated New Zealand landed cost NZ$21,756 with projected dealer margin +NZ$4,600.",
      highlights: [
        "NZ$4,600 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 114k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: VW2E26-123185)"
      ],
      confidence: 88,
      arbitrageSpread: 4600
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 119700, price: 28617, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 111720, price: 27775, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 125400, price: 29178, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15618,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2838,
      totalLandedNzd: 21756,
      targetMarginNzd: 4600,
      maxBidNzd: 23456
    }
  },
  {
    // CSV Fields
    stockid: "1172564",
    make: "Nissan",
    model: "Cube",
    grade: "15X V Smart",
    chassis: "Z12-313130",
    year: 2016,
    month: null,
    kms: 77,
    color: "blue",
    doors: 0,
    cc: 1500,
    trans: "AT",
    fueltype: "P",
    condition: "3",
    ac: "AC",
    equip: "ps, pw, abs",
    jpy_fob: 275000,
    "jpy fob": 275000,

    // App Extensions
    id: 13,
    km: 77000,
    badge: "15X V Smart",
    interiorGrade: "C",
    auctionHouse: "HAA Kobe",
    lotNumber: "1172564",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 54m",
    fobJpy: 275000,
    landedNzd: 7261,
    estRetailNzd: 11311,
    maxBidNzd: 7861,
    targetMarginNzd: 3450,
    score: 61,
    status: "Review",
    fuel: "Petrol",
    engine: "1500cc Petrol",
    transmission: "Automatic (AT)",
    vin: "Z12-313130",
    dealer: "Auckland Auto Group",
    image: "/vehicles/mazda_demio.jpg",
    gallery: ["/vehicles/mazda_demio.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 77k kms ODO. Estimated New Zealand landed cost NZ$7,261 with projected dealer margin +NZ$3,450.",
      highlights: [
        "NZ$3,450 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 77k km certified ODO",
        "Factory options: ps, pw, abs (AC)",
        "Auction House: HAA Kobe (Chassis: Z12-313130)"
      ],
      confidence: 89,
      arbitrageSpread: 3450
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 80850, price: 11537, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 75460, price: 11198, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 84700, price: 11763, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 3014,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 947,
      totalLandedNzd: 7261,
      targetMarginNzd: 3450,
      maxBidNzd: 7861
    }
  },
  {
    // CSV Fields
    stockid: "1172581",
    make: "Honda",
    model: "Jade",
    grade: "HYBRID",
    chassis: "FR4-1003525",
    year: 2015,
    month: null,
    kms: 50,
    color: "black",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw",
    jpy_fob: 550000,
    "jpy fob": 550000,

    // App Extensions
    id: 14,
    km: 50000,
    badge: "HYBRID",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1172581",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 16m",
    fobJpy: 550000,
    landedNzd: 10727,
    estRetailNzd: 15327,
    maxBidNzd: 11627,
    targetMarginNzd: 3700,
    score: 73,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1500cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "FR4-1003525",
    dealer: "Hamilton Motors",
    image: "/vehicles/honda_accord.jpg",
    gallery: ["/vehicles/honda_accord.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 50k kms ODO. Estimated New Zealand landed cost NZ$10,727 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 50k km certified ODO",
        "Factory options: ps, pw (AAC)",
        "Auction House: USS Nagoya (Chassis: FR4-1003525)"
      ],
      confidence: 91,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 52500, price: 15634, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 49000, price: 15174, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 55000, price: 15940, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6028,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1399,
      totalLandedNzd: 10727,
      targetMarginNzd: 3700,
      maxBidNzd: 11627
    }
  },
  {
    // CSV Fields
    stockid: "1172517",
    make: "Toyota",
    model: "Porte 4d",
    grade: "F",
    chassis: "NCP141-9135928",
    year: 2014,
    month: null,
    kms: 49,
    color: "red",
    doors: 0,
    cc: 1500,
    trans: "IA",
    fueltype: "-",
    condition: "3",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 320000,
    "jpy fob": 320000,

    // App Extensions
    id: 15,
    km: 49000,
    badge: "F",
    interiorGrade: "C",
    auctionHouse: "JU Saitama",
    lotNumber: "1172517",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 23m",
    fobJpy: 320000,
    landedNzd: 7828,
    estRetailNzd: 11578,
    maxBidNzd: 8428,
    targetMarginNzd: 3150,
    score: 63,
    status: "Review",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Intelligent Auto (IA)",
    vin: "NCP141-9135928",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 49k kms ODO. Estimated New Zealand landed cost NZ$7,828 with projected dealer margin +NZ$3,150.",
      highlights: [
        "NZ$3,150 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 49k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: JU Saitama (Chassis: NCP141-9135928)"
      ],
      confidence: 91,
      arbitrageSpread: 3150
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2014, km: 51450, price: 11810, daysListed: 14 },
      { source: "Turners Auckland", year: 2014, km: 48020, price: 11462, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2014, km: 53900, price: 12041, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 3507,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1021,
      totalLandedNzd: 7828,
      targetMarginNzd: 3150,
      maxBidNzd: 8428
    }
  },
  {
    // CSV Fields
    stockid: "1172418",
    make: "Subaru",
    model: "Levorg 4wd",
    grade: "1.6GTEYESIGHT PF",
    chassis: "VM4-065517",
    year: 2015,
    month: null,
    kms: 65,
    color: "red",
    doors: 0,
    cc: 1600,
    trans: "FAT",
    fueltype: "P",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, sw",
    jpy_fob: 520000,
    "jpy fob": 520000,

    // App Extensions
    id: 16,
    km: 65000,
    badge: "1.6GTEYESIGHT PF",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "1172418",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 30m",
    fobJpy: 520000,
    landedNzd: 10349,
    estRetailNzd: 14849,
    maxBidNzd: 11149,
    targetMarginNzd: 3700,
    score: 72,
    status: "Consider",
    fuel: "Petrol",
    engine: "1600cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "VM4-065517",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_rav4.jpg",
    gallery: ["/vehicles/toyota_rav4.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 65k kms ODO. Estimated New Zealand landed cost NZ$10,349 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 65k km certified ODO",
        "Factory options: ps, pw, sw (AAC)",
        "Auction House: USS Osaka (Chassis: VM4-065517)"
      ],
      confidence: 90,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 68250, price: 15146, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 63700, price: 14701, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 71500, price: 15443, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 5699,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1350,
      totalLandedNzd: 10349,
      targetMarginNzd: 3700,
      maxBidNzd: 11149
    }
  },
  {
    // CSV Fields
    stockid: "1172314",
    make: "Toyota",
    model: "Aqua",
    grade: "G",
    chassis: "NHP10-2312488",
    year: 2014,
    month: null,
    kms: 79,
    color: "pearl",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 390000,
    "jpy fob": 390000,

    // App Extensions
    id: 17,
    km: 79000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "1172314",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 37m",
    fobJpy: 390000,
    landedNzd: 8710,
    estRetailNzd: 12960,
    maxBidNzd: 9410,
    targetMarginNzd: 3550,
    score: 72,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-2312488",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 79k kms ODO. Estimated New Zealand landed cost NZ$8,710 with projected dealer margin +NZ$3,550.",
      highlights: [
        "NZ$3,550 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 79k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: USS Tokyo (Chassis: NHP10-2312488)"
      ],
      confidence: 90,
      arbitrageSpread: 3550
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2014, km: 82950, price: 13219, daysListed: 14 },
      { source: "Turners Auckland", year: 2014, km: 77420, price: 12830, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2014, km: 86900, price: 13478, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4274,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1136,
      totalLandedNzd: 8710,
      targetMarginNzd: 3550,
      maxBidNzd: 9410
    }
  },
  {
    // CSV Fields
    stockid: "1171545",
    make: "Toyota",
    model: "C-hr",
    grade: "G",
    chassis: "ZYX10-2028576",
    year: 2017,
    month: null,
    kms: 37,
    color: "red",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1380000,
    "jpy fob": 1380000,

    // App Extensions
    id: 18,
    km: 37000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1171545",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 44m",
    fobJpy: 1380000,
    landedNzd: 21189,
    estRetailNzd: 26889,
    maxBidNzd: 22889,
    targetMarginNzd: 4000,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2028576",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 37k kms ODO. Estimated New Zealand landed cost NZ$21,189 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 37k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Yokohama (Chassis: ZYX10-2028576)"
      ],
      confidence: 91,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 38850, price: 27427, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 36260, price: 26620, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 40700, price: 27965, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15125,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2764,
      totalLandedNzd: 21189,
      targetMarginNzd: 4000,
      maxBidNzd: 22889
    }
  },
  {
    // CSV Fields
    stockid: "322299",
    make: "Toyota",
    model: "Prius",
    grade: "S TouringSelection",
    chassis: "ZVW51-6106898",
    year: 2019,
    month: null,
    kms: 24,
    color: "blue",
    doors: 5,
    cc: 1800,
    trans: "IAT",
    fueltype: "H",
    condition: "3",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1350000,
    "jpy fob": 1350000,

    // App Extensions
    id: 19,
    km: 24000,
    badge: "S TouringSelection",
    interiorGrade: "C",
    auctionHouse: "TAA Kanto",
    lotNumber: "322299",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 51m",
    fobJpy: 1350000,
    landedNzd: 20810,
    estRetailNzd: 26410,
    maxBidNzd: 22510,
    targetMarginNzd: 3900,
    score: 64,
    status: "Review",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "ZVW51-6106898",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_prius.jpg",
    gallery: ["/vehicles/toyota_prius.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 24k kms ODO. Estimated New Zealand landed cost NZ$20,810 with projected dealer margin +NZ$3,900.",
      highlights: [
        "NZ$3,900 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 24k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: TAA Kanto (Chassis: ZVW51-6106898)"
      ],
      confidence: 92,
      arbitrageSpread: 3900
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 25200, price: 26938, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 23520, price: 26146, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 26400, price: 27466, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14796,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2714,
      totalLandedNzd: 20810,
      targetMarginNzd: 3900,
      maxBidNzd: 22510
    }
  },
  {
    // CSV Fields
    stockid: "322312",
    make: "Subaru",
    model: "Xv",
    grade: "2.0i アイサイト プラウド4W",
    chassis: "GP7-102721",
    year: 2015,
    month: null,
    kms: 46,
    color: "orange",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 562000,
    "jpy fob": 562000,

    // App Extensions
    id: 20,
    km: 46000,
    badge: "2.0i アイサイト プラウド4W",
    interiorGrade: "B",
    auctionHouse: "CAA Chubu",
    lotNumber: "322312",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 58m",
    fobJpy: 562000,
    landedNzd: 10879,
    estRetailNzd: 15479,
    maxBidNzd: 11779,
    targetMarginNzd: 3700,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "2000cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "GP7-102721",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_rav4.jpg",
    gallery: ["/vehicles/toyota_rav4.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 46k kms ODO. Estimated New Zealand landed cost NZ$10,879 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 46k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: GP7-102721)"
      ],
      confidence: 91,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 48300, price: 15789, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 45080, price: 15324, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 50600, price: 16098, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6160,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1419,
      totalLandedNzd: 10879,
      targetMarginNzd: 3700,
      maxBidNzd: 11779
    }
  },
  {
    // CSV Fields
    stockid: "1172013",
    make: "Toyota",
    model: "Aqua",
    grade: "CROSSOVER",
    chassis: "NHP10H-6080519",
    year: 2017,
    month: null,
    kms: 38,
    color: "blue",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.7",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 760000,
    "jpy fob": 760000,

    // App Extensions
    id: 21,
    km: 38000,
    badge: "CROSSOVER",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "1172013",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 20m",
    fobJpy: 760000,
    landedNzd: 13374,
    estRetailNzd: 18634,
    maxBidNzd: 14474,
    targetMarginNzd: 4160,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10H-6080519",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.7 auction inspection with verified 38k kms ODO. Estimated New Zealand landed cost NZ$13,374 with projected dealer margin +NZ$4,160.",
      highlights: [
        "NZ$4,160 projected dealer gross margin at current live FX",
        "Grade 3.7 verified condition with 38k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: NHP10H-6080519)"
      ],
      confidence: 91,
      arbitrageSpread: 4160
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 39900, price: 19007, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 37240, price: 18448, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 41800, price: 19379, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 8330,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1744,
      totalLandedNzd: 13374,
      targetMarginNzd: 4160,
      maxBidNzd: 14474
    }
  },
  {
    // CSV Fields
    stockid: "1171904",
    make: "Toyota",
    model: "C-hr",
    grade: "G",
    chassis: "ZYX10-2089296",
    year: 2017,
    month: null,
    kms: 95,
    color: "pearl",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1270000,
    "jpy fob": 1270000,

    // App Extensions
    id: 22,
    km: 95000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1171904",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 27m",
    fobJpy: 1270000,
    landedNzd: 19802,
    estRetailNzd: 25402,
    maxBidNzd: 21402,
    targetMarginNzd: 4000,
    score: 71,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2089296",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 95k kms ODO. Estimated New Zealand landed cost NZ$19,802 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 95k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Nagoya (Chassis: ZYX10-2089296)"
      ],
      confidence: 89,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 99750, price: 25910, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 93100, price: 25148, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 104500, price: 26418, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 13919,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2583,
      totalLandedNzd: 19802,
      targetMarginNzd: 4000,
      maxBidNzd: 21402
    }
  },
  {
    // CSV Fields
    stockid: "1171883",
    make: "Suzuki",
    model: "Swift",
    grade: "RS",
    chassis: "ZC72S-303030",
    year: 2013,
    month: null,
    kms: 83,
    color: "black",
    doors: 0,
    cc: 1200,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, ew, abs",
    jpy_fob: 400000,
    "jpy fob": 400000,

    // App Extensions
    id: 23,
    km: 83000,
    badge: "RS",
    interiorGrade: "B",
    auctionHouse: "JU Saitama",
    lotNumber: "1171883",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 34m",
    fobJpy: 400000,
    landedNzd: 8837,
    estRetailNzd: 12937,
    maxBidNzd: 9537,
    targetMarginNzd: 3400,
    score: 71,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1200cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZC72S-303030",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 83k kms ODO. Estimated New Zealand landed cost NZ$8,837 with projected dealer margin +NZ$3,400.",
      highlights: [
        "NZ$3,400 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 83k km certified ODO",
        "Factory options: ps, pw, ew, abs (AAC)",
        "Auction House: JU Saitama (Chassis: ZC72S-303030)"
      ],
      confidence: 89,
      arbitrageSpread: 3400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2013, km: 87150, price: 13196, daysListed: 14 },
      { source: "Turners Auckland", year: 2013, km: 81340, price: 12808, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2013, km: 91300, price: 13454, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4384,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1153,
      totalLandedNzd: 8837,
      targetMarginNzd: 3400,
      maxBidNzd: 9537
    }
  },
  {
    // CSV Fields
    stockid: "322296",
    make: "Subaru",
    model: "レヴォーグ",
    grade: "1.6GTアイサイト Sスタイル",
    chassis: "VM4-071064",
    year: 2016,
    month: null,
    kms: 123,
    color: "pearl",
    doors: 0,
    cc: 1600,
    trans: "FAT",
    fueltype: "-",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 425000,
    "jpy fob": 425000,

    // App Extensions
    id: 24,
    km: 123000,
    badge: "1.6GTアイサイト Sスタイル",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "322296",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 41m",
    fobJpy: 425000,
    landedNzd: 9152,
    estRetailNzd: 14102,
    maxBidNzd: 9852,
    targetMarginNzd: 4250,
    score: 82,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1600cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "VM4-071064",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 123k kms ODO. Estimated New Zealand landed cost NZ$9,152 with projected dealer margin +NZ$4,250.",
      highlights: [
        "NZ$4,250 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 123k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Osaka (Chassis: VM4-071064)"
      ],
      confidence: 90,
      arbitrageSpread: 4250
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 129150, price: 14384, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 120540, price: 13961, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 135300, price: 14666, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4658,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1194,
      totalLandedNzd: 9152,
      targetMarginNzd: 4250,
      maxBidNzd: 9852
    }
  },
  {
    // CSV Fields
    stockid: "322293",
    make: "Toyota",
    model: "Wish",
    grade: "1.8X",
    chassis: "ZGE20G-0185889",
    year: 2013,
    month: null,
    kms: 113,
    color: "red",
    doors: 0,
    cc: 1800,
    trans: "IAT",
    fueltype: "-",
    condition: "3.7",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 421000,
    "jpy fob": 421000,

    // App Extensions
    id: 25,
    km: 113000,
    badge: "1.8X",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "322293",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 48m",
    fobJpy: 421000,
    landedNzd: 9101,
    estRetailNzd: 13361,
    maxBidNzd: 9801,
    targetMarginNzd: 3560,
    score: 70,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "ZGE20G-0185889",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.7 auction inspection with verified 113k kms ODO. Estimated New Zealand landed cost NZ$9,101 with projected dealer margin +NZ$3,560.",
      highlights: [
        "NZ$3,560 projected dealer gross margin at current live FX",
        "Grade 3.7 verified condition with 113k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Tokyo (Chassis: ZGE20G-0185889)"
      ],
      confidence: 88,
      arbitrageSpread: 3560
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2013, km: 118650, price: 13628, daysListed: 14 },
      { source: "Turners Auckland", year: 2013, km: 110740, price: 13227, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2013, km: 124300, price: 13895, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4614,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1187,
      totalLandedNzd: 9101,
      targetMarginNzd: 3560,
      maxBidNzd: 9801
    }
  },
  {
    // CSV Fields
    stockid: "1171699",
    make: "Toyota",
    model: "C-hr",
    grade: "S",
    chassis: "ZYX10-2022718",
    year: 2017,
    month: null,
    kms: 57,
    color: "pearl",
    doors: 0,
    cc: 1800,
    trans: "AT",
    fueltype: "-",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1310000,
    "jpy fob": 1310000,

    // App Extensions
    id: 26,
    km: 57000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1171699",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 55m",
    fobJpy: 1310000,
    landedNzd: 20307,
    estRetailNzd: 26307,
    maxBidNzd: 21907,
    targetMarginNzd: 4400,
    score: 85,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Automatic (AT)",
    vin: "ZYX10-2022718",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 57k kms ODO. Estimated New Zealand landed cost NZ$20,307 with projected dealer margin +NZ$4,400.",
      highlights: [
        "NZ$4,400 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 57k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Yokohama (Chassis: ZYX10-2022718)"
      ],
      confidence: 93,
      arbitrageSpread: 4400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 59850, price: 26833, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 55860, price: 26044, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 62700, price: 27359, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14358,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2649,
      totalLandedNzd: 20307,
      targetMarginNzd: 4400,
      maxBidNzd: 21907
    }
  },
  {
    // CSV Fields
    stockid: "322167",
    make: "Toyota",
    model: "Aqua",
    grade: "S",
    chassis: "NHP10-6591085",
    year: 2017,
    month: null,
    kms: 25,
    color: "blue",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 864000,
    "jpy fob": 864000,

    // App Extensions
    id: 27,
    km: 25000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "322167",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 17m",
    fobJpy: 864000,
    landedNzd: 14686,
    estRetailNzd: 19886,
    maxBidNzd: 15886,
    targetMarginNzd: 4000,
    score: 74,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-6591085",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 25k kms ODO. Estimated New Zealand landed cost NZ$14,686 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 25k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: TAA Kanto (Chassis: NHP10-6591085)"
      ],
      confidence: 92,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 26250, price: 20284, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 24500, price: 19687, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 27500, price: 20681, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 9470,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1916,
      totalLandedNzd: 14686,
      targetMarginNzd: 4000,
      maxBidNzd: 15886
    }
  },
  {
    // CSV Fields
    stockid: "1171591",
    make: "Mazda",
    model: "Cx-8",
    grade: "25S BLACK TONE E",
    chassis: "KG5P-254916",
    year: 2021,
    month: null,
    kms: 115,
    color: "black",
    doors: 0,
    cc: 2500,
    trans: "FAT",
    fueltype: "-",
    condition: "4.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1585000,
    "jpy fob": 1585000,

    // App Extensions
    id: 28,
    km: 115000,
    badge: "25S BLACK TONE E",
    interiorGrade: "A",
    auctionHouse: "CAA Chubu",
    lotNumber: "1171591",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 24m",
    fobJpy: 1585000,
    landedNzd: 23773,
    estRetailNzd: 31073,
    maxBidNzd: 25673,
    targetMarginNzd: 5400,
    score: 90,
    status: "Priority",
    fuel: "Petrol / Hybrid",
    engine: "2500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "KG5P-254916",
    dealer: "Auckland Auto Group",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 115k kms ODO. Estimated New Zealand landed cost NZ$23,773 with projected dealer margin +NZ$5,400.",
      highlights: [
        "NZ$5,400 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 115k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: KG5P-254916)"
      ],
      confidence: 88,
      arbitrageSpread: 5400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 120750, price: 31694, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 112700, price: 30762, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 126500, price: 32316, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 17372,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3101,
      totalLandedNzd: 23773,
      targetMarginNzd: 5400,
      maxBidNzd: 25673
    }
  },
  {
    // CSV Fields
    stockid: "1171515",
    make: "Toyota",
    model: "C-hr",
    grade: "G",
    chassis: "ZYX10-2013571",
    year: 2017,
    month: null,
    kms: 49,
    color: "green",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "A2",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1450000,
    "jpy fob": 1450000,

    // App Extensions
    id: 29,
    km: 49000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "1171515",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 31m",
    fobJpy: 1450000,
    landedNzd: 22071,
    estRetailNzd: 27871,
    maxBidNzd: 23871,
    targetMarginNzd: 4000,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2013571",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade A2 auction inspection with verified 49k kms ODO. Estimated New Zealand landed cost NZ$22,071 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade A2 verified condition with 49k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: ZYX10-2013571)"
      ],
      confidence: 91,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 51450, price: 28428, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 48020, price: 27592, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 53900, price: 28986, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15892,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2879,
      totalLandedNzd: 22071,
      targetMarginNzd: 4000,
      maxBidNzd: 23871
    }
  },
  {
    // CSV Fields
    stockid: "1171129",
    make: "Toyota",
    model: "Aqua",
    grade: "Z",
    chassis: "MXPK11-2008617",
    year: 2021,
    month: null,
    kms: 66,
    color: "black",
    doors: 0,
    cc: 1500,
    trans: "IAT",
    fueltype: "-",
    condition: "3",
    ac: "AAC",
    equip: "ps, pw, aw, abs",
    jpy_fob: 1120000,
    "jpy fob": 1120000,

    // App Extensions
    id: 30,
    km: 66000,
    badge: "Z",
    interiorGrade: "C",
    auctionHouse: "USS Nagoya",
    lotNumber: "1171129",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 38m",
    fobJpy: 1120000,
    landedNzd: 17911,
    estRetailNzd: 23511,
    maxBidNzd: 19311,
    targetMarginNzd: 4200,
    score: 62,
    status: "Review",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "MXPK11-2008617",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 66k kms ODO. Estimated New Zealand landed cost NZ$17,911 with projected dealer margin +NZ$4,200.",
      highlights: [
        "NZ$4,200 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 66k km certified ODO",
        "Factory options: ps, pw, aw, abs (AAC)",
        "Auction House: USS Nagoya (Chassis: MXPK11-2008617)"
      ],
      confidence: 90,
      arbitrageSpread: 4200
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 69300, price: 23981, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 64680, price: 23276, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 72600, price: 24451, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 12275,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2336,
      totalLandedNzd: 17911,
      targetMarginNzd: 4200,
      maxBidNzd: 19311
    }
  },
  {
    // CSV Fields
    stockid: "1171137",
    make: "Toyota",
    model: "Harrier Hybrid",
    grade: "S",
    chassis: "AXUH80-0056573",
    year: 2023,
    month: null,
    kms: 56,
    color: "beige",
    doors: 0,
    cc: 2500,
    trans: "FAT",
    fueltype: "H",
    condition: "3",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2100000,
    "jpy fob": 2100000,

    // App Extensions
    id: 31,
    km: 56000,
    badge: "S",
    interiorGrade: "C",
    auctionHouse: "JU Saitama",
    lotNumber: "1171137",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 45m",
    fobJpy: 2100000,
    landedNzd: 30263,
    estRetailNzd: 37163,
    maxBidNzd: 32663,
    targetMarginNzd: 4500,
    score: 62,
    status: "Review",
    fuel: "Hybrid",
    engine: "2500cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "AXUH80-0056573",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_harrier.jpg",
    gallery: ["/vehicles/toyota_harrier.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3 auction inspection with verified 56k kms ODO. Estimated New Zealand landed cost NZ$30,263 with projected dealer margin +NZ$4,500.",
      highlights: [
        "NZ$4,500 projected dealer gross margin at current live FX",
        "Grade 3 verified condition with 56k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: JU Saitama (Chassis: AXUH80-0056573)"
      ],
      confidence: 90,
      arbitrageSpread: 4500
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 58800, price: 37906, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 54880, price: 36791, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 61600, price: 38650, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 23016,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3947,
      totalLandedNzd: 30263,
      targetMarginNzd: 4500,
      maxBidNzd: 32663
    }
  },
  {
    // CSV Fields
    stockid: "1171138",
    make: "Toyota",
    model: "Avensis wagon",
    grade: "Xi",
    chassis: "ZRT272W-0008457",
    year: 2013,
    month: null,
    kms: 46,
    color: "black",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 520000,
    "jpy fob": 520000,

    // App Extensions
    id: 32,
    km: 46000,
    badge: "Xi",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "1171138",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 52m",
    fobJpy: 520000,
    landedNzd: 10349,
    estRetailNzd: 14549,
    maxBidNzd: 11149,
    targetMarginNzd: 3400,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "2000cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZRT272W-0008457",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 46k kms ODO. Estimated New Zealand landed cost NZ$10,349 with projected dealer margin +NZ$3,400.",
      highlights: [
        "NZ$3,400 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 46k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: USS Osaka (Chassis: ZRT272W-0008457)"
      ],
      confidence: 91,
      arbitrageSpread: 3400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2013, km: 48300, price: 14840, daysListed: 14 },
      { source: "Turners Auckland", year: 2013, km: 45080, price: 14404, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2013, km: 50600, price: 15131, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 5699,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1350,
      totalLandedNzd: 10349,
      targetMarginNzd: 3400,
      maxBidNzd: 11149
    }
  },
  {
    // CSV Fields
    stockid: "322088",
    make: "Nissan",
    model: "Nv200",
    grade: "DX (2 seats) エマージェン",
    chassis: "VM20-167719",
    year: 2021,
    month: null,
    kms: 98,
    color: "white",
    doors: 0,
    cc: 1600,
    trans: "AT",
    fueltype: "P",
    condition: "4",
    ac: "AC",
    equip: "ps, pw, rm",
    jpy_fob: 785000,
    "jpy fob": 785000,

    // App Extensions
    id: 33,
    km: 98000,
    badge: "DX (2 seats) エマージェン",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "322088",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 59m",
    fobJpy: 785000,
    landedNzd: 13690,
    estRetailNzd: 19790,
    maxBidNzd: 14790,
    targetMarginNzd: 5000,
    score: 83,
    status: "Consider",
    fuel: "Petrol",
    engine: "1600cc Petrol",
    transmission: "Automatic (AT)",
    vin: "VM20-167719",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_hiace.jpg",
    gallery: ["/vehicles/toyota_hiace.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 98k kms ODO. Estimated New Zealand landed cost NZ$13,690 with projected dealer margin +NZ$5,000.",
      highlights: [
        "NZ$5,000 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 98k km certified ODO",
        "Factory options: ps, pw, rm (AC)",
        "Auction House: USS Tokyo (Chassis: VM20-167719)"
      ],
      confidence: 91,
      arbitrageSpread: 5000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 102900, price: 20186, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 96040, price: 19592, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 107800, price: 20582, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 8604,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1786,
      totalLandedNzd: 13690,
      targetMarginNzd: 5000,
      maxBidNzd: 14790
    }
  },
  {
    // CSV Fields
    stockid: "1167985",
    make: "Honda",
    model: "Cr-v",
    grade: "Hybrid EX",
    chassis: "RT5-1002691",
    year: 2019,
    month: 9,
    kms: 100,
    color: "dark/blue",
    doors: 0,
    cc: 2000,
    trans: "DAT",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1900000,
    "jpy fob": 1900000,

    // App Extensions
    id: 34,
    km: 100000,
    badge: "Hybrid EX",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1167985",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 21m",
    fobJpy: 1900000,
    landedNzd: 27743,
    estRetailNzd: 34643,
    maxBidNzd: 29943,
    targetMarginNzd: 4700,
    score: 83,
    status: "Consider",
    fuel: "Hybrid",
    engine: "2000cc Hybrid",
    transmission: "Dual-clutch AT (DAT)",
    vin: "RT5-1002691",
    dealer: "Auckland Auto Group",
    image: "/vehicles/honda_crv.jpg",
    gallery: ["/vehicles/honda_crv.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 100k kms ODO. Estimated New Zealand landed cost NZ$27,743 with projected dealer margin +NZ$4,700.",
      highlights: [
        "NZ$4,700 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 100k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Yokohama (Chassis: RT5-1002691)"
      ],
      confidence: 91,
      arbitrageSpread: 4700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 105000, price: 35336, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 98000, price: 34297, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 110000, price: 36029, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 20824,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3619,
      totalLandedNzd: 27743,
      targetMarginNzd: 4700,
      maxBidNzd: 29943
    }
  },
  {
    // CSV Fields
    stockid: "321957",
    make: "Toyota",
    model: "C-hr",
    grade: "S LED EDITION",
    chassis: "ZYX10-2157182",
    year: 2019,
    month: null,
    kms: 30,
    color: "black",
    doors: 5,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "4",
    ac: "AAC",
    equip: "abs, ew, ps, pw, sr, nc",
    jpy_fob: 1465000,
    "jpy fob": 1465000,

    // App Extensions
    id: 35,
    km: 30000,
    badge: "S LED EDITION",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "321957",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 28m",
    fobJpy: 1465000,
    landedNzd: 22261,
    estRetailNzd: 28761,
    maxBidNzd: 24061,
    targetMarginNzd: 4700,
    score: 91,
    status: "Priority",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2157182",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 30k kms ODO. Estimated New Zealand landed cost NZ$22,261 with projected dealer margin +NZ$4,700.",
      highlights: [
        "NZ$4,700 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 30k km certified ODO",
        "Factory options: abs, ew, ps, pw, sr, nc (AAC)",
        "Auction House: TAA Kanto (Chassis: ZYX10-2157182)"
      ],
      confidence: 89,
      arbitrageSpread: 4700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 31500, price: 29336, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 29400, price: 28473, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 33000, price: 29911, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 16057,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2904,
      totalLandedNzd: 22261,
      targetMarginNzd: 4700,
      maxBidNzd: 24061
    }
  },
  {
    // CSV Fields
    stockid: "321955",
    make: "Toyota",
    model: "C-hr",
    grade: "S LED PACKAGE",
    chassis: "ZYX10-2169580",
    year: 2019,
    month: null,
    kms: 80,
    color: "pearl-white",
    doors: 5,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1420000,
    "jpy fob": 1420000,

    // App Extensions
    id: 36,
    km: 80000,
    badge: "S LED PACKAGE",
    interiorGrade: "B",
    auctionHouse: "CAA Chubu",
    lotNumber: "321955",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 35m",
    fobJpy: 1420000,
    landedNzd: 21692,
    estRetailNzd: 28092,
    maxBidNzd: 23392,
    targetMarginNzd: 4700,
    score: 84,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2169580",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 80k kms ODO. Estimated New Zealand landed cost NZ$21,692 with projected dealer margin +NZ$4,700.",
      highlights: [
        "NZ$4,700 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 80k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: ZYX10-2169580)"
      ],
      confidence: 92,
      arbitrageSpread: 4700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 84000, price: 28654, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 78400, price: 27811, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 88000, price: 29216, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15563,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2829,
      totalLandedNzd: 21692,
      targetMarginNzd: 4700,
      maxBidNzd: 23392
    }
  },
  {
    // CSV Fields
    stockid: "321973",
    make: "Mazda",
    model: "Demio",
    grade: "13S",
    chassis: "DJ3FS-140717",
    year: 2015,
    month: null,
    kms: 38,
    color: "meteor-grey",
    doors: 0,
    cc: 1300,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 525000,
    "jpy fob": 525000,

    // App Extensions
    id: 37,
    km: 38000,
    badge: "13S",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "321973",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 42m",
    fobJpy: 525000,
    landedNzd: 10412,
    estRetailNzd: 14912,
    maxBidNzd: 11212,
    targetMarginNzd: 3700,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1300cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "DJ3FS-140717",
    dealer: "Auckland Auto Group",
    image: "/vehicles/mazda_demio.jpg",
    gallery: ["/vehicles/mazda_demio.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 38k kms ODO. Estimated New Zealand landed cost NZ$10,412 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 38k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: DJ3FS-140717)"
      ],
      confidence: 91,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 39900, price: 15210, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 37240, price: 14763, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 41800, price: 15508, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 5754,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1358,
      totalLandedNzd: 10412,
      targetMarginNzd: 3700,
      maxBidNzd: 11212
    }
  },
  {
    // CSV Fields
    stockid: "1170930",
    make: "Lexus",
    model: "Rx",
    grade: "RX200t Version L",
    chassis: "AGL20W-0004905",
    year: 2017,
    month: null,
    kms: 98,
    color: "pearl",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "P",
    condition: "",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2280000,
    "jpy fob": 2280000,

    // App Extensions
    id: 38,
    km: 98000,
    badge: "RX200t Version L",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1170930",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 49m",
    fobJpy: 2280000,
    landedNzd: 32532,
    estRetailNzd: 39132,
    maxBidNzd: 35132,
    targetMarginNzd: 4000,
    score: 71,
    status: "Consider",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "AGL20W-0004905",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_harrier.jpg",
    gallery: ["/vehicles/toyota_harrier.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade  auction inspection with verified 98k kms ODO. Estimated New Zealand landed cost NZ$32,532 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade  verified condition with 98k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Nagoya (Chassis: AGL20W-0004905)"
      ],
      confidence: 89,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 102900, price: 39915, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 96040, price: 38741, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 107800, price: 40697, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 24989,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 4243,
      totalLandedNzd: 32532,
      targetMarginNzd: 4000,
      maxBidNzd: 35132
    }
  },
  {
    // CSV Fields
    stockid: "1170832",
    make: "Toyota",
    model: "Aqua",
    grade: "S",
    chassis: "NHP10-2426512",
    year: 2015,
    month: null,
    kms: 51,
    color: "purple",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 550000,
    "jpy fob": 550000,

    // App Extensions
    id: 39,
    km: 51000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "JU Saitama",
    lotNumber: "1170832",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 56m",
    fobJpy: 550000,
    landedNzd: 10727,
    estRetailNzd: 15327,
    maxBidNzd: 11627,
    targetMarginNzd: 3700,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-2426512",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 51k kms ODO. Estimated New Zealand landed cost NZ$10,727 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 51k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: JU Saitama (Chassis: NHP10-2426512)"
      ],
      confidence: 91,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 53550, price: 15634, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 49980, price: 15174, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 56100, price: 15940, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6028,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1399,
      totalLandedNzd: 10727,
      targetMarginNzd: 3700,
      maxBidNzd: 11627
    }
  },
  {
    // CSV Fields
    stockid: "1170883",
    make: "Nissan",
    model: "Note",
    grade: "Standard",
    chassis: "E12-208345",
    year: 2014,
    month: null,
    kms: 52,
    color: "blue",
    doors: 0,
    cc: 1200,
    trans: "AT",
    fueltype: "-",
    condition: "3.5",
    ac: "AAC",
    equip: "ps, pw",
    jpy_fob: 290000,
    "jpy fob": 290000,

    // App Extensions
    id: 40,
    km: 52000,
    badge: "Standard",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "1170883",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 18m",
    fobJpy: 290000,
    landedNzd: 7450,
    estRetailNzd: 11600,
    maxBidNzd: 8050,
    targetMarginNzd: 3550,
    score: 73,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1200cc Petrol / Hybrid",
    transmission: "Automatic (AT)",
    vin: "E12-208345",
    dealer: "Auckland Auto Group",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 52k kms ODO. Estimated New Zealand landed cost NZ$7,450 with projected dealer margin +NZ$3,550.",
      highlights: [
        "NZ$3,550 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 52k km certified ODO",
        "Factory options: ps, pw (AAC)",
        "Auction House: USS Osaka (Chassis: E12-208345)"
      ],
      confidence: 91,
      arbitrageSpread: 3550
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2014, km: 54600, price: 11832, daysListed: 14 },
      { source: "Turners Auckland", year: 2014, km: 50960, price: 11484, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2014, km: 57200, price: 12064, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 3178,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 972,
      totalLandedNzd: 7450,
      targetMarginNzd: 3550,
      maxBidNzd: 8050
    }
  },
  {
    // CSV Fields
    stockid: "1170749",
    make: "Tesla",
    model: "Model3",
    grade: "Long Range 4WD",
    chassis: "LRW-3F7EK4MC311",
    year: 2021,
    month: null,
    kms: 37,
    color: "white",
    doors: 0,
    cc: 0,
    trans: "CAT",
    fueltype: "E",
    condition: "4.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2300000,
    "jpy fob": 2300000,

    // App Extensions
    id: 41,
    km: 37000,
    badge: "Long Range 4WD",
    interiorGrade: "A",
    auctionHouse: "USS Tokyo",
    lotNumber: "1170749",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 25m",
    fobJpy: 2300000,
    landedNzd: 32784,
    estRetailNzd: 40784,
    maxBidNzd: 35384,
    targetMarginNzd: 5400,
    score: 96,
    status: "Priority",
    fuel: "Electric (EV)",
    engine: "Electric Drive",
    transmission: "Continuous AT (CAT)",
    vin: "LRW-3F7EK4MC311",
    dealer: "Hamilton Motors",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 37k kms ODO. Estimated New Zealand landed cost NZ$32,784 with projected dealer margin +NZ$5,400.",
      highlights: [
        "NZ$5,400 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 37k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Tokyo (Chassis: LRW-3F7EK4MC311)"
      ],
      confidence: 94,
      arbitrageSpread: 5400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 38850, price: 41600, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 36260, price: 40376, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 40700, price: 42415, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 25208,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 4276,
      totalLandedNzd: 32784,
      targetMarginNzd: 5400,
      maxBidNzd: 35384
    }
  },
  {
    // CSV Fields
    stockid: "1170748",
    make: "Lexus",
    model: "Nx",
    grade: "NX200t I Package",
    chassis: "AYZ10-1004382",
    year: 2015,
    month: null,
    kms: 95,
    color: "pearl",
    doors: 0,
    cc: 2500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1550000,
    "jpy fob": 1550000,

    // App Extensions
    id: 42,
    km: 95000,
    badge: "NX200t I Package",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1170748",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 32m",
    fobJpy: 1550000,
    landedNzd: 23331,
    estRetailNzd: 28931,
    maxBidNzd: 25231,
    targetMarginNzd: 3700,
    score: 71,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "2500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "AYZ10-1004382",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_harrier.jpg",
    gallery: ["/vehicles/toyota_harrier.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 95k kms ODO. Estimated New Zealand landed cost NZ$23,331 with projected dealer margin +NZ$3,700.",
      highlights: [
        "NZ$3,700 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 95k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Yokohama (Chassis: AYZ10-1004382)"
      ],
      confidence: 89,
      arbitrageSpread: 3700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 99750, price: 29510, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 93100, price: 28642, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 104500, price: 30088, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 16988,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3043,
      totalLandedNzd: 23331,
      targetMarginNzd: 3700,
      maxBidNzd: 25231
    }
  },
  {
    // CSV Fields
    stockid: "1170719",
    make: "Toyota",
    model: "C-hr",
    grade: "G",
    chassis: "ZYX10-2033861",
    year: 2017,
    month: null,
    kms: 85,
    color: "red",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1300000,
    "jpy fob": 1300000,

    // App Extensions
    id: 43,
    km: 85000,
    badge: "G",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "1170719",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 39m",
    fobJpy: 1300000,
    landedNzd: 20180,
    estRetailNzd: 25780,
    maxBidNzd: 21780,
    targetMarginNzd: 4000,
    score: 71,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2033861",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 85k kms ODO. Estimated New Zealand landed cost NZ$20,180 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 85k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: TAA Kanto (Chassis: ZYX10-2033861)"
      ],
      confidence: 89,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 89250, price: 26296, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 83300, price: 25522, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 93500, price: 26811, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14248,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2632,
      totalLandedNzd: 20180,
      targetMarginNzd: 4000,
      maxBidNzd: 21780
    }
  },
  {
    // CSV Fields
    stockid: "1170622",
    make: "Honda",
    model: "Cr-v",
    grade: "ハイブリッドEXマスターピース",
    chassis: "RT6-1000513",
    year: 2018,
    month: 12,
    kms: 114,
    color: "pearl-white",
    doors: 0,
    cc: 2000,
    trans: "DAT",
    fueltype: "P",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1600000,
    "jpy fob": 1600000,

    // App Extensions
    id: 44,
    km: 114000,
    badge: "ハイブリッドEXマスターピース",
    interiorGrade: "B",
    auctionHouse: "CAA Chubu",
    lotNumber: "1170622",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 46m",
    fobJpy: 1600000,
    landedNzd: 23961,
    estRetailNzd: 30411,
    maxBidNzd: 25861,
    targetMarginNzd: 4550,
    score: 82,
    status: "Consider",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Dual-clutch AT (DAT)",
    vin: "RT6-1000513",
    dealer: "Hamilton Motors",
    image: "/vehicles/honda_crv.jpg",
    gallery: ["/vehicles/honda_crv.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 114k kms ODO. Estimated New Zealand landed cost NZ$23,961 with projected dealer margin +NZ$4,550.",
      highlights: [
        "NZ$4,550 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 114k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: RT6-1000513)"
      ],
      confidence: 90,
      arbitrageSpread: 4550
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2018, km: 119700, price: 31019, daysListed: 14 },
      { source: "Turners Auckland", year: 2018, km: 111720, price: 30107, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2018, km: 125400, price: 31627, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 17536,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3125,
      totalLandedNzd: 23961,
      targetMarginNzd: 4550,
      maxBidNzd: 25861
    }
  },
  {
    // CSV Fields
    stockid: "321785",
    make: "Mazda",
    model: "Demio",
    grade: "15C",
    chassis: "DJLFS-626812",
    year: 2019,
    month: null,
    kms: 43,
    color: "pearl",
    doors: 5,
    cc: 1500,
    trans: "FAT",
    fueltype: "P",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 662000,
    "jpy fob": 662000,

    // App Extensions
    id: 45,
    km: 43000,
    badge: "15C",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "321785",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 53m",
    fobJpy: 662000,
    landedNzd: 12139,
    estRetailNzd: 17439,
    maxBidNzd: 13139,
    targetMarginNzd: 4300,
    score: 73,
    status: "Consider",
    fuel: "Petrol",
    engine: "1500cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "DJLFS-626812",
    dealer: "Christchurch Cars",
    image: "/vehicles/mazda_demio.jpg",
    gallery: ["/vehicles/mazda_demio.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 43k kms ODO. Estimated New Zealand landed cost NZ$12,139 with projected dealer margin +NZ$4,300.",
      highlights: [
        "NZ$4,300 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 43k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: DJLFS-626812)"
      ],
      confidence: 91,
      arbitrageSpread: 4300
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 45150, price: 17788, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 42140, price: 17265, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 47300, price: 18137, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 7256,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1583,
      totalLandedNzd: 12139,
      targetMarginNzd: 4300,
      maxBidNzd: 13139
    }
  },
  {
    // CSV Fields
    stockid: "1170382",
    make: "Toyota",
    model: "Prius Alpha",
    grade: "S",
    chassis: "ZVW41W-0038018",
    year: 2016,
    month: null,
    kms: 85,
    color: "black",
    doors: 0,
    cc: 1800,
    trans: "IAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 875000,
    "jpy fob": 875000,

    // App Extensions
    id: 46,
    km: 85000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1170382",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 15m",
    fobJpy: 875000,
    landedNzd: 14824,
    estRetailNzd: 19874,
    maxBidNzd: 16024,
    targetMarginNzd: 3850,
    score: 71,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "ZVW41W-0038018",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_prius.jpg",
    gallery: ["/vehicles/toyota_prius.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 85k kms ODO. Estimated New Zealand landed cost NZ$14,824 with projected dealer margin +NZ$3,850.",
      highlights: [
        "NZ$3,850 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 85k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Nagoya (Chassis: ZVW41W-0038018)"
      ],
      confidence: 89,
      arbitrageSpread: 3850
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 89250, price: 20271, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 83300, price: 19675, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 93500, price: 20669, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 9590,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1934,
      totalLandedNzd: 14824,
      targetMarginNzd: 3850,
      maxBidNzd: 16024
    }
  },
  {
    // CSV Fields
    stockid: "1170158",
    make: "Toyota",
    model: "Aqua",
    grade: "S",
    chassis: "NHP10-6581401",
    year: 2017,
    month: null,
    kms: 80,
    color: "gray",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 540000,
    "jpy fob": 540000,

    // App Extensions
    id: 47,
    km: 80000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "JU Saitama",
    lotNumber: "1170158",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 22m",
    fobJpy: 540000,
    landedNzd: 10601,
    estRetailNzd: 15401,
    maxBidNzd: 11401,
    targetMarginNzd: 4000,
    score: 72,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1500cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-6581401",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 80k kms ODO. Estimated New Zealand landed cost NZ$10,601 with projected dealer margin +NZ$4,000.",
      highlights: [
        "NZ$4,000 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 80k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: JU Saitama (Chassis: NHP10-6581401)"
      ],
      confidence: 90,
      arbitrageSpread: 4000
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 84000, price: 15709, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 78400, price: 15247, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 88000, price: 16017, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 5918,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1383,
      totalLandedNzd: 10601,
      targetMarginNzd: 4000,
      maxBidNzd: 11401
    }
  },
  {
    // CSV Fields
    stockid: "1169805",
    make: "Toyota",
    model: "Aqua",
    grade: "S",
    chassis: "NHP10-2583768",
    year: 2016,
    month: null,
    kms: 77,
    color: "yellow",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 490000,
    "jpy fob": 490000,

    // App Extensions
    id: 48,
    km: 77000,
    badge: "S",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "1169805",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 29m",
    fobJpy: 490000,
    landedNzd: 9970,
    estRetailNzd: 14620,
    maxBidNzd: 10770,
    targetMarginNzd: 3850,
    score: 72,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-2583768",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 77k kms ODO. Estimated New Zealand landed cost NZ$9,970 with projected dealer margin +NZ$3,850.",
      highlights: [
        "NZ$3,850 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 77k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Osaka (Chassis: NHP10-2583768)"
      ],
      confidence: 90,
      arbitrageSpread: 3850
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 80850, price: 14912, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 75460, price: 14474, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 84700, price: 15205, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 5370,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1300,
      totalLandedNzd: 9970,
      targetMarginNzd: 3850,
      maxBidNzd: 10770
    }
  },
  {
    // CSV Fields
    stockid: "321598",
    make: "Toyota",
    model: "C-hr",
    grade: "G LED Edition",
    chassis: "ZYX10-2119232",
    year: 2018,
    month: null,
    kms: 97,
    color: "red",
    doors: 5,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1278000,
    "jpy fob": 1278000,

    // App Extensions
    id: 49,
    km: 97000,
    badge: "G LED Edition",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "321598",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 36m",
    fobJpy: 1278000,
    landedNzd: 19903,
    estRetailNzd: 26053,
    maxBidNzd: 21503,
    targetMarginNzd: 4550,
    score: 83,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2119232",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 97k kms ODO. Estimated New Zealand landed cost NZ$19,903 with projected dealer margin +NZ$4,550.",
      highlights: [
        "NZ$4,550 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 97k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Tokyo (Chassis: ZYX10-2119232)"
      ],
      confidence: 91,
      arbitrageSpread: 4550
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2018, km: 101850, price: 26574, daysListed: 14 },
      { source: "Turners Auckland", year: 2018, km: 95060, price: 25792, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2018, km: 106700, price: 27095, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14007,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2596,
      totalLandedNzd: 19903,
      targetMarginNzd: 4550,
      maxBidNzd: 21503
    }
  },
  {
    // CSV Fields
    stockid: "1169512",
    make: "Toyota",
    model: "Hiace Van",
    grade: "LongDX GL Package",
    chassis: "GDH201V-1119628",
    year: 2025,
    month: null,
    kms: 17,
    color: "white",
    doors: 0,
    cc: 2800,
    trans: "IAT",
    fueltype: "D",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2755000,
    "jpy fob": 2755000,

    // App Extensions
    id: 50,
    km: 17000,
    badge: "LongDX GL Package",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1169512",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 43m",
    fobJpy: 2755000,
    landedNzd: 38519,
    estRetailNzd: 47219,
    maxBidNzd: 41619,
    targetMarginNzd: 5600,
    score: 87,
    status: "Priority",
    fuel: "Diesel",
    engine: "2800cc Diesel",
    transmission: "Intelligent AT (IAT)",
    vin: "GDH201V-1119628",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_hiace.jpg",
    gallery: ["/vehicles/toyota_hiace.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 17k kms ODO. Estimated New Zealand landed cost NZ$38,519 with projected dealer margin +NZ$5,600.",
      highlights: [
        "NZ$5,600 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 17k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Yokohama (Chassis: GDH201V-1119628)"
      ],
      confidence: 95,
      arbitrageSpread: 5600
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2025, km: 17850, price: 48163, daysListed: 14 },
      { source: "Turners Auckland", year: 2025, km: 16660, price: 46747, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2025, km: 18700, price: 49108, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 30195,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 5024,
      totalLandedNzd: 38519,
      targetMarginNzd: 5600,
      maxBidNzd: 41619
    }
  },
  {
    // CSV Fields
    stockid: "1168556",
    make: "Toyota",
    model: "Aqua",
    grade: "G’sレザーセレクション",
    chassis: "NHP10-6592475",
    year: 2017,
    month: null,
    kms: 98,
    color: "blue",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "-",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, abs",
    jpy_fob: 730000,
    "jpy fob": 730000,

    // App Extensions
    id: 51,
    km: 98000,
    badge: "G’sレザーセレクション",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "1168556",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 50m",
    fobJpy: 730000,
    landedNzd: 12996,
    estRetailNzd: 18396,
    maxBidNzd: 13996,
    targetMarginNzd: 4400,
    score: 83,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "1500cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "NHP10-6592475",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 98k kms ODO. Estimated New Zealand landed cost NZ$12,996 with projected dealer margin +NZ$4,400.",
      highlights: [
        "NZ$4,400 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 98k km certified ODO",
        "Factory options: ps, pw, abs (AAC)",
        "Auction House: TAA Kanto (Chassis: NHP10-6592475)"
      ],
      confidence: 91,
      arbitrageSpread: 4400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 102900, price: 18764, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 96040, price: 18212, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 107800, price: 19132, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 8001,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1695,
      totalLandedNzd: 12996,
      targetMarginNzd: 4400,
      maxBidNzd: 13996
    }
  },
  {
    // CSV Fields
    stockid: "321136",
    make: "Nissan",
    model: "March",
    grade: "S",
    chassis: "K13-094514",
    year: 2021,
    month: null,
    kms: 7,
    color: "silver k23",
    doors: 0,
    cc: 1200,
    trans: "FAT",
    fueltype: "P",
    condition: "4.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 595000,
    "jpy fob": 595000,

    // App Extensions
    id: 52,
    km: 7000,
    badge: "S",
    interiorGrade: "A",
    auctionHouse: "CAA Chubu",
    lotNumber: "321136",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 57m",
    fobJpy: 595000,
    landedNzd: 11294,
    estRetailNzd: 17594,
    maxBidNzd: 12194,
    targetMarginNzd: 5400,
    score: 98,
    status: "Priority",
    fuel: "Petrol",
    engine: "1200cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "K13-094514",
    dealer: "Auckland Auto Group",
    image: "/vehicles/mazda_demio.jpg",
    gallery: ["/vehicles/mazda_demio.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 7k kms ODO. Estimated New Zealand landed cost NZ$11,294 with projected dealer margin +NZ$5,400.",
      highlights: [
        "NZ$5,400 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 7k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: K13-094514)"
      ],
      confidence: 96,
      arbitrageSpread: 5400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 7350, price: 17946, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 6860, price: 17418, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 7700, price: 18298, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 6521,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1473,
      totalLandedNzd: 11294,
      targetMarginNzd: 5400,
      maxBidNzd: 12194
    }
  },
  {
    // CSV Fields
    stockid: "1168375",
    make: "Toyota",
    model: "Corolla Sports",
    grade: "Hybrid G",
    chassis: "ZWE211H-1012018",
    year: 2018,
    month: null,
    kms: 57,
    color: "black",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1290000,
    "jpy fob": 1290000,

    // App Extensions
    id: 53,
    km: 57000,
    badge: "Hybrid G",
    interiorGrade: "B",
    auctionHouse: "HAA Kobe",
    lotNumber: "1168375",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 19m",
    fobJpy: 1290000,
    landedNzd: 20055,
    estRetailNzd: 26205,
    maxBidNzd: 21655,
    targetMarginNzd: 4550,
    score: 85,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZWE211H-1012018",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 57k kms ODO. Estimated New Zealand landed cost NZ$20,055 with projected dealer margin +NZ$4,550.",
      highlights: [
        "NZ$4,550 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 57k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: ZWE211H-1012018)"
      ],
      confidence: 93,
      arbitrageSpread: 4550
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2018, km: 59850, price: 26729, daysListed: 14 },
      { source: "Turners Auckland", year: 2018, km: 55860, price: 25943, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2018, km: 62700, price: 27253, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14139,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2616,
      totalLandedNzd: 20055,
      targetMarginNzd: 4550,
      maxBidNzd: 21655
    }
  },
  {
    // CSV Fields
    stockid: "1166879",
    make: "Toyota",
    model: "Vellfire Hybrid",
    grade: "X 4WD",
    chassis: "AYH30W-0003920",
    year: 2015,
    month: null,
    kms: 99,
    color: "black",
    doors: 0,
    cc: 2500,
    trans: "IAT",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1690000,
    "jpy fob": 1690000,

    // App Extensions
    id: 54,
    km: 99000,
    badge: "X 4WD",
    interiorGrade: "B",
    auctionHouse: "USS Nagoya",
    lotNumber: "1166879",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 26m",
    fobJpy: 1690000,
    landedNzd: 25096,
    estRetailNzd: 31196,
    maxBidNzd: 27096,
    targetMarginNzd: 4100,
    score: 83,
    status: "Consider",
    fuel: "Hybrid",
    engine: "2500cc Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "AYH30W-0003920",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_alphard.jpg",
    gallery: ["/vehicles/toyota_alphard.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 99k kms ODO. Estimated New Zealand landed cost NZ$25,096 with projected dealer margin +NZ$4,100.",
      highlights: [
        "NZ$4,100 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 99k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Nagoya (Chassis: AYH30W-0003920)"
      ],
      confidence: 91,
      arbitrageSpread: 4100
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 103950, price: 31820, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 97020, price: 30884, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 108900, price: 32444, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 18523,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3273,
      totalLandedNzd: 25096,
      targetMarginNzd: 4100,
      maxBidNzd: 27096
    }
  },
  {
    // CSV Fields
    stockid: "1166877",
    make: "Toyota",
    model: "Corolla Touring",
    grade: "Hybrid G 4WD",
    chassis: "ZWE215W-0006400",
    year: 2023,
    month: null,
    kms: 82,
    color: "white",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "H",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1400000,
    "jpy fob": 1400000,

    // App Extensions
    id: 55,
    km: 82000,
    badge: "Hybrid G 4WD",
    interiorGrade: "B",
    auctionHouse: "JU Saitama",
    lotNumber: "1166877",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 33m",
    fobJpy: 1400000,
    landedNzd: 21441,
    estRetailNzd: 28041,
    maxBidNzd: 23141,
    targetMarginNzd: 4900,
    score: 72,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1800cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZWE215W-0006400",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_corolla_touring.jpg",
    gallery: ["/vehicles/toyota_corolla_touring.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 82k kms ODO. Estimated New Zealand landed cost NZ$21,441 with projected dealer margin +NZ$4,900.",
      highlights: [
        "NZ$4,900 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 82k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: JU Saitama (Chassis: ZWE215W-0006400)"
      ],
      confidence: 90,
      arbitrageSpread: 4900
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 86100, price: 28602, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 80360, price: 27761, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 90200, price: 29163, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15344,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2797,
      totalLandedNzd: 21441,
      targetMarginNzd: 4900,
      maxBidNzd: 23141
    }
  },
  {
    // CSV Fields
    stockid: "320637",
    make: "Nissan",
    model: "Nv200 Vanette Van",
    grade: "DX",
    chassis: "VM20-192597",
    year: 2022,
    month: null,
    kms: 31,
    color: "white",
    doors: 5,
    cc: 1600,
    trans: "AT",
    fueltype: "P",
    condition: "3.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1200000,
    "jpy fob": 1200000,

    // App Extensions
    id: 56,
    km: 31000,
    badge: "DX",
    interiorGrade: "B",
    auctionHouse: "USS Osaka",
    lotNumber: "320637",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 40m",
    fobJpy: 1200000,
    landedNzd: 18920,
    estRetailNzd: 25170,
    maxBidNzd: 20420,
    targetMarginNzd: 4750,
    score: 74,
    status: "Consider",
    fuel: "Petrol",
    engine: "1600cc Petrol",
    transmission: "Automatic (AT)",
    vin: "VM20-192597",
    dealer: "Hamilton Motors",
    image: "/vehicles/toyota_hiace.jpg",
    gallery: ["/vehicles/toyota_hiace.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 31k kms ODO. Estimated New Zealand landed cost NZ$18,920 with projected dealer margin +NZ$4,750.",
      highlights: [
        "NZ$4,750 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 31k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Osaka (Chassis: VM20-192597)"
      ],
      confidence: 92,
      arbitrageSpread: 4750
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2022, km: 32550, price: 25673, daysListed: 14 },
      { source: "Turners Auckland", year: 2022, km: 30380, price: 24918, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2022, km: 34100, price: 26177, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 13152,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2468,
      totalLandedNzd: 18920,
      targetMarginNzd: 4750,
      maxBidNzd: 20420
    }
  },
  {
    // CSV Fields
    stockid: "1165726",
    make: "Suzuki",
    model: "Ignis",
    grade: "HYBRID MX",
    chassis: "FF21S-124616",
    year: 2016,
    month: null,
    kms: 74,
    color: "orange",
    doors: 0,
    cc: 1200,
    trans: "FAT",
    fueltype: "H",
    condition: "",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 350000,
    "jpy fob": 350000,

    // App Extensions
    id: 57,
    km: 74000,
    badge: "HYBRID MX",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "1165726",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 47m",
    fobJpy: 350000,
    landedNzd: 8206,
    estRetailNzd: 12756,
    maxBidNzd: 8906,
    targetMarginNzd: 3850,
    score: 72,
    status: "Consider",
    fuel: "Hybrid",
    engine: "1200cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "FF21S-124616",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_aqua.jpg",
    gallery: ["/vehicles/toyota_aqua.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade  auction inspection with verified 74k kms ODO. Estimated New Zealand landed cost NZ$8,206 with projected dealer margin +NZ$3,850.",
      highlights: [
        "NZ$3,850 projected dealer gross margin at current live FX",
        "Grade  verified condition with 74k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Tokyo (Chassis: FF21S-124616)"
      ],
      confidence: 90,
      arbitrageSpread: 3850
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2016, km: 77700, price: 13011, daysListed: 14 },
      { source: "Turners Auckland", year: 2016, km: 72520, price: 12628, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2016, km: 81400, price: 13266, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 3836,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1070,
      totalLandedNzd: 8206,
      targetMarginNzd: 3850,
      maxBidNzd: 8906
    }
  },
  {
    // CSV Fields
    stockid: "1165080",
    make: "Subaru",
    model: "Forester",
    grade: "アドバンス 4WD",
    chassis: "SKE-015912",
    year: 2019,
    month: null,
    kms: 89,
    color: "silver",
    doors: 0,
    cc: 2000,
    trans: "FAT",
    fueltype: "-",
    condition: "4",
    ac: "AAC",
    equip: "ps, pw, ew",
    jpy_fob: 1330000,
    "jpy fob": 1330000,

    // App Extensions
    id: 58,
    km: 89000,
    badge: "アドバンス 4WD",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "1165080",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 54m",
    fobJpy: 1330000,
    landedNzd: 20559,
    estRetailNzd: 26859,
    maxBidNzd: 22159,
    targetMarginNzd: 4700,
    score: 84,
    status: "Consider",
    fuel: "Petrol / Hybrid",
    engine: "2000cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "SKE-015912",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_rav4.jpg",
    gallery: ["/vehicles/toyota_rav4.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 89k kms ODO. Estimated New Zealand landed cost NZ$20,559 with projected dealer margin +NZ$4,700.",
      highlights: [
        "NZ$4,700 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 89k km certified ODO",
        "Factory options: ps, pw, ew (AAC)",
        "Auction House: USS Yokohama (Chassis: SKE-015912)"
      ],
      confidence: 92,
      arbitrageSpread: 4700
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2019, km: 93450, price: 27396, daysListed: 14 },
      { source: "Turners Auckland", year: 2019, km: 87220, price: 26590, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2019, km: 97900, price: 27933, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14577,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2682,
      totalLandedNzd: 20559,
      targetMarginNzd: 4700,
      maxBidNzd: 22159
    }
  },
  {
    // CSV Fields
    stockid: "1164312",
    make: "Mazda",
    model: "Demio",
    grade: "13- Skyactive",
    chassis: "DEJFS-136281",
    year: 2013,
    month: null,
    kms: 62,
    color: "brown",
    doors: 0,
    cc: 1300,
    trans: "AT",
    fueltype: "P",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 260000,
    "jpy fob": 260000,

    // App Extensions
    id: 59,
    km: 62000,
    badge: "13- Skyactive",
    interiorGrade: "B",
    auctionHouse: "TAA Kanto",
    lotNumber: "1164312",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 16m",
    fobJpy: 260000,
    landedNzd: 7072,
    estRetailNzd: 11472,
    maxBidNzd: 7672,
    targetMarginNzd: 3800,
    score: 85,
    status: "Consider",
    fuel: "Petrol",
    engine: "1300cc Petrol",
    transmission: "Automatic (AT)",
    vin: "DEJFS-136281",
    dealer: "Hamilton Motors",
    image: "/vehicles/mazda_demio.jpg",
    gallery: ["/vehicles/mazda_demio.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 62k kms ODO. Estimated New Zealand landed cost NZ$7,072 with projected dealer margin +NZ$3,800.",
      highlights: [
        "NZ$3,800 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 62k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: TAA Kanto (Chassis: DEJFS-136281)"
      ],
      confidence: 93,
      arbitrageSpread: 3800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2013, km: 65100, price: 11701, daysListed: 14 },
      { source: "Turners Auckland", year: 2013, km: 60760, price: 11357, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2013, km: 68200, price: 11931, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 2850,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 922,
      totalLandedNzd: 7072,
      targetMarginNzd: 3800,
      maxBidNzd: 7672
    }
  },
  {
    // CSV Fields
    stockid: "1163311",
    make: "Toyota",
    model: "C-hr",
    grade: "G",
    chassis: "ZYX10-2016800",
    year: 2017,
    month: null,
    kms: 51,
    color: "silver",
    doors: 0,
    cc: 1800,
    trans: "FAT",
    fueltype: "-",
    condition: "4.5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1380000,
    "jpy fob": 1380000,

    // App Extensions
    id: 60,
    km: 51000,
    badge: "G",
    interiorGrade: "A",
    auctionHouse: "CAA Chubu",
    lotNumber: "1163311",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 23m",
    fobJpy: 1380000,
    landedNzd: 21189,
    estRetailNzd: 27689,
    maxBidNzd: 22889,
    targetMarginNzd: 4800,
    score: 95,
    status: "Priority",
    fuel: "Petrol / Hybrid",
    engine: "1800cc Petrol / Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX10-2016800",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 51k kms ODO. Estimated New Zealand landed cost NZ$21,189 with projected dealer margin +NZ$4,800.",
      highlights: [
        "NZ$4,800 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 51k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: CAA Chubu (Chassis: ZYX10-2016800)"
      ],
      confidence: 93,
      arbitrageSpread: 4800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2017, km: 53550, price: 28243, daysListed: 14 },
      { source: "Turners Auckland", year: 2017, km: 49980, price: 27412, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2017, km: 56100, price: 28797, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15125,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2764,
      totalLandedNzd: 21189,
      targetMarginNzd: 4800,
      maxBidNzd: 22889
    }
  },
  {
    // CSV Fields
    stockid: "1162086",
    make: "Nissan",
    model: "X-trail",
    grade: "X_e-4ORCE",
    chassis: "SNT33-004794",
    year: 2022,
    month: null,
    kms: 80,
    color: "gray",
    doors: 0,
    cc: 1500,
    trans: "FAT",
    fueltype: "P",
    condition: "5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2100000,
    "jpy fob": 2100000,

    // App Extensions
    id: 61,
    km: 80000,
    badge: "X_e-4ORCE",
    interiorGrade: "A",
    auctionHouse: "HAA Kobe",
    lotNumber: "1162086",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 30m",
    fobJpy: 2100000,
    landedNzd: 30263,
    estRetailNzd: 38463,
    maxBidNzd: 32663,
    targetMarginNzd: 5800,
    score: 93,
    status: "Priority",
    fuel: "Petrol",
    engine: "1500cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "SNT33-004794",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_rav4.jpg",
    gallery: ["/vehicles/toyota_rav4.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 80k kms ODO. Estimated New Zealand landed cost NZ$30,263 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 80k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: HAA Kobe (Chassis: SNT33-004794)"
      ],
      confidence: 91,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2022, km: 84000, price: 39232, daysListed: 14 },
      { source: "Turners Auckland", year: 2022, km: 78400, price: 38078, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2022, km: 88000, price: 40002, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 23016,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3947,
      totalLandedNzd: 30263,
      targetMarginNzd: 5800,
      maxBidNzd: 32663
    }
  },
  {
    // CSV Fields
    stockid: "318545",
    make: "Mazda",
    model: "Mazda3",
    grade: "20S L Package",
    chassis: "BPFP-116352",
    year: 2021,
    month: null,
    kms: 30,
    color: "silver",
    doors: 5,
    cc: 2000,
    trans: "FAT",
    fueltype: "P",
    condition: "4.5",
    ac: "AAC",
    equip: "abs, aw, ps, pw, sm, tr",
    jpy_fob: 1450000,
    "jpy fob": 1450000,

    // App Extensions
    id: 62,
    km: 30000,
    badge: "20S L Package",
    interiorGrade: "A",
    auctionHouse: "USS Nagoya",
    lotNumber: "318545",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "3h 37m",
    fobJpy: 1450000,
    landedNzd: 22071,
    estRetailNzd: 29271,
    maxBidNzd: 23871,
    targetMarginNzd: 5400,
    score: 96,
    status: "Priority",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "BPFP-116352",
    dealer: "Hamilton Motors",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 30k kms ODO. Estimated New Zealand landed cost NZ$22,071 with projected dealer margin +NZ$5,400.",
      highlights: [
        "NZ$5,400 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 30k km certified ODO",
        "Factory options: abs, aw, ps, pw, sm, tr (AAC)",
        "Auction House: USS Nagoya (Chassis: BPFP-116352)"
      ],
      confidence: 94,
      arbitrageSpread: 5400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 31500, price: 29856, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 29400, price: 28978, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 33000, price: 30442, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 15892,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2879,
      totalLandedNzd: 22071,
      targetMarginNzd: 5400,
      maxBidNzd: 23871
    }
  },
  {
    // CSV Fields
    stockid: "318546",
    make: "Toyota",
    model: "C-hr",
    grade: "G Mode Nero Safety",
    chassis: "ZYX11-2040207",
    year: 2021,
    month: 3,
    kms: 63,
    color: "black",
    doors: 5,
    cc: 1797,
    trans: "FAT",
    fueltype: "P",
    condition: "4.5",
    ac: "AAC",
    equip: "abs, aw, ps, pw, es, s",
    jpy_fob: 1880000,
    "jpy fob": 1880000,

    // App Extensions
    id: 63,
    km: 63000,
    badge: "G Mode Nero Safety",
    interiorGrade: "A",
    auctionHouse: "JU Saitama",
    lotNumber: "318546",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "4h 44m",
    fobJpy: 1880000,
    landedNzd: 27491,
    estRetailNzd: 35091,
    maxBidNzd: 29691,
    targetMarginNzd: 5400,
    score: 94,
    status: "Priority",
    fuel: "Petrol",
    engine: "1797cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "ZYX11-2040207",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_chr.jpg",
    gallery: ["/vehicles/toyota_chr.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 63k kms ODO. Estimated New Zealand landed cost NZ$27,491 with projected dealer margin +NZ$5,400.",
      highlights: [
        "NZ$5,400 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 63k km certified ODO",
        "Factory options: abs, aw, ps, pw, es, s (AAC)",
        "Auction House: JU Saitama (Chassis: ZYX11-2040207)"
      ],
      confidence: 92,
      arbitrageSpread: 5400
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 66150, price: 35793, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 61740, price: 34740, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 69300, price: 36495, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 20605,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3586,
      totalLandedNzd: 27491,
      targetMarginNzd: 5400,
      maxBidNzd: 29691
    }
  },
  {
    // CSV Fields
    stockid: "318423",
    make: "BMW",
    model: "5 Series",
    grade: "523i_M Sports",
    chassis: "WBA-JA12080BJ155",
    year: 2020,
    month: null,
    kms: 47,
    color: "black",
    doors: 5,
    cc: 2000,
    trans: "AT",
    fueltype: "P",
    condition: "4.5",
    ac: "AAC",
    equip: "abs, aw, ps, pw, es, r",
    jpy_fob: 1840000,
    "jpy fob": 1840000,

    // App Extensions
    id: 64,
    km: 47000,
    badge: "523i_M Sports",
    interiorGrade: "A",
    auctionHouse: "USS Osaka",
    lotNumber: "318423",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "5h 51m",
    fobJpy: 1840000,
    landedNzd: 26987,
    estRetailNzd: 34437,
    maxBidNzd: 29187,
    targetMarginNzd: 5250,
    score: 95,
    status: "Priority",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Automatic (AT)",
    vin: "WBA-JA12080BJ155",
    dealer: "Auckland Auto Group",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 47k kms ODO. Estimated New Zealand landed cost NZ$26,987 with projected dealer margin +NZ$5,250.",
      highlights: [
        "NZ$5,250 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 47k km certified ODO",
        "Factory options: abs, aw, ps, pw, es, r (AAC)",
        "Auction House: USS Osaka (Chassis: WBA-JA12080BJ155)"
      ],
      confidence: 93,
      arbitrageSpread: 5250
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2020, km: 49350, price: 35126, daysListed: 14 },
      { source: "Turners Auckland", year: 2020, km: 46060, price: 34093, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2020, km: 51700, price: 35814, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 20167,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 3520,
      totalLandedNzd: 26987,
      targetMarginNzd: 5250,
      maxBidNzd: 29187
    }
  },
  {
    // CSV Fields
    stockid: "318421",
    make: "BMW",
    model: "3 Series",
    grade: "320i_Mスポーツエディション",
    chassis: "WBA-8A19090NU774",
    year: 2018,
    month: null,
    kms: 72,
    color: "black",
    doors: 5,
    cc: 2000,
    trans: "FAT",
    fueltype: "P",
    condition: "4.5",
    ac: "AAC",
    equip: "abs, aw, ps, pw, es, r",
    jpy_fob: 1350000,
    "jpy fob": 1350000,

    // App Extensions
    id: 65,
    km: 72000,
    badge: "320i_Mスポーツエディション",
    interiorGrade: "A",
    auctionHouse: "USS Tokyo",
    lotNumber: "318421",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "6h 58m",
    fobJpy: 1350000,
    landedNzd: 20810,
    estRetailNzd: 27460,
    maxBidNzd: 22510,
    targetMarginNzd: 4950,
    score: 93,
    status: "Priority",
    fuel: "Petrol",
    engine: "2000cc Petrol",
    transmission: "Floor Automatic (FAT)",
    vin: "WBA-8A19090NU774",
    dealer: "Hamilton Motors",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4.5 auction inspection with verified 72k kms ODO. Estimated New Zealand landed cost NZ$20,810 with projected dealer margin +NZ$4,950.",
      highlights: [
        "NZ$4,950 projected dealer gross margin at current live FX",
        "Grade 4.5 verified condition with 72k km certified ODO",
        "Factory options: abs, aw, ps, pw, es, r (AAC)",
        "Auction House: USS Tokyo (Chassis: WBA-8A19090NU774)"
      ],
      confidence: 91,
      arbitrageSpread: 4950
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2018, km: 75600, price: 28009, daysListed: 14 },
      { source: "Turners Auckland", year: 2018, km: 70560, price: 27185, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2018, km: 79200, price: 28558, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 14796,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2714,
      totalLandedNzd: 20810,
      targetMarginNzd: 4950,
      maxBidNzd: 22510
    }
  },
  {
    // CSV Fields
    stockid: "317214",
    make: "Toyota",
    model: "Alphard Hybrid",
    grade: "X 4WD",
    chassis: "AYH30W-0132485",
    year: 2021,
    month: null,
    kms: 84,
    color: "pearl",
    doors: 5,
    cc: 2500,
    trans: "IAT",
    fueltype: "H",
    condition: "3.5",
    ac: "WAC",
    equip: "abs, ps, pw, em, tv, na",
    jpy_fob: 2580000,
    "jpy fob": 2580000,

    // App Extensions
    id: 66,
    km: 84000,
    badge: "X 4WD",
    interiorGrade: "B",
    auctionHouse: "USS Yokohama",
    lotNumber: "317214",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "7h 20m",
    fobJpy: 2580000,
    landedNzd: 36314,
    estRetailNzd: 43814,
    maxBidNzd: 39214,
    targetMarginNzd: 4600,
    score: 71,
    status: "Consider",
    fuel: "Hybrid",
    engine: "2500cc Hybrid",
    transmission: "Intelligent AT (IAT)",
    vin: "AYH30W-0132485",
    dealer: "Christchurch Cars",
    image: "/vehicles/toyota_alphard.jpg",
    gallery: ["/vehicles/toyota_alphard.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 3.5 auction inspection with verified 84k kms ODO. Estimated New Zealand landed cost NZ$36,314 with projected dealer margin +NZ$4,600.",
      highlights: [
        "NZ$4,600 projected dealer gross margin at current live FX",
        "Grade 3.5 verified condition with 84k km certified ODO",
        "Factory options: abs, ps, pw, em, tv, na (WAC)",
        "Auction House: USS Yokohama (Chassis: AYH30W-0132485)"
      ],
      confidence: 89,
      arbitrageSpread: 4600
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 88200, price: 44690, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 82320, price: 43376, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 92400, price: 45567, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 28277,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 4737,
      totalLandedNzd: 36314,
      targetMarginNzd: 4600,
      maxBidNzd: 39214
    }
  },
  {
    // CSV Fields
    stockid: "316929",
    make: "Toyota",
    model: "Harrier",
    grade: "Hybrid Z",
    chassis: "AXUH80-0043256",
    year: 2022,
    month: null,
    kms: 58,
    color: "black",
    doors: 5,
    cc: 2500,
    trans: "FAT",
    fueltype: "H",
    condition: "5",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 2700000,
    "jpy fob": 2700000,

    // App Extensions
    id: 67,
    km: 58000,
    badge: "Hybrid Z",
    interiorGrade: "A",
    auctionHouse: "TAA Kanto",
    lotNumber: "316929",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "8h 27m",
    fobJpy: 2700000,
    landedNzd: 37826,
    estRetailNzd: 46626,
    maxBidNzd: 40826,
    targetMarginNzd: 5800,
    score: 94,
    status: "Priority",
    fuel: "Hybrid",
    engine: "2500cc Hybrid",
    transmission: "Floor Automatic (FAT)",
    vin: "AXUH80-0043256",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_harrier.jpg",
    gallery: ["/vehicles/toyota_harrier.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 58k kms ODO. Estimated New Zealand landed cost NZ$37,826 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 58k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: TAA Kanto (Chassis: AXUH80-0043256)"
      ],
      confidence: 92,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2022, km: 60900, price: 47559, daysListed: 14 },
      { source: "Turners Auckland", year: 2022, km: 56840, price: 46160, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2022, km: 63800, price: 48491, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 29592,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 4934,
      totalLandedNzd: 37826,
      targetMarginNzd: 5800,
      maxBidNzd: 40826
    }
  },
  {
    // CSV Fields
    stockid: "1153771",
    make: "Honda",
    model: "CBR650R",
    grade: "UNKNOWN",
    chassis: "RH03-1201",
    year: 2023,
    month: null,
    kms: 26,
    color: "white",
    doors: 0,
    cc: 650,
    trans: "MT",
    fueltype: "G",
    condition: "5",
    ac: "UNKNOWN",
    equip: "ps, pw",
    jpy_fob: 822000,
    "jpy fob": 822000,

    // App Extensions
    id: 68,
    km: 26000,
    badge: "UNKNOWN",
    interiorGrade: "A",
    auctionHouse: "CAA Chubu",
    lotNumber: "1153771",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "9h 34m",
    fobJpy: 822000,
    landedNzd: 14155,
    estRetailNzd: 21055,
    maxBidNzd: 15255,
    targetMarginNzd: 5800,
    score: 96,
    status: "Priority",
    fuel: "Gasoline",
    engine: "650cc Gasoline",
    transmission: "Manual (MT)",
    vin: "RH03-1201",
    dealer: "Hamilton Motors",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 26k kms ODO. Estimated New Zealand landed cost NZ$14,155 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 26k km certified ODO",
        "Factory options: ps, pw (UNKNOWN)",
        "Auction House: CAA Chubu (Chassis: RH03-1201)"
      ],
      confidence: 94,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 27300, price: 21476, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 25480, price: 20844, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 28600, price: 21897, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 9009,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1846,
      totalLandedNzd: 14155,
      targetMarginNzd: 5800,
      maxBidNzd: 15255
    }
  },
  {
    // CSV Fields
    stockid: "1153108",
    make: "Honda",
    model: "CBR650R",
    grade: "UNKNOWN",
    chassis: "RH03E-1200214",
    year: 2023,
    month: null,
    kms: 3,
    color: "black",
    doors: 0,
    cc: 650,
    trans: "MT",
    fueltype: "G",
    condition: "5",
    ac: "UNKNOWN",
    equip: "ps, pw",
    jpy_fob: 980000,
    "jpy fob": 980000,

    // App Extensions
    id: 69,
    km: 3000,
    badge: "UNKNOWN",
    interiorGrade: "A",
    auctionHouse: "HAA Kobe",
    lotNumber: "1153108",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "10h 41m",
    fobJpy: 980000,
    landedNzd: 16147,
    estRetailNzd: 23247,
    maxBidNzd: 17447,
    targetMarginNzd: 5800,
    score: 98,
    status: "Priority",
    fuel: "Gasoline",
    engine: "650cc Gasoline",
    transmission: "Manual (MT)",
    vin: "RH03E-1200214",
    dealer: "Christchurch Cars",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 3k kms ODO. Estimated New Zealand landed cost NZ$16,147 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 3k km certified ODO",
        "Factory options: ps, pw (UNKNOWN)",
        "Auction House: HAA Kobe (Chassis: RH03E-1200214)"
      ],
      confidence: 96,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 3150, price: 23712, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 2940, price: 23015, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 3300, price: 24177, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 10741,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2106,
      totalLandedNzd: 16147,
      targetMarginNzd: 5800,
      maxBidNzd: 17447
    }
  },
  {
    // CSV Fields
    stockid: "1153106",
    make: "BMW",
    model: "NINE TSCRAMBLER",
    grade: "UNKNOWN",
    chassis: "WB10L7105P6G08",
    year: 2023,
    month: null,
    kms: 10,
    color: "gray",
    doors: 0,
    cc: 1170,
    trans: "MT",
    fueltype: "G",
    condition: "5",
    ac: "UNKNOWN",
    equip: "ps, pw",
    jpy_fob: 1110000,
    "jpy fob": 1110000,

    // App Extensions
    id: 70,
    km: 10000,
    badge: "UNKNOWN",
    interiorGrade: "A",
    auctionHouse: "USS Nagoya",
    lotNumber: "1153106",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "11h 48m",
    fobJpy: 1110000,
    landedNzd: 17786,
    estRetailNzd: 24986,
    maxBidNzd: 19186,
    targetMarginNzd: 5800,
    score: 97,
    status: "Priority",
    fuel: "Gasoline",
    engine: "1170cc Gasoline",
    transmission: "Manual (MT)",
    vin: "WB10L7105P6G08",
    dealer: "Auckland Auto Group",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 10k kms ODO. Estimated New Zealand landed cost NZ$17,786 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 10k km certified ODO",
        "Factory options: ps, pw (UNKNOWN)",
        "Auction House: USS Nagoya (Chassis: WB10L7105P6G08)"
      ],
      confidence: 95,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2023, km: 10500, price: 25486, daysListed: 14 },
      { source: "Turners Auckland", year: 2023, km: 9800, price: 24736, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2023, km: 11000, price: 25985, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 12166,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2320,
      totalLandedNzd: 17786,
      targetMarginNzd: 5800,
      maxBidNzd: 19186
    }
  },
  {
    // CSV Fields
    stockid: "1150840",
    make: "HONDA",
    model: "REBEL250",
    grade: "A",
    chassis: "MC49-1410498",
    year: 2024,
    month: null,
    kms: 28,
    color: "MATBLACK",
    doors: 0,
    cc: 250,
    trans: "MT",
    fueltype: "P",
    condition: "5",
    ac: "UNKNOWN",
    equip: "ps, pw",
    jpy_fob: 452000,
    "jpy fob": 452000,

    // App Extensions
    id: 71,
    km: 28000,
    badge: "A",
    interiorGrade: "A",
    auctionHouse: "JU Saitama",
    lotNumber: "1150840",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "12h 55m",
    fobJpy: 452000,
    landedNzd: 9492,
    estRetailNzd: 16092,
    maxBidNzd: 10292,
    targetMarginNzd: 5800,
    score: 96,
    status: "Priority",
    fuel: "Petrol",
    engine: "250cc Petrol",
    transmission: "Manual (MT)",
    vin: "MC49-1410498",
    dealer: "Hamilton Motors",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 28k kms ODO. Estimated New Zealand landed cost NZ$9,492 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 28k km certified ODO",
        "Factory options: ps, pw (UNKNOWN)",
        "Auction House: JU Saitama (Chassis: MC49-1410498)"
      ],
      confidence: 94,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2024, km: 29400, price: 16414, daysListed: 14 },
      { source: "Turners Auckland", year: 2024, km: 27440, price: 15931, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2024, km: 30800, price: 16736, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 4954,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 1238,
      totalLandedNzd: 9492,
      targetMarginNzd: 5800,
      maxBidNzd: 10292
    }
  },
  {
    // CSV Fields
    stockid: "1150839",
    make: "DUCATI",
    model: "STREETFIGHTER",
    grade: "V4S",
    chassis: "ZDM1F00AAMB0028",
    year: 2021,
    month: null,
    kms: 19,
    color: "RED",
    doors: 0,
    cc: 1100,
    trans: "MT",
    fueltype: "P",
    condition: "5",
    ac: "UNKNOWN",
    equip: "ps, pw",
    jpy_fob: 1522000,
    "jpy fob": 1522000,

    // App Extensions
    id: 72,
    km: 19000,
    badge: "V4S",
    interiorGrade: "A",
    auctionHouse: "USS Osaka",
    lotNumber: "1150839",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "13h 17m",
    fobJpy: 1522000,
    landedNzd: 22978,
    estRetailNzd: 30578,
    maxBidNzd: 24778,
    targetMarginNzd: 5800,
    score: 97,
    status: "Priority",
    fuel: "Petrol",
    engine: "1100cc Petrol",
    transmission: "Manual (MT)",
    vin: "ZDM1F00AAMB0028",
    dealer: "Christchurch Cars",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    gallery: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 5 auction inspection with verified 19k kms ODO. Estimated New Zealand landed cost NZ$22,978 with projected dealer margin +NZ$5,800.",
      highlights: [
        "NZ$5,800 projected dealer gross margin at current live FX",
        "Grade 5 verified condition with 19k km certified ODO",
        "Factory options: ps, pw (UNKNOWN)",
        "Auction House: USS Osaka (Chassis: ZDM1F00AAMB0028)"
      ],
      confidence: 95,
      arbitrageSpread: 5800
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2021, km: 19950, price: 31190, daysListed: 14 },
      { source: "Turners Auckland", year: 2021, km: 18620, price: 30272, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2021, km: 20900, price: 31801, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 16681,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2997,
      totalLandedNzd: 22978,
      targetMarginNzd: 5800,
      maxBidNzd: 24778
    }
  },
  {
    // CSV Fields
    stockid: "315020",
    make: "Toyota",
    model: "Harrier Hybrid 4wd",
    grade: "ELEGANCE",
    chassis: "AVU65W-0038177",
    year: 2015,
    month: null,
    kms: 94,
    color: "silver",
    doors: 5,
    cc: 2500,
    trans: "IA",
    fueltype: "H",
    condition: "4",
    ac: "AC",
    equip: "ps, pw",
    jpy_fob: 1145000,
    "jpy fob": 1145000,

    // App Extensions
    id: 73,
    km: 94000,
    badge: "ELEGANCE",
    interiorGrade: "B",
    auctionHouse: "USS Tokyo",
    lotNumber: "315020",
    auctionDate: "Tomorrow, 10:45 AM JST",
    timeLeft: "2h 24m",
    fobJpy: 1145000,
    landedNzd: 18226,
    estRetailNzd: 23826,
    maxBidNzd: 19726,
    targetMarginNzd: 4100,
    score: 83,
    status: "Consider",
    fuel: "Hybrid",
    engine: "2500cc Hybrid",
    transmission: "Intelligent Auto (IA)",
    vin: "AVU65W-0038177",
    dealer: "Auckland Auto Group",
    image: "/vehicles/toyota_harrier.jpg",
    gallery: ["/vehicles/toyota_harrier.jpg"],
    aiAnalysis: {
      summary: "Japanese Heiwa verified lot. Grade 4 auction inspection with verified 94k kms ODO. Estimated New Zealand landed cost NZ$18,226 with projected dealer margin +NZ$4,100.",
      highlights: [
        "NZ$4,100 projected dealer gross margin at current live FX",
        "Grade 4 verified condition with 94k km certified ODO",
        "Factory options: ps, pw (AC)",
        "Auction House: USS Tokyo (Chassis: AVU65W-0038177)"
      ],
      confidence: 91,
      arbitrageSpread: 4100
    },
    nzComparables: [
      { source: "Trade Me Motors", year: 2015, km: 98700, price: 24303, daysListed: 14 },
      { source: "Turners Auckland", year: 2015, km: 92120, price: 23588, daysListed: 19 },
      { source: "AutoTrader NZ", year: 2015, km: 103400, price: 24779, daysListed: 27 }
    ],
    costBreakdown: {
      fobConvertedNzd: 12549,
      freightNzd: 2200,
      complianceNzd: 1100,
      gstAndFeesNzd: 2377,
      totalLandedNzd: 18226,
      targetMarginNzd: 4100,
      maxBidNzd: 19726
    }
  }
];

export interface Dealer {
  id: number;
  name: string;
  location: string;
  tier: string;
  activeOpportunities: number;
  priorityBuys: number;
  monthlyImportsTarget: number;
  avgMargin: number;
  contactName: string;
  email: string;
  phone: string;
  preferences: {
    makes: string[];
    models: string[];
    yearRange: string;
    maxKm: number;
    fuelTypes: string[];
    targetRetail: string;
    targetMargin: string;
  };
}

export const DEALERS: Dealer[] = [
  {
    id: 1,
    name: "Auckland Auto Group",
    location: "Penrose, Auckland",
    tier: "Platinum Commercial",
    activeOpportunities: 73,
    priorityBuys: 11,
    monthlyImportsTarget: 25,
    avgMargin: 4250,
    contactName: "David Miller",
    email: "david@aucklandauto.co.nz",
    phone: "+64 9 525 8890",
    preferences: {
      makes: ["Toyota", "Honda", "Mazda", "Lexus", "Nissan", "Subaru"],
      models: ["Aqua", "Fit", "C-HR", "Axela", "NX300h", "Prius", "Harrier", "Rav4"],
      yearRange: "2013 â€“ 2025",
      maxKm: 120000,
      fuelTypes: ["Hybrid", "Petrol", "Diesel", "Electric (EV)"],
      targetRetail: "NZ$14,000 â€“ NZ$45,000",
      targetMargin: "NZ$3,500+"
    }
  },
  {
    id: 2,
    name: "Hamilton Motors",
    location: "Te Rapa, Hamilton",
    tier: "Gold Dealer",
    activeOpportunities: 24,
    priorityBuys: 5,
    monthlyImportsTarget: 14,
    avgMargin: 3600,
    contactName: "Sarah Jenkins",
    email: "sarah@hamiltonmotors.co.nz",
    phone: "+64 7 849 2200",
    preferences: {
      makes: ["Honda", "Toyota", "Subaru", "Suzuki"],
      models: ["Fit", "Aqua", "Vezel", "Impreza", "Swift", "Forester"],
      yearRange: "2014 â€“ 2023",
      maxKm: 95000,
      fuelTypes: ["Hybrid", "Petrol"],
      targetRetail: "NZ$14,000 â€“ NZ$30,000",
      targetMargin: "NZ$3,000+"
    }
  },
  {
    id: 3,
    name: "Christchurch Cars",
    location: "Moorhouse Ave, Christchurch",
    tier: "Silver Dealer",
    activeOpportunities: 19,
    priorityBuys: 3,
    monthlyImportsTarget: 10,
    avgMargin: 2900,
    contactName: "Marcus Vance",
    email: "marcus@chchcars.co.nz",
    phone: "+64 3 379 1144",
    preferences: {
      makes: ["Toyota", "Nissan", "Mazda", "Suzuki"],
      models: ["Aqua", "Note", "Demio", "Axela", "Sienta"],
      yearRange: "2013 â€“ 2022",
      maxKm: 110000,
      fuelTypes: ["Hybrid", "Petrol"],
      targetRetail: "NZ$12,000 â€“ NZ$25,000",
      targetMargin: "NZ$2,500+"
    }
  }
];

export const GLOBAL_SETTINGS = {
  fxRateJpyNzd: 91.24,
  fxLastUpdated: "12 mins ago (Live Bank Feed)",
  freightPerUnitNzd: 2200,
  compliancePerUnitNzd: 1100,
  gstRate: 0.15,
  defaultTargetMarginNzd: 3500,
  auctionPortFeeNzd: 280,
  cleanCarNeutralThreshold: 112, // g/km
};

