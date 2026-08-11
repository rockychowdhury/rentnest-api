import { prisma } from '../src/lib/prisma.js';
import { PropertyStatus, PropertyUnitStatus, RentType, Currency, AmenityType } from '../generated/prisma/enums.js';

const LANDLORD_IDS = [
  '7a9a2578-13a5-426c-846e-88908dd05625',
  'f589a678-da84-4695-be03-b4660eec6a4b',
  'd890b26e-7b9b-49e3-a5f3-c4c6384d7fcf',
  'd9df5809-4ef2-45b8-a181-051175dddb4c',
];

const IMAGES = [
  'https://i.ibb.co.com/N6n173gD/adam-winger-VGs8z60y-T2c-unsplash.jpg',
  'https://i.ibb.co.com/MD9DdzpF/aes-VGr1z-Btx-Voc-unsplash.jpg',
  'https://i.ibb.co.com/3m91wcHd/brian-babb-Xbw-Hrt87m-Q0-unsplash.jpg',
  'https://i.ibb.co.com/cK7RvHWh/caroline-badran-n4f-Hj9z-CW6g-unsplash.jpg',
  'https://i.ibb.co.com/My6psqHg/florian-schmidinger-b-79n-Oqf95-I-unsplash.jpg',
  'https://i.ibb.co.com/RTDj0X5R/harbourside-bahamas-X2fs-KFvn5g-M-unsplash.jpg',
  'https://i.ibb.co.com/DPpyNgQP/kara-eads-L7-Ew-Hkq1-B2s-unsplash.jpg',
  'https://i.ibb.co.com/sd8bzMHL/leohoho-QL7-Kd-Xdcf-WA-unsplash.jpg',
  'https://i.ibb.co.com/nsLmr7N1/manuel-frohlich-Z-2oso2-BOPo-unsplash.jpg',
  'https://i.ibb.co.com/Q3sdL36j/naomi-hebert-MP0bga-S-d1c-unsplash.jpg',
  'https://i.ibb.co.com/nNSmnC4T/osmany-m-leyva-aldana-FBz-Ec-1-To-Wo-unsplash.jpg',
  'https://i.ibb.co.com/93nn2KHD/renee-miranda-Dzc01qilrc-U-unsplash.jpg',
  'https://i.ibb.co.com/B59F607Z/roberto-nickson-so3wg-JLw-Dxo-unsplash.jpg',
  'https://i.ibb.co.com/bMnZ6yWk/todd-kent-178j8t-Jr-Nlc-unsplash.jpg',
  'https://i.ibb.co.com/20N9QsgB/webaliser-TPTXZd9m-Oo-unsplash.jpg',
  'https://i.ibb.co.com/RkqVnWWt/william-dmytrow-r-CTMEKe-a-BU-unsplash.jpg',
  'https://i.ibb.co.com/0VYpX6Zj/62065301110343249.jpg',
  'https://i.ibb.co.com/zW9T7jJZ/164944405099393955.jpg',
  'https://i.ibb.co.com/Kpw7DYg8/206532332907631804.jpg',
  'https://i.ibb.co.com/KzpF80Kb/241646336254502717.jpg',
  'https://i.ibb.co.com/Gft3DCJn/295056213113368205.jpg',
  'https://i.ibb.co.com/nqmykKcf/296252481760597124.jpg',
  'https://i.ibb.co.com/CpCTd9cL/376895062587397913.jpg',
  'https://i.ibb.co.com/v6rzHBXd/515873332340503068.jpg',
  'https://i.ibb.co.com/dwPKxbpF/525021269079643370.jpg',
  'https://i.ibb.co.com/TBqKPYYv/528187862554509946.jpg',
  'https://i.ibb.co.com/SDj2LnPR/544020830010388249.jpg',
  'https://i.ibb.co.com/yDxHYZ9/586312445282788001.jpg',
  'https://i.ibb.co.com/zTBnVyhP/601582462768271757.jpg',
  'https://i.ibb.co.com/1fncTtwv/729372102193706155.jpg',
  'https://i.ibb.co.com/99b2BsMs/748582769354448682.jpg',
  'https://i.ibb.co.com/4gMTRGQc/776237685821626766.jpg',
  'https://i.ibb.co.com/46V3MXY/1055671968925742621.jpg',
  'https://i.ibb.co.com/mdkzfDM/1081145454301106903.jpg',
  'https://i.ibb.co.com/hFzXjhCv/1129840625290690545.jpg',
  'https://i.ibb.co.com/Y45gycbH/beautiful-architecture-office-business-building-with-glass-window-shape.jpg',
  'https://i.ibb.co.com/zyMLj8P/download.jpg',
  'https://i.ibb.co.com/9PgLP8k/Home-page-Town-Country-Living.jpg',
  'https://i.ibb.co.com/ZR0S9cbY/joel-filipe-RFDP7-80v5-A-unsplash.jpg',
  'https://i.ibb.co.com/k2Vrh79g/low-angle-shot-tall-city-building-with-blue-sky-background-new-york.jpg',
  'https://i.ibb.co.com/Cds24kN/neo-brutalism-inspired-building.jpg',
  'https://i.ibb.co.com/Xrcgz7yr/Parisian-I-hope-you-have-a-new-house-even-though-it-s-gone-Facebook.jpg',
  'https://i.ibb.co.com/cKVtKG4m/Southern-Countryside-Cottage-Home-Tour-AI.jpg',
  'https://i.ibb.co.com/pvLfGQx9/Swipe-to-explore-stylish-minimalist-office.jpg',
  'https://i.ibb.co.com/1YXvj72j/the-sims-4-vacation-house-inspo.jpg',
];

const DISTRICT_CENTERS: Record<number, [number, number]> = {
  26: [23.8103, 90.4125],
  15: [22.3569, 91.7832],
  91: [24.9045, 91.8611],
  47: [22.8456, 89.5403],
  81: [24.3745, 88.6042],
  6: [22.701, 90.3535],
  61: [24.7471, 90.4203],
  22: [21.4332, 92.0108],
  33: [23.9999, 90.4203],
  67: [23.6222, 90.4996],
  85: [25.7559, 89.2433],
  10: [24.8469, 89.3774],
  19: [23.4607, 91.1809],
  41: [23.1669, 89.209],
};

const POSTCODES: Record<number, string[]> = {
  26: ['1205', '1206', '1207', '1209', '1212', '1215', '1216', '1219', '1229'],
  15: ['4000', '4202', '4212'],
  91: ['3100', '3101', '3102'],
  47: ['9000', '9001', '9100'],
  81: ['6000', '6100'],
  6: ['8200'],
  61: ['2200'],
  22: ['4700', '4701'],
  33: ['1700', '1701'],
  67: ['1400', '1410'],
  85: ['5400'],
  10: ['5800'],
  19: ['3500'],
  41: ['7400'],
};

const STREETS = [
  'Road 7', 'Road 11', 'Avenue 5', 'College Road', 'Station Road', 'Airport Road',
  'New Market Road', 'Main Road', 'Lake Road', 'Garden Road', 'Boro Bari Road',
  'Mollapara Road', 'Highway Link Road', 'Shantinagar Road', 'Bijoy Sarani',
  'Mirpur Road', 'Moghbazar Road', 'Green Road', 'Kazi Nazrul Islam Avenue', 'Sonargaon Road',
];

const LANDMARKS = [
  'Near city bus stand', 'Beside Al-Madina Masjid', 'Opposite district stadium',
  'Adjacent to Grand Mart', 'Near central mosque', 'Behind City College',
  'Beside petrol pump', 'Near community market', 'Adjacent to school field',
];

const UTILITY_POLICIES = [
  'Billed separately based on meter reading',
  'Flat rate included in monthly rent',
  'As per monthly consumption',
];

interface UnitSpec {
  count: [number, number];
  beds: [number, number];
  baths: [number, number];
  sizes: [number, number];
  floors?: number[];
  baseRent: number;
  variance?: number;
  yearly?: boolean;
  daily?: boolean;
  weekly?: boolean;
  hourly?: boolean;
  roundTo?: number;
}

interface PropertySeed {
  category: string;
  title: string;
  description: string;
  landlord: number;
  districtId: number;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'DRAFT' | 'INACTIVE';
  featured?: boolean;
  verified?: boolean;
  simple?: boolean;
  units: UnitSpec;
  propertyAmenities: string[];
  unitAmenities: string[];
}

const PROPERTIES: PropertySeed[] = [
  {
    category: 'Apartment/Flat',
    title: 'Sunlit 3-Bed Family Apartment with Balcony in Dhanmondi',
    description:
      'A well-maintained family apartment on a quiet Dhanmondi lane, offering three spacious bedrooms, a wide living-dining area and a covered balcony overlooking the neighbourhood. The building has a lift, backup generator, 24/7 security and dedicated parking. Ideal for families who want a calm address close to schools, hospitals and Dhanmondi Lake.',
    landlord: 0,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [4, 4], beds: [2, 3], baths: [2, 3], sizes: [1200, 1800],
      floors: [3, 4, 5], baseRent: 42000, yearly: true, roundTo: 1000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Parking', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System', 'Rooftop Access'],
    unitAmenities: ['Gas Line', 'Balcony', 'Air Conditioning', 'Intercom', 'Wi-Fi/Internet'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Premium 4-Bed Penthouse Apartment in Gulshan',
    description:
      'Exclusive penthouse apartment on the top floor of a Gulshan high-rise. Four generous bedrooms, staff accommodation, a large rooftop terrace and panoramic city views. Residents enjoy a swimming pool, gym, reserved parking and an elevator that continues to run on backup power. A premium choice for executives and large families.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [2, 2], beds: [3, 4], baths: [3, 4], sizes: [2000, 2600],
      floors: [7, 8], baseRent: 75000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Elevator Backup Power', 'Parking', 'CCTV', 'Security Guard', 'Swimming Pool', 'Gym', 'Fire Safety System', 'WASA Water Supply'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Budget 2-Bed Flat near Mirpur 10',
    description:
      'Affordable two-bedroom flats on a busy but convenient Mirpur road. Each unit has a small balcony, tiled kitchen and enough room for a small family. The building is equipped with a lift, generator backup and CCTV. Walking distance to Mirpur 10 bus stoppage, shopping malls and major hospitals.',
    landlord: 2,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [6, 6], beds: [2, 2], baths: [1, 2], sizes: [800, 1000],
      floors: [2, 3, 4, 5], baseRent: 16000, yearly: true, roundTo: 500,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Balcony', 'Intercom'],
  },
  {
    category: 'Apartment/Flat',
    title: '3-Bed Seaside Apartment at Nasirabad Housing',
    description:
      'A light and airy three-bedroom apartment in a gated residential pocket of Nasirabad Housing Society, Chattogram. Sea breeze, tree-lined streets and easy access to Agrabad and GEC circle. The building has a lift, generator, car parking and 24-hour security. Great for families looking for a calm home close to the city.',
    landlord: 3,
    districtId: 15,
    status: 'ACTIVE',
    simple: true,
    verified: true,
    units: {
      count: [1, 1], beds: [3, 3], baths: [2, 2], sizes: [1300, 1400],
      floors: [4], baseRent: 32000, roundTo: 1000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Parking', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Compact 1-Bed Rental Flat in Shantinagar',
    description:
      'Compact one-bedroom flats ideal for bachelors or couples in the heart of Dhaka. Efficient layout with a fitted kitchen, one bathroom and a small balcony. Building facilities include a lift, generator and water reserve tank. Close to Shantinagar, Ramna Park and numerous offices and restaurants.',
    landlord: 0,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [5, 5], beds: [1, 2], baths: [1, 1], sizes: [600, 850],
      floors: [2, 3, 4, 5], baseRent: 14000, yearly: true, roundTo: 500,
    },
    propertyAmenities: ['Lift', 'Generator', 'Water Reserve Tank', 'WASA Water Supply', 'CCTV'],
    unitAmenities: ['Gas Line', 'Balcony', 'Intercom', 'Wi-Fi/Internet'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Elegant 3-Bed Apartment in Sylhet City Centre',
    description:
      'Refurbished three-bedroom apartment minutes from Sylhet\'s main commercial zone. Wood-toned interiors, modern kitchen, and a corner balcony with city views. The building is secured, with lift, generator, and covered parking. Short walk to restaurants, banks and the Zindabazar shopping district.',
    landlord: 1,
    districtId: 91,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [3, 3], beds: [2, 3], baths: [2, 2], sizes: [1150, 1500],
      floors: [4, 5], baseRent: 30000, yearly: true, roundTo: 1000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Parking', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Cozy 2-Bed Flat in Khulna New Market Area',
    description:
      'Neat two-bedroom flat a short walk from Khulna New Market and the big hospitals. Simple, clean and ready to move into, with balcony, gas line and municipal water. The building has a generator and CCTV. A dependable budget-friendly option in a convenient location.',
    landlord: 2,
    districtId: 47,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [2, 2], baths: [1, 2], sizes: [850, 1050],
      floors: [2, 3, 4], baseRent: 15000, yearly: true, roundTo: 500,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Balcony', 'Intercom'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Modern 3-Bed Apartment at Bashundhara R/A',
    description:
      'Contemporary three-bedroom apartment in a modern complex within Bashundhara Residential Area. Open-plan living, master en-suite and a balcony facing the community park. Amenities include a lift, generator, gym, children\'s play area and 24/7 security. Perfect for young families and professionals.',
    landlord: 3,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [3, 3], baths: [2, 3], sizes: [1400, 1700],
      floors: [6, 7], baseRent: 48000, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Parking', 'CCTV', 'Security Guard', 'Gym', "Children's Play Area", 'Fire Safety System', 'WASA Water Supply'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Apartment/Flat',
    title: 'Unit per Floor Apartment Building in Rajshahi',
    description:
      'A small residential building in Rajshahi city with one apartment on each floor. Flats come with two to three bedrooms, a balcony and separate utility space. Building features include a generator, water reserve tank and CCTV. A practical rental for families near Shaheb Bazar and Rajshahi University.',
    landlord: 0,
    districtId: 81,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [2, 3], baths: [1, 2], sizes: [900, 1200],
      floors: [1, 2, 3, 4], baseRent: 18000, yearly: true, roundTo: 500,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Balcony', 'Intercom'],
  },
  {
    category: 'House',
    title: 'Independent 4-Bed House with Garden in Uttara',
    description:
      'Standalone two-storey house with a private garden in a quiet Uttara block. Four bedrooms, three bathrooms, a spacious drawing and dining room and a kitchen with servant quarter. Comes with car parking for two vehicles, generator and piped gas. A serene family home minutes from Uttara\'s schools and markets.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [2, 2], beds: [3, 4], baths: [3, 4], sizes: [1800, 2600],
      floors: [1, 2], baseRent: 60000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Parking', 'Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Balcony', 'Air Conditioning', 'Wi-Fi/Internet', 'Store Room', 'Servant Quarter'],
  },
  {
    category: 'House',
    title: '2-Storied Family House in Bashundhara Residential Area',
    description:
      'A handsome two-storey house in Bashundhara R/A with a front lawn and driveway. Each floor offers three large bedrooms, modern bathrooms and a family lounge. Fully tiled, with generator, reserve water tank and on-site security. Walking distance to international chain schools and the main shopping blocks.',
    landlord: 2,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [2, 2], beds: [3, 4], baths: [3, 3], sizes: [1500, 2200],
      floors: [1, 2], baseRent: 45000, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Parking', 'Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', "Children's Play Area"],
    unitAmenities: ['Gas Line', 'Balcony', 'Air Conditioning', 'Intercom', 'Store Room'],
  },
  {
    category: 'House',
    title: 'Countryside 3-Bed House near Sylhet Airport Road',
    description:
      'A charming countryside house set back from the Sylhet airport road. Three bedrooms, a large living space and a backyard with fruit trees. The property is surrounded by greenery yet only twenty minutes from the city. Includes piped gas, water reserve and covered parking.',
    landlord: 3,
    districtId: 91,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [2, 2], beds: [2, 3], baths: [2, 3], sizes: [1400, 1800],
      baseRent: 25000, yearly: true, roundTo: 1000,
    },
    propertyAmenities: ['Parking', 'Water Reserve Tank', 'WASA Water Supply', 'Generator', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Wi-Fi/Internet'],
  },
  {
    category: 'House',
    title: 'Spacious Single-Family House in Baridhara DOHS',
    description:
      'An expansive single-family house in the sought-after Baridhara DOHS, offering four en-suite bedrooms, a formal living room, family lounge, study and a large garden. Reserved parking, full-time security, generator and a servant quarter. A prestigious home in one of Dhaka\'s most secure residential enclaves.',
    landlord: 0,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [1, 1], beds: [4, 4], baths: [4, 4], sizes: [2500, 2800],
      baseRent: 85000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Parking', 'Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom', 'Store Room', 'Servant Quarter'],
  },
  {
    category: 'House',
    title: '4-Bed Village House with Courtyard in Bogura',
    description:
      'A traditional yet modernised village house in Bogura with a wide brick courtyard and a tin-shed garage. Four bedrooms, a spacious living room and a country kitchen. Peaceful setting close to Bogura\'s main bazar, ideal for a family wanting more space and fresh air at a reasonable cost.',
    landlord: 1,
    districtId: 10,
    status: 'DRAFT',
    verified: false,
    units: {
      count: [2, 2], beds: [3, 4], baths: [2, 3], sizes: [1600, 2200],
      baseRent: 20000, yearly: true, roundTo: 1000,
    },
    propertyAmenities: ['Parking', 'Generator', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Gas Line', 'Wi-Fi/Internet', 'Balcony'],
  },
  {
    category: 'Duplex',
    title: 'Duplex Family Residence in Dhanmondi Lake View',
    description:
      'A premium duplex residence on a tree-lined Dhanmondi lane with partial lake views. Three to four bedrooms across two levels, a grand staircase, balconies on both floors and a rooftop terrace. Comes with lift, generator, parking and round-the-clock security. One of the finest family addresses in Dhaka.',
    landlord: 2,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [2, 2], beds: [3, 4], baths: [3, 4], sizes: [2000, 2400],
      baseRent: 65000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Elevator Backup Power', 'Parking', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System', 'Rooftop Access'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom', 'Store Room', 'Servant Quarter'],
  },
  {
    category: 'Duplex',
    title: 'Premium Duplex Apartment in Chittagong Bay View',
    description:
      'A luxurious duplex apartment in the Bay View area of Chattogram with a wide balcony facing the sea. Three bedrooms, a private stairwell, separate dining room and a stylish modern kitchen. Building amenities include a lift, generator, pool and gym. Perfect for families who value privacy and views.',
    landlord: 3,
    districtId: 15,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [3, 3], beds: [3, 3], baths: [3, 4], sizes: [1800, 2200],
      baseRent: 55000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Parking', 'CCTV', 'Security Guard', 'Swimming Pool', 'Gym', 'Fire Safety System', 'WASA Water Supply'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Intercom', 'Wi-Fi/Internet'],
  },
  {
    category: 'Duplex',
    title: 'Duplex with Rooftop in Rajshahi City',
    description:
      'A bright duplex in Rajshahi city with a private rooftop ideal for family gatherings. Three to four bedrooms, two spacious living areas and a tiled kitchen. Includes parking, generator and a water reserve tank. Convenient access to Shaheb Bazar, medical colleges and schools.',
    landlord: 0,
    districtId: 81,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [2, 2], beds: [3, 4], baths: [2, 3], sizes: [1500, 2000],
      baseRent: 30000, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Parking', 'Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Rooftop Access'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Store Room'],
  },
  {
    category: 'Studio',
    title: 'Modern Studio near Bashundhara City Mall',
    description:
      'Sleek studio flats minutes from Bashundhara City Mall and Panthapath. Each studio combines a sleeping area, kitchenette and workspace in an efficient layout. Building has a lift, generator and CCTV. A favourite with young professionals and students who want a central, low-maintenance home.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [5, 5], beds: [0, 1], baths: [1, 1], sizes: [350, 600],
      floors: [2, 3, 4, 5], baseRent: 18000, yearly: true, daily: true, roundTo: 500,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Gas Line', 'Air Conditioning', 'Balcony', 'Wi-Fi/Internet', 'Furnished'],
  },
  {
    category: 'Studio',
    title: 'Furnished Studio in Cox\'s Bazar Tourist Zone',
    description:
      'Furnished studios designed for short stays near the Cox\'s Bazar beach stretch. Each unit has a comfortable bed, private bathroom, kitchenette and air conditioning. Daily and weekly stays welcome. The building has a generator, security and a rooftop with sea views.',
    landlord: 2,
    districtId: 22,
    status: 'PENDING_VERIFICATION',
    verified: false,
    units: {
      count: [4, 4], beds: [0, 1], baths: [1, 1], sizes: [300, 550],
      floors: [2, 3], baseRent: 15000, yearly: true, daily: true, weekly: true, roundTo: 500,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Rooftop Access', 'Fire Safety System'],
    unitAmenities: ['Air Conditioning', 'Furnished', 'Balcony', 'Wi-Fi/Internet'],
  },
  {
    category: 'Studio',
    title: 'Compact Studio at Agrabad Commercial Area',
    description:
      'Practical studio units in the heart of Chattogram\'s commercial district at Agrabad. Short and long stays supported, with daily pricing for business visitors. Each studio has a private bath, kitchenette and work desk. Lift, generator and security provided.',
    landlord: 3,
    districtId: 15,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [0, 1], baths: [1, 1], sizes: [320, 520],
      floors: [3, 4], baseRent: 16000, daily: true, weekly: true, roundTo: 500,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Air Conditioning', 'Furnished', 'Wi-Fi/Internet', 'Intercom'],
  },
  {
    category: 'Studio',
    title: 'Studio Apartment near Sylhet Shahjalal University',
    description:
      'Student-friendly studios a short ride from Shahjalal University of Science and Technology. Affordable monthly plans plus daily rates for guest stays. Units come furnished with a small kitchenette and attached bathroom. The building is quiet, gated and fully secured.',
    landlord: 0,
    districtId: 91,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [6, 6], beds: [0, 1], baths: [1, 1], sizes: [280, 480],
      floors: [2, 3, 4], baseRent: 11000, daily: true, weekly: true, roundTo: 500,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet', 'Balcony'],
  },
  {
    category: 'Room',
    title: 'Single Room in Shared Flat at Moghbazar',
    description:
      'Private single rooms inside a shared flat at Moghbazar, ideal for working singles. Each room comes with a bed, wardrobe and study space, with shared kitchen and bathroom. Common areas are cleaned regularly and the flat has generator and gas line. One room available immediately.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [1, 1], baths: [1, 2], sizes: [120, 200],
      baseRent: 7000, daily: true, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet', 'Balcony'],
  },
  {
    category: 'Room',
    title: 'Private Room near Comilla Victoria College',
    description:
      'A private room in a family house near Comilla Victoria College. Calm surroundings, shared bathroom and kitchen access, with gas and water supplied. Ideal for students or a single professional. Monthly rent is all-inclusive of utilities up to a reasonable limit.',
    landlord: 2,
    districtId: 19,
    status: 'ACTIVE',
    simple: true,
    verified: true,
    units: {
      count: [1, 1], beds: [1, 1], baths: [1, 1], sizes: [160, 180],
      baseRent: 5000, roundTo: 250,
    },
    propertyAmenities: ['Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet'],
  },
  {
    category: 'Room',
    title: 'Furnished Room for Couple in Jashore',
    description:
      'A furnished room suitable for a couple, located in a secure residential house in Jashore. Includes a double bed, wardrobe, attached bath and a small sitting corner. Daily and monthly stays supported. The building has a generator, CCTV and piped gas.',
    landlord: 3,
    districtId: 41,
    status: 'PENDING_VERIFICATION',
    verified: false,
    units: {
      count: [3, 3], beds: [1, 2], baths: [1, 1], sizes: [150, 260],
      baseRent: 8000, daily: true, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Furnished', 'Air Conditioning', 'Wi-Fi/Internet'],
  },
  {
    category: 'Bachelor Mess',
    title: 'Bachelor Mess for Professionals near Farmgate',
    description:
      'A well-run bachelor mess for working professionals near Farmgate. Each bed space is clean, with shared living, dining and kitchen areas. Monthly rent covers food, utilities and housekeeping. The building has a generator, gas line and round-the-clock caretaker. Simple, tidy and centrally located.',
    landlord: 0,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [6, 6], beds: [1, 1], baths: [1, 2], sizes: [100, 160],
      baseRent: 6500, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Prayer Room/Mosque', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Bachelor Mess',
    title: 'Student Bachelor Mess at Shahbagh',
    description:
      'Affordable student mess at Shahbagh, popular with those studying in Dhaka\'s university belt. Shared rooms and common kitchen, with gas, water and high-speed Wi-Fi included. A caretaker manages daily cleaning and security. Convenient for classes at Dhaka University and surrounding institutes.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [8, 8], beds: [1, 1], baths: [1, 2], sizes: [90, 140],
      baseRent: 5500, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Community Room', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet'],
  },
  {
    category: 'Bachelor Mess',
    title: 'Working Men\'s Hostel Mess in Chattogram GEC',
    description:
      'A disciplined working men\'s mess close to GEC circle in Chattogram. Each bed space includes a cot, wardrobe and desk; common areas are shared. Food and utilities are part of the monthly rent. Generator backup, CCTV and a live-in manager ensure a hassle-free stay.',
    landlord: 2,
    districtId: 15,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [5, 5], beds: [1, 1], baths: [1, 2], sizes: [100, 150],
      baseRent: 6000, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Hostel/Dormitory',
    title: 'Girls Hostel near North South University',
    description:
      'A secure girls hostel minutes from North South University at Bashundhara. Clean beds in shared rooms with common washrooms, dining hall and a study lounge. Rent includes meals, utilities and Wi-Fi. Full-time security, CCTV and a female warden on campus round the clock.',
    landlord: 3,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [10, 10], beds: [1, 1], baths: [1, 2], sizes: [80, 130],
      baseRent: 4500, daily: true, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply', 'Community Room', 'Prayer Room/Mosque', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Hostel/Dormitory',
    title: 'Student Dormitory at Khulna University Campus',
    description:
      'Budget dormitory accommodation for students near Khulna University. Shared rooms with attached common facilities, a common room and a small mess. Utilities and basic furnishing included in the monthly fee. A quiet, secure environment focused on studying.',
    landlord: 0,
    districtId: 47,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [8, 8], beds: [1, 1], baths: [1, 2], sizes: [90, 140],
      baseRent: 4000, roundTo: 250,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Community Room', 'Fire Safety System'],
    unitAmenities: ['Furnished', 'Wi-Fi/Internet'],
  },
  {
    category: 'Sublet',
    title: 'Short-Term Furnished Sublet in Banani',
    description:
      'Furnished sublet units in Banani for short-term stays, fully equipped for instant move-in. Each unit has a bedroom, sitting area, kitchenette and fast internet. Flexible daily, weekly and monthly rates. Ideal for expats, project staff and relocating professionals.',
    landlord: 1,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [2, 2], beds: [1, 2], baths: [1, 2], sizes: [450, 700],
      floors: [3, 4], baseRent: 22000, daily: true, weekly: true, roundTo: 500,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Furnished', 'Air Conditioning', 'Wi-Fi/Internet', 'Intercom'],
  },
  {
    category: 'Sublet',
    title: 'Executive Sublet near Sylhet Osmani Airport',
    description:
      'An executive-grade furnished sublet minutes from Osmani International Airport. One well-appointed unit with a master bedroom, modern kitchen and concierge-style service. Daily and monthly pricing for travelling professionals. Includes housekeeping, Wi-Fi and airport pickup on request.',
    landlord: 2,
    districtId: 91,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [1, 2], beds: [2, 2], baths: [1, 2], sizes: [800, 900],
      floors: [3], baseRent: 25000, daily: true, weekly: true, hourly: true, roundTo: 1000,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Water Reserve Tank', 'WASA Water Supply'],
    unitAmenities: ['Furnished', 'Air Conditioning', 'Wi-Fi/Internet', 'Intercom', 'Balcony'],
  },
  {
    category: 'Office Space',
    title: 'Corporate Office Floor in Motijheel CBD',
    description:
      'Full floors of corporate office space in a modern building in Motijheel, Dhaka\'s financial district. Open-plan layouts with separate cabins, meeting rooms and pantry space. The building offers lifts, backup power, security and visitor parking. Ideal for banks, IT firms and corporate headquarters.',
    landlord: 3,
    districtId: 26,
    status: 'ACTIVE',
    featured: true,
    verified: true,
    units: {
      count: [3, 3], beds: [0, 0], baths: [1, 2], sizes: [900, 1500],
      floors: [6, 7], baseRent: 120000, yearly: true, roundTo: 10000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Elevator Backup Power', 'Parking', 'CCTV', 'Security Guard', 'Community Room', 'Fire Safety System', 'WASA Water Supply'],
    unitAmenities: ['Air Conditioning', 'Intercom', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Office Space',
    title: 'Co-working Office Space at Kawran Bazar',
    description:
      'Flexible co-working and private office units at Kawran Bazar, minutes from major shopping malls. Open workstations and enclosed offices with meeting rooms, high-speed internet and a common reception. Daily hot-desking as well as monthly private offices available. Everything a growing team needs under one roof.',
    landlord: 0,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [4, 4], beds: [0, 0], baths: [1, 2], sizes: [250, 600],
      floors: [4, 5], baseRent: 45000, daily: true, weekly: true, roundTo: 2000,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Security Guard', 'Community Room', 'Fire Safety System', 'WASA Water Supply'],
    unitAmenities: ['Air Conditioning', 'Wi-Fi/Internet', 'Intercom', 'Store Room'],
  },
  {
    category: 'Office Space',
    title: 'Office Suite in Agrabad CDA Avenue',
    description:
      'Well-finished office suites along CDA Avenue in Agrabad, Chattogram\'s business hub. Each suite includes a cabin, workstations and a pantry corner. Building amenities include lifts, generator, dedicated parking and security. Suitable for import-export houses, agencies and professional firms.',
    landlord: 1,
    districtId: 15,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [3, 3], beds: [0, 0], baths: [1, 1], sizes: [700, 1200],
      floors: [4, 5], baseRent: 80000, yearly: true, roundTo: 5000,
    },
    propertyAmenities: ['Lift', 'Generator', 'Elevator Backup Power', 'Parking', 'CCTV', 'Security Guard', 'Fire Safety System'],
    unitAmenities: ['Air Conditioning', 'Intercom', 'Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Office Space',
    title: 'Small Business Office in Rajshahi CBD',
    description:
      'Compact offices in the Rajshahi central business district, ideal for SMEs, consultancies and clinics. Each office has partitioned cabins, a waiting area and washroom access. Generator, CCTV and lift facilities are shared. Affordable monthly and yearly plans with flexible growth options.',
    landlord: 2,
    districtId: 81,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [3, 3], beds: [0, 0], baths: [1, 1], sizes: [400, 700],
      floors: [3, 4], baseRent: 35000, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Lift', 'Generator', 'CCTV', 'Water Reserve Tank', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Air Conditioning', 'Wi-Fi/Internet', 'Intercom'],
  },
  {
    category: 'Shop/Retail',
    title: 'Ground Floor Retail Shops at New Market Gate',
    description:
      'Prime ground-floor retail shops at the main gate of Dhaka New Market, a high-footfall commercial location. Each shop comes with a shutter door, display window and storage loft. Security, generator and common washrooms are shared. Excellent for garment, food and electronics businesses.',
    landlord: 3,
    districtId: 26,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [5, 5], beds: [0, 0], baths: [0, 1], sizes: [150, 400],
      baseRent: 40000, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Wi-Fi/Internet', 'Store Room'],
  },
  {
    category: 'Shop/Retail',
    title: 'Commercial Shop Units in Jashore Boro Bazar',
    description:
      'Commercial shop units in the bustling Jashore Boro Bazar. Varying sizes suit boutiques, hardware stores and general traders. Shops are on the ground floor with good visibility and shared security. Annual leases preferred, with monthly options available.',
    landlord: 0,
    districtId: 41,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [6, 6], beds: [0, 0], baths: [0, 1], sizes: [120, 350],
      baseRent: 18000, yearly: true, roundTo: 1000,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'WASA Water Supply', 'Fire Safety System'],
    unitAmenities: ['Store Room'],
  },
  {
    category: 'Warehouse',
    title: 'Industrial Warehouse in Tongi Industrial Area',
    description:
      'A sturdy industrial warehouse in the Tongi industrial belt with a concrete floor, high ceiling and wide loading bay. Suitable for storage, light manufacturing and distribution. The site has generator support, CCTV, boundary wall security and enough space for truck movement. Single large shed with easy highway access.',
    landlord: 1,
    districtId: 33,
    status: 'ACTIVE',
    simple: true,
    verified: true,
    units: {
      count: [1, 1], beds: [0, 0], baths: [1, 1], sizes: [4000, 6000],
      baseRent: 120000, roundTo: 10000,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Parking', 'Fire Safety System'],
    unitAmenities: ['Store Room'],
  },
  {
    category: 'Farmhouse/Land',
    title: 'Farmhouse Retreat with Pond in Mymensingh',
    description:
      'A peaceful farmhouse retreat in Mymensingh surrounded by paddy fields and a stocked pond. The main cottage has three bedrooms, a living hall and a veranda; a separate guest cottage offers two more beds. Daily rates are ideal for weekend getaways, monthly plans suit longer stays. Perfect for families who love nature.',
    landlord: 2,
    districtId: 61,
    status: 'ACTIVE',
    verified: true,
    units: {
      count: [2, 2], beds: [2, 4], baths: [2, 3], sizes: [1800, 3500],
      baseRent: 35000, daily: true, weekly: true, yearly: true, roundTo: 2000,
    },
    propertyAmenities: ['Parking', 'Generator', 'Water Reserve Tank', 'Fire Safety System'],
    unitAmenities: ['Air Conditioning', 'Furnished', 'Wi-Fi/Internet', 'Balcony'],
  },
  {
    category: 'Rooftop/Garage',
    title: 'Rooftop Event Space and Garage Parking in Uttara',
    description:
      'A versatile rooftop space with an adjoining covered garage in Uttara, available for event hosting and parking rental. The rooftop is tiled with safety rails, ideal for small gatherings and product launches; the garage bays suit long-term vehicle parking. Generator and CCTV on site. Monthly and short-term options available.',
    landlord: 3,
    districtId: 26,
    status: 'ACTIVE',
    simple: true,
    verified: true,
    units: {
      count: [1, 1], beds: [0, 0], baths: [0, 1], sizes: [300, 400],
      baseRent: 8000, roundTo: 500,
    },
    propertyAmenities: ['Generator', 'CCTV', 'Security Guard', 'Fire Safety System', 'Rooftop Access'],
    unitAmenities: ['Store Room'],
  },
];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

function pickN<T>(rng: () => number, arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0] as T);
  }
  return out;
}

function roundTo(value: number, base: number): number {
  return Math.max(base, Math.round(value / base) * base);
}

function availableFromDate(rng: () => number): Date {
  const days = randInt(rng, 0, 30);
  const d = new Date(Date.now() + days * 86400000);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function unitLabel(category: string, index: number, floor: number | null): string {
  switch (category) {
    case 'Apartment/Flat': {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      return `${floor ?? index + 1}${letters[index % letters.length]}`;
    }
    case 'House':
      return index === 0 ? 'Whole House' : `Unit ${String.fromCharCode(65 + index)}`;
    case 'Duplex':
      return `Duplex ${String.fromCharCode(65 + index)}`;
    case 'Studio':
      return `Studio ${index + 1}`;
    case 'Room':
      return `Room ${index + 1}`;
    case 'Bachelor Mess':
      return `Bed Space ${index + 1}`;
    case 'Hostel/Dormitory':
      return `Bed ${index + 1}`;
    case 'Sublet':
      return `Sublet Unit ${String.fromCharCode(65 + index)}`;
    case 'Office Space':
      return `Suite ${floor ?? ''}${index + 1}`;
    case 'Shop/Retail':
      return `Shop ${index + 1}`;
    case 'Warehouse':
      return `Shed ${String.fromCharCode(65 + index)}`;
    case 'Farmhouse/Land':
      return index === 0 ? 'Main Cottage' : `Guest Cottage ${index}`;
    case 'Rooftop/Garage':
      return `Bay ${index + 1}`;
    default:
      return `Unit ${index + 1}`;
  }
}

function unitStatus(rng: () => number, index: number, total: number, simple: boolean): PropertyUnitStatus {
  if (simple) return PropertyUnitStatus.AVAILABLE;
  if (index === total - 1) return PropertyUnitStatus.AVAILABLE;
  const r = rng();
  if (r < 0.62) return PropertyUnitStatus.AVAILABLE;
  if (r < 0.88) return PropertyUnitStatus.OCCUPIED;
  return PropertyUnitStatus.MAINTENANCE;
}

function buildPricing(
  rng: () => number,
  spec: UnitSpec,
  size: number,
  monthly: number,
) {
  const deposit = roundTo(monthly * 3, 1000);
  const utility = roundTo(1500 + size / 15, 250);
  const policies = [...UTILITY_POLICIES];
  const rows: Array<{
    rentType: RentType;
    rentAmount: number;
    securityDeposit: number;
    utilityBill: number;
    utilityPolicy: string;
    currency: Currency;
  }> = [
    {
      rentType: RentType.MONTHLY,
      rentAmount: monthly,
      securityDeposit: deposit,
      utilityBill: utility,
      utilityPolicy: pick(rng, policies),
      currency: Currency.BDT,
    },
  ];

  if (spec.yearly) {
    const discount = 0.05 + rng() * 0.06;
    rows.push({
      rentType: RentType.YEARLY,
      rentAmount: roundTo(monthly * 12 * (1 - discount), 5000),
      securityDeposit: roundTo(monthly * 2, 1000),
      utilityBill: 0,
      utilityPolicy: 'Tenant pays utilities separately',
      currency: Currency.BDT,
    });
  }

  if (spec.daily) {
    const daily = Math.max(350, Math.round(monthly / 30 / 50) * 50);
    rows.push({
      rentType: RentType.DAILY,
      rentAmount: daily,
      securityDeposit: 0,
      utilityBill: daily > 800 ? 250 : 150,
      utilityPolicy: 'Flat rate, utilities included',
      currency: Currency.BDT,
    });
  }

  if (spec.weekly) {
    const weekly = Math.max(1500, Math.round(monthly / 4 / 250) * 250);
    rows.push({
      rentType: RentType.WEEKLY,
      rentAmount: weekly,
      securityDeposit: 0,
      utilityBill: 500,
      utilityPolicy: 'Flat rate, utilities included',
      currency: Currency.BDT,
    });
  }

  if (spec.hourly) {
    rows.push({
      rentType: RentType.HOURLY,
      rentAmount: roundTo(1200 + rng() * 800, 100),
      securityDeposit: 0,
      utilityBill: 0,
      utilityPolicy: 'Hourly rental, no deposit',
      currency: Currency.BDT,
    });
  }

  return rows;
}

async function main() {
  try {
    const categories = await prisma.category.findMany();
    const categoryByName = new Map(categories.map((c) => [c.name, c.id]));

    const amenities = await prisma.amenity.findMany();
    const amenityByName = new Map(amenities.map((a) => [a.name, a]));

    const allAreas = await prisma.area.findMany({ select: { id: true, districtId: true } });
    const areasByDistrict = new Map<number, { id: number }[]>();
    for (const area of allAreas) {
      const list = areasByDistrict.get(area.districtId) ?? [];
      list.push(area);
      areasByDistrict.set(area.districtId, list);
    }

    const resolveCategoryId = (name: string): string => {
      const id = categoryByName.get(name);
      if (!id) throw new Error(`Category "${name}" not found in database`);
      return id;
    };

    const resolveAmenityId = (name: string, allowedTypes: AmenityType[]): string => {
      const amenity = amenityByName.get(name);
      if (!amenity) throw new Error(`Amenity "${name}" not found in database`);
      if (!allowedTypes.includes(amenity.type)) {
        throw new Error(`Amenity "${name}" is type ${amenity.type}, expected one of ${allowedTypes.join(', ')}`);
      }
      return amenity.id;
    };

    const rng = mulberry32(20260811);

    const uniqueImages = Array.from(new Set(IMAGES));
    const shuffledImages = [...uniqueImages].sort(() => rng() - 0.5);
    const coverByIndex = shuffledImages.slice(0, PROPERTIES.length);

    await prisma.$transaction(
      async (tx) => {
        console.log('Clearing existing property data...');
      await tx.review.deleteMany();
      await tx.payment.deleteMany();
      await tx.lease.deleteMany();
      await tx.rentalRequest.deleteMany();
      await tx.propertyUnitAmenity.deleteMany();
      await tx.propertyAmenity.deleteMany();
      await tx.propertyImage.deleteMany();
      await tx.pricing.deleteMany();
      await tx.propertyUnit.deleteMany();
      await tx.propertyVerificationQueue.deleteMany();
      await tx.property.deleteMany();
      await tx.address.deleteMany();

      let createdCount = 0;
      let unitCount = 0;
      let pricingCount = 0;

      for (let i = 0; i < PROPERTIES.length; i++) {
        const seed = PROPERTIES[i] as PropertySeed;
        const categoryId = resolveCategoryId(seed.category);
        const propertyAmenityIds = seed.propertyAmenities.map((name) =>
          resolveAmenityId(name, [AmenityType.PROPERTY, AmenityType.COMMON]),
        );
        const unitAmenityPool = seed.unitAmenities.map((name) =>
          resolveAmenityId(name, [AmenityType.UNIT]),
        );

        const spec = seed.units;
        const isSimple = Boolean(seed.simple);
        const totalUnits = isSimple
          ? 1
          : randInt(rng, spec.count[0], spec.count[1]);
        const midSize = (spec.sizes[0] + spec.sizes[1]) / 2;
        const roundToBase = spec.roundTo ?? 500;

        const districtPool = areasByDistrict.get(seed.districtId) ?? [];
        if (districtPool.length === 0) {
          throw new Error(`No areas found for district ${seed.districtId}`);
        }
        const area = pick(rng, districtPool);
        const center = DISTRICT_CENTERS[seed.districtId] as [number, number];
        const postalPool = POSTCODES[seed.districtId] ?? ['1200'];

        const addressData = {
          buildingNo: `House ${randInt(rng, 5, 120)}`,
          streetAddress: pick(rng, STREETS),
          addressLine2: pick(rng, LANDMARKS),
          landmark: rng() > 0.5 ? pick(rng, LANDMARKS) : null,
          postalCode: pick(rng, postalPool),
          areaId: area.id,
          latitude: center[0] + (rng() - 0.5) * 0.04,
          longitude: center[1] + (rng() - 0.5) * 0.04,
        };

        const unitsData = [];
        for (let u = 0; u < totalUnits; u++) {
          const beds = randInt(rng, spec.beds[0], spec.beds[1]);
          const baths = spec.baths[0] === spec.baths[1]
            ? spec.baths[0]
            : randInt(rng, spec.baths[0], spec.baths[1]);
          const size = randInt(rng, spec.sizes[0], spec.sizes[1]);
          const floor = spec.floors
            ? (spec.floors[u % spec.floors.length] as number)
            : null;
          const status = unitStatus(rng, u, totalUnits, isSimple);
          const monthly = roundTo(
            spec.baseRent * (size / midSize) * (0.95 + rng() * 0.12),
            roundToBase,
          );
          const label = unitLabel(seed.category, u, floor);

          unitsData.push({
            unitLabel: label,
            status,
            availableFrom:
              status === PropertyUnitStatus.AVAILABLE
                ? availableFromDate(rng)
                : null,
            sizeSqft: size,
            bedrooms: beds,
            bathrooms: baths,
            floor,
            description:
              `${beds > 0 ? `${beds} bedroom${beds > 1 ? 's' : ''}` : 'Studio'} layout spanning ${size} sqft` +
              `${floor ? ` on floor ${floor}` : ''}. ` +
              (status === PropertyUnitStatus.AVAILABLE
                ? 'Ready for immediate move-in.'
                : status === PropertyUnitStatus.OCCUPIED
                  ? 'Currently occupied by an existing tenant.'
                  : 'Undergoing scheduled maintenance.'),
            pricing: {
              create: buildPricing(rng, spec, size, monthly).map((p) => ({
                ...p,
                rentAmount: p.rentAmount,
              })),
            },
            amenities: {
              create: pickN(rng, unitAmenityPool, randInt(rng, 2, 4)).map((id) => ({
                amenity: { connect: { id } },
              })),
            },
          });
          pricingCount += isSimple ? 1 : (spec.yearly ? 2 : 1) + (spec.daily ? 1 : 0) + (spec.weekly ? 1 : 0) + (spec.hourly ? 1 : 0);
        }
        unitCount += totalUnits;

        const usedImages = new Set<string>([coverByIndex[i] as string]);
        const nextImage = () => {
          const fresh = uniqueImages.find((url) => !usedImages.has(url));
          const url = fresh ?? (uniqueImages[Math.floor(rng() * uniqueImages.length)] as string);
          usedImages.add(url);
          return url;
        };

        const slug = `${slugify(seed.category)}-${slugify(seed.title)}`;
        const status = seed.status as PropertyStatus;

        const createdProperty = await tx.property.create({
          data: {
            slug,
            landlord: { connect: { id: LANDLORD_IDS[seed.landlord] as string } },
            category: { connect: { id: categoryId } },
            title: seed.title,
            description: seed.description,
            status,
            isFeatured: seed.featured ?? false,
            isVerified: seed.verified ?? false,
            address: { create: addressData },
            amenities: {
              create: propertyAmenityIds.map((id) => ({ amenity: { connect: { id } } })),
            },
            units: { create: unitsData },
            verificationQueue:
              status === PropertyStatus.PENDING_VERIFICATION ? { create: {} } : undefined,
          },
        });

        const createdUnits = await tx.propertyUnit.findMany({
          where: { propertyId: createdProperty.id },
          select: { id: true, unitLabel: true },
        });

        const rooms = ['Living room', 'Bedroom', 'Kitchen', 'Balcony view', 'Bathroom'];
        const imagesData = [
          {
            propertyId: createdProperty.id,
            url: coverByIndex[i] as string,
            caption: `${seed.title} - Main view`,
            isCover: true,
          },
          {
            propertyId: createdProperty.id,
            url: nextImage(),
            caption: 'Building exterior and entrance',
            isCover: false,
          },
          ...createdUnits.map((unit) => ({
            propertyId: createdProperty.id,
            unitId: unit.id,
            url: nextImage(),
            caption: `Unit ${unit.unitLabel} - ${pick(rng, rooms)}`,
            isCover: false,
          })),
        ];

        await tx.propertyImage.createMany({ data: imagesData });

        createdCount++;
        console.log(`Created property ${createdCount}/${PROPERTIES.length}: "${seed.title}" (${totalUnits} units)`);
      }

      console.log('---- SEED SUMMARY ----');
      console.log(`Properties created: ${createdCount}`);
      console.log(`Units created: ${unitCount}`);
      console.log(`Pricing entries created: ${pricingCount}`);
      console.log('Property seed completed successfully!');
    },
      { maxWait: 60000, timeout: 900000 },
    );
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
