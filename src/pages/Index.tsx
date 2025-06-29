
import React from 'react';
import { Search, Bell, Calendar, Users, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const currentIssues = [
    {
      id: 1,
      title: "Budgetproposition 2024",
      description: "Regeringens förslag till statsbudget för 2024",
      status: "Pågående",
      committee: "Finansutskottet",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Klimatlagen - ändringsförslag",
      description: "Förslag om skärpta klimatmål och nya åtgärder",
      status: "Remiss",
      committee: "Miljö och jordbruksutskottet",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "Digitalisering av offentlig sektor",
      description: "Satsning på e-tjänster och digital infrastruktur",
      status: "Beslutad",
      committee: "Näringsutskottet",
      date: "2024-01-10"
    }
  ];

  const recentNews = [
    {
      title: "Ny partiledardebatt planerad för nästa vecka",
      summary: "Fokus kommer ligga på ekonomisk politik och klimatfrågor",
      time: "2 timmar sedan"
    },
    {
      title: "Utskottsmöte om sjukvårdspolitik",
      summary: "Socialutskottet diskuterar vårdköer och personalbrister",
      time: "4 timmar sedan"
    },
    {
      title: "Interpellationsdebatt om bostadspolitik",
      summary: "Opposition ifrågasätter regeringens bostadsstrategi",
      time: "6 timmar sedan"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
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
                <p className="text-sm text-blue-600">Transparens i demokratin</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                Aktuellt
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                Ärenden
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                Ledamöter
              </a>
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                Statistik
              </a>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Bell className="w-4 h-4 mr-2" />
                Prenumerera
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Följ Sveriges riksdag
          </h2>
          <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto">
            Håll dig uppdaterad om politiska beslut, pågående ärenden och riksdagsarbetet. 
            Transparens och demokratisk insyn för alla medborgare.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input 
                  placeholder="Sök efter ärenden, ledamöter eller propositioner..." 
                  className="pl-10 py-3 text-lg border-blue-200 focus:border-blue-400"
                />
              </div>
              <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                Sök
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">349</div>
                <div className="text-sm text-blue-600">Riksdagsledamöter</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">127</div>
                <div className="text-sm text-blue-600">Pågående ärenden</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">43</div>
                <div className="text-sm text-blue-600">Möten denna vecka</div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">89</div>
                <div className="text-sm text-blue-600">Nya beslut</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Issues Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-blue-900">Aktuella ärenden</h3>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Se alla ärenden <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentIssues.map((issue) => (
              <Card key={issue.id} className="border-blue-100 hover:shadow-lg transition-all hover:border-blue-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-blue-900 leading-tight">
                      {issue.title}
                    </CardTitle>
                    <Badge 
                      variant={issue.status === 'Pågående' ? 'default' : issue.status === 'Beslutad' ? 'secondary' : 'outline'}
                      className={issue.status === 'Pågående' ? 'bg-blue-100 text-blue-800' : ''}
                    >
                      {issue.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-600">
                    {issue.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-blue-500">
                    <span>{issue.committee}</span>
                    <span>{issue.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-blue-900 mb-8">Senaste nytt</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {recentNews.map((news, index) => (
                <Card key={index} className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-blue-900 mb-2">{news.title}</h4>
                    <p className="text-blue-600 mb-3">{news.summary}</p>
                    <div className="text-sm text-blue-400">{news.time}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-blue-200 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardContent className="pt-6">
                <h4 className="text-2xl font-bold mb-4">Missa inga viktiga beslut</h4>
                <p className="mb-6 opacity-90">
                  Prenumerera på vårt nyhetsbrev och få de senaste uppdateringarna om 
                  riksdagsarbetet direkt i din inkorg.
                </p>
                <div className="space-y-3">
                  <Input 
                    placeholder="Din e-postadress" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button className="w-full bg-white text-blue-800 hover:bg-blue-50">
                    Prenumerera gratis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Riksdagskoll</span>
              </div>
              <p className="text-blue-200">
                Transparens och demokratisk insyn för alla svenska medborgare.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Navigation</h5>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Aktuellt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ärenden</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ledamöter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statistik</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Information</h5>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Om oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integritetspolicy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API-dokumentation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Följ oss</h5>
              <p className="text-blue-200 mb-4">
                Håll dig uppdaterad via våra sociala medier
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Riksdagskoll. Byggd för transparens och demokrati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
