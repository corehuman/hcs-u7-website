'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Brain, Lock, Zap, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function TechnicalSection() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const codeExamples = {
    cryptographic: `// HCS-U7 Code Structure
const profile = {
  code: "HCS-U7|V:7.0|ALG:QS|E:E|MOD:c50f0m50|...",
  QSIG: "00019s4egk",  // Question Signature
  B3: "01oy6we0"       // Blake3 hash
};

// Verification
function verifyProfile(profileCode) {
  const parsed = parseHCS(profileCode);
  const computedQSIG = hashResponses(parsed.responses);
  const computedB3 = blake3(parsed.profile);
  
  return (
    computedQSIG === parsed.QSIG &&
    computedB3 === parsed.B3
  );
}`,

    behavioral: `function detectBot(testResults) {
  const metrics = {
    rtVariability: calculateSD(testResults.reactionTimes),
    stroopEffect: testResults.avgIncongruent - testResults.avgCongruent,
    learningSlope: calculateTrendline(testResults.accuracy),
    errorPattern: analyzeErrorDistribution(testResults.errors)
  };
  
  // Human signatures
  const isHuman = (
    metrics.rtVariability > 40 &&     // Humans vary
    metrics.rtVariability < 120 &&    // But not randomly
    metrics.stroopEffect > 30 &&      // Show interference
    metrics.learningSlope > 0.01 &&   // Improve over time
    metrics.errorPattern.clustered    // Errors from fatigue
  );
  
  return !isHuman; // Return true if bot detected
}`,

    integration: `import { HCSAuth } from '@hcs-u7/auth';

// Initialize
const auth = new HCSAuth({
  apiKey: process.env.HCS_API_KEY,
  threshold: 0.85  // 85% similarity required
});

// Enrollment (first time)
async function enrollUser(userId) {
  const session = await auth.enroll(userId);
  // User completes cognitive tests
  return session.signature;
}

// Verification (subsequent logins)
async function verifyUser(userId) {
  const result = await auth.verify(userId);
  
  if (result.verified) {
    return { success: true, token: generateJWT(userId) };
  }
  return { success: false, reason: 'Cognitive mismatch' };
}`,
    widget: `<!-- 1. Include the SDK -->
<script src="https://cdn.hcs-u7.com/v1.js"></script>

<!-- 2. CAPTCHA container -->
<div id="hcs-captcha"></div>

<!-- 3. Initialization -->
<script>
  HCSCaptcha.render('#hcs-captcha', {
    siteKey: 'YOUR_SITE_KEY_HERE',
    onVerify: function(token) {
      // Send token to your backend
      console.log('Human verified:', token);
      const hiddenInput = document.getElementById('hcs-token');
      if (hiddenInput) hiddenInput.value = token;
    },
    onError: function(error) {
      console.error('Verification failed:', error);
    }
  });
</script>`,
    backend: `// Example: Node.js / Express endpoint
import fetch from 'node-fetch';

app.post('/api/verify-human', async (req, res) => {
  const { hcsToken } = req.body;

  try {
    const response = await fetch('https://api.hcs-u7.com/v1/verify', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_SECRET_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: hcsToken,
        userIP: req.ip
      })
    });

    const result = await response.json();

    if (result.isHuman && result.confidence > 0.95) {
      // Human verified → continue your business logic
      return res.json({ success: true });
    }

    return res.status(403).json({ error: 'Bot detected', details: result });
  } catch (err) {
    console.error('HCS-U7 verification error', err);
    return res.status(500).json({ error: 'Verification service unavailable' });
  }
});`
  };

  const humanVsBotMetrics = [
    {
      metric: isFr ? 'Variabilité TR' : 'RT Variability',
      human: '50-100ms SD',
      bot: '<10ms or erratic',
      detection: isFr ? 'Facile' : 'Easy'
    },
    {
      metric: isFr ? 'Effet Stroop' : 'Stroop Effect',
      human: '50-150ms',
      bot: '0ms or excessive',
      detection: isFr ? 'Facile' : 'Easy'
    },
    {
      metric: isFr ? 'Courbe d\'apprentissage' : 'Learning Curve',
      human: isFr ? 'Amélioration graduelle' : 'Gradual improvement',
      bot: isFr ? 'Plate ou aléatoire' : 'Flat or random',
      detection: isFr ? 'Facile' : 'Easy'
    },
    {
      metric: isFr ? 'Modèles d\'erreur' : 'Error Patterns',
      human: isFr ? 'Corrélé à la fatigue' : 'Fatigue-correlated',
      bot: isFr ? 'Distribution aléatoire' : 'Random distribution',
      detection: isFr ? 'Moyen' : 'Medium'
    },
    {
      metric: isFr ? 'Cohérence temporelle' : 'Timing Consistency',
      human: isFr ? 'Variation naturelle' : 'Natural variation',
      bot: isFr ? 'Trop cohérent' : 'Too consistent',
      detection: isFr ? 'Facile' : 'Easy'
    }
  ];

  return (
    <section className="py-20 section-base">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4" variant="outline">
              <Code className="h-3 w-3 mr-2" />
              {isFr ? 'Plongée Technique' : 'Technical Deep Dive'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isFr ? 'Comment Fonctionne la Sécurité Cognitive' : 'How Cognitive Security Works'}
            </h2>
            <p className="text-lg text-foreground/85 max-w-3xl mx-auto">
              {isFr
                ? 'Trois couches de sécurité : signatures cryptographiques post-quantiques, modèles comportementaux humains et protocoles d\'intégration'
                : 'Three security layers: post-quantum cryptographic signatures, human behavioral patterns, and integration protocols'}
            </p>
          </motion.div>
        </div>

        <Card className="card-base mb-12">
          <CardContent className="p-8">
            <Tabs defaultValue="cryptographic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="cryptographic" className="gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {isFr ? 'Cryptographique' : 'Cryptographic'}
                  </span>
                  <span className="md:hidden">Crypto</span>
                </TabsTrigger>
                <TabsTrigger value="behavioral" className="gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {isFr ? 'Comportemental' : 'Behavioral'}
                  </span>
                  <span className="md:hidden">{isFr ? 'Modèles' : 'Patterns'}</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {isFr ? 'Intégration' : 'Integration'}
                  </span>
                  <span className="md:hidden">API</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Cryptographic Signatures */}
              <TabsContent value="cryptographic" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {isFr ? 'Signatures Cryptographiques' : 'Cryptographic Signatures'}
                  </h3>
                  
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {isFr
                        ? 'Chaque profil HCS-U7 comprend deux signatures cryptographiques qui rendent impossible la falsification sans les résultats originaux des tests cognitifs.'
                        : 'Every HCS-U7 profile includes two cryptographic signatures that make it impossible to forge without the original cognitive test results.'}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{codeExamples.cryptographic}</pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-primary/5">
                      <Check className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold text-sm mb-1">
                        {isFr ? 'Intégrité' : 'Integrity'}
                      </h4>
                      <p className="text-xs text-foreground/85">
                        {isFr
                          ? 'Toute modification invalide les signatures'
                          : 'Any modification invalidates the signatures'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5">
                      <Check className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold text-sm mb-1">
                        {isFr ? 'Non-répudiation' : 'Non-repudiation'}
                      </h4>
                      <p className="text-xs text-foreground/85">
                        {isFr
                          ? 'Traçable à une session spécifique'
                          : 'Traceable to specific test session'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5">
                      <Check className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold text-sm mb-1">
                        {isFr ? 'Résistance aux collisions' : 'Collision resistance'}
                      </h4>
                      <p className="text-xs text-foreground/85">
                        {isFr
                          ? 'Blake3 offre 128 bits de sécurité'
                          : 'Blake3 provides 128-bit security'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-foreground/85 space-y-2">
                    <p>
                      {isFr
                        ? 'La couche cryptographique combine une signature post-quantique (QSIG, inspirée des schémas lattice du NIST) et un hash BLAKE3 classique. Un attaquant doit casser simultanément les deux, ce qui rend les attaques même assistées par un ordinateur quantique économiquement irréalistes.'
                        : 'The cryptographic layer combines a post-quantum signature (QSIG, inspired by NIST lattice schemes) with a classical BLAKE3 hash. An attacker must break both at the same time, making attacks economically unrealistic even with quantum assistance.'}
                    </p>
                    <p>
                      {isFr
                        ? 'De plus, le profil cognitif brut est compressé avec perte en une signature d’environ 96 bits d’entropie : même si un hash était inversé, les données de tests originales ne pourraient pas être reconstruites exactement.'
                        : 'In addition, the raw cognitive profile is compressed with controlled loss into a signature of about 96 bits of entropy: even if a hash were inverted, the original test data cannot be reconstructed exactly.'}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: Behavioral Patterns */}
              <TabsContent value="behavioral" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {isFr ? 'Détection de Modèles Comportementaux' : 'Behavioral Pattern Detection'}
                  </h3>
                  
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {isFr
                        ? 'Les tests cognitifs mesurent des modèles uniques aux humains et presque impossibles à répliquer avec précision pour l\'IA ou l\'automatisation.'
                        : 'Cognitive tests measure patterns that are unique to humans and nearly impossible for AI or automation to replicate accurately.'}
                    </AlertDescription>
                  </Alert>

                  <p className="text-sm text-foreground/85 mb-4">
                    {isFr
                      ? 'Cette couche s’appuie explicitement sur l’entropie biologique : bruit neuronal (5–15 ms), variabilité musculaire et fluctuations d’attention. Ces micro-variations sont non déterministes et ne peuvent pas être pré-calculées, même par un modèle d’IA ou un ordinateur quantique.'
                      : 'This layer explicitly leverages biological entropy: neural noise (5–15 ms), motor variability and attention fluctuations. These micro-variations are non-deterministic and cannot be pre-computed, even by an AI model or a quantum computer.'}
                  </p>

                  {/* Human vs Bot Table */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">
                      {isFr ? 'Signatures Humain vs Bot' : 'Human vs Bot Signatures'}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border rounded-lg">
                        <thead className="bg-muted/50">
                          <tr className="text-sm">
                            <th className="p-2 text-left">{isFr ? 'Métrique' : 'Metric'}</th>
                            <th className="p-2 text-left">{isFr ? 'Modèle Humain' : 'Human Pattern'}</th>
                            <th className="p-2 text-left">{isFr ? 'Modèle Bot/IA' : 'Bot/AI Pattern'}</th>
                            <th className="p-2 text-left">{isFr ? 'Détection' : 'Detection'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {humanVsBotMetrics.map((row, idx) => (
                            <tr key={idx} className="border-t text-sm">
                              <td className="p-2">{row.metric}</td>
                              <td className="p-2">
                                <span className="inline-flex px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                                  {row.human}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="inline-flex px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                                  {row.bot}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="text-green-900 dark:text-green-100">✅ {row.detection}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{codeExamples.behavioral}</pre>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/25 border border-green-200 dark:border-green-800/50">
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">99.2%</div>
                      <div className="text-xs text-green-800 dark:text-green-200">
                        {isFr ? 'Détection humaine' : 'Human detection'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/25 border border-blue-200 dark:border-blue-800/50">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">98.7%</div>
                      <div className="text-xs text-blue-800 dark:text-blue-200">
                        {isFr ? 'Détection de bot' : 'Bot detection'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/25 border border-purple-200 dark:border-purple-800/50">
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">&lt;0.1%</div>
                      <div className="text-xs text-purple-800 dark:text-purple-200">
                        {isFr ? 'Faux positifs' : 'False positive rate'}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: Integration */}
              <TabsContent value="integration" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {isFr ? 'Exemples d\'Intégration' : 'Integration Examples'}
                  </h3>
                  
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {isFr
                        ? 'APIs et SDKs simples pour une intégration rapide dans votre flux d\'authentification existant'
                        : 'Simple APIs and SDKs for quick integration into your existing authentication flow'}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">
                        {isFr ? 'Widget JavaScript (Frontend)' : 'JavaScript Widget (Frontend)'}
                      </h4>
                      <p className="mb-2 text-xs text-foreground/85">
                        {isFr
                          ? 'Ajoutez un widget HCS-U7 à n\'importe quel formulaire comme CAPTCHA cognitif résistant aux bots.'
                          : 'Add an HCS-U7 widget to any form as an AI-resistant cognitive CAPTCHA.'}
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                        <pre>{codeExamples.widget}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">
                        {isFr ? 'Endpoint de validation (Backend Node.js)' : 'Validation endpoint (Node.js backend)'}
                      </h4>
                      <p className="mb-2 text-xs text-foreground/85">
                        {isFr
                          ? 'Côté serveur, validez le token HCS-U7 avant d\'accepter une action sensible (création de compte, paiement, changement de mot de passe, etc.).'
                          : 'On the server, validate the HCS-U7 token before accepting any sensitive action (account creation, payment, password change, etc.).'}
                      </p>
                      <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                        <pre>{codeExamples.backend}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">JavaScript/TypeScript SDK</h4>
                      <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{codeExamples.integration}</pre>
                      </div>
                    </div>

                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base">{isFr ? 'Démarrage Rapide' : 'Quick Start'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            {isFr ? 'Obtenez une clé API gratuite sur' : 'Get free API key at'} <code className="text-xs bg-muted px-1 rounded">/developers/api-key</code>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            {isFr ? 'Installez le SDK :' : 'Install SDK:'} <code className="text-xs bg-muted px-1 rounded">npm install @hcs-u7/auth</code>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            {isFr ? 'Ajoutez 5 lignes de code (voir exemples ci-dessus)' : 'Add 5 lines of code (see examples above)'}
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold">4.</span>
                            {isFr
                              ? 'Déployez et testez (1 000 vérifications gratuites/mois)'
                              : 'Deploy and test (1,000 free verifications/month)'}
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Badge component (if not imported from ui)
function Badge({ children, className = "", variant = "default" }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variant === 'outline' ? 'border' : 'bg-primary/10'} ${className}`}>
      {children}
    </span>
  );
}
