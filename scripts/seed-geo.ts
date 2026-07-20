import { prisma } from '../src/lib/prisma.js';

const DIVISIONS_URL = 'https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-divisions.json';
const DISTRICTS_URL = 'https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-districts.json';
const UPAZILAS_URL = 'https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/src/data/bd-upazilas.json';

async function seed() {
  try {
    console.log('Fetching geojson data from repository...');

    const divisionsRes = await fetch(DIVISIONS_URL);
    if (!divisionsRes.ok) throw new Error('Failed to fetch divisions');
    const divisionsData = await divisionsRes.json();

    const districtsRes = await fetch(DISTRICTS_URL);
    if (!districtsRes.ok) throw new Error('Failed to fetch districts');
    const districtsData = await districtsRes.json();

    const upazilasRes = await fetch(UPAZILAS_URL);
    if (!upazilasRes.ok) throw new Error('Failed to fetch upazilas');
    const upazilasData = await upazilasRes.json();

    console.log('Seeding divisions...');
    let divisionCount = 0;
    for (const d of divisionsData.divisions) {
      await prisma.division.upsert({
        where: { id: parseInt(d.id) },
        update: { 
          name: d.name, 
          bnName: d.bn_name 
        },
        create: {
          id: parseInt(d.id),
          name: d.name,
          bnName: d.bn_name,
        },
      });
      divisionCount++;
    }
    console.log(`Seeded ${divisionCount} divisions.`);

    console.log('Seeding districts...');
    let districtCount = 0;
    for (const d of districtsData.districts) {
      await prisma.district.upsert({
        where: { id: parseInt(d.id) },
        update: { 
          name: d.name, 
          bnName: d.bn_name, 
          divisionId: parseInt(d.division_id) 
        },
        create: {
          id: parseInt(d.id),
          name: d.name,
          bnName: d.bn_name,
          divisionId: parseInt(d.division_id),
        },
      });
      districtCount++;
    }
    console.log(`Seeded ${districtCount} districts.`);

    console.log('Seeding upazilas...');
    let upazilaCount = 0;
    for (const u of upazilasData.upazilas) {
      await prisma.upazila.upsert({
        where: { id: parseInt(u.id) },
        update: { 
          name: u.name, 
          bn_name: u.bn_name, 
          districtId: parseInt(u.district_id) 
        },
        create: {
          id: parseInt(u.id),
          name: u.name,
          bn_name: u.bn_name,
          districtId: parseInt(u.district_id),
        },
      });
      upazilaCount++;
    }
    console.log(`Seeded ${upazilaCount} upazilas.`);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    // Ensuring process exits successfully
    process.exit(0);
  }
}

seed();
