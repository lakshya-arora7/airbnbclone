export interface IndianCity {
  id: string;
  name: string;
  state: string;
  aliases?: string[];
  type: string;
  isPopular?: boolean;
}

export const INDIAN_CITIES: IndianCity[] = [
  // --- National Capital Region & North India ---
  { id: "noida", name: "Noida", state: "Uttar Pradesh", aliases: ["Gautam Buddha Nagar"], type: "City & Tech Hub", isPopular: true },
  { id: "delhi", name: "New Delhi", state: "Delhi", aliases: ["Delhi", "NCR", "Old Delhi"], type: "National Capital", isPopular: true },
  { id: "greater-noida", name: "Greater Noida", state: "Uttar Pradesh", aliases: ["Gr Noida"], type: "City & Educational Hub", isPopular: true },
  { id: "gurgaon", name: "Gurgaon", state: "Haryana", aliases: ["Gurugram", "Millennium City"], type: "Metropolis & Tech Hub", isPopular: true },
  { id: "ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh", aliases: ["Ghaziabad NCR"], type: "Commercial City", isPopular: true },
  { id: "faridabad", name: "Faridabad", state: "Haryana", aliases: ["Faridabad NCR"], type: "Industrial City" },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", aliases: ["Taj Mahal City"], type: "Heritage & Wonder of the World", isPopular: true },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", aliases: ["Nawabs City", "LKO"], type: "State Capital & Heritage", isPopular: true },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", aliases: ["Banaras", "Benares", "Kashi"], type: "Spiritual & Cultural Capital", isPopular: true },
  { id: "prayagraj", name: "Prayagraj", state: "Uttar Pradesh", aliases: ["Allahabad"], type: "Spiritual Confluence" },
  { id: "mathura", name: "Mathura", state: "Uttar Pradesh", aliases: ["Braj"], type: "Heritage & Spiritual Center" },
  { id: "vrindavan", name: "Vrindavan", state: "Uttar Pradesh", aliases: ["Brij"], type: "Heritage Stays" },
  { id: "ayodhya", name: "Ayodhya", state: "Uttar Pradesh", aliases: ["Ram Janmabhoomi"], type: "Heritage & Spiritual Destination", isPopular: true },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", aliases: ["Cawnpore"], type: "Commercial Hub" },
  { id: "meerut", name: "Meerut", state: "Uttar Pradesh", aliases: ["Meerut Cantt"], type: "Historic City" },
  { id: "aligarh", name: "Aligarh", state: "Uttar Pradesh", aliases: [], type: "University City" },
  { id: "bareilly", name: "Bareilly", state: "Uttar Pradesh", aliases: [], type: "Northern City" },
  { id: "gorakhpur", name: "Gorakhpur", state: "Uttar Pradesh", aliases: [], type: "Cultural Hub" },
  { id: "moradabad", name: "Moradabad", state: "Uttar Pradesh", aliases: ["Brass City"], type: "Artisan Hub" },
  { id: "jhansi", name: "Jhansi", state: "Uttar Pradesh", aliases: [], type: "Historic Fort City" },
  { id: "saharanpur", name: "Saharanpur", state: "Uttar Pradesh", aliases: [], type: "Agricultural Center" },

  // --- Uttarakhand & Himachal Pradesh ---
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", aliases: ["Doon Valley"], type: "Valley Capital & Foothills", isPopular: true },
  { id: "mussoorie", name: "Mussoorie", state: "Uttarakhand", aliases: ["Queen of the Hills"], type: "Hill Station & Mountain Retreat", isPopular: true },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", aliases: ["Yoga Capital"], type: "Yoga & River Adventure Haven", isPopular: true },
  { id: "haridwar", name: "Haridwar", state: "Uttarakhand", aliases: ["Gateway to Gods"], type: "Ganga Riverside Heritage" },
  { id: "nainital", name: "Nainital", state: "Uttarakhand", aliases: ["Lake City"], type: "Lakes & Hill Station", isPopular: true },
  { id: "almora", name: "Almora", state: "Uttarakhand", aliases: ["Kumaon"], type: "Scenic Himalayan Retreat" },
  { id: "ranikhet", name: "Ranikhet", state: "Uttarakhand", aliases: [], type: "Pine Forests & Meadows" },
  { id: "lansdowne", name: "Lansdowne", state: "Uttarakhand", aliases: [], type: "Quiet Cantonment Hill Station" },
  { id: "auli", name: "Auli", state: "Uttarakhand", aliases: ["Skiing Capital"], type: "Snow Peaks & Ski Resort", isPopular: true },
  { id: "corbett", name: "Jim Corbett", state: "Uttarakhand", aliases: ["Ramnagar", "Corbett National Park"], type: "Wildlife Safaris & Luxury Resorts", isPopular: true },
  { id: "mukteshwar", name: "Mukteshwar", state: "Uttarakhand", aliases: [], type: "Panoramic Mountain Heights" },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", aliases: ["Simla"], type: "State Capital & Colonial Hill Station", isPopular: true },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", aliases: ["Kullu Manali", "Old Manali"], type: "Snow Mountains & Valley Chalets", isPopular: true },
  { id: "dharamshala", name: "Dharamshala", state: "Himachal Pradesh", aliases: ["Dharamsala", "McLeodGanj"], type: "Cedar Forests & Tibetan Culture", isPopular: true },
  { id: "mcleodganj", name: "McLeod Ganj", state: "Himachal Pradesh", aliases: ["Upper Dharamshala"], type: "Cafes & Monasteries", isPopular: true },
  { id: "kasauli", name: "Kasauli", state: "Himachal Pradesh", aliases: [], type: "Serene Pine Ridge Retreat" },
  { id: "dalhousie", name: "Dalhousie", state: "Himachal Pradesh", aliases: ["Khajjiar"], type: "Colonial Charm & Mini Switzerland" },
  { id: "kasol", name: "Kasol", state: "Himachal Pradesh", aliases: ["Parvati Valley"], type: "River Valley & Trekking Hub", isPopular: true },
  { id: "kullu", name: "Kullu", state: "Himachal Pradesh", aliases: ["Valley of Gods"], type: "Adventure & Heritage Valley" },
  { id: "spiti", name: "Spiti Valley", state: "Himachal Pradesh", aliases: ["Kaza"], type: "Cold Desert & Ancient Monasteries" },
  { id: "bir-billing", name: "Bir Billing", state: "Himachal Pradesh", aliases: ["Bir"], type: "Paragliding Capital & Eco Stays" },
  { id: "solan", name: "Solan", state: "Himachal Pradesh", aliases: ["Mushroom City"], type: "Gateway to the Hills" },
  { id: "chamba", name: "Chamba", state: "Himachal Pradesh", aliases: [], type: "Historic Himalayan Valley" },

  // --- Jammu, Kashmir & Ladakh ---
  { id: "srinagar", name: "Srinagar", state: "Jammu and Kashmir", aliases: ["Dal Lake"], type: "Dal Lake Houseboats & Mughal Gardens", isPopular: true },
  { id: "gulmarg", name: "Gulmarg", state: "Jammu and Kashmir", aliases: ["Meadow of Flowers"], type: "Snow Wonderland & Gondola", isPopular: true },
  { id: "pahalgam", name: "Pahalgam", state: "Jammu and Kashmir", aliases: ["Valley of Shepherds"], type: "Pine Valleys & Lidder River", isPopular: true },
  { id: "sonamarg", name: "Sonamarg", state: "Jammu and Kashmir", aliases: ["Golden Meadow"], type: "Glacier Treks & Alpine Beauty" },
  { id: "jammu", name: "Jammu", state: "Jammu and Kashmir", aliases: ["City of Temples"], type: "Winter Capital" },
  { id: "katra", name: "Katra", state: "Jammu and Kashmir", aliases: ["Vaishno Devi"], type: "Pilgrimage Center", isPopular: true },
  { id: "leh", name: "Leh", state: "Ladakh", aliases: ["Leh Ladakh"], type: "High Altitude Desert & Monasteries", isPopular: true },
  { id: "nubra", name: "Nubra Valley", state: "Ladakh", aliases: ["Hunder", "Diskit"], type: "Sand Dunes & Double Hump Camels" },
  { id: "pangong", name: "Pangong Lake", state: "Ladakh", aliases: ["Pangong Tso"], type: "Azure Crystal Alpine Lake" },

  // --- Punjab & Chandigarh & Haryana ---
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh", aliases: ["The City Beautiful"], type: "Architectural Marvel & UT", isPopular: true },
  { id: "amritsar", name: "Amritsar", state: "Punjab", aliases: ["Golden Temple City"], type: "Golden Temple & Culinary Capital", isPopular: true },
  { id: "ludhiana", name: "Ludhiana", state: "Punjab", aliases: [], type: "Textile & Industrial Hub" },
  { id: "jalandhar", name: "Jalandhar", state: "Punjab", aliases: [], type: "Sports & Cultural Center" },
  { id: "patiala", name: "Patiala", state: "Punjab", aliases: ["Royal City"], type: "Royal Heritage City" },
  { id: "bathinda", name: "Bathinda", state: "Punjab", aliases: [], type: "Historic Fort City" },
  { id: "mohali", name: "Mohali", state: "Punjab", aliases: ["SAS Nagar"], type: "Sports & Tech City" },
  { id: "panipat", name: "Panipat", state: "Haryana", aliases: ["City of Weavers"], type: "Historical Battle City" },
  { id: "karnal", name: "Karnal", state: "Haryana", aliases: [], type: "Rice City" },
  { id: "ambala", name: "Ambala", state: "Haryana", aliases: ["Ambala Cantt"], type: "Twin Cantonment City" },
  { id: "rohtak", name: "Rohtak", state: "Haryana", aliases: [], type: "Educational City" },

  // --- Rajasthan ---
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", aliases: ["Pink City"], type: "Royal Palaces & Fortresses", isPopular: true },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", aliases: ["City of Lakes", "Venice of the East"], type: "Lake Palaces & Regal Luxury", isPopular: true },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan", aliases: ["Blue City", "Sun City"], type: "Mehrangarh Fort & Desert Heritage", isPopular: true },
  { id: "jaisalmer", name: "Jaisalmer", state: "Rajasthan", aliases: ["Golden City"], type: "Thar Desert Dunes & Sandstone Forts", isPopular: true },
  { id: "pushkar", name: "Pushkar", state: "Rajasthan", aliases: ["Brahma Temple"], type: "Sacred Lake & Desert Culture", isPopular: true },
  { id: "bikaner", name: "Bikaner", state: "Rajasthan", aliases: ["Camel City"], type: "Junagarh Fort & Dunes" },
  { id: "mount-abu", name: "Mount Abu", state: "Rajasthan", aliases: ["Dilwara"], type: "Oasis Hill Station & Dilwara Temples", isPopular: true },
  { id: "ranthambore", name: "Ranthambore", state: "Rajasthan", aliases: ["Sawai Madhopur"], type: "Royal Bengal Tiger Reserves", isPopular: true },
  { id: "ajmer", name: "Ajmer", state: "Rajasthan", aliases: ["Dargah Sharif"], type: "Sufi Heritage & Taragarh" },
  { id: "chittorgarh", name: "Chittorgarh", state: "Rajasthan", aliases: ["Chittor Fort"], type: "Monumental Hill Fort" },
  { id: "alwar", name: "Alwar", state: "Rajasthan", aliases: ["Sariska"], type: "Sariska Tigers & Hill Forts" },
  { id: "neemrana", name: "Neemrana", state: "Rajasthan", aliases: [], type: "Heritage Fort Palace Getaways" },
  { id: "kota", name: "Kota", state: "Rajasthan", aliases: ["Chambal"], type: "Riverfront & Heritage City" },
  { id: "bharatpur", name: "Bharatpur", state: "Rajasthan", aliases: ["Keoladeo Bird Sanctuary"], type: "World Heritage Bird Park" },

  // --- Maharashtra ---
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", aliases: ["Bombay", "Maximum City", "South Bombay", "Bandra"], type: "Financial Metropolis & Coastal Hub", isPopular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", aliases: ["Poona", "Oxford of the East"], type: "Cultural & IT Hub", isPopular: true },
  { id: "lonavala", name: "Lonavala", state: "Maharashtra", aliases: ["Khandala", "Lonavla"], type: "Western Ghats & Waterfalls", isPopular: true },
  { id: "mahabaleshwar", name: "Mahabaleshwar", state: "Maharashtra", aliases: ["Panchgani"], type: "Strawberry Hills & Valley Points", isPopular: true },
  { id: "alibaug", name: "Alibaug", state: "Maharashtra", aliases: ["Alibag"], type: "Coastal Villas & Speedboat Getaways", isPopular: true },
  { id: "nashik", name: "Nashik", state: "Maharashtra", aliases: ["Nasik", "Wine Capital"], type: "Vineyards & Godavari Riverside", isPopular: true },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", aliases: ["Orange City"], type: "Tiger Gateway of India" },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", aliases: ["Aurangabad", "Ajanta Ellora"], type: "UNESCO Ajanta & Ellora Caves", isPopular: true },
  { id: "shirdi", name: "Shirdi", state: "Maharashtra", aliases: ["Sai Baba City"], type: "Spiritual Pilgrimage Center" },
  { id: "kolhapur", name: "Kolhapur", state: "Maharashtra", aliases: [], type: "Mahalakshmi Temple & Heritage" },
  { id: "matheran", name: "Matheran", state: "Maharashtra", aliases: [], type: "Automobile-free Eco Hill Station" },
  { id: "panchgani", name: "Panchgani", state: "Maharashtra", aliases: [], type: "Table Land & Valley Vistas" },
  { id: "ratnagiri", name: "Ratnagiri", state: "Maharashtra", aliases: ["Konkan"], type: "Konkan Coast & Alphonso Mangos" },
  { id: "solapur", name: "Solapur", state: "Maharashtra", aliases: [], type: "Historic Textile City" },
  { id: "thane", name: "Thane", state: "Maharashtra", aliases: ["City of Lakes"], type: "Metropolitan Lake City" },
  { id: "navi-mumbai", name: "Navi Mumbai", state: "Maharashtra", aliases: [], type: "Planned Waterfront City" },

  // --- Goa ---
  { id: "goa", name: "Goa", state: "Goa", aliases: ["North Goa", "South Goa", "Panaji", "Calangute", "Candolim", "Anjuna", "Baga", "Vagator", "Palolem", "Morjim"], type: "Beaches, Luxury Villas & Nightlife", isPopular: true },
  { id: "panaji", name: "Panaji", state: "Goa", aliases: ["Panjim", "Fontainhas"], type: "Latin Quarter & River Mandovi", isPopular: true },
  { id: "margao", name: "Margao", state: "Goa", aliases: ["Madgaon"], type: "South Goa Cultural Capital" },

  // --- Gujarat ---
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", aliases: ["Amdavad"], type: "UNESCO Heritage City & Riverfront", isPopular: true },
  { id: "surat", name: "Surat", state: "Gujarat", aliases: ["Diamond City"], type: "Diamond & Textile Capital", isPopular: true },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", aliases: ["Baroda"], type: "Cultural Capital & Laxmi Vilas Palace", isPopular: true },
  { id: "rajkot", name: "Rajkot", state: "Gujarat", aliases: [], type: "Saurashtra Commercial Hub" },
  { id: "kutch", name: "Rann of Kutch", state: "Gujarat", aliases: ["Kutch", "Bhuj", "White Desert"], type: "White Salt Desert & Rann Utsav", isPopular: true },
  { id: "gir", name: "Sasan Gir", state: "Gujarat", aliases: ["Gir National Park"], type: "Asiatic Lion Sanctuary", isPopular: true },
  { id: "dwarka", name: "Dwarka", state: "Gujarat", aliases: [], type: "Sacred Coastal Temple" },
  { id: "somnath", name: "Somnath", state: "Gujarat", aliases: [], type: "Jyotirlinga Sea Shore Temple" },
  { id: "gandhinagar", name: "Gandhinagar", state: "Gujarat", aliases: ["Akshardham"], type: "Green Capital City" },
  { id: "bhavnagar", name: "Bhavnagar", state: "Gujarat", aliases: [], type: "Gulf of Khambhat Port" },
  { id: "jamnagar", name: "Jamnagar", state: "Gujarat", aliases: ["Oil City"], type: "Coastal Heritage & Marine Sanctuary" },

  // --- Karnataka ---
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", aliases: ["Bangalore", "Silicon Valley of India"], type: "Tech Capital & Garden City", isPopular: true },
  { id: "mysuru", name: "Mysuru", state: "Karnataka", aliases: ["Mysore"], type: "Royal Palaces & Silk Capital", isPopular: true },
  { id: "coorg", name: "Coorg", state: "Karnataka", aliases: ["Madikeri", "Kodagu", "Scotland of India"], type: "Coffee Plantations & Mist Hills", isPopular: true },
  { id: "chikmagalur", name: "Chikmagalur", state: "Karnataka", aliases: ["Chikkamagaluru"], type: "Coffee Hills & Mountain Peaks", isPopular: true },
  { id: "hampi", name: "Hampi", state: "Karnataka", aliases: ["Vijayanagara"], type: "UNESCO Boulder Ruins & Monolithic Temples", isPopular: true },
  { id: "gokarna", name: "Gokarna", state: "Karnataka", aliases: ["Om Beach"], type: "Pristine Clifftop Beaches & Temples", isPopular: true },
  { id: "mangaluru", name: "Mangaluru", state: "Karnataka", aliases: ["Mangalore"], type: "Coastal Port & Culinary Haven" },
  { id: "udupi", name: "Udupi", state: "Karnataka", aliases: ["Malpe"], type: "Coastal Temples & St. Mary's Island" },
  { id: "kabini", name: "Kabini", state: "Karnataka", aliases: ["Nagarhole"], type: "Wildlife Jungle Lodges & River Safaris" },
  { id: "badami", name: "Badami", state: "Karnataka", aliases: ["Pattadakal", "Aihole"], type: "Ancient Rock-cut Cave Architecture" },
  { id: "hubli", name: "Hubli-Dharwad", state: "Karnataka", aliases: ["Hubballi"], type: "Commercial Gateway" },
  { id: "belgaum", name: "Belagavi", state: "Karnataka", aliases: ["Belgaum"], type: "Border Heritage City" },

  // --- Kerala ---
  { id: "kochi", name: "Kochi", state: "Kerala", aliases: ["Cochin", "Fort Kochi", "Ernakulam"], type: "Queen of the Arabian Sea & Colonial Heritage", isPopular: true },
  { id: "munnar", name: "Munnar", state: "Kerala", aliases: ["Tea Gardens"], type: "Sprawling Tea Gardens & Mountain Peaks", isPopular: true },
  { id: "alleppey", name: "Alleppey", state: "Kerala", aliases: ["Alappuzha", "Venice of the East"], type: "Backwaters & Houseboat Cruises", isPopular: true },
  { id: "wayanad", name: "Wayanad", state: "Kerala", aliases: ["Vythiri", "Kalpetta"], type: "Lush Waterfalls & Treehouse Resorts", isPopular: true },
  { id: "varkala", name: "Varkala", state: "Kerala", aliases: ["Varkala Cliff"], type: "Dramatic Sea Cliffs & Surfing Beaches", isPopular: true },
  { id: "trivandrum", name: "Thiruvananthapuram", state: "Kerala", aliases: ["Trivandrum", "Kovalam"], type: "State Capital, Padmanabhaswamy & Kovalam", isPopular: true },
  { id: "thekkady", name: "Thekkady", state: "Kerala", aliases: ["Periyar"], type: "Spice Plantations & Periyar Wildlife Sanctuary" },
  { id: "kumarakom", name: "Kumarakom", state: "Kerala", aliases: ["Vembanad Lake"], type: "Lake Resorts & Bird Sanctuary" },
  { id: "kozhikode", name: "Kozhikode", state: "Kerala", aliases: ["Calicut"], type: "Historic Malabar Coast & Cuisine" },
  { id: "thrissur", name: "Thrissur", state: "Kerala", aliases: ["Trichur"], type: "Cultural Capital of Kerala" },
  { id: "kollam", name: "Kollam", state: "Kerala", aliases: ["Quilon"], type: "Gateway to the Backwaters" },
  { id: "kannur", name: "Kannur", state: "Kerala", aliases: ["Cannanore"], type: "Theyyam & Secluded Beaches" },

  // --- Tamil Nadu & Puducherry ---
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", aliases: ["Madras"], type: "Coastal Metropolis & Classical Culture", isPopular: true },
  { id: "pondicherry", name: "Pondicherry", state: "Puducherry", aliases: ["Puducherry", "Auroville", "White Town"], type: "French Quarter & Auroville Coastal Retreat", isPopular: true },
  { id: "ooty", name: "Ooty", state: "Tamil Nadu", aliases: ["Udhagamandalam", "Nilgiris"], type: "Nilgiri Mountain Railway & Tea Hills", isPopular: true },
  { id: "kodaikanal", name: "Kodaikanal", state: "Tamil Nadu", aliases: ["Kodai", "Princess of Hill Stations"], type: "Star-shaped Lake & Mist Forests", isPopular: true },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu", aliases: ["Meenakshi Temple City"], type: "Meenakshi Amman Temple Heritage", isPopular: true },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", aliases: ["Kovai", "Manchester of South India"], type: "Industrial Gateway to Nilgiris" },
  { id: "mahabalipuram", name: "Mahabalipuram", state: "Tamil Nadu", aliases: ["Mamallapuram"], type: "UNESCO Shore Temples & Rock Carvings", isPopular: true },
  { id: "rameswaram", name: "Rameswaram", state: "Tamil Nadu", aliases: ["Dhanushkodi"], type: "Island Temple & Pamban Bridge", isPopular: true },
  { id: "kanyakumari", name: "Kanyakumari", state: "Tamil Nadu", aliases: ["Cape Comorin"], type: "Triconfluence of Oceans & Sunrise", isPopular: true },
  { id: "thanjavur", name: "Thanjavur", state: "Tamil Nadu", aliases: ["Tanjore"], type: "Brihadisvara Great Living Chola Temple" },
  { id: "tiruchirappalli", name: "Tiruchirappalli", state: "Tamil Nadu", aliases: ["Trichy", "Rockfort"], type: "Rockfort & Island Temples" },
  { id: "salem", name: "Salem", state: "Tamil Nadu", aliases: ["Yercaud Foothills"], type: "Mango & Steel City" },
  { id: "yercaud", name: "Yercaud", state: "Tamil Nadu", aliases: ["Jewel of the South"], type: "Shevaroy Hills Sanctuary" },
  { id: "tirupati", name: "Tirupati", state: "Andhra Pradesh", aliases: ["Tirumala"], type: "Sacred Tirumala Venkateswara Temple", isPopular: true },

  // --- Telangana & Andhra Pradesh ---
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", aliases: ["Cyberabad", "City of Pearls", "Secunderabad"], type: "City of Pearls, Charminar & High-Tech", isPopular: true },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", aliases: ["Vizag"], type: "Coastal Port & Araku Valley Gateway", isPopular: true },
  { id: "vijayawada", name: "Vijayawada", state: "Andhra Pradesh", aliases: ["Bezawada"], type: "Krishna Riverfront City" },
  { id: "guntur", name: "Guntur", state: "Andhra Pradesh", aliases: [], type: "Historic Trading Center" },
  { id: "warangal", name: "Warangal", state: "Telangana", aliases: ["Kakatiya"], type: "Kakatiya Dynasty Architecture" },
  { id: "rajahmundry", name: "Rajahmundry", state: "Andhra Pradesh", aliases: ["Rajamahendravaram"], type: "Godavari Cultural Capital" },
  { id: "araku", name: "Araku Valley", state: "Andhra Pradesh", aliases: ["Araku"], type: "Coffee Plantations & Borra Caves" },

  // --- West Bengal, Odisha, Bihar & Jharkhand ---
  { id: "kolkata", name: "Kolkata", state: "West Bengal", aliases: ["Calcutta", "City of Joy"], type: "Cultural & Literary Metropolis", isPopular: true },
  { id: "darjeeling", name: "Darjeeling", state: "West Bengal", aliases: ["Queen of the Hills", "Kanchenjunga"], type: "Himalayan Toy Train & Tea Estates", isPopular: true },
  { id: "kalimpong", name: "Kalimpong", state: "West Bengal", aliases: [], type: "Orchid Nurseries & River Views" },
  { id: "siliguri", name: "Siliguri", state: "West Bengal", aliases: ["Chicken's Neck"], type: "Gateway to Northeast India" },
  { id: "digha", name: "Digha", state: "West Bengal", aliases: ["Mandarmani"], type: "Bengal Coastal Resort" },
  { id: "shantiniketan", name: "Shantiniketan", state: "West Bengal", aliases: ["Tagore City"], type: "Tagore's University & Art Town" },
  { id: "sundarbans", name: "Sundarbans", state: "West Bengal", aliases: ["Mangroves"], type: "World Heritage Mangrove Forest" },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", aliases: ["Temple City"], type: "Ancient Kalinga Temples & Smart City", isPopular: true },
  { id: "puri", name: "Puri", state: "Odisha", aliases: ["Jagannath Puri", "Golden Beach"], type: "Jagannath Temple & Blue Flag Golden Beach", isPopular: true },
  { id: "konark", name: "Konark", state: "Odisha", aliases: ["Sun Temple"], type: "Sun Temple UNESCO Monument", isPopular: true },
  { id: "cuttack", name: "Cuttack", state: "Odisha", aliases: ["Silver City"], type: "Historic Millennia-old City" },
  { id: "patna", name: "Patna", state: "Bihar", aliases: ["Pataliputra"], type: "State Capital & Ganga River Heritage" },
  { id: "gaya", name: "Bodh Gaya", state: "Bihar", aliases: ["Gaya", "Bodhgaya"], type: "Mahabodhi Temple UNESCO Enlightenment Site", isPopular: true },
  { id: "nalanda", name: "Nalanda", state: "Bihar", aliases: ["Rajgir"], type: "Ancient World University Ruins" },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", aliases: ["City of Waterfalls"], type: "State Capital & Cascades" },
  { id: "jamshedpur", name: "Jamshedpur", state: "Jharkhand", aliases: ["Tatanagar", "Steel City"], type: "First Planned Industrial City" },
  { id: "deoghar", name: "Deoghar", state: "Jharkhand", aliases: ["Baidyanath Dham"], type: "Baidyanath Jyotirlinga Shrine" },

  // --- Madhya Pradesh & Chhattisgarh ---
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", aliases: ["City of Lakes"], type: "State Capital & Upper Lake Heritage", isPopular: true },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", aliases: ["Cleanest City", "Food Capital"], type: "Cleanest City in India & Sarafa Bazaar", isPopular: true },
  { id: "gwalior", name: "Gwalior", state: "Madhya Pradesh", aliases: ["Gwalior Fort"], type: "Impenetrable Fort & Music Capital" },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", aliases: ["Bhedaghat", "Marble Rocks"], type: "Marble Rocks & Dhuandhar Falls" },
  { id: "ujjain", name: "Ujjain", state: "Madhya Pradesh", aliases: ["Mahakaleshwar"], type: "Mahakaleshwar Jyotirlinga & Kumbh City", isPopular: true },
  { id: "khajuraho", name: "Khajuraho", state: "Madhya Pradesh", aliases: ["Khajuraho Temples"], type: "UNESCO Nagara Temple Sculptures", isPopular: true },
  { id: "orchha", name: "Orchha", state: "Madhya Pradesh", aliases: ["Betwa"], type: "Bundela Palaces on Betwa River" },
  { id: "pachmarhi", name: "Pachmarhi", state: "Madhya Pradesh", aliases: ["Queen of Satpura"], type: "Satpura Hill Station & Caves" },
  { id: "kanha", name: "Kanha National Park", state: "Madhya Pradesh", aliases: ["Kanha"], type: "Jungle Book Tiger Sanctuary" },
  { id: "bandhavgarh", name: "Bandhavgarh", state: "Madhya Pradesh", aliases: [], type: "Highest Tiger Density Reserve" },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", aliases: [], type: "State Capital" },
  { id: "bilaspur", name: "Bilaspur", state: "Chhattisgarh", aliases: [], type: "High Court City" },

  // --- North-East & Islands ---
  { id: "gangtok", name: "Gangtok", state: "Sikkim", aliases: ["Sikkim Capital"], type: "Himalayan Ridge Capital & Monasteries", isPopular: true },
  { id: "pelling", name: "Pelling", state: "Sikkim", aliases: [], type: "Views of Mount Kanchenjunga" },
  { id: "guwahati", name: "Guwahati", state: "Assam", aliases: ["Gateway to Northeast", "Kamakhya"], type: "Kamakhya Temple & Brahmaputra", isPopular: true },
  { id: "kaziranga", name: "Kaziranga", state: "Assam", aliases: ["Rhino Sanctuary"], type: "One-horned Rhino World Heritage Reserve", isPopular: true },
  { id: "shillong", name: "Shillong", state: "Meghalaya", aliases: ["Scotland of the East"], type: "Pine Hills, Music & Living Root Bridges", isPopular: true },
  { id: "cherrapunji", name: "Cherrapunji", state: "Meghalaya", aliases: ["Sohra"], type: "Waterfalls & Living Root Bridges", isPopular: true },
  { id: "dawki", name: "Dawki", state: "Meghalaya", aliases: ["Umngot River"], type: "Crystal Clear Glass Boat River" },
  { id: "imphal", name: "Imphal", state: "Manipur", aliases: ["Loktak Lake"], type: "Floating National Park & Valley" },
  { id: "aizawl", name: "Aizawl", state: "Mizoram", aliases: [], type: "Mountain Cliff City & Blue Mountain" },
  { id: "kohima", name: "Kohima", state: "Nagaland", aliases: ["Hornbill"], type: "Hornbill Festival & Dzukou Valley" },
  { id: "agartala", name: "Agartala", state: "Tripura", aliases: ["Ujjayanta"], type: "Royal Palace City" },
  { id: "itangar", name: "Itanagar", state: "Arunachal Pradesh", aliases: ["Tawang Gateway"], type: "Land of the Dawn-lit Mountains" },
  { id: "tawang", name: "Tawang", state: "Arunachal Pradesh", aliases: ["Tawang Monastery"], type: "Snow Mountain Monastery Retreat", isPopular: true },
  { id: "port-blair", name: "Port Blair", state: "Andaman and Nicobar Islands", aliases: ["Andaman", "Cellular Jail"], type: "Tropical Island Capital & Marine Parks", isPopular: true },
  { id: "havelock", name: "Havelock Island", state: "Andaman and Nicobar Islands", aliases: ["Swaraj Dweep", "Radhanagar Beach"], type: "World Top Rated White Sand Beaches & Diving", isPopular: true }
];

export function searchIndianCities(query: string, maxResults = 8): IndianCity[] {
  const q = (query || "").trim().toLowerCase();

  // If no query, return the curated popular destinations across India
  if (!q) {
    return INDIAN_CITIES.filter((c) => c.isPopular).slice(0, maxResults);
  }

  // 1. Exact Match on name or alias
  const exactMatches: IndianCity[] = [];
  // 2. City name starts with query (Primary Prefix Match)
  const namePrefixMatches: IndianCity[] = [];
  // 3. Any alias starts with query (e.g. "Bom" -> Bombay -> Mumbai, "Ban" -> Bangalore -> Bengaluru)
  const aliasPrefixMatches: IndianCity[] = [];
  // 4. State starts with query (e.g. "Ker" -> Kerala cities, "Raj" -> Rajasthan cities)
  const statePrefixMatches: IndianCity[] = [];
  // 5. Name contains query
  const nameContainsMatches: IndianCity[] = [];
  // 6. State or alias contains query
  const otherContainsMatches: IndianCity[] = [];

  const seenIds = new Set<string>();

  for (const city of INDIAN_CITIES) {
    const nameLower = city.name.toLowerCase();
    const stateLower = city.state.toLowerCase();
    const aliasesLower = (city.aliases || []).map((a) => a.toLowerCase());

    if (nameLower === q || aliasesLower.includes(q)) {
      exactMatches.push(city);
      seenIds.add(city.id);
      continue;
    }

    if (nameLower.startsWith(q)) {
      namePrefixMatches.push(city);
      seenIds.add(city.id);
      continue;
    }

    if (aliasesLower.some((a) => a.startsWith(q))) {
      aliasPrefixMatches.push(city);
      seenIds.add(city.id);
      continue;
    }

    if (stateLower.startsWith(q)) {
      statePrefixMatches.push(city);
      seenIds.add(city.id);
      continue;
    }

    if (nameLower.includes(q)) {
      nameContainsMatches.push(city);
      seenIds.add(city.id);
      continue;
    }

    if (stateLower.includes(q) || aliasesLower.some((a) => a.includes(q))) {
      otherContainsMatches.push(city);
      seenIds.add(city.id);
      continue;
    }
  }

  const combined = [
    ...exactMatches,
    ...namePrefixMatches,
    ...aliasPrefixMatches,
    ...statePrefixMatches,
    ...nameContainsMatches,
    ...otherContainsMatches,
  ];

  return combined.slice(0, maxResults);
}
