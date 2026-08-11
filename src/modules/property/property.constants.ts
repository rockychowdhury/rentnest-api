import { PropertySelect } from "../../../generated/prisma/models";

export const propertySelect: PropertySelect = {
    id: true,
    slug:true,
    title: true,
    description: true,
    categoryId: true,
    landlordId: true,
    status: true,
    isFeatured: true,
    isVerified: true,
    rating: true,
    _count: {
        select: {
            reviews: true
        }
    },
    createdAt: true,
    deletedAt: true,
    landlord: {
        select: {
            id: true,
            phone: true,
            email: true,
            profile: {
                select: {
                    fullName: true,
                    avatarUrl: true
                }
            }
        }
    },
    category: {
        select: {
            id: true,
            name: true
        }
    },
    address: {
        select: {
            id: true,
            buildingNo: true,
            streetAddress: true,
            addressLine2: true,
            landmark: true,
            postalCode: true,
            areaId: true,
            latitude: true,
            longitude: true,
            area: {
                select: {
                    id: true,
                    name: true,
                    districtId: true,
                    district: {
                        select: {
                            id: true,
                            name: true,
                            divisionId: true,
                            division: { select: { id: true, name: true } }
                        }
                    }
                }
            }
        }
    },
    images: {
        select: {
            id: true,
            url: true,
            isCover: true,
            caption: true
        }
    },
    amenities: {
        select: {
            amenity: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    units: {
        where: { deletedAt: null },
        select: {
            id: true,
            unitLabel: true,
            status: true,
            availableFrom: true,
            bedrooms: true,
            bathrooms: true,
            sizeSqft: true,
            pricing: {
                where: { isActive: true },
                select: {
                    id: true,
                    rentType: true,
                    rentAmount: true,
                    securityDeposit: true
                }
            }
        }
    }
};

export const publicPropertySelect = {
    id: true,
    slug: true,
    title: true,
    isVerified: true,
    rating: true,
    _count: {
        select: {
            reviews: true
        }
    },
    images: {
        where: { isCover: true },
        take: 1,
        select: {
            url: true,
        }
    },
    address: {
        select: {
            id: true,
            streetAddress: true,
            area: {
                select: {
                    name: true,
                    district: {
                        select: {
                            name: true,
                            division: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    category: {
        select: {
            id: true,
            name: true
        }
    },
    amenities: {
        select: {
            amenityId: true
        }
    },
    units: {
        where: { deletedAt: null },
        select: {
            id: true,
            bedrooms: true,
            bathrooms: true,
            sizeSqft: true,
            status: true,
            availableFrom: true,
            pricing: {
                where: { isActive: true },
                select: {
                    id: true,
                    rentType: true,
                    rentAmount: true,
                    currency: true
                }
            },
            amenities: {
                select: {
                    amenityId: true
                }
            }
        }
    },
    isFeatured: true
};

export const formatPublicProperty = (property: any, query?: any) => {
    let cheapUnit = null;
    let expensiveUnit = null;
    
    if (property.units && property.units.length > 0) {
        // Always only consider AVAILABLE units by default
        let filteredUnits = property.units.filter((u: any) => u.status === 'AVAILABLE');

        if (query) {
            if (query.bedrooms) {
                filteredUnits = filteredUnits.filter((u: any) => u.bedrooms >= Number(query.bedrooms));
            }
            if (query.bathrooms) {
                filteredUnits = filteredUnits.filter((u: any) => u.bathrooms >= Number(query.bathrooms));
            }
            if (query.minPrice || query.maxPrice || query.rentType) {
                filteredUnits = filteredUnits.filter((u: any) => {
                    return u.pricing.some((p: any) => {
                        let isValid = true;
                        if (query.minPrice && Number(p.rentAmount) < Number(query.minPrice)) isValid = false;
                        if (query.maxPrice && Number(p.rentAmount) > Number(query.maxPrice)) isValid = false;
                        if (query.rentType && p.rentType !== query.rentType) isValid = false;
                        return isValid;
                    });
                });
            }
            if (query.amenities) {
                const amenityList = query.amenities.split(',').map((id: string) => id.trim());
                filteredUnits = filteredUnits.filter((u: any) => {
                    return amenityList.every((amenityId: string) => {
                        const hasOnUnit = u.amenities?.some((a: any) => a.amenityId === amenityId);
                        const hasOnProperty = property.amenities?.some((a: any) => a.amenityId === amenityId);
                        return hasOnUnit || hasOnProperty;
                    });
                });
            }
        }

        const sortedUnits = filteredUnits.map((u: any) => {
            const minPrice = u.pricing.length > 0 
                ? Math.min(...u.pricing.map((p: any) => Number(p.rentAmount))) 
                : Infinity;
            return { ...u, minPrice };
        }).filter((u: any) => u.minPrice !== Infinity).sort((a: any, b: any) => a.minPrice - b.minPrice);

        if (sortedUnits.length > 0) {
            const cheapest = sortedUnits[0];
            const mostExpensive = sortedUnits[sortedUnits.length - 1];

            const formatUnit = (u: any) => ({
                id: u.id,
                beds: u.bedrooms,
                bath: u.bathrooms,
                size: u.sizeSqft,
                availableFrom: u.availableFrom,
                pricing: u.pricing[0] 
            });

            cheapUnit = formatUnit(cheapest);
            expensiveUnit = formatUnit(mostExpensive);
        } else {
            return null; // Return null if no units matched the filter, so we can filter this property out completely
        }
    }

    return {
        id: property.id,
        slug: property.slug,
        title: property.title,
        image: property.images?.[0] || null,
        rating: property.rating ?? 0,
        reviewCount: property._count?.reviews ?? 0,
        address: {
            id: property.address?.id,
            streetAddress: property.address?.streetAddress,
            area: property.address?.area?.name,
            district: property.address?.area?.district?.name,
            division: property.address?.area?.district?.division?.name
        },
        category: property.category,
        cheapUnit,
        expensiveUnit,
        isFeatured: property.isFeatured
    };
};
