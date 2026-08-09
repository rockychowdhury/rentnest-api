import { prisma } from '../src/lib/prisma.js';

import { AmenityType } from '../generated/prisma/enums/index.js';

const amenities = [
  { name: 'Lift', description: 'Elevator access in the building', type: 'COMMON' },
  { name: 'Generator', description: 'Backup power generator for load-shedding coverage', type: 'COMMON' },
  { name: 'Gas Line', description: 'Piped natural gas connection', type: 'UNIT' },
  { name: 'Parking', description: 'Dedicated car parking space', type: 'PROPERTY' },
  { name: 'CCTV', description: 'Closed-circuit security camera coverage', type: 'COMMON' },
  { name: 'Security Guard', description: 'On-site security personnel', type: 'COMMON' },
  { name: 'Water Reserve Tank', description: 'Rooftop/underground water storage for supply continuity', type: 'PROPERTY' },
  { name: 'WASA Water Supply', description: 'Connected to municipal water authority supply', type: 'PROPERTY' },
  { name: 'Wi-Fi/Internet', description: 'Building-provided or pre-wired internet connectivity', type: 'UNIT' },
  { name: 'Intercom', description: 'Building intercom/entry communication system', type: 'UNIT' },
  { name: 'Balcony', description: 'Attached balcony or veranda', type: 'UNIT' },
  { name: 'Furnished', description: 'Unit comes furnished', type: 'UNIT' },
  { name: 'Air Conditioning', description: 'AC installed or pre-wired', type: 'UNIT' },
  { name: 'Rooftop Access', description: 'Shared rooftop access for tenants', type: 'COMMON' },
  { name: 'Community Room', description: 'Shared common/community room in the building', type: 'COMMON' },
  { name: 'Prayer Room/Mosque', description: 'On-premises or adjacent prayer space', type: 'COMMON' },
  { name: "Children's Play Area", description: 'Dedicated play area within the property', type: 'PROPERTY' },
  { name: 'Gym', description: 'On-site fitness facility', type: 'PROPERTY' },
  { name: 'Swimming Pool', description: 'On-site pool', type: 'PROPERTY' },
  { name: 'Elevator Backup Power', description: 'Generator specifically ensures lift function during outages', type: 'COMMON' },
  { name: 'Fire Safety System', description: 'Fire extinguishers/alarm system installed', type: 'COMMON' },
  { name: 'Servant Quarter', description: 'Attached room for domestic help', type: 'UNIT' },
  { name: 'Store Room', description: 'Additional storage room within the unit', type: 'UNIT' }
];

async function seedAmenities() {
  try {
    console.log('Clearing existing amenities...');
    await prisma.amenity.deleteMany({});
    
    console.log('Seeding amenities...');
    let count = 0;
    
    for (const amenity of amenities) {
      await prisma.amenity.create({
        data: {
          name: amenity.name,
          description: amenity.description,
          type: amenity.type as any, // Cast to any to avoid typescript enum complaints in seed
        },
      });
      count++;
    }
    
    console.log(`Successfully seeded ${count} amenities!`);
  } catch (error) {
    console.error('Error seeding amenities:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedAmenities();
