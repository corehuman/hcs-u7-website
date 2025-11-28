'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Info, Shield, ArrowRight, Copy } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface CodeInputsProps {
  onCompare: (code1: string, code2: string) => void;
}

export function CodeInputs({ onCompare }: CodeInputsProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');

  const exampleCode1 = 'HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f0m50|COG:F34C42V0S17Cr8|INT:PB=F,SM=H,TN=L|QSIG:00019s4egk|B3:01oy6we0';
  const exampleCode2 = 'HCS-U7|V:7.0|ALG:QS|E:E|MOD:c45f5m50|COG:F38C45V5S20Cr12|INT:PB=F,SM=M,TN=L|QSIG:00019s4egl|B3:01oy6we1';

  const loadExamples = () => {
    setCode1(exampleCode1);
    setCode2(exampleCode2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Fingerprint className="w-5 h-5" />
          <Badge variant="outline" className="text-xs">
            {isFr ? 'Outil de Vérification de Profils' : 'Profile Verification Tool'}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {isFr ? 'Comparer les Profils HCS-U7' : 'Compare HCS-U7 Profiles'}
        </h1>

        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          {isFr
            ? 'Vérifiez l’identité, détectez les comptes en double ou mesurez la similarité cognitive entre deux profils'
            : 'Verify identity, detect duplicate accounts, or measure cognitive similarity between two profiles'}
        </p>
      </div>

      {/* Use Cases */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-blue-100 dark:bg-blue-900/25 border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            {isFr ? 'Vérification d’Identité' : 'Identity Verification'}
          </h3>
          <p className="text-sm text-foreground/70">
            {isFr
              ? 'Confirmez que deux profils appartiennent à la même personne (85%+ similarité = correspondance)'
              : 'Confirm two profiles belong to the same person (85%+ similarity = match)'}
          </p>
        </Card>

        <Card className="p-4 bg-purple-100 dark:bg-purple-900/25 border-purple-200 dark:border-purple-900">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <Copy className="w-4 h-4 text-purple-600" />
            {isFr ? 'Détection de Doublons' : 'Duplicate Detection'}
          </h3>
          <p className="text-sm text-foreground/70">
            {isFr
              ? 'Trouvez les comptes en double ou les inscriptions frauduleuses'
              : 'Find duplicate accounts or fraudulent registrations'}
          </p>
        </Card>

        <Card className="p-4 bg-green-100 dark:bg-green-900/25 border-green-200 dark:border-green-900">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <Fingerprint className="w-4 h-4 text-green-600" />
            {isFr ? 'Analyse de Similarité' : 'Similarity Analysis'}
          </h3>
          <p className="text-sm text-foreground/70">
            {isFr
              ? 'Mesurez la compatibilité cognitive entre utilisateurs'
              : 'Measure cognitive compatibility between users'}
          </p>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 dark:border-blue-900 bg-blue-100 dark:bg-blue-900/25">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">{isFr ? 'Comment ça fonctionne :' : 'How it works:'}</span> {isFr
            ? 'Le système analyse les deux codes HCS-U7, extrait les dimensions cognitives et calcule la similarité multidimensionnelle. Seuil : 85%+ = Même personne.'
            : 'The system parses both HCS-U7 codes, extracts cognitive dimensions, and calculates multi-dimensional similarity. Threshold: 85%+ = Same person.'}
        </AlertDescription>
      </Alert>

      {/* Input Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile 1 */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="code1" className="text-lg font-semibold">{isFr ? 'Profil 1' : 'Profile 1'}</Label>
            <Badge className="text-xs">{isFr ? 'Principal' : 'Primary'}</Badge>
          </div>

          <Textarea
            id="code1"
            value={code1}
            onChange={(e) => setCode1(e.target.value)}
            placeholder={isFr ? 'Collez le code HCS-U7 ici...' : 'Paste HCS-U7 code here...'}
            className="font-mono text-xs h-32 mb-3"
          />

          <p className="text-xs text-foreground/85">
            Format: HCS-U7|V:7.0|ALG:QS|E:E|MOD:...|COG:...|INT:...|QSIG:...|B3:...
          </p>
        </Card>

        {/* Profile 2 */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="code2" className="text-lg font-semibold">{isFr ? 'Profil 2' : 'Profile 2'}</Label>
            <Badge variant="secondary" className="text-xs">{isFr ? 'Comparaison' : 'Comparison'}</Badge>
          </div>

          <Textarea
            id="code2"
            value={code2}
            onChange={(e) => setCode2(e.target.value)}
            placeholder={isFr ? 'Collez le code HCS-U7 ici...' : 'Paste HCS-U7 code here...'}
            className="font-mono text-xs h-32 mb-3"
          />

          <p className="text-xs text-foreground/85">
            {isFr ? 'Collez le second profil à comparer avec le principal' : 'Paste second profile to compare against primary'}
          </p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => onCompare(code1, code2)}
          disabled={!code1 || !code2}
          size="lg"
          className="flex-1 sm:flex-initial group"
        >
          <Fingerprint className="mr-2 h-4 w-4" />
          {isFr ? 'Comparer les Profils' : 'Compare Profiles'}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <Button onClick={loadExamples} variant="outline" size="lg">
          <Copy className="mr-2 h-4 w-4" />
          {isFr ? 'Charger les Codes Exemples' : 'Load Example Codes'}
        </Button>
      </div>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{isFr ? 'Processus de Vérification' : 'Verification Process'}</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Analyse des Codes HCS' : 'Parse HCS Codes'}</p>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Extraction de tous les composants : Élément, Modalités, Cognition (5 dimensions), Interaction, Signatures'
                  : 'Extract all components: Element, Modalities, Cognition (5 dimensions), Interaction, Signatures'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Calcul de Similarité' : 'Calculate Similarity'}</p>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Comparaison multidimensionnelle utilisant la similarité cosinus pondérée et la distance euclidienne'
                  : 'Multi-dimensional comparison using weighted cosine similarity and Euclidean distance'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Vérification des Signatures' : 'Verify Signatures'}</p>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Vérification des signatures cryptographiques (QSIG, B3) pour correspondance exacte ou détection de falsification'
                  : 'Check cryptographic signatures (QSIG, B3) for exact match or tampering detection'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Génération du Rapport' : 'Generate Report'}</p>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Score de similarité global (0-100%), analyse dimension par dimension et verdict de correspondance (85%+ = même personne)'
                  : 'Overall similarity score (0-100%), dimension-by-dimension breakdown, and match verdict (85%+ = same person)'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
