
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Database, RefreshCw, CheckCircle, AlertCircle, FileText, Vote } from 'lucide-react';
import { getCurrentMembers, getFormerMembers, hamtaPerson } from '@/utils/personApi';
import { sparaLedamot, hamtaLedamoter } from '@/utils/supabasePersons';
import { hamtaRecentaAnforanden } from '@/utils/anforandeApi';
import { hamtaDokument } from '@/utils/dokumentApi';
import { hamtaVoteringar } from '@/utils/voteringApi';
import { sparaAnforanden, sparaDokument, sparaVoteringar, hamtaStatistik } from '@/utils/supabaseData';
import { toast } from 'sonner';

interface ImportStats {
  total: number;
  processed: number;
  success: number;
  errors: number;
}

interface DataStats {
  ledamoter: number;
  anforanden: number;
  dokument: number;
  voteringar: number;
}

const DataManager: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats>({ total: 0, processed: 0, success: 0, errors: 0 });
  const [dataStats, setDataStats] = useState<DataStats>({ ledamoter: 0, anforanden: 0, dokument: 0, voteringar: 0 });
  const [currentImportType, setCurrentImportType] = useState<string>('');

  const handleImportCurrentMembers = async () => {
    try {
      setIsImporting(true);
      setCurrentImportType('Nuvarande ledamöter');
      toast.info('Hämtar nuvarande ledamöter från Riksdagens API...');
      
      const members = await getCurrentMembers();
      console.log(`Hittade ${members.length} nuvarande ledamöter`);
      
      setImportStats({ total: members.length, processed: 0, success: 0, errors: 0 });
      
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        try {
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
      await updateDataStats();
      
    } catch (error) {
      console.error('Error importing current members:', error);
      toast.error('Fel vid import av nuvarande ledamöter');
    } finally {
      setIsImporting(false);
      setCurrentImportType('');
    }
  };

  const handleImportRecentSpeeches = async () => {
    try {
      setIsImporting(true);
      setCurrentImportType('Senaste anföranden');
      toast.info('Hämtar senaste anföranden...');
      
      const anforanden = await hamtaRecentaAnforanden(100);
      console.log(`Hittade ${anforanden.length} anföranden`);
      
      setImportStats({ total: anforanden.length, processed: 0, success: 0, errors: 0 });
      
      const batchSize = 20;
      for (let i = 0; i < anforanden.length; i += batchSize) {
        const batch = anforanden.slice(i, i + batchSize);
        try {
          const success = await sparaAnforanden(batch);
          setImportStats(prev => ({
            ...prev,
            processed: Math.min(i + batchSize, anforanden.length),
            success: success ? prev.success + batch.length : prev.success,
            errors: success ? prev.errors : prev.errors + batch.length
          }));
        } catch (error) {
          console.error('Error saving anföranden batch:', error);
          setImportStats(prev => ({
            ...prev,
            processed: Math.min(i + batchSize, anforanden.length),
            errors: prev.errors + batch.length
          }));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success(`Import klar! ${importStats.success} anföranden sparade.`);
      await updateDataStats();
      
    } catch (error) {
      console.error('Error importing speeches:', error);
      toast.error('Fel vid import av anföranden');
    } finally {
      setIsImporting(false);
      setCurrentImportType('');
    }
  };

  const handleImportRecentDocuments = async () => {
    try {
      setIsImporting(true);
      setCurrentImportType('Senaste dokument');
      toast.info('Hämtar senaste dokument...');
      
      const dokument = await hamtaDokument({ p: 1 });
      console.log(`Hittade ${dokument.length} dokument`);
      
      setImportStats({ total: dokument.length, processed: 0, success: 0, errors: 0 });
      
      const success = await sparaDokument(dokument);
      setImportStats({
        total: dokument.length,
        processed: dokument.length,
        success: success ? dokument.length : 0,
        errors: success ? 0 : dokument.length
      });
      
      toast.success(`Import klar! ${success ? dokument.length : 0} dokument sparade.`);
      await updateDataStats();
      
    } catch (error) {
      console.error('Error importing documents:', error);
      toast.error('Fel vid import av dokument');
    } finally {
      setIsImporting(false);
      setCurrentImportType('');
    }
  };

  const updateDataStats = async () => {
    try {
      const stats = await hamtaStatistik();
      setDataStats(stats);
    } catch (error) {
      console.error('Error updating data stats:', error);
    }
  };

  React.useEffect(() => {
    updateDataStats();
  }, []);

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Datahantering - Riksdagens Data</span>
        </CardTitle>
        <CardDescription>
          Hämta och lagra information från Riksdagens öppna API
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Ledamöter</span>
            </div>
            <Badge variant="secondary">{dataStats.ledamoter}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Anföranden</span>
            </div>
            <Badge variant="secondary">{dataStats.anforanden}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Dokument</span>
            </div>
            <Badge variant="secondary">{dataStats.dokument}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Vote className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Voteringar</span>
            </div>
            <Badge variant="secondary">{dataStats.voteringar}</Badge>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={updateDataStats}
            disabled={isImporting}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Uppdatera statistik
          </Button>
        </div>

        {/* Import Progress */}
        {isImporting && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Import pågår: {currentImportType}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleImportCurrentMembers}
            disabled={isImporting}
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <Users className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Ledamöter</div>
              <div className="text-xs opacity-80">Hämta nuvarande ledamöter</div>
            </div>
          </Button>

          <Button
            onClick={handleImportRecentSpeeches}
            disabled={isImporting}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <FileText className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Anföranden</div>
              <div className="text-xs opacity-80">Hämta senaste anföranden</div>
            </div>
          </Button>

          <Button
            onClick={handleImportRecentDocuments}
            disabled={isImporting}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <Download className="w-5 h-5" />
            <div className="text-center">
              <div className="font-medium">Dokument</div>
              <div className="text-xs opacity-80">Hämta senaste dokument</div>
            </div>
          </Button>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Obs:</strong> API:et har begränsningar på 3 anrop per sekund. 
              Större importer kan ta tid att slutföra.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManager;
