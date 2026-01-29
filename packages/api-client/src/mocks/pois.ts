// Mock Point of Interest data for Buenos Aires
export type POIType = 'transport' | 'schools' | 'hospitals' | 'parks' | 'security'

export interface POI {
  id: string
  type: POIType
  name: string
  coordinates: [number, number] // [lng, lat]
  details?: string
}

// Subte (Metro) stations
const subteStations: POI[] = [
  { id: 'subte-1', type: 'transport', name: 'Palermo', coordinates: [-58.4211, -34.5809], details: 'Linea D' },
  { id: 'subte-2', type: 'transport', name: 'Plaza Italia', coordinates: [-58.4195, -34.5808], details: 'Linea D' },
  { id: 'subte-3', type: 'transport', name: 'Scalabrini Ortiz', coordinates: [-58.4267, -34.5848], details: 'Linea D' },
  { id: 'subte-4', type: 'transport', name: 'Bulnes', coordinates: [-58.4108, -34.5895], details: 'Linea D' },
  { id: 'subte-5', type: 'transport', name: 'Aguero', coordinates: [-58.4097, -34.5963], details: 'Linea D' },
  { id: 'subte-6', type: 'transport', name: 'Pueyrredon', coordinates: [-58.4055, -34.6032], details: 'Linea D' },
  { id: 'subte-7', type: 'transport', name: 'Facultad de Medicina', coordinates: [-58.3998, -34.5993], details: 'Linea D' },
  { id: 'subte-8', type: 'transport', name: 'Callao', coordinates: [-58.3920, -34.6040], details: 'Linea D' },
  { id: 'subte-9', type: 'transport', name: 'Tribunales', coordinates: [-58.3850, -34.6030], details: 'Linea D' },
  { id: 'subte-10', type: 'transport', name: 'Congreso', coordinates: [-58.3925, -34.6090], details: 'Linea A' },
  { id: 'subte-11', type: 'transport', name: 'Saenz Pena', coordinates: [-58.4000, -34.6095], details: 'Linea A' },
  { id: 'subte-12', type: 'transport', name: 'Loria', coordinates: [-58.4105, -34.6180], details: 'Linea A' },
  { id: 'subte-13', type: 'transport', name: 'Castro Barros', coordinates: [-58.4200, -34.6180], details: 'Linea A' },
  { id: 'subte-14', type: 'transport', name: 'Caballito', coordinates: [-58.4340, -34.6180], details: 'Linea A' },
  { id: 'subte-15', type: 'transport', name: 'Primera Junta', coordinates: [-58.4440, -34.6180], details: 'Linea A' },
]

// Schools
const schools: POI[] = [
  { id: 'school-1', type: 'schools', name: 'Escuela Normal Sup. N°1', coordinates: [-58.3962, -34.6085], details: 'Publica' },
  { id: 'school-2', type: 'schools', name: 'Colegio Nacional Bs. As.', coordinates: [-58.3730, -34.6090], details: 'Publica' },
  { id: 'school-3', type: 'schools', name: 'Escuela ORT', coordinates: [-58.4450, -34.5620], details: 'Privada' },
  { id: 'school-4', type: 'schools', name: 'Colegio Marianista', coordinates: [-58.4380, -34.6160], details: 'Privada' },
  { id: 'school-5', type: 'schools', name: 'Escuela Tecnica N°27', coordinates: [-58.4510, -34.5730], details: 'Publica' },
  { id: 'school-6', type: 'schools', name: 'Instituto Libre de Segunda Ensenanza', coordinates: [-58.3820, -34.6020], details: 'Publica' },
  { id: 'school-7', type: 'schools', name: 'Colegio Del Salvador', coordinates: [-58.3900, -34.6010], details: 'Privada' },
  { id: 'school-8', type: 'schools', name: 'Escuela Normal N°4', coordinates: [-58.4290, -34.5870], details: 'Publica' },
  { id: 'school-9', type: 'schools', name: 'Colegio San Jose', coordinates: [-58.4850, -34.5720], details: 'Privada' },
  { id: 'school-10', type: 'schools', name: 'Escuela Tecnica N°1 Otto Krause', coordinates: [-58.3750, -34.6065], details: 'Publica' },
]

// Hospitals
const hospitals: POI[] = [
  { id: 'hospital-1', type: 'hospitals', name: 'Hospital Italiano', coordinates: [-58.4165, -34.6110], details: 'Privado' },
  { id: 'hospital-2', type: 'hospitals', name: 'Hospital Aleman', coordinates: [-58.4100, -34.5890], details: 'Privado' },
  { id: 'hospital-3', type: 'hospitals', name: 'Hospital de Clinicas', coordinates: [-58.3985, -34.5990], details: 'Publico' },
  { id: 'hospital-4', type: 'hospitals', name: 'Hospital Fernandez', coordinates: [-58.4090, -34.5755], details: 'Publico' },
  { id: 'hospital-5', type: 'hospitals', name: 'Sanatorio Guemes', coordinates: [-58.4200, -34.5920], details: 'Privado' },
  { id: 'hospital-6', type: 'hospitals', name: 'Hospital Durand', coordinates: [-58.4350, -34.6180], details: 'Publico' },
  { id: 'hospital-7', type: 'hospitals', name: 'Hospital Rivadavia', coordinates: [-58.3920, -34.5850], details: 'Publico' },
  { id: 'hospital-8', type: 'hospitals', name: 'FLENI', coordinates: [-58.4560, -34.5430], details: 'Privado' },
  { id: 'hospital-9', type: 'hospitals', name: 'Hospital Pirovano', coordinates: [-58.4530, -34.5690], details: 'Publico' },
  { id: 'hospital-10', type: 'hospitals', name: 'Hospital Britanico', coordinates: [-58.3810, -34.6290], details: 'Privado' },
]

// Parks
const parks: POI[] = [
  { id: 'park-1', type: 'parks', name: 'Parque 3 de Febrero', coordinates: [-58.4180, -34.5680], details: 'Bosques de Palermo' },
  { id: 'park-2', type: 'parks', name: 'Jardin Japones', coordinates: [-58.4150, -34.5740], details: 'Palermo' },
  { id: 'park-3', type: 'parks', name: 'Rosedal', coordinates: [-58.4100, -34.5720], details: 'Palermo' },
  { id: 'park-4', type: 'parks', name: 'Jardin Botanico', coordinates: [-58.4170, -34.5820], details: 'Palermo' },
  { id: 'park-5', type: 'parks', name: 'Parque Centenario', coordinates: [-58.4360, -34.6060], details: 'Caballito' },
  { id: 'park-6', type: 'parks', name: 'Parque Rivadavia', coordinates: [-58.4390, -34.6180], details: 'Caballito' },
  { id: 'park-7', type: 'parks', name: 'Plaza San Martin', coordinates: [-58.3750, -34.5950], details: 'Retiro' },
  { id: 'park-8', type: 'parks', name: 'Parque Lezama', coordinates: [-58.3690, -34.6290], details: 'San Telmo' },
  { id: 'park-9', type: 'parks', name: 'Reserva Ecologica', coordinates: [-58.3530, -34.6150], details: 'Puerto Madero' },
  { id: 'park-10', type: 'parks', name: 'Plaza Francia', coordinates: [-58.3920, -34.5830], details: 'Recoleta' },
]

// Police stations
const policeStations: POI[] = [
  { id: 'police-1', type: 'security', name: 'Comisaria 14', coordinates: [-58.4150, -34.5780], details: 'Palermo' },
  { id: 'police-2', type: 'security', name: 'Comisaria 17', coordinates: [-58.3880, -34.5910], details: 'Recoleta' },
  { id: 'police-3', type: 'security', name: 'Comisaria 23', coordinates: [-58.4550, -34.5580], details: 'Belgrano' },
  { id: 'police-4', type: 'security', name: 'Comisaria 25', coordinates: [-58.4580, -34.5450], details: 'Nunez' },
  { id: 'police-5', type: 'security', name: 'Comisaria 11', coordinates: [-58.4350, -34.6200], details: 'Caballito' },
  { id: 'police-6', type: 'security', name: 'Comisaria 38', coordinates: [-58.4850, -34.5700], details: 'Villa Urquiza' },
  { id: 'police-7', type: 'security', name: 'Comisaria 5', coordinates: [-58.3680, -34.6190], details: 'San Telmo' },
  { id: 'police-8', type: 'security', name: 'Comisaria 4', coordinates: [-58.3630, -34.6080], details: 'Puerto Madero' },
  { id: 'police-9', type: 'security', name: 'Comisaria 6', coordinates: [-58.4190, -34.6060], details: 'Almagro' },
  { id: 'police-10', type: 'security', name: 'Comisaria 24', coordinates: [-58.4500, -34.5750], details: 'Colegiales' },
]

// Combined POIs
export const mockPOIs: POI[] = [
  ...subteStations,
  ...schools,
  ...hospitals,
  ...parks,
  ...policeStations,
]

// Helper to get POIs by type
export function getPOIsByType(type: POIType): POI[] {
  return mockPOIs.filter((poi) => poi.type === type)
}

// Helper to get all POIs within bounds
export function getPOIsInBounds(
  north: number,
  south: number,
  east: number,
  west: number
): POI[] {
  return mockPOIs.filter((poi) => {
    const [lng, lat] = poi.coordinates
    return lat <= north && lat >= south && lng <= east && lng >= west
  })
}
