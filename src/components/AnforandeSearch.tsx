
import React, { useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sokAnforanden, Anforande, AnforandeParams } from '@/utils/anforandeApi';
import AnforandeCard from './AnforandeCard';

const AnforandeSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [results, setResults] = useState<Anforande[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const parties = [
    { code: 'S', name: 'Socialdemokraterna', color: 'bg-red-100 text-red-800' },
    { code: 'M', name: 'Moderaterna', color: 'bg-blue-100 text-blue-800' },
    { code: 'SD', name: 'Sverigedemokraterna', color: 'bg-yellow-100 text-yellow-800' },
    { code: 'C', name: 'Centerpartiet', color: 'bg-green-100 text-green-800' },
    { code: 'V', name: 'Vänsterpartiet', color: 'bg-red-200 text-red-900' },
    { code: 'KD', name: 'Kristdemokraterna', color: 'bg-blue-200 text-blue-900' },
    { code: 'L', name: 'Liberalerna', color: 'bg-cyan-100 text-cyan-800' },
    { code: 'MP', name: 'Miljöpartiet', color: 'bg-green-200 text-green-900' }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedParty) {
      setError('Ange ett sökord eller välj ett parti');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params: AnforandeParams = {
        sort: 'datum_desc',
        p: 1 // Only get first page for UI responsiveness
      };

      if (searchTerm.trim()) {
        params.sok = searchTerm.trim();
      }

      if (selectedParty) {
        params.parti = selectedParty;
      }

      console.log('Searching with params:', params);
      const searchResults = await sokAnforanden(params);
      
      // Limit to 20 results for better UX
      setResults(searchResults.slice(0, 20));
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Ett fel uppstod vid sökningen. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedParty('');
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Search className="w-5 h-5" />
            Sök anföranden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                placeholder="Sök efter ämne, nyckelord eller talare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Party Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <Filter className="w-4 h-4" />
              Filtrera efter parti:
            </div>
            <div className="flex flex-wrap gap-2">
              {parties.map((party) => (
                <Badge
                  key={party.code}
                  variant={selectedParty === party.code ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedParty === party.code 
                      ? party.color 
                      : 'hover:bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => setSelectedParty(selectedParty === party.code ? '' : party.code)}
                >
                  {party.code}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedParty) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Rensa filter
            </Button>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600">Söker anföranden...</span>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && !error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <p className="text-yellow-800">Inga anföranden hittades för din sökning.</p>
            <p className="text-yellow-600 text-sm mt-1">Prova andra sökord eller filter.</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-blue-900">
              Sökresultat ({results.length} anföranden)
            </h3>
            {results.length === 20 && (
              <p className="text-sm text-blue-600">Visar de 20 senaste resultaten</p>
            )}
          </div>
          
          <div className="grid gap-4">
            {results.map((anforande) => (
              <AnforandeCard
                key={anforande.anforande_id}
                anforande={anforande}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnforandeSearch;
