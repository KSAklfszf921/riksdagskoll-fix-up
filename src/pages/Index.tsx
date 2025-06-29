import React, { useState, useEffect } from 'react';
import { Search, Bell, Calendar, Users, FileText, ExternalLink, Mic, Database, Vote, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecentAnforanden, Anforande } from '@/utils/anforandeApi';
import AnforandeCard from '@/components/AnforandeCard';
import AnforandeSearch from '@/components/AnforandeSearch';
import DataManager from '@/components/DataManager';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
const Index = () => {
  const [recentSpeeches, setRecentSpeeches] = useState<Anforande[]>([]);
  const [loadingSpeeches, setLoadingSpeeches] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const {
    totalLedamoter,
    totalAnforanden,
    totalDokument,
    totalVoteringar,
    partiFordelning,
    recentAnforanden,
    loading: statsLoading
  } = useRealTimeStats();
  useEffect(() => {
    const fetchRecentSpeeches = async () => {
      try {
        console.log('Fetching recent speeches...');
        const speeches = await getRecentAnforanden(3);
        console.log('Fetched speeches:', speeches);
        setRecentSpeeches(speeches);
      } catch (error) {
        console.error('Error fetching recent speeches:', error);
      } finally {
        setLoadingSpeeches(false);
      }
    };
    fetchRecentSpeeches();
  }, []);
  const topPartier = Object.entries(partiFordelning).sort(([, a], [, b]) => b - a).slice(0, 5);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Riksdagskoll</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                Ledamöter
              </a>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setShowSearch(!showSearch)}>
                <Search className="w-4 h-4 mr-2" />
                Sök anföranden
              </Button>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => setShowDataManager(!showDataManager)}>
                <Database className="w-4 h-4 mr-2" />
                Hantera data
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      {showSearch && <section className="py-8 px-4 bg-blue-50 border-b">
          <div className="container mx-auto">
            <AnforandeSearch />
          </div>
        </section>}

      {/* Data Manager Section */}
      {showDataManager && <section className="py-8 px-4 bg-green-50 border-b">
          <div className="container mx-auto">
            <DataManager />
          </div>
        </section>}

      {/* Hero Section */}
      <section className="px-4 py-[20px]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Följ Sveriges riksdag
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input placeholder="Sök efter ärenden, ledamöter eller anföranden..." className="pl-10 py-3 text-lg border-blue-200 focus:border-blue-400" onFocus={() => setShowSearch(true)} />
              </div>
              <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowSearch(true)}>
                Sök
              </Button>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsLoading ? '...' : totalLedamoter}
                </div>
                <div className="text-sm text-blue-600">Riksdagsledamöter</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsLoading ? '...' : totalAnforanden}
                </div>
                <div className="text-sm text-blue-600">Anföranden</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsLoading ? '...' : totalDokument}
                </div>
                <div className="text-sm text-blue-600">Dokument</div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Vote className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {statsLoading ? '...' : totalVoteringar}
                </div>
                <div className="text-sm text-blue-600">Voteringar</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Party Distribution Section */}
      {topPartier.length > 0 && <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-blue-900">Partifördelning</h3>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPartier.map(([parti, antal]) => <Card key={parti} className="border-blue-100 hover:shadow-lg transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-blue-900 mb-2">{antal}</div>
                    <div className="text-lg font-medium text-blue-700">{parti}</div>
                    <div className="text-sm text-blue-500">ledamöter</div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>}

      {/* Recent Speeches Section */}
      

      {/* Recent Data from Database */}
      {recentAnforanden.length > 0 && <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-blue-900">Senast lagrade anföranden</h3>
              <Badge variant="secondary">{recentAnforanden.length} av {totalAnforanden} totalt</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentAnforanden.map((anforande: any) => <Card key={anforande.anforande_id} className="border-blue-100 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-blue-900 leading-tight">
                        {anforande.rubrik || 'Anförande'}
                      </CardTitle>
                      <Badge variant="outline">{anforande.parti}</Badge>
                    </div>
                    <CardDescription>
                      {anforande.talare} • {anforande.dok_datum}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {anforande.anforande?.substring(0, 200)}...
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>}

      {/* Footer */}
      
    </div>;
};
export default Index;