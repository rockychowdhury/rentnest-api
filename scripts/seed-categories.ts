import { prisma } from '../src/lib/prisma.js';

const categories = [
  { name: 'Apartment/Flat', description: 'Self-contained residential unit within a multi-unit building' },
  { name: 'House', description: 'Standalone single-family residential building' },
  { name: 'Duplex', description: 'Two-story residential unit within a shared building' },
  { name: 'Studio', description: 'Single-room unit combining living, sleeping, and kitchen space' },
  { name: 'Room', description: 'Single room within a shared house or flat, common areas shared' },
  { name: 'Bachelor Mess', description: 'Shared accommodation for unmarried working professionals/students, typically same-sex' },
  { name: 'Hostel/Dormitory', description: 'Shared multi-occupant accommodation, typically for students' },
  { name: 'Sublet', description: "Short-term subletting of an existing tenant's unit or room" },
  { name: 'Office Space', description: 'Commercial space for business/office use' },
  { name: 'Shop/Retail', description: 'Commercial space for retail or storefront use' },
  { name: 'Warehouse', description: 'Storage or industrial space' },
  { name: 'Farmhouse/Land', description: 'Agricultural land or rural farmhouse property' },
  { name: 'Rooftop/Garage', description: 'Rooftop space or garage/parking unit for rent' }
];

async function seedCategories() {
  try {
    console.log('Seeding categories...');
    let count = 0;
    
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: { description: category.description },
        create: {
          name: category.name,
          description: category.description,
        },
      });
      count++;
    }
    
    console.log(`Successfully seeded ${count} categories!`);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedCategories();
