import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Company } from '@/app/core/domain/entities/Company';
import useSession from '@/hooks/useSession';
import { authSwitchCompany } from '@auth/authApi';
import { setGlobalHeaders } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

/**
 * BusinessContext Interface
 */
interface BusinessContextType {
    activeCompany: Company | null;
    availableCompanies: Company[];
    switchCompany: (companyId: string) => Promise<void>;
    isLoadingContext: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

/**
 * BusinessProvider Component
 * Orquestador global de la empresa activa y contexto de negocio.
 */
export function BusinessProvider({ children }: { children: ReactNode }) {
    const { user, isAuth } = useSession();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const [isLoadingContext, setIsLoadingContext] = useState(true);

    const availableCompanies = useMemo(() => user?.companies || [], [user]);

    // Sincronización inicial y cuando el usuario cambia
    useEffect(() => {
        if (isAuth && user) {
            const activeId = user.lastActiveCompanyId;
            const company = availableCompanies.find(c => c.id === activeId) || availableCompanies[0] || null;
            
            if (company) {
                setActiveCompany(company);
                setGlobalHeaders({ 'X-Company-Context': company.id });
            }
            setIsLoadingContext(false);
        } else {
            setActiveCompany(null);
            setIsLoadingContext(false);
        }
    }, [isAuth, user, availableCompanies]);

    /**
     * Switch Company Logic
     * Centraliza el cambio de contexto para toda la app.
     */
    const switchCompany = async (companyId: string) => {
        const company = availableCompanies.find(c => c.id === companyId);
        
        if (!company) {
            enqueueSnackbar('La empresa seleccionada no es válida', { variant: 'error' });
            return;
        }

        try {
            setIsLoadingContext(true);
            
            // 1. Backend Sync
            await authSwitchCompany(companyId);
            
            // 2. Network Context Sync
            setGlobalHeaders({ 'X-Company-Context': companyId });
            
            // 3. Local State Sync
            setActiveCompany(company);
            
            // 4. Cache Invalidation
            await queryClient.invalidateQueries();
            
            enqueueSnackbar(`Contexto cambiado a: ${company.name}`, { variant: 'success' });
        } catch (error) {
            console.error('Error switching context:', error);
            enqueueSnackbar('No se pudo cambiar el contexto de la empresa', { variant: 'error' });
            throw error;
        } finally {
            setIsLoadingContext(false);
        }
    };

    const value = useMemo(() => ({
        activeCompany,
        availableCompanies,
        switchCompany,
        isLoadingContext
    }), [activeCompany, availableCompanies, isLoadingContext]);

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    );
}

/**
 * Custom Hook to use the BusinessContext
 */
export function useBusiness() {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }
    return context;
}

export default BusinessContext;
