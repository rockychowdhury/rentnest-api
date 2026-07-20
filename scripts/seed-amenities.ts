import { prisma } from '../src/lib/prisma.js';

const amenities = [
  { name: 'Lift', description: 'Elevator access in the building' },
  { name: 'Generator', description: 'Backup power generator for load-shedding coverage' },
  { name: 'Gas Line', description: 'Piped natural gas connection' },
  { name: 'Parking', description: 'Dedicated car parking space' },
  { name: 'CCTV', description: 'Closed-circuit security camera coverage' },
  { name: 'Security Guard', description: 'On-site security personnel' },
  { name: 'Water Reserve Tank', description: 'Rooftop/underground water storage for supply continuity' },
  { name: 'WASA Water Supply', description: 'Connected to municipal water authority supply' },
  { name: 'Wi-Fi/Internet', description: 'Building-provided or pre-wired internet connectivity' },
  { name: 'Intercom', description: 'Building intercom/entry communication system' },
  { name: 'Balcony', description: 'Attached balcony or veranda' },
  { name: 'Furnished', description: 'Unit comes furnished' },
  { name: 'Air Conditioning', description: 'AC installed or pre-wired' },
  { name: 'Rooftop Access', description: 'Shared rooftop access for tenants' },
  { name: 'Community Room', description: 'Shared common/community room in the building' },
  { name: 'Prayer Room/Mosque', description: 'On-premises or adjacent prayer space' },
  { name: "Children's Play Area", description: 'Dedicated play area within the property' },
  { name: 'Gym', description: 'On-site fitness facility' },
  { name: 'Swimming Pool', description: 'On-site pool' },
  { name: 'Elevator Backup Power', description: 'Generator specifically ensures lift function during outages' },
  { name: 'Fire Safety System', description: 'Fire extinguishers/alarm system installed' },
  { name: 'Servant Quarter', description: 'Attached room for domestic help' },
  { name: 'Store Room', description: 'Additional storage room within the unit' }
];

async function seedAmenities() {
  try {
    console.log('Seeding amenities...');
    let count = 0;
    
    for (const amenity of amenities) {
      await prisma.amenity.upsert({
        where: { name: amenity.name },
        update: { description: amenity.description },
        create: {
          name: amenity.name,
          description: amenity.description,
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
