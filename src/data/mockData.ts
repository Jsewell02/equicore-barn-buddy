export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  color: string;
  owner: string;
  image?: string;
  boardingRate: number;
  healthStatus: 'excellent' | 'good' | 'needs-attention' | 'critical';
  lastVetVisit: string;
  lastFarrierVisit: string;
  feeding: {
    hay: string;
    grain: string;
    supplements: string[];
  };
  notes: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'lesson' | 'feeding' | 'vet' | 'farrier' | 'exercise' | 'grooming';
  horseId?: string;
  startTime: string;
  endTime: string;
  date: string;
  instructor?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Invoice {
  id: string;
  clientName: string;
  horseNames: string[];
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  items: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'feed' | 'bedding' | 'supplements' | 'equipment' | 'medical';
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface AIInsight {
  id: string;
  type: 'health' | 'scheduling' | 'inventory' | 'billing' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionRequired: boolean;
  suggestedAction?: string;
  relatedEntity?: {
    type: 'horse' | 'inventory' | 'schedule';
    id: string;
    name: string;
  };
  createdAt: string;
}

// Mock Data
export const horses: Horse[] = [
  {
    id: '1',
    name: 'Bella',
    breed: 'Quarter Horse',
    age: 10,
    color: 'Bay',
    owner: 'Sarah Johnson',
    boardingRate: 850,
    healthStatus: 'needs-attention',
    lastVetVisit: '2024-06-15',
    lastFarrierVisit: '2024-05-10',
    feeding: {
      hay: '3 flakes, 2x daily',
      grain: '2 cups sweet feed, 2x daily',
      supplements: ['Joint Support', 'Vitamin E']
    },
    notes: 'Gentle mare, good with beginners. Needs farrier visit soon.'
  },
  {
    id: '2',
    name: 'Thunder',
    breed: 'Thoroughbred',
    age: 8,
    color: 'Dark Bay',
    owner: 'Mike Rodriguez',
    boardingRate: 950,
    healthStatus: 'excellent',
    lastVetVisit: '2024-07-01',
    lastFarrierVisit: '2024-06-20',
    feeding: {
      hay: '4 flakes, 3x daily',
      grain: '3 cups performance feed, 2x daily',
      supplements: ['Electrolytes', 'Probiotics']
    },
    notes: 'High energy, excellent jumping prospect. Regular exercise needed.'
  },
  {
    id: '3',
    name: 'Moonlight',
    breed: 'Arabian',
    age: 12,
    color: 'Gray',
    owner: 'Emma Chen',
    boardingRate: 800,
    healthStatus: 'good',
    lastVetVisit: '2024-06-28',
    lastFarrierVisit: '2024-06-18',
    feeding: {
      hay: '2 flakes, 2x daily',
      grain: '1.5 cups senior feed, 2x daily',
      supplements: ['Senior Support', 'Omega-3']
    },
    notes: 'Senior mare, very calm temperament. Great for trail rides.'
  },
  {
    id: '4',
    name: 'Storm',
    breed: 'Paint Horse',
    age: 6,
    color: 'Pinto',
    owner: 'David Wilson',
    boardingRate: 875,
    healthStatus: 'good',
    lastVetVisit: '2024-07-05',
    lastFarrierVisit: '2024-06-25',
    feeding: {
      hay: '3 flakes, 2x daily',
      grain: '2.5 cups feed, 2x daily',
      supplements: ['Biotin', 'Joint Support']
    },
    notes: 'Friendly gelding, enjoys ground work and trail riding.'
  }
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Bella - Lesson with Sarah',
    type: 'lesson',
    horseId: '1',
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-07-22',
    instructor: 'Lisa Anderson',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Thunder - Vet Checkup',
    type: 'vet',
    horseId: '2',
    startTime: '14:00',
    endTime: '15:00',
    date: '2024-07-22',
    notes: 'Annual physical and vaccinations',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Morning Feeding',
    type: 'feeding',
    startTime: '07:00',
    endTime: '08:00',
    date: '2024-07-22',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Moonlight - Farrier Visit',
    type: 'farrier',
    horseId: '3',
    startTime: '11:00',
    endTime: '12:00',
    date: '2024-07-23',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Storm - Exercise Session',
    type: 'exercise',
    horseId: '4',
    startTime: '16:00',
    endTime: '17:00',
    date: '2024-07-23',
    priority: 'low'
  }
];

export const invoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    clientName: 'Sarah Johnson',
    horseNames: ['Bella'],
    issueDate: '2024-07-01',
    dueDate: '2024-07-31',
    total: 985,
    status: 'pending',
    items: [
      { description: 'Monthly Boarding - Bella', quantity: 1, rate: 850, total: 850 },
      { description: 'Farrier Service', quantity: 1, rate: 135, total: 135 }
    ]
  },
  {
    id: 'INV-2024-002',
    clientName: 'Mike Rodriguez',
    horseNames: ['Thunder'],
    issueDate: '2024-07-01',
    dueDate: '2024-07-31',
    total: 1150,
    status: 'paid',
    items: [
      { description: 'Monthly Boarding - Thunder', quantity: 1, rate: 950, total: 950 },
      { description: 'Training Sessions (4)', quantity: 4, rate: 50, total: 200 }
    ]
  },
  {
    id: 'INV-2024-003',
    clientName: 'Emma Chen',
    horseNames: ['Moonlight'],
    issueDate: '2024-06-01',
    dueDate: '2024-06-30',
    total: 800,
    status: 'overdue',
    items: [
      { description: 'Monthly Boarding - Moonlight', quantity: 1, rate: 800, total: 800 }
    ]
  }
];

export const inventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Timothy Hay',
    category: 'feed',
    currentStock: 15,
    minStock: 25,
    unit: 'bales',
    costPerUnit: 12.50,
    supplier: 'Green Valley Farms',
    lastRestocked: '2024-07-10'
  },
  {
    id: '2',
    name: 'Sweet Feed',
    category: 'feed',
    currentStock: 8,
    minStock: 12,
    unit: 'bags',
    costPerUnit: 18.75,
    supplier: 'Purina Mills',
    lastRestocked: '2024-07-05'
  },
  {
    id: '3',
    name: 'Pine Shavings',
    category: 'bedding',
    currentStock: 35,
    minStock: 20,
    unit: 'bales',
    costPerUnit: 8.25,
    supplier: 'Mountain Bedding Co',
    lastRestocked: '2024-07-15'
  },
  {
    id: '4',
    name: 'Joint Support Supplement',
    category: 'supplements',
    currentStock: 5,
    minStock: 8,
    unit: 'containers',
    costPerUnit: 45.00,
    supplier: 'EquiHealth Solutions',
    lastRestocked: '2024-06-20'
  },
  {
    id: '5',
    name: 'Electrolyte Powder',
    category: 'supplements',
    currentStock: 12,
    minStock: 6,
    unit: 'containers',
    costPerUnit: 28.50,
    supplier: 'EquiHealth Solutions',
    lastRestocked: '2024-07-12'
  }
];

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'health',
    priority: 'high',
    title: 'Farrier Visit Overdue',
    description: 'Bella hasn\'t had a farrier visit in 6 weeks. Recommended interval is 4-6 weeks for optimal hoof health.',
    actionRequired: true,
    suggestedAction: 'Schedule farrier appointment within the next week',
    relatedEntity: {
      type: 'horse',
      id: '1',
      name: 'Bella'
    },
    createdAt: '2024-07-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'inventory',
    priority: 'medium',
    title: 'Low Hay Inventory',
    description: 'Timothy hay stock (15 bales) is below minimum threshold (25 bales). Consider reordering to avoid shortage.',
    actionRequired: true,
    suggestedAction: 'Order 30-40 bales from Green Valley Farms',
    relatedEntity: {
      type: 'inventory',
      id: '1',
      name: 'Timothy Hay'
    },
    createdAt: '2024-07-21T08:15:00Z'
  },
  {
    id: '3',
    type: 'billing',
    priority: 'medium',
    title: 'Overdue Invoice',
    description: 'Emma Chen\'s invoice (INV-2024-003) for $800 is now 22 days overdue.',
    actionRequired: true,
    suggestedAction: 'Send payment reminder or schedule payment discussion',
    relatedEntity: {
      type: 'horse',
      id: '3',
      name: 'Moonlight'
    },
    createdAt: '2024-07-19T14:20:00Z'
  },
  {
    id: '4',
    type: 'scheduling',
    priority: 'low',
    title: 'Optimal Exercise Schedule',
    description: 'Thunder has high energy and would benefit from more frequent exercise sessions. Current schedule: 3x/week.',
    actionRequired: false,
    suggestedAction: 'Consider increasing exercise to 4-5 sessions per week',
    relatedEntity: {
      type: 'horse',
      id: '2',
      name: 'Thunder'
    },
    createdAt: '2024-07-18T16:45:00Z'
  }
];