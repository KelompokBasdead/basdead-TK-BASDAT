// ─────────────────────────────────────────────
//  TikTakTuk — Central Dummy Data Store
//  src/data/mockData.js
// ─────────────────────────────────────────────

export const VENUES = [
  { venue_id: "ven_001", venue_name: "Jakarta Convention Center", city: "Jakarta", address: "Jl. Gatot Subroto No.1", capacity: 1000, has_reserved_seating: true },
  { venue_id: "ven_002", venue_name: "Taman Impian Jayakarta", city: "Jakarta Utara", address: "Jl. Lodan Timur No.7", capacity: 500, has_reserved_seating: false },
  { venue_id: "ven_003", venue_name: "Bandung Hall Center", city: "Bandung", address: "Jl. Asia Afrika, Bandung", capacity: 800, has_reserved_seating: true },
  { venue_id: "ven_004", venue_name: "Surabaya Arena", city: "Surabaya", address: "Jl. Pemuda No.15", capacity: 1200, has_reserved_seating: false },
  { venue_id: "ven_005", venue_name: "Bali Arts Center", city: "Bali", address: "Jl. Nusa Indah, Denpasar", capacity: 600, has_reserved_seating: true },
];

export const ARTISTS = [
  { artist_id: "art_001", name: "Fourtwnty", genre: "Indie Folk" },
  { artist_id: "art_002", name: "Hindia", genre: "Indie Pop" },
  { artist_id: "art_003", name: "Tulus", genre: "Pop" },
  { artist_id: "art_004", name: "Nadin Amizah", genre: "Folk" },
  { artist_id: "art_005", name: "Pamungkas", genre: "Singer-Songwriter" },
  { artist_id: "art_006", name: "Raisa", genre: "R&B / Pop" },
  { artist_id: "art_007", name: "Yura Yunita", genre: "Pop Soul" },
  { artist_id: "art_008", name: "Payung Teduh", genre: "Folk Jazz" },
];

export const EVENTS = [
  { event_id: "evt_001", event_title: "Konser Melodi Senja", event_datetime: "2024-05-15T19:00:00", venue_id: "ven_001", organizer_id: "org_001", artists: ["art_001", "art_002"], description: "Nikmati suasana senja dengan alunan musik indie yang menenangkan." },
  { event_id: "evt_002", event_title: "Festival Seni Budaya", event_datetime: "2024-06-22T10:00:00", venue_id: "ven_002", organizer_id: "org_002", artists: ["art_003"], description: "Perayaan seni dan budaya nusantara." },
  { event_id: "evt_003", event_title: "Malam Akustik Bandung", event_datetime: "2024-06-10T18:00:00", venue_id: "ven_003", organizer_id: "org_001", artists: ["art_005", "art_004"], description: "Akustik penuh perasaan dari Bandung." },
  { event_id: "evt_004", event_title: "Jazz Under Stars", event_datetime: "2024-07-20T20:00:00", venue_id: "ven_005", organizer_id: "org_003", artists: ["art_008"], description: "Malam jazz romantis di bawah langit Bali." },
  { event_id: "evt_005", event_title: "RnB Night Jakarta", event_datetime: "2024-08-05T19:30:00", venue_id: "ven_001", organizer_id: "org_002", artists: ["art_006"], description: "Malam R&B bersama Raisa." },
  { event_id: "evt_006", event_title: "Indie Vibes Surabaya", event_datetime: "2024-09-01T17:00:00", venue_id: "ven_004", organizer_id: "org_003", artists: ["art_007", "art_003"], description: "Festival indie musik di kota Pahlawan." },
];

export const TICKET_CATEGORIES = [
  { category_id: "cat_001", category_name: "WVIP", price: 1500000, quota: 50, tevent_id: "evt_001" },
  { category_id: "cat_002", category_name: "VIP", price: 750000, quota: 150, tevent_id: "evt_001" },
  { category_id: "cat_003", category_name: "Category 1", price: 450000, quota: 300, tevent_id: "evt_001" },
  { category_id: "cat_004", category_name: "Category 2", price: 250000, quota: 500, tevent_id: "evt_001" },
  { category_id: "cat_005", category_name: "General Admission", price: 150000, quota: 500, tevent_id: "evt_002" },
  { category_id: "cat_006", category_name: "VVIP", price: 2000000, quota: 30, tevent_id: "evt_003" },
  { category_id: "cat_007", category_name: "VIP", price: 900000, quota: 100, tevent_id: "evt_003" },
  { category_id: "cat_008", category_name: "Regular", price: 350000, quota: 400, tevent_id: "evt_003" },
  { category_id: "cat_009", category_name: "Platinum", price: 1200000, quota: 80, tevent_id: "evt_004" },
  { category_id: "cat_010", category_name: "Gold", price: 600000, quota: 200, tevent_id: "evt_004" },
  { category_id: "cat_011", category_name: "Silver", price: 300000, quota: 350, tevent_id: "evt_004" },
  { category_id: "cat_012", category_name: "VIP", price: 800000, quota: 100, tevent_id: "evt_005" },
  { category_id: "cat_013", category_name: "Regular", price: 300000, quota: 400, tevent_id: "evt_005" },
  { category_id: "cat_014", category_name: "Festival", price: 200000, quota: 600, tevent_id: "evt_006" },
];

export const CUSTOMERS = [
  { customer_id: "cust_001", full_name: "Budi Santoso", phone_number: "+62812345678", user_id: "usr_007" },
  { customer_id: "cust_002", full_name: "Siti Rahayu", phone_number: "+62898765432", user_id: "usr_008" },
  { customer_id: "cust_003", full_name: "Andi Pratama", phone_number: "+62877654321", user_id: "usr_009" },
  { customer_id: "cust_004", full_name: "Dewi Kartika", phone_number: "+62856789012", user_id: "usr_010" },
  { customer_id: "cust_005", full_name: "Rizky Fauzan", phone_number: "+62845678901", user_id: "usr_011" },
  { customer_id: "cust_006", full_name: "Maya Indah", phone_number: "+62834567890", user_id: "usr_012" },
];

export const ORGANIZERS = [
  { organizer_id: "org_001", organizer_name: "Andi Wijaya", contact_email: "organizer1@example.com", user_id: "usr_004" },
  { organizer_id: "org_002", organizer_name: "Bintang Event", contact_email: "organizer2@example.com", user_id: "usr_005" },
  { organizer_id: "org_003", organizer_name: "Cahaya Promotama", contact_email: "organizer3@example.com", user_id: "usr_006" },
  { organizer_id: "org_004", organizer_name: "Duta Hiburan", contact_email: "organizer4@example.com", user_id: "usr_013" },
];

export const ORDERS = [
  { order_id: "ord_001", order_date: "2024-04-10T14:32:00", payment_status: "Paid", total_amount: 1200000, customer_id: "cust_001" },
  { order_id: "ord_002", order_date: "2024-04-11T09:15:00", payment_status: "Paid", total_amount: 150000, customer_id: "cust_001" },
  { order_id: "ord_003", order_date: "2024-04-12T18:44:00", payment_status: "Pending", total_amount: 1500000, customer_id: "cust_002" },
  { order_id: "ord_004", order_date: "2024-04-13T11:00:00", payment_status: "Cancelled", total_amount: 700000, customer_id: "cust_002" },
  { order_id: "ord_005", order_date: "2024-04-14T08:30:00", payment_status: "Paid", total_amount: 450000, customer_id: "cust_003" },
  { order_id: "ord_006", order_date: "2024-04-15T20:10:00", payment_status: "Pending", total_amount: 900000, customer_id: "cust_003" },
  { order_id: "ord_007", order_date: "2024-04-16T13:45:00", payment_status: "Paid", total_amount: 300000, customer_id: "cust_004" },
  { order_id: "ord_008", order_date: "2024-04-17T16:20:00", payment_status: "Paid", total_amount: 600000, customer_id: "cust_004" },
  { order_id: "ord_009", order_date: "2024-04-18T10:05:00", payment_status: "Cancelled", total_amount: 250000, customer_id: "cust_005" },
  { order_id: "ord_010", order_date: "2024-04-19T15:55:00", payment_status: "Paid", total_amount: 800000, customer_id: "cust_005" },
  { order_id: "ord_011", order_date: "2024-04-20T12:00:00", payment_status: "Pending", total_amount: 200000, customer_id: "cust_006" },
  { order_id: "ord_012", order_date: "2024-04-21T17:30:00", payment_status: "Paid", total_amount: 350000, customer_id: "cust_006" },
];

export const SEATS = [
  { seat_id: "seat_001", section: "WVIP", seat_number: "1", row_number: "A", venue_id: "ven_001" },
  { seat_id: "seat_002", section: "WVIP", seat_number: "2", row_number: "A", venue_id: "ven_001" },
  { seat_id: "seat_003", section: "WVIP", seat_number: "3", row_number: "A", venue_id: "ven_001" },
  { seat_id: "seat_004", section: "VIP", seat_number: "1", row_number: "B", venue_id: "ven_001" },
  { seat_id: "seat_005", section: "VIP", seat_number: "2", row_number: "B", venue_id: "ven_001" },
  { seat_id: "seat_006", section: "VIP", seat_number: "3", row_number: "B", venue_id: "ven_001" },
  { seat_id: "seat_007", section: "Category 1", seat_number: "1", row_number: "C", venue_id: "ven_001" },
  { seat_id: "seat_008", section: "Category 1", seat_number: "2", row_number: "C", venue_id: "ven_001" },
  { seat_id: "seat_009", section: "Category 1", seat_number: "3", row_number: "C", venue_id: "ven_001" },
  { seat_id: "seat_010", section: "Category 2", seat_number: "1", row_number: "D", venue_id: "ven_001" },
  { seat_id: "seat_011", section: "WVIP", seat_number: "1", row_number: "A", venue_id: "ven_003" },
  { seat_id: "seat_012", section: "WVIP", seat_number: "2", row_number: "A", venue_id: "ven_003" },
  { seat_id: "seat_013", section: "VIP", seat_number: "1", row_number: "B", venue_id: "ven_003" },
  { seat_id: "seat_014", section: "VIP", seat_number: "2", row_number: "B", venue_id: "ven_003" },
  { seat_id: "seat_015", section: "Regular", seat_number: "1", row_number: "C", venue_id: "ven_003" },
  // More seats for Bali Arts Center
  { seat_id: "seat_016", section: "Platinum", seat_number: "1", row_number: "A", venue_id: "ven_005" },
  { seat_id: "seat_017", section: "Platinum", seat_number: "2", row_number: "A", venue_id: "ven_005" },
  { seat_id: "seat_018", section: "Gold", seat_number: "1", row_number: "B", venue_id: "ven_005" },
  { seat_id: "seat_019", section: "Gold", seat_number: "2", row_number: "B", venue_id: "ven_005" },
  { seat_id: "seat_020", section: "Silver", seat_number: "1", row_number: "C", venue_id: "ven_005" },
  // Extra seats for total of 30
  { seat_id: "seat_021", section: "WVIP", seat_number: "4", row_number: "A", venue_id: "ven_001" },
  { seat_id: "seat_022", section: "VIP", seat_number: "4", row_number: "B", venue_id: "ven_001" },
  { seat_id: "seat_023", section: "Category 1", seat_number: "4", row_number: "C", venue_id: "ven_001" },
  { seat_id: "seat_024", section: "Category 2", seat_number: "2", row_number: "D", venue_id: "ven_001" },
  { seat_id: "seat_025", section: "Category 2", seat_number: "3", row_number: "D", venue_id: "ven_001" },
  { seat_id: "seat_026", section: "VIP", seat_number: "3", row_number: "B", venue_id: "ven_003" },
  { seat_id: "seat_027", section: "Regular", seat_number: "2", row_number: "C", venue_id: "ven_003" },
  { seat_id: "seat_028", section: "Regular", seat_number: "3", row_number: "C", venue_id: "ven_003" },
  { seat_id: "seat_029", section: "Silver", seat_number: "2", row_number: "C", venue_id: "ven_005" },
  { seat_id: "seat_030", section: "Gold", seat_number: "3", row_number: "B", venue_id: "ven_005" },
];

export const TICKETS = [
  { ticket_id: "tkt_001", ticket_code: "TTK-EVT001-VIP-001", tcategory_id: "cat_002", torder_id: "ord_001", status: "Valid", seat_id: "seat_004" },
  { ticket_id: "tkt_002", ticket_code: "TTK-EVT001-VIP-002", tcategory_id: "cat_002", torder_id: "ord_001", status: "Valid", seat_id: "seat_005" },
  { ticket_id: "tkt_003", ticket_code: "TTK-EVT002-GA-001", tcategory_id: "cat_005", torder_id: "ord_002", status: "Used", seat_id: null },
  { ticket_id: "tkt_004", ticket_code: "TTK-EVT001-WVIP-001", tcategory_id: "cat_001", torder_id: "ord_003", status: "Valid", seat_id: "seat_001" },
  { ticket_id: "tkt_005", ticket_code: "TTK-EVT003-VVIP-001", tcategory_id: "cat_006", torder_id: "ord_004", status: "Cancelled", seat_id: "seat_011" },
  { ticket_id: "tkt_006", ticket_code: "TTK-EVT001-CAT1-001", tcategory_id: "cat_003", torder_id: "ord_005", status: "Valid", seat_id: "seat_007" },
  { ticket_id: "tkt_007", ticket_code: "TTK-EVT003-VIP-001", tcategory_id: "cat_007", torder_id: "ord_006", status: "Valid", seat_id: "seat_013" },
  { ticket_id: "tkt_008", ticket_code: "TTK-EVT004-PLAT-001", tcategory_id: "cat_009", torder_id: "ord_007", status: "Valid", seat_id: "seat_016" },
  { ticket_id: "tkt_009", ticket_code: "TTK-EVT004-GOLD-001", tcategory_id: "cat_010", torder_id: "ord_008", status: "Used", seat_id: "seat_018" },
  { ticket_id: "tkt_010", ticket_code: "TTK-EVT001-CAT2-001", tcategory_id: "cat_004", torder_id: "ord_009", status: "Cancelled", seat_id: null },
  { ticket_id: "tkt_011", ticket_code: "TTK-EVT005-VIP-001", tcategory_id: "cat_012", torder_id: "ord_010", status: "Valid", seat_id: null },
  { ticket_id: "tkt_012", ticket_code: "TTK-EVT006-FEST-001", tcategory_id: "cat_014", torder_id: "ord_011", status: "Valid", seat_id: null },
  { ticket_id: "tkt_013", ticket_code: "TTK-EVT006-FEST-002", tcategory_id: "cat_014", torder_id: "ord_012", status: "Used", seat_id: null },
  { ticket_id: "tkt_014", ticket_code: "TTK-EVT003-REG-001", tcategory_id: "cat_008", torder_id: "ord_001", status: "Valid", seat_id: "seat_015" },
  { ticket_id: "tkt_015", ticket_code: "TTK-EVT002-GA-002", tcategory_id: "cat_005", torder_id: "ord_002", status: "Valid", seat_id: null },
  { ticket_id: "tkt_016", ticket_code: "TTK-EVT004-SILV-001", tcategory_id: "cat_011", torder_id: "ord_003", status: "Valid", seat_id: "seat_020" },
  { ticket_id: "tkt_017", ticket_code: "TTK-EVT001-VIP-003", tcategory_id: "cat_002", torder_id: "ord_004", status: "Cancelled", seat_id: null },
  { ticket_id: "tkt_018", ticket_code: "TTK-EVT005-REG-001", tcategory_id: "cat_013", torder_id: "ord_005", status: "Valid", seat_id: null },
  { ticket_id: "tkt_019", ticket_code: "TTK-EVT003-VIP-002", tcategory_id: "cat_007", torder_id: "ord_006", status: "Used", seat_id: "seat_014" },
  { ticket_id: "tkt_020", ticket_code: "TTK-EVT001-WVIP-002", tcategory_id: "cat_001", torder_id: "ord_007", status: "Valid", seat_id: "seat_002" },
];

export const HAS_RELATIONSHIP = [
  { seat_id: "seat_001", ticket_id: "tkt_004" },
  { seat_id: "seat_002", ticket_id: "tkt_020" },
  { seat_id: "seat_004", ticket_id: "tkt_001" },
  { seat_id: "seat_005", ticket_id: "tkt_002" },
  { seat_id: "seat_007", ticket_id: "tkt_006" },
  { seat_id: "seat_011", ticket_id: "tkt_005" },
  { seat_id: "seat_013", ticket_id: "tkt_007" },
  { seat_id: "seat_014", ticket_id: "tkt_019" },
  { seat_id: "seat_015", ticket_id: "tkt_014" },
  { seat_id: "seat_016", ticket_id: "tkt_008" },
];

export const PROMOTIONS = [
  { promotion_id: "promo_001", promo_code: "TIKTAK20", discount_type: "PERCENTAGE", discount_value: 20, start_date: "2024-01-01", end_date: "2024-12-31", usage_limit: 100 },
  { promotion_id: "promo_002", promo_code: "HEMAT50K", discount_type: "NOMINAL", discount_value: 50000, start_date: "2024-01-01", end_date: "2024-12-31", usage_limit: 50 },
  { promotion_id: "promo_003", promo_code: "NEWUSER30", discount_type: "PERCENTAGE", discount_value: 30, start_date: "2024-03-01", end_date: "2024-06-30", usage_limit: 200 },
  { promotion_id: "promo_004", promo_code: "SUMMER15", discount_type: "PERCENTAGE", discount_value: 15, start_date: "2024-06-01", end_date: "2024-08-31", usage_limit: 150 },
  { promotion_id: "promo_005", promo_code: "FLASH100K", discount_type: "NOMINAL", discount_value: 100000, start_date: "2024-05-01", end_date: "2024-05-31", usage_limit: 30 },
  { promotion_id: "promo_006", promo_code: "LOYAL25", discount_type: "PERCENTAGE", discount_value: 25, start_date: "2024-04-01", end_date: "2024-12-31", usage_limit: 75 },
];

export const ORDER_PROMOTION = [
  { order_promotion_id: "op_001", promotion_id: "promo_001", order_id: "ord_001" },
  { order_promotion_id: "op_002", promotion_id: "promo_002", order_id: "ord_002" },
  { order_promotion_id: "op_003", promotion_id: "promo_003", order_id: "ord_005" },
  { order_promotion_id: "op_004", promotion_id: "promo_001", order_id: "ord_008" },
  { order_promotion_id: "op_005", promotion_id: "promo_004", order_id: "ord_010" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getVenueById(id) {
  return VENUES.find((v) => v.venue_id === id);
}

export function getEventById(id) {
  return EVENTS.find((e) => e.event_id === id);
}

export function getCategoryById(id) {
  return TICKET_CATEGORIES.find((c) => c.category_id === id);
}

export function getOrderById(id) {
  return ORDERS.find((o) => o.order_id === id);
}

export function getCustomerById(id) {
  return CUSTOMERS.find((c) => c.customer_id === id);
}

export function getSeatById(id) {
  return SEATS.find((s) => s.seat_id === id);
}

export function getArtistById(id) {
  return ARTISTS.find((a) => a.artist_id === id);
}

export function isSeatOccupied(seatId) {
  return HAS_RELATIONSHIP.some((r) => r.seat_id === seatId);
}

export function getCategoriesForEvent(eventId) {
  return TICKET_CATEGORIES.filter((c) => c.tevent_id === eventId);
}

export function getTicketsUsedForCategory(categoryId) {
  return TICKETS.filter((t) => t.tcategory_id === categoryId && t.status !== "Cancelled").length;
}

export function getEventForOrder(orderId) {
  // Find a ticket for this order to determine the event
  const ticket = TICKETS.find((t) => t.torder_id === orderId);
  if (!ticket) return null;
  const category = getCategoryById(ticket.tcategory_id);
  if (!category) return null;
  return getEventById(category.tevent_id);
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Dummy user sessions per role ────────────────────────────────────────────────
export const DUMMY_USERS = {
  customer: { role: "customer", username: "customer1", customer_id: "cust_001", full_name: "Budi Santoso", phone_number: "+62812345678", avatar: "B", roleLabel: "Pelanggan" },
  organizer: { role: "organizer", username: "organizer1", organizer_id: "org_001", organizer_name: "Andi Wijaya", contact_email: "organizer1@example.com", avatar: "A", roleLabel: "Penyelenggara" },
  admin: { role: "admin", username: "admin1", full_name: "Admin Utama", email: "admin@tiktaktuk.id", avatar: "A", roleLabel: "Administrator" },
  guest: { role: "guest", username: "guest", full_name: "Guest", avatar: "G", roleLabel: "Tamu" },
};