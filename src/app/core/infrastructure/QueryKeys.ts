export const QUERY_KEYS = {
  system: {
    all: ['system'] as const,
    serverTime: () => [...QUERY_KEYS.system.all, 'server-time'] as const,
  },
  production: {
    all: ['production'] as const,
    yields: {
      all: () => [...QUERY_KEYS.production.all, 'yields'] as const,
      history: (campaignId: string) => [...QUERY_KEYS.production.yields.all(), 'history', campaignId] as const,
      machineHistory: (machineId: string, timeRange?: string) => 
        [...QUERY_KEYS.production.yields.all(), 'machine', machineId, timeRange].filter(Boolean) as const,
    },
    campaigns: {
      all: () => [...QUERY_KEYS.production.all, 'campaigns'] as const,
      detail: (id: string) => [...QUERY_KEYS.production.campaigns.all(), 'detail', id] as const,
    },
    machines: {
      all: () => [...QUERY_KEYS.production.all, 'machines'] as const,
      dashboard: (companyId: string) => [...QUERY_KEYS.production.machines.all(), 'dashboard', companyId] as const,
    }
  }
} as const;
