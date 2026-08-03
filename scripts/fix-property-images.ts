import { prisma } from '../src/lib/prisma.js';

const categoryImages: Record<string, string[]> = {
  "Shop/Retail": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1000&q=80",
  ],
  "Office Space": [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&q=80",
  ],
  "Apartment/Flat": [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&q=80",
  ],
  "Bachelor Mess": [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1000&q=80",
  ],
  "Studio": [
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1000&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&q=80",
  ],
  "Sublet": [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80",
  ],
  "Rooftop/Garage": [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80",
  ],
};

const defaultImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=80",
];

async function main() {
  try {
    console.log("Updating property images with reliable Unsplash URLs...");
    const properties = await prisma.property.findMany({
      include: {
        category: true,
        images: true,
      },
    });

    for (let i = 0; i < properties.length; i++) {
      const p = properties[i];
      const categoryName = p.category?.name || "";
      const pool = categoryImages[categoryName] || defaultImages;
      const primaryUrl = pool[i % pool.length];

      // Delete existing broken images for this property
      await prisma.propertyImage.deleteMany({
        where: { propertyId: p.id },
      });

      // Create new cover image
      await prisma.propertyImage.create({
        data: {
          propertyId: p.id,
          url: primaryUrl,
          isCover: true,
          caption: `${categoryName} View`,
        },
      });

      console.log(`Updated images for property "${p.title}" -> ${primaryUrl}`);
    }

    console.log("All property images updated successfully!");
  } catch (err) {
    console.error("Error updating property images:", err);
  } finally {
    process.exit(0);
  }
}

main();
