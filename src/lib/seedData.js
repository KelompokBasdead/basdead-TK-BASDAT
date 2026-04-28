export const organizers = [
  {
    organizer_id: "8b93cbd8-451a-4e55-bf2a-d4a36b7ecabb",
    organizer_name: "Soundrenaline",
    contact_email: "contact@sound.id",
  },
  {
    organizer_id: "b77e78e6-2dfb-4419-a927-fd71dee7859e",
    organizer_name: "Pestapora",
    contact_email: "hello@pesta.com",
  },
  {
    organizer_id: "7d63a472-060e-4e16-bf48-3134cf9c8a54",
    organizer_name: "Synchronize",
    contact_email: "info@sync.id",
  },
  {
    organizer_id: "1430a1e2-14e9-45c9-8c20-2f4eb7d19a30",
    organizer_name: "Java Jazz",
    contact_email: "admin@java.com",
  },
];

export const venues = [
  {
    venue_id: "30000000-0000-0000-0000-000000000001",
    venue_name: "Gelora Bung Karno",
    capacity: 77000,
    address: "Jl. Pintu Satu Senayan",
    city: "Jakarta Pusat",
    has_reserved_seating: false,
  },
  {
    venue_id: "30000000-0000-0000-0000-000000000002",
    venue_name: "JIExpo Kemayoran",
    capacity: 50000,
    address: "Kemayoran",
    city: "Jakarta Pusat",
    has_reserved_seating: false,
  },
  {
    venue_id: "30000000-0000-0000-0000-000000000003",
    venue_name: "Istora Senayan",
    capacity: 7000,
    address: "Kompleks GBK",
    city: "Jakarta Pusat",
    has_reserved_seating: false,
  },
  {
    venue_id: "30000000-0000-0000-0000-000000000004",
    venue_name: "Taman Impian Jayakarta",
    capacity: 500,
    address: "Jl. Lodan Timur No.7",
    city: "Jakarta Utara",
    has_reserved_seating: false,
  },
  {
    venue_id: "30000000-0000-0000-0000-000000000005",
    venue_name: "Bandung Hall Center",
    capacity: 800,
    address: "Jl. Asia Afrika",
    city: "Bandung",
    has_reserved_seating: false,
  },
  {
    venue_id: "30000000-0000-0000-0000-000000000006",
    venue_name: "Jakarta Convention Center",
    capacity: 5000,
    address: "Jl. Gatot Subroto",
    city: "Jakarta Pusat",
    has_reserved_seating: true,
  },
];

export const artists = [
  { artist_id: "80b3b8b1-02b6-42b5-9fb3-9c002c369deb", name: "Fourtwnty", genre: "Indie Folk" },
  { artist_id: "2c626f2c-38ae-424c-b176-c735ebbef550", name: "Nadin Amizah", genre: "Pop" },
  { artist_id: "50bebb90-f825-4ade-96bd-e11a2847bdca", name: "Raisa", genre: "Pop" },
  { artist_id: "6ee0a606-2ea0-4ee3-bc9b-4baf833931b4", name: "Tulus", genre: "Pop Jazz" },
  { artist_id: "df2c481f-80da-44d3-b464-8e15c9d4d355", name: "Isyana Sarasvati", genre: "Pop" },
  { artist_id: "1942c5ff-99b1-48f2-b861-2be84a6d2314", name: "Kunto Aji", genre: "Pop" },
  { artist_id: "54548c63-01b8-4204-9ec3-f0f2d29cf52b", name: "Slank", genre: "Rock" },
  { artist_id: "bb8e1d3c-1aa2-441c-99e3-4207ad8e5d3d", name: "Dewa 19", genre: "Rock" },
];

export const events = [
  {
    event_id: "11111111-1111-1111-1111-111111111111",
    event_datetime: "2024-05-15T19:00",
    event_title: "Konser Melodi Senja",
    venue_id: "30000000-0000-0000-0000-000000000006",
    organizer_id: "8b93cbd8-451a-4e55-bf2a-d4a36b7ecabb",
    artist_ids: [
      "80b3b8b1-02b6-42b5-9fb3-9c002c369deb",
      "2c626f2c-38ae-424c-b176-c735ebbef550",
    ],
    description: "Konser pop dan folk dengan suasana senja.",
    ticket_categories: [
      { category_name: "VVIP", quota: 50, price: 1500000 },
      { category_name: "VIP", quota: 150, price: 750000 },
      { category_name: "Category 1", quota: 300, price: 450000 },
      { category_name: "Category 2", quota: 500, price: 250000 },
      { category_name: "Festival A", quota: 400, price: 200000 },
      { category_name: "Festival B", quota: 400, price: 200000 },
    ],
  },
  {
    event_id: "22222222-2222-2222-2222-222222222222",
    event_datetime: "2024-06-22T10:00",
    event_title: "Festival Seni Budaya",
    venue_id: "30000000-0000-0000-0000-000000000002",
    organizer_id: "b77e78e6-2dfb-4419-a927-fd71dee7859e",
    artist_ids: [
      "50bebb90-f825-4ade-96bd-e11a2847bdca",
      "6ee0a606-2ea0-4ee3-bc9b-4baf833931b4",
      "df2c481f-80da-44d3-b464-8e15c9d4d355",
    ],
    description: "Festival lintas seni dengan penampilan musik dan budaya.",
    ticket_categories: [
      { category_name: "General Admission", quota: 500, price: 150000 },
      { category_name: "Early Bird", quota: 200, price: 100000 },
      { category_name: "Student Pass", quota: 100, price: 75000 },
      { category_name: "VIP Access", quota: 50, price: 300000 },
    ],
  },
  {
    event_id: "33333333-3333-3333-3333-333333333333",
    event_datetime: "2024-06-10T18:00",
    event_title: "Malam Akustik Bandung",
    venue_id: "30000000-0000-0000-0000-000000000005",
    organizer_id: "7d63a472-060e-4e16-bf48-3134cf9c8a54",
    artist_ids: [
      "1942c5ff-99b1-48f2-b861-2be84a6d2314",
      "80b3b8b1-02b6-42b5-9fb3-9c002c369deb",
    ],
    description: "Malam akustik intim bersama musisi pilihan.",
    ticket_categories: [
      { category_name: "VVIP", quota: 30, price: 2000000 },
      { category_name: "VIP", quota: 100, price: 900000 },
      { category_name: "Regular", quota: 400, price: 350000 },
      { category_name: "Balcony", quota: 200, price: 200000 },
    ],
  },
  {
    event_id: "44444444-4444-4444-4444-444444444444",
    event_datetime: "2024-08-17T19:30",
    event_title: "Merdeka Fest",
    venue_id: "30000000-0000-0000-0000-000000000001",
    organizer_id: "1430a1e2-14e9-45c9-8c20-2f4eb7d19a30",
    artist_ids: [
      "54548c63-01b8-4204-9ec3-f0f2d29cf52b",
      "bb8e1d3c-1aa2-441c-99e3-4207ad8e5d3d",
    ],
    description: "Perayaan musik nasional di Hari Kemerdekaan.",
    ticket_categories: [{ category_name: "Festival", quota: 1200, price: 250000 }],
  },
  {
    event_id: "55555555-5555-5555-5555-555555555555",
    event_datetime: "2024-09-01T20:00",
    event_title: "Rock Legends Tour",
    venue_id: "30000000-0000-0000-0000-000000000002",
    organizer_id: "8b93cbd8-451a-4e55-bf2a-d4a36b7ecabb",
    artist_ids: [
      "54548c63-01b8-4204-9ec3-f0f2d29cf52b",
      "2c626f2c-38ae-424c-b176-c735ebbef550",
    ],
    description: "Tur rock besar dengan kolaborasi spesial.",
    ticket_categories: [{ category_name: "Rock Zone", quota: 1500, price: 350000 }],
  },
  {
    event_id: "66666666-6666-6666-6666-666666666666",
    event_datetime: "2024-10-10T18:00",
    event_title: "Jazz Nite",
    venue_id: "30000000-0000-0000-0000-000000000003",
    organizer_id: "1430a1e2-14e9-45c9-8c20-2f4eb7d19a30",
    artist_ids: ["50bebb90-f825-4ade-96bd-e11a2847bdca"],
    description: "Malam jazz santai dengan aransemen elegan.",
    ticket_categories: [{ category_name: "Regular", quota: 500, price: 300000 }],
  },
];

export const orders = [
  {
    order_id: "ord_001",
    order_date: "2024-04-10T14:32:00",
    payment_status: "lunas",
    total_amount: 1200000,
    customer_id: "cust_001",
    customer_name: "Budi Santoso",
  },
  {
    order_id: "ord_002",
    order_date: "2024-04-11T09:15:00",
    payment_status: "lunas",
    total_amount: 150000,
    customer_id: "cust_001",
    customer_name: "Budi Santoso",
  },
  {
    order_id: "ord_003",
    order_date: "2024-04-12T18:44:00",
    payment_status: "pending",
    total_amount: 1500000,
    customer_id: "cust_002",
    customer_name: "Siti Rahayu",
  },
  {
    order_id: "ord_004",
    order_date: "2024-04-13T11:00:00",
    payment_status: "dibatalkan",
    total_amount: 700000,
    customer_id: "cust_002",
    customer_name: "Siti Rahayu",
  },
];

export const promotions = [
  { promo_id: "promo_001", kode: "TIKTAK20", tipe: "persentase", nilai: 20, mulai: "2024-01-01", berakhir: "2024-12-31", terpakai: 45, limit: 100 },
  { promo_id: "promo_002", kode: "HEMAT50K", tipe: "nominal", nilai: 50000, mulai: "2024-01-01", berakhir: "2024-12-31", terpakai: 12, limit: 50 },
  { promo_id: "promo_003", kode: "NEWUSER30", tipe: "persentase", nilai: 30, mulai: "2024-03-01", berakhir: "2024-06-30", terpakai: 87, limit: 200 },
];

export const users = [
  { username: "admin1", password: "admin123", role: "admin" },
  { username: "organizer1", password: "org123", role: "organizer" },
  { username: "customer1", password: "cust123", role: "customer" },
];