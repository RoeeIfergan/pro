import { useState, useCallback, useMemo } from 'react'

import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

// Car interface
export interface Car {
  id: number
  make: string
  model: string
  year: number
  color: string
  price: number
  mileage: number
  fuelType: string
  transmission: string
  engine: string
  bodyType: string
  condition: string
  location: string
  dealership: string
  vin: string
  features: string
  description: string
  subRows?: Car[]
}

// Generate sample car data function
export const generateCarData = (count: number): Car[] => {
  const data: Car[] = []

  const makes = [
    'Toyota',
    'Honda',
    'Ford',
    'BMW',
    'Mercedes',
    'Audi',
    'Volkswagen',
    'Nissan',
    'Hyundai',
    'Kia'
  ]
  const models = {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
    Ford: ['F-150', 'Mustang', 'Explorer', 'Focus', 'Escape'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', 'i3'],
    Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'],
    Audi: ['A4', 'A6', 'Q5', 'Q7', 'TT'],
    Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Golf', 'Atlas'],
    Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Leaf'],
    Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Ioniq'],
    Kia: ['Optima', 'Forte', 'Sorento', 'Sportage', 'Soul']
  }
  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Gold', 'Green', 'Brown']
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
  const transmissions = ['Manual', 'Automatic', 'CVT']
  const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Truck', 'Coupe', 'Wagon', 'Convertible']
  const conditions = [
    'New',
    'Used - Excellent',
    'Used - Good',
    'Used - Fair',
    'Certified Pre-Owned'
  ]
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ']
  const dealerships = ['AutoMax', 'Premier Motors', 'Elite Cars', 'City Auto', 'Highway Motors']
  const featuresList = [
    'Navigation',
    'Leather Seats',
    'Sunroof',
    'Backup Camera',
    'Bluetooth',
    'Heated Seats',
    'AlloyWheels'
  ]

  for (let i = 0; i < count; i++) {
    const make = makes[i % makes.length]
    const modelOptions = models[make as keyof typeof models]
    const model = modelOptions[i % modelOptions.length]
    const year = 2015 + (i % 9) // Years 2015-2023

    const car: Car = {
      id: i + 1,
      make,
      model,
      year,
      color: colors[i % colors.length],
      price: 15000 + (i % 40) * 2000 + Math.floor(Math.random() * 5000),
      mileage:
        year < 2022 ? Math.floor(Math.random() * 80000) + 5000 : Math.floor(Math.random() * 15000),
      fuelType: fuelTypes[i % fuelTypes.length],
      transmission: transmissions[i % transmissions.length],
      engine: `${1.5 + (i % 4) * 0.5}L ${i % 2 === 0 ? 'I4' : 'V6'}`,
      bodyType: bodyTypes[i % bodyTypes.length],
      condition: conditions[i % conditions.length],
      location: locations[i % locations.length],
      dealership: dealerships[i % dealerships.length],
      vin: `1HGBH41JXMN${String(100000 + i).padStart(6, '0')}`,
      features: featuresList.slice(0, (i % 4) + 2).join(', '),
      description: `${year} ${make} ${model} in ${colors[i % colors.length].toLowerCase()} with ${Math.floor(Math.random() * 80000) + 5000} miles.`
    }
    data.push(car)
  }

  return data
}

// Custom hook for managing cars data
export const useCars = () => {
  const [data, setData] = useState(() => generateCarData(100))
  const [isLoading, setIsLoading] = useState(false)
  const [hasNext, setHasNext] = useState(true)

  const loadMore = useCallback(() => {
    if (isLoading || !hasNext) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newData = generateCarData(50)
      const startId = data.length + 1
      const updatedData = newData.map((item, index) => ({
        ...item,
        id: startId + index
      }))

      setData((prev) => [...prev, ...updatedData])
      setIsLoading(false)

      // Stop loading more after 500 items
      if (data.length > 500) {
        setHasNext(false)
      }
    }, 1000)
  }, [isLoading, hasNext, data.length])

  return {
    data,
    setData,
    isLoading,
    hasNext,
    loadMore
  }
}

// Custom hook for cars table columns
export const useCarsColumns = (): ColumnDef<Car, unknown>[] => {
  const columnHelper = createColumnHelper<Car>()

  return useMemo(
    () =>
      [
        columnHelper.accessor('make', {
          header: 'Make',
          size: 100,
          enableGrouping: true
        }),
        columnHelper.accessor('model', {
          header: 'Model',
          size: 120,
          enableGrouping: true
        }),
        columnHelper.accessor('year', {
          header: 'Year',
          size: 80,
          enableGrouping: true
        }),
        columnHelper.accessor('color', {
          header: 'Color',
          size: 100,
          enableGrouping: true
        }),
        columnHelper.accessor('price', {
          header: 'Price',
          size: 120,
          cell: (info) => `$${info.getValue().toLocaleString()}`,
          enableGrouping: true
        }),
        columnHelper.accessor('mileage', {
          header: 'Mileage',
          size: 100,
          cell: (info) => `${info.getValue().toLocaleString()} mi`,
          enableGrouping: true
        }),
        columnHelper.accessor('fuelType', {
          header: 'Fuel Type',
          size: 100,
          enableGrouping: true
        }),
        columnHelper.accessor('transmission', {
          header: 'Transmission',
          size: 120,
          enableGrouping: true
        }),
        columnHelper.accessor('engine', {
          header: 'Engine',
          size: 100
        }),
        columnHelper.accessor('bodyType', {
          header: 'Body Type',
          size: 100,
          enableGrouping: true
        }),
        columnHelper.accessor('condition', {
          header: 'Condition',
          size: 140,
          enableGrouping: true
        }),
        columnHelper.accessor('location', {
          header: 'Location',
          size: 140,
          enableGrouping: true
        }),
        columnHelper.accessor('dealership', {
          header: 'Dealership',
          size: 120,
          enableGrouping: true
        }),
        columnHelper.accessor('vin', {
          header: 'VIN',
          size: 180
        }),
        columnHelper.accessor('features', {
          header: 'Features',
          size: 200
        }),
        columnHelper.accessor('description', {
          header: 'Description',
          size: 250
        })
      ] as ColumnDef<Car, unknown>[],
    []
  )
}
