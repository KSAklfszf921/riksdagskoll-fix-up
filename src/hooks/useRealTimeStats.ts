
import { useState, useEffect } from 'react';
import { hamtaStatistik, hamtaPartiStatistik } from '@/utils/supabaseData';
import { hamtaAnforandenFranDB } from '@/utils/supabaseData';

interface RealTimeStats {
  totalLedamoter: number;
  totalAnforanden: number;
  totalDokument: number;
  totalVoteringar: number;
  partiFordelning: { [key: string]: number };
  recentAnforanden: any[];
  loading: boolean;
  error: string | null;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalLedamoter: 0,
    totalAnforanden: 0,
    totalDokument: 0,
    totalVoteringar: 0,
    partiFordelning: {},
    recentAnforanden: [],
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const [baseStats, partiStats, anforanden] = await Promise.all([
        hamtaStatistik(),
        hamtaPartiStatistik(),
        hamtaAnforandenFranDB()
      ]);

      setStats({
        totalLedamoter: baseStats.ledamoter,
        totalAnforanden: baseStats.anforanden,
        totalDokument: baseStats.dokument,
        totalVoteringar: baseStats.voteringar,
        partiFordelning: partiStats,
        recentAnforanden: anforanden.slice(0, 5),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Kunde inte hämta statistik'
      }));
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Uppdatera var 30:e sekund
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { ...stats, refetch: fetchStats };
};
