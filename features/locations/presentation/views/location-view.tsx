'use client';

import { useRouter } from 'next/navigation';
import { LocationForm } from '../components/location-form';
import { useLocationStore } from '../../context/location-store';
import { LocationFormValues } from '../../schemas/location.schema';
import { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
interface LocationViewProps {
    locationId?: number;
}

export function LocationView({ locationId }: LocationViewProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { addLocation, updateLocation, getLocationById } = useLocationStore();
    const [initialData, setInitialData] = useState<any>(null);

    // Cargar datos iniciales si es una edición
    useEffect(() => {
        const loadLocation = async () => {
            if (locationId) {
                const location = await getLocationById(locationId);
                if (location) {
                    setInitialData(location);
                }
            }
        };
        loadLocation();
    }, [locationId, getLocationById]);

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true);
        try {
            if (locationId) {
                await updateLocation(locationId, data);
            } else {
                await addLocation(data);
            }
            router.push('/locations');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">

            {/* Breadcrumbs, título y descripción */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Wrench className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/locations">Ubicaciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{locationId ? "Editar Ubicación" : "Nueva Ubicación"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <LocationForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 