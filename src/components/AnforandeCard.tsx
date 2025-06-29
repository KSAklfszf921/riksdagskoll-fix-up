
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { Anforande } from '@/utils/riksdagApi';

interface AnforandeCardProps {
  anforande: Anforande;
  showFullText?: boolean;
}

const AnforandeCard: React.FC<AnforandeCardProps> = ({ anforande, showFullText = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPartyColor = (parti: string) => {
    const partiColors: { [key: string]: string } = {
      'S': 'bg-red-100 text-red-800',
      'M': 'bg-blue-100 text-blue-800',
      'SD': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-green-100 text-green-800',
      'V': 'bg-red-200 text-red-900',
      'KD': 'bg-blue-200 text-blue-900',
      'L': 'bg-cyan-100 text-cyan-800',
      'MP': 'bg-green-200 text-green-900'
    };
    return partiColors[parti] || 'bg-gray-100 text-gray-800';
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="border-blue-100 hover:shadow-lg transition-all hover:border-blue-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-blue-900 leading-tight line-clamp-2">
              {anforande.rubrik}
            </CardTitle>
            <CardDescription className="text-blue-600 mt-1">
              {anforande.dok_titel}
            </CardDescription>
          </div>
          <Badge className={getPartyColor(anforande.parti)}>
            {anforande.parti}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-blue-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{anforande.talare}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(anforande.dok_datum)}</span>
          </div>
        </div>

        {anforande.anforandetyp && (
          <Badge variant="outline" className="text-xs">
            {anforande.anforandetyp}
          </Badge>
        )}

        <div className="text-gray-700 leading-relaxed">
          {showFullText ? (
            <div className="whitespace-pre-wrap">{anforande.anforande}</div>
          ) : (
            <p>{truncateText(anforande.anforande)}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-blue-500">
            Anförande #{anforande.nummer}
          </div>
          
          <div className="flex gap-2">
            {anforande.protokoll_url_xml && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(anforande.protokoll_url_xml, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Protokoll
              </Button>
            )}
            {anforande.relaterat_dokument_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(anforande.relaterat_dokument_url, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Dokument
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnforandeCard;
