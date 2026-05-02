import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiSystemRepository } from "../../../core/infrastructure/repositories/ApiSystemRepository";
import { GetServerTimeUseCase } from "../../../core/application/use-cases/GetServerTimeUseCase";

const systemRepository = new ApiSystemRepository();
const getServerTimeUseCase = new GetServerTimeUseCase(systemRepository);

export function useServerTime() {
  const [liveTime, setLiveTime] = useState<string>("");

  const {
    data: serverTime,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['server-time'],
    queryFn: () => getServerTimeUseCase.execute(),
    staleTime: 0,             // Considerar siempre viejo para forzar refetch al montar (abrir modal)
    refetchInterval: 1000 * 60 * 3, // Refrescar automáticamente cada 3 minutos
    refetchIntervalInBackground: true, // Mantener sincronizado incluso en pestañas inactivas
  });

  useEffect(() => {
    if (!serverTime) return;

    // Inicializamos el reloj con la hora del servidor
    let currentTimestamp = serverTime.timestamp * 1000;
    
    const timer = setInterval(() => {
      currentTimestamp += 1000;
      const date = new Date(currentTimestamp);
      
      // Formateo manual para mantener el estándar regional sin depender de la latencia de la API
      const formatted = date.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      setLiveTime(formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, [serverTime]);

  return {
    serverTime: serverTime ? { ...serverTime, formatted: liveTime || serverTime.formatted } : null,
    isLoading,
    error,
    refetch
  };
}
