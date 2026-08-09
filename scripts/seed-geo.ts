import { prisma } from '../src/lib/prisma.js';

const GEO_DATA_URL = 'https://raw.githubusercontent.com/sohan-99/bangladesh-location-data/master/locationBdDivisonsToUnionsEnglish.json';

async function seed() {
  try {
    console.log('Fetching geojson data from repository...');

    const res = await fetch(GEO_DATA_URL);
    if (!res.ok) throw new Error('Failed to fetch geo data');
    const data = await res.json();

    console.log('Deleting existing geo data...');
    // Delete existing geo data in reverse order of relations
    await prisma.area.deleteMany();
    await prisma.district.deleteMany();
    await prisma.division.deleteMany();

    console.log('Seeding divisions...');
    let divisionCount = 0;
    for (const d of data.divisions_en) {
      await prisma.division.create({
        data: {
          id: parseInt(d.value),
          name: d.title,
        },
      });
      divisionCount++;
    }
    console.log(`Seeded ${divisionCount} divisions.`);

    console.log('Seeding districts...');
    let districtCount = 0;
    for (const divId of Object.keys(data.districts_en)) {
      const districts = data.districts_en[divId];
      for (const d of districts) {
        await prisma.district.create({
          data: {
            id: parseInt(d.value),
            name: d.title,
            divisionId: parseInt(divId),
          },
        });
        districtCount++;
      }
    }
    console.log(`Seeded ${districtCount} districts.`);

    console.log('Seeding areas (upazilas and unions)...');
    let areaCount = 0;
    for (const distId of Object.keys(data.upazilas_en)) {
      const upazilas = data.upazilas_en[distId];
      const uniqueAreaNames = new Set<string>();

      for (const u of upazilas) {
        // Add upazila name
        if (!uniqueAreaNames.has(u.title)) {
          uniqueAreaNames.add(u.title);
        }

        // Add unions for this upazila
        const unions = data.unions_en[u.value] || [];
        for (const union of unions) {
          if (!uniqueAreaNames.has(union.title)) {
            uniqueAreaNames.add(union.title);
          }
        }
      }

      // Create areas for this district
      const areaData = Array.from(uniqueAreaNames).map(name => ({
        name,
        districtId: parseInt(distId),
      }));

      if (areaData.length > 0) {
        await prisma.area.createMany({
          data: areaData,
        });
        areaCount += areaData.length;
      }
    }
    console.log(`Seeded ${areaCount} unique areas.`);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
