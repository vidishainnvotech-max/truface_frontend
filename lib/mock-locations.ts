import type {
  FieldAgent,
  GeofenceSettings,
  LocationDetails,
  LocationFormValues,
  LocationListItem,
} from "@/types/locations";

export const mockLocations: LocationListItem[] = [
  {
    id: "LOC-001",
    name: "Pune Assembly Line",
    type: "factory-node",
    address: "Plot 4, MIDC Sector II, Pune, MH",
    employees: 1240,
    devicesActive: 6,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-002",
    name: "Mumbai Headquarters",
    type: "corporate-hq",
    address: "Level 12, Godrej One, Vikhroli, Mumbai",
    employees: 486,
    devicesActive: 2,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-003",
    name: "Chennai Warehouse",
    type: "distribution",
    address: "Karanai Village Road, Kanchipuram, TN",
    employees: 850,
    devicesActive: 4,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-004",
    name: "Delhi Sales Office",
    type: "field-office",
    address: "Ansals Chambers II, Bhikaji Cama Place, DL",
    employees: 45,
    devicesActive: 1,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-005",
    name: "Bangalore Tech Hub",
    type: "rnd-center",
    address: "Varthur Hobli, Outer Ring Road, Bangalore",
    employees: 350,
    devicesActive: 3,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-006",
    name: "Hyderabad Distribution",
    type: "warehouse",
    address: "IDA Jeedimetla, Phase V, Hyderabad, TS",
    employees: 242,
    devicesActive: 0,
    devicesOffline: 2,
    status: "inactive",
  },
  {
    id: "LOC-007",
    name: "Noida Plant Sector 63",
    type: "factory-node",
    address: "Plot 18, Sector 63, Noida, UP",
    employees: 980,
    devicesActive: 5,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-008",
    name: "Kolkata Regional Office",
    type: "corporate-hq",
    address: "Salt Lake Sector V, Kolkata, WB",
    employees: 210,
    devicesActive: 2,
    devicesOffline: 1,
    status: "active",
  },
  {
    id: "LOC-009",
    name: "Coimbatore Transit Depot",
    type: "distribution",
    address: "SIDCO Industrial Estate, Coimbatore, TN",
    employees: 160,
    devicesActive: 3,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-010",
    name: "Gurugram Client Desk",
    type: "field-office",
    address: "DLF Cyber City, Phase II, Gurugram, HR",
    employees: 38,
    devicesActive: 1,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-011",
    name: "Pune Innovation Lab",
    type: "rnd-center",
    address: "Baner Road, Near Balewadi, Pune, MH",
    employees: 120,
    devicesActive: 2,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-012",
    name: "Ahmedabad Storage Hub",
    type: "warehouse",
    address: "Changodar Industrial Estate, Ahmedabad, GJ",
    employees: 310,
    devicesActive: 4,
    devicesOffline: 1,
    status: "active",
  },
  {
    id: "LOC-013",
    name: "Surat Fabrication Unit",
    type: "factory-node",
    address: "Pandesara GIDC, Surat, GJ",
    employees: 670,
    devicesActive: 5,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-014",
    name: "Chandigarh Branch Office",
    type: "field-office",
    address: "Industrial Area Phase I, Chandigarh, CH",
    employees: 52,
    devicesActive: 1,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-015",
    name: "Kochi Port Warehouse",
    type: "warehouse",
    address: "Willingdon Island, Kochi, KL",
    employees: 190,
    devicesActive: 0,
    devicesOffline: 3,
    status: "inactive",
  },
  {
    id: "LOC-016",
    name: "Jaipur Dispatch Center",
    type: "distribution",
    address: "Sitapura Industrial Area, Jaipur, RJ",
    employees: 275,
    devicesActive: 3,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-017",
    name: "Indore Plant Extension",
    type: "factory-node",
    address: "Pithampur Industrial Area, Indore, MP",
    employees: 540,
    devicesActive: 4,
    devicesOffline: 1,
    status: "active",
  },
  {
    id: "LOC-018",
    name: "Bhubaneswar Field Desk",
    type: "field-office",
    address: "Infocity, Chandrasekharpur, Bhubaneswar, OD",
    employees: 29,
    devicesActive: 1,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-019",
    name: "Mysore Test Facility",
    type: "rnd-center",
    address: "Belagola Industrial Area, Mysore, KA",
    employees: 95,
    devicesActive: 2,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-020",
    name: "Lucknow Central Hub",
    type: "corporate-hq",
    address: "Gomti Nagar Extension, Lucknow, UP",
    employees: 165,
    devicesActive: 2,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-021",
    name: "Visakhapatnam Bulk Store",
    type: "warehouse",
    address: "Akkayyapalem, Visakhapatnam, AP",
    employees: 220,
    devicesActive: 3,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-022",
    name: "Nagpur Cross-Dock",
    type: "distribution",
    address: "Butibori MIDC, Nagpur, MH",
    employees: 140,
    devicesActive: 2,
    devicesOffline: 2,
    status: "inactive",
  },
  {
    id: "LOC-023",
    name: "Thrissur Assembly Bay",
    type: "factory-node",
    address: "Koratty Industrial Estate, Thrissur, KL",
    employees: 430,
    devicesActive: 4,
    devicesOffline: 0,
    status: "active",
  },
  {
    id: "LOC-024",
    name: "Patna Outreach Office",
    type: "field-office",
    address: "Boring Road, Patna, BR",
    employees: 33,
    devicesActive: 1,
    devicesOffline: 0,
    status: "active",
  },
];

export function getLocationById(id: string): LocationListItem | undefined {
  return mockLocations.find((l) => l.id === id);
}

export function locationToFormValues(loc: LocationListItem): LocationFormValues {
  const [cityPart, statePart] = splitAddress(loc.address);
  return {
    name: loc.name,
    type: loc.type,
    address: loc.address,
    city: cityPart,
    state: stateToCode(statePart),
    pinCode: "",
    shiftStart: "09:00 AM",
    shiftEnd: "08:00 PM",
    timezone: "ist",
    occupancy: loc.employees ? String(loc.employees) : "",
    deviceId: "tf-device-018",
    geofenceActive: loc.status === "active",
    radius: "150",
    latitude: "18.5204",
    longitude: "73.8567",
  };
}

export const emptyLocationFormValues: LocationFormValues = {
  name: "",
  type: "factory-node",
  address: "",
  city: "",
  state: "mh",
  pinCode: "",
  shiftStart: "09:00 AM",
  shiftEnd: "08:00 PM",
  timezone: "ist",
  occupancy: "",
  deviceId: "tf-device-018",
  geofenceActive: true,
  radius: "150",
  latitude: "18.5204",
  longitude: "73.8567",
};

function splitAddress(address: string): [string, string] {
  const parts = address.split(",").map((p) => p.trim());
  const city = parts.length >= 2 ? parts[parts.length - 2] : "";
  const state = parts.length >= 1 ? parts[parts.length - 1] : "";
  return [city, state];
}

function stateToCode(state: string): string {
  const s = state.toLowerCase();
  if (s.includes("mh") || s.includes("maharashtra")) return "mh";
  if (s.includes("up") || s.includes("uttar")) return "up";
  if (s.includes("tn") || s.includes("tamil")) return "tn";
  if (s.includes("ka") || s.includes("karnataka") || s.includes("bangalore")) return "ka";
  if (s.includes("dl") || s.includes("delhi")) return "dl";
  if (s.includes("gj") || s.includes("gujarat")) return "gj";
  if (s.includes("wb") || s.includes("bengal")) return "wb";
  if (s.includes("rj") || s.includes("rajasthan")) return "rj";
  return "mh";
}

export function getLocationDetails(loc: LocationListItem): LocationDetails {
  const presentToday = Math.round(loc.employees * 0.93);
  const attendanceRate = loc.employees > 0 ? Math.round((presentToday / loc.employees) * 1000) / 10 : 0;

  return {
    presentToday: loc.status === "active" ? presentToday : 0,
    attendanceRate: loc.status === "active" ? attendanceRate : 0,
    workforce: [
      { id: "TF-1082", name: "Rajesh Kumar", department: "Tech Ops", method: "face", checkIn: "09:15 AM", status: "on-time" },
      { id: "TF-1498", name: "Priya Patel", department: "Quality Assurance", method: "face", checkIn: "09:32 AM", status: "late" },
      { id: "TF-1001", name: "Vikram Singh", department: "Logistics", method: "fingerprint", checkIn: "09:41 AM", status: "late" },
      { id: "TF-2311", name: "Amit Sharma", department: "Operations", method: "rfid", checkIn: "09:02 AM", status: "on-time" },
      { id: "TF-4204", name: "Sunita Rao", department: "Admin Head Office", method: "face", checkIn: "08:55 AM", status: "on-time" },
    ],
  };
}

export function getGeofenceSettings(): GeofenceSettings {
  return {
    radiusM: 500,
    latitude: 18.6139,
    longitude: 73.809,
    enforced: true,
    spoofLock: true,
  };
}

export function getFieldAgents(): FieldAgent[] {
  return [
    { id: "TF-8821", name: "Rahul Deshmukh", role: "Senior Surveyor", lastSeen: "3m ago", within: true, distance: "12m within Geofence", battery: 84, gpsAccuracy: "High (±2m)" },
    { id: "TF-7710", name: "Suresh Patil", role: "Logistics Lead", lastSeen: "12m ago", within: false, distance: "450m outside Geofence", battery: 61, gpsAccuracy: "Medium (±8m)" },
    { id: "TF-6604", name: "Kiran Gokhale", role: "Field Technician", lastSeen: "1h ago", within: true, distance: "4m within Geofence", battery: 47, gpsAccuracy: "High (±3m)" },
    { id: "TF-5519", name: "Pooja Hegde", role: "Quality Inspector", lastSeen: "32m ago", within: true, distance: "80m within Geofence", battery: 92, gpsAccuracy: "High (±2m)" },
  ];
}
