import { DemoState } from '@/contexts/DemoContext';
import { horses as baseHorses, scheduleEvents as baseEvents, invoices as baseInvoices, inventory, aiInsights as baseInsights } from './mockData';
import type { Horse, ScheduleEvent, Invoice, AIInsight } from './mockData';

// Horse data variations for different demo configurations
const horseProfiles: Record<string, Partial<Horse>> = {
  'Bella': {
    name: 'Bella',
    breed: 'Quarter Horse',
    color: 'Bay',
    owner: 'Sarah Johnson',
    healthStatus: 'needs-attention',
    notes: 'Gentle mare, good with beginners. Needs farrier visit soon.'
  },
  'Thunder': {
    name: 'Thunder', 
    breed: 'Thoroughbred',
    color: 'Dark Bay',
    owner: 'Mike Rodriguez',
    healthStatus: 'excellent',
    notes: 'High energy, excellent jumping prospect. Regular exercise needed.'
  },
  'Moonlight': {
    name: 'Moonlight',
    breed: 'Arabian', 
    color: 'Gray',
    owner: 'Emma Chen',
    healthStatus: 'good',
    notes: 'Senior mare, very calm temperament. Great for trail rides.'
  },
  'Storm': {
    name: 'Storm',
    breed: 'Paint Horse',
    color: 'Pinto', 
    owner: 'David Wilson',
    healthStatus: 'good',
    notes: 'Friendly gelding, enjoys ground work and trail riding.'
  }
};

export function getDynamicMockData(demoState: DemoState) {
  // Reorder horses to put primary horse first
  const primaryHorseProfile = horseProfiles[demoState.primaryHorse];
  const reorderedHorses = [...baseHorses];
  
  if (primaryHorseProfile) {
    // Find the primary horse and move it to first position
    const primaryIndex = reorderedHorses.findIndex(h => h.name === demoState.primaryHorse);
    if (primaryIndex > 0) {
      const primaryHorse = reorderedHorses.splice(primaryIndex, 1)[0];
      reorderedHorses.unshift(primaryHorse);
    }
  }

  // Update schedule events to feature the primary horse more prominently
  const dynamicEvents = baseEvents.map(event => {
    if (event.title.includes('Bella') && demoState.primaryHorse !== 'Bella') {
      return {
        ...event,
        title: event.title.replace('Bella', demoState.primaryHorse),
        horseId: '1' // Primary horse always gets ID 1
      };
    }
    return event;
  });

  // Update invoices to reflect the demo barn owner
  const dynamicInvoices = baseInvoices.map(invoice => {
    if (invoice.id === 'INV-2024-001') {
      return {
        ...invoice,
        horseNames: [demoState.primaryHorse]
      };
    }
    return invoice;
  });

  // Update AI insights to reference the primary horse
  const dynamicInsights = baseInsights.map(insight => {
    if (insight.relatedEntity?.name === 'Bella' && demoState.primaryHorse !== 'Bella') {
      return {
        ...insight,
        title: insight.title.replace('Bella', demoState.primaryHorse),
        description: insight.description.replace('Bella', demoState.primaryHorse),
        relatedEntity: {
          ...insight.relatedEntity,
          name: demoState.primaryHorse
        }
      };
    }
    return insight;
  });

  return {
    horses: reorderedHorses,
    scheduleEvents: dynamicEvents,
    invoices: dynamicInvoices,
    inventory,
    aiInsights: dynamicInsights
  };
}