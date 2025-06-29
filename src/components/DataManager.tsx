
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { getCurrentMembers, getFormerMembers, hamtaPerson } from '@/utils/personApi';
import { sparaLedamot, hamtaLedamoter } from '@/utils/supabasePersons';
import { toast } from 'sonner';

interface ImportStats {
  total: number;
  processed: number;
  success: number;
  errors: number;
}

const DataManager: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats>({ total: 0, processed: 0, success: 0, errors: 0 });
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const handleImportCurrentMembers = async () => {
    try {
      setIsImporting(true);
      toast.info('Hämtar nuvarande ledamöter från Riksdagens API...');
      
      const members = await getCurrentMembers();
      console.log(`Hittade ${members.length} nuvarande ledamöter`);
      
      setImportStats({ total: members.length, processed: 0, success: 0, errors: 0 });
      
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        try {
          // Hämta detaljerad information
          const detailedPerson = await hamtaPerson(member.intressent_id);
          if (detailedPerson) {
            const success = await sparaLedamot(detailedPerson);
            setImportStats(prev => ({
              ...prev,
              processed: i + 1,
              success: success ? prev.success + 1 : prev.success,
              errors: success ? prev.errors : prev.errors + 1
            }));
          }
          
          // Delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 400));
        } catch (error) {
          console.error(`Error processing member ${member.intressent_id}:`, error);
          setImportStats(prev => ({
            ...prev,
            processed: i + 1,
            errors: prev.errors + 1
          }));
        }
      }
      
      toast.success(`Import klar! ${importStats.success} ledamöter sparade.`);
      
    } catch (error) {
      console.error('Error importing current members:', error);
      toast.error('Fel vid import av nuvarande ledamöter');
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFormerMembers = async () => {
    try {
      setIsImporting(true);
      toast.info('Hämtar tidigare ledamöter från Riksdagens API...');
      
      const members = await getFormerMembers();
      console.log(`Hittade ${members.length} tidigare ledamöter`);
      
      setImportStats({ total: members.length, processed: 0, success: 0, errors: 0 });
      
      // Process in smaller batches for former members (there are many more)
      const batchSize = 50;
      for (let batchStart = 0; batchStart < members.length; batchStart += batchSize) {
        const batch = members.slice(batchStart, Math.min(batchStart + batchSize, members.length));
        
        for (let i = 0; i < batch.length; i++) {
          const member = batch[i];
          try {
            const detailedPerson = await hamtaPerson(member.intressent_id);
            if (detailedPerson) {
              const success = await sparaLedamot(detailedPerson);
              setImportStats(prev => ({
                ...prev,
                processed: batchStart + i + 1,
                success: success ? prev.success + 1 : prev.success,
                errors: success ? prev.errors : prev.errors + 1
              }));
            }
            
            await new Promise(resolve => setTimeout(resolve, 400));
          } catch (error) {
            console.error(`Error processing former member ${member.intressent_id}:`, error);
            setImportStats(prev => ({
              ...prev,
              processed: batchStart + i + 1,
              errors: prev.errors + 1
            }));
          }
        }
        
        // Longer pause between batches
        if (batchStart + batchSize < members.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      toast.success(`Import klar! ${importStats.success} tidigare ledamöter sparade.`);
      
    } catch (error) {
      console.error('Error importing former members:', error);
      toast.error('Fel vid import av tidigare ledamöter');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCheckSavedData = async () => {
    try {
      const savedMembers = await hamtaLedamoter();
      setSavedCount(savedMembers.length);
      toast.success(`${savedMembers.length} ledamöter finns sparade i databasen`);
    } catch (error) {
      console.error('Error checking saved data:', error);
      toast.error('Fel vid kontroll av sparad data');
    }
  };

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Datahantering - Riksdagens Ledamöter</span>
        </CardTitle>
        <CardDescription>
          Hämta och lagra information om riksdagsledamöter från Riksdagens öppna API
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Sparade ledamöter:</span>
          </div>
          <div className="flex items-center space-x-2">
            {savedCount !== null && (
              <Badge variant="secondary">{savedCount} st</Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckSavedData}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Kontrollera
            </Button>
          </div>
        </div>

        {/* Import Progress */}
        {isImporting && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Import pågår...</span>
              <span className="text-sm text-gray-500">
                {importStats.processed} / {importStats.total}
              </span>
            </div>
            <Progress 
              value={importStats.total > 0 ? (importStats.processed / importStats.total) * 100 : 0} 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                {importStats.success} lyckade
              </span>
              <span className="flex items-center">
                <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                {importStats.errors} fel
              </span>
            </div>
          </div>
        )}

        {/* Import Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleImportCurrentMembers}
            disabled={isImporting}
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <Download className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Nuvarande ledamöter</div>
              <div className="text-xs opacity-80">Hämta alla aktiva riksdagsledamöter</div>
            </div>
          </Button>

          <Button
            onClick={handleImportFormerMembers}
            disabled={isImporting}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <Download className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Tidigare ledamöter</div>
              <div className="text-xs opacity-80">Hämta historiska riksdagsledamöter</div>
            </div>
          </Button>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Obs:</strong> Import av tidigare ledamöter kan ta lång tid (flera tusen personer). 
              API:et har begränsningar på 3 anrop per sekund.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManager;
