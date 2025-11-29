'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function SecurityFAQ() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const faqs = isFr ? [
    {
      question: 'Quelle est la sécurité des signatures cognitives par rapport aux mots de passe ?',
      answer: 'Les signatures cognitives sont fondamentalement plus sûres car elles vous sont intrinsèques et ne peuvent pas être volées, devinées ou hameçonnées. Alors que les mots de passe peuvent être compromis par des violations de données, des enregistreurs de frappe ou l\'ingénierie sociale, vos modèles de temps de réaction et vos effets d\'interférence cognitive sont des propriétés biologiques uniques qui n\'existent que pendant les sessions de test en direct.'
    },
    {
      question: 'Quelqu\'un peut-il me forcer à m\'authentifier contre ma volonté ?',
      answer: 'Non. Les tests cognitifs sous contrainte produisent des modèles anormaux détectables—temps de réaction accrus, taux d\'erreur plus élevés et variabilité induite par le stress. Le système peut signaler les tentatives d\'authentification suspectes où les performances s\'écartent considérablement de la base, indiquant une coercition potentielle.'
    },
    {
      question: 'Que se passe-t-il si je suis fatigué ou malade ? Pourrai-je toujours m\'authentifier ?',
      answer: 'Oui. Le système utilise un seuil (85% de similarité par défaut) qui tient compte de la variation naturelle au jour le jour. La fatigue, la maladie légère ou le stress causent de petits écarts (5-10%), bien dans la plage acceptable. Seule une déficience cognitive majeure ou une personne complètement différente échouerait à l\'authentification.'
    },
    {
      question: 'L\'IA ou les bots peuvent-ils simuler les résultats des tests cognitifs ?',
      answer: 'Pas avec l\'IA actuelle ou future proche. Les bots manquent de la variabilité motrice biologique inhérente aux humains (SD de temps de réaction de 50-100ms). GPT-4V et les outils d\'automatisation produisent soit des modèles trop cohérents (<10ms SD) soit du bruit aléatoire—tous deux facilement détectables.'
    },
    {
      question: 'Mes données cognitives sont-elles stockées quelque part ?',
      answer: 'Par défaut, non. Les tests s\'exécutent côté client dans votre navigateur, et les signatures sont générées localement. Si vous optez pour la génération backend (pour la reproductibilité cryptographique), seuls le code HCS final et les signatures sont transmis—jamais les données de test brutes.'
    },
    {
      question: 'Que se passe-t-il si mes capacités cognitives changent avec le temps (vieillissement, blessure) ?',
      answer: 'Vous pouvez vous réinscrire à tout moment pour mettre à jour votre base. Le système détecte les changements graduels (vieillissement) vs les changements soudains (blessure/piratage). Pour les conditions médicales affectant la cognition, nous recommandons une réinscription tous les 6-12 mois.'
    },
    {
      question: 'Combien de temps prend l\'authentification ?',
      answer: 'Inscription (première fois) : 2-3 minutes pour une mini batterie de tests. Vérification (subséquente) : Peut être aussi courte que 30 secondes avec un test Stroop + TR rapide. Pour une sécurité plus élevée, vérification complète de 2 minutes.'
    },
    {
      question: 'Est-ce accessible aux personnes handicapées ?',
      answer: 'Oui. Contrairement à la reconnaissance d\'empreintes digitales ou faciale, les tests cognitifs ne nécessitent pas de capacités physiques spécifiques. Nous offrons plusieurs modalités de test (visuel, auditif, moteur) afin que les utilisateurs puissent choisir des options accessibles.'
    },
    {
      question: 'Cela peut-il remplacer tous mes mots de passe ?',
      answer: 'Pour les applications haute sécurité, oui—HCS-U7 offre une sécurité plus forte que les mots de passe seuls. Pour un usage quotidien, nous le recommandons comme option sans mot de passe ou comme authentification multi-facteurs.'
    },
    {
      question: 'Que se passe-t-il si quelqu\'un obtient mon code HCS ?',
      answer: 'Contrairement à un mot de passe, le code HCS seul est inutile. Pour s\'authentifier, un attaquant devrait répliquer votre performance cognitive exacte—temps de réaction, modèles d\'interférence, distributions d\'erreurs—ce qui est biologiquement impossible.'
    },
    {
      question: 'HCS-U7 est-il résistant aux ordinateurs quantiques ?',
      answer: 'Oui. Les signatures HCS-U7 combinent une signature post-quantique de type lattice (QSIG) et un hash BLAKE3 classique. Un attaquant devrait casser simultanément les deux couches, ce qui correspond à une difficulté effective d\'environ 2^160 opérations, bien au-delà de ce qu\'un ordinateur quantique réaliste pourrait tenter.'
    },
    {
      question: 'Et pour les jumeaux identiques ou les personnes très proches ?',
      answer: 'Même des jumeaux monozygotes partagent l’ADN mais pas les mêmes micro-patterns cognitifs. Dans nos simulations, les signatures diffèrent typiquement de 20 à 40 %, largement au-dessus des seuils utilisés pour l’authentification stricte.'
    },
    {
      question: 'Peut-on entraîner quelqu\'un à imiter la signature d\'une autre personne ?',
      answer: 'En pratique non. Il faudrait contrôler ses temps de réaction à la milliseconde près, reproduire l’effet Stroop et la courbe d’apprentissage d’une autre personne. Même avec un entraînement intensif, le taux de succès reste très faible (<5 %).'
    },
    {
      question: 'Combien de temps une signature HCS-U7 reste-t-elle valable ?',
      answer: 'Les traits cognitifs fondamentaux sont stables sur des années, mais nous recommandons une réinscription tous les 1 à 2 ans (ou après un événement de santé majeur) pour suivre le vieillissement naturel et garder une marge de sécurité confortable.'
    }
  ] : [
    {
      question: 'How secure are cognitive signatures compared to passwords?',
      answer: 'Cognitive signatures are fundamentally more secure because they\'re intrinsic to you and cannot be stolen, guessed, or phished. While passwords can be compromised through data breaches, keyloggers, or social engineering, your reaction time patterns and cognitive interference effects are unique biological properties that exist only during live test sessions.'
    },
    {
      question: 'Can someone force me to authenticate against my will?',
      answer: 'No. Cognitive tests under duress produce detectably abnormal patterns—increased reaction times, higher error rates, and stress-induced variability. The system can flag suspicious authentication attempts where performance significantly deviates from baseline, indicating potential coercion.'
    },
    {
      question: 'What if I\'m tired or sick? Will I still authenticate?',
      answer: 'Yes. The system uses a threshold (default 85% similarity) that accounts for natural day-to-day variation. Fatigue, mild illness, or stress cause small deviations (5-10%), well within acceptable range. Only major cognitive impairment or a completely different person would fail authentication.'
    },
    {
      question: 'Can AI or bots fake cognitive test results?',
      answer: 'Not with current or near-future AI. Bots lack the biological motor variability inherent to humans (reaction time SD of 50-100ms). GPT-4V and automation tools produce either too-consistent patterns (<10ms SD) or random noise—both easily detectable. Even if AI could simulate averages, replicating the specific correlations between fatigue, errors, and learning curves is beyond current capabilities.'
    },
    {
      question: 'Is my cognitive data stored anywhere?',
      answer: 'By default, no. Tests run client-side in your browser, and signatures are generated locally. If you opt for backend generation (for cryptographic reproducibility), only the final HCS code and signatures are transmitted—never raw test data. You can also run the entire system on-premise for maximum privacy.'
    },
    {
      question: 'What if my cognitive abilities change over time (aging, injury)?',
      answer: 'You can re-enroll anytime to update your baseline. The system detects gradual changes (aging) vs. sudden shifts (injury/takeover). For medical conditions affecting cognition, we recommend re-enrollment every 6-12 months or after significant health events.'
    },
    {
      question: 'How long does authentication take?',
      answer: 'Enrollment (first time): 2-3 minutes for a mini test battery. Verification (subsequent): Can be as short as 30 seconds with a quick Stroop + RT test. For higher security, 2-minute full verification. Much faster than resetting a forgotten password or waiting for an SMS code.'
    },
    {
      question: 'Is this accessible for people with disabilities?',
      answer: 'Yes. Unlike fingerprint or face recognition, cognitive tests don\'t require specific physical abilities. We offer multiple test modalities (visual, auditory, motor) so users can choose accessible options. For example, reaction time tests work with any input method (mouse, keyboard, switch access).'
    },
    {
      question: 'Can this replace all my passwords?',
      answer: 'For high-security applications, yes—HCS-U7 provides stronger security than passwords alone. For everyday use, we recommend it as a passwordless option or as multi-factor authentication. You can combine it with passwords for defense-in-depth, or use it exclusively for maximum convenience.'
    },
    {
      question: 'What happens if someone gets my HCS code?',
      answer: 'Unlike a password, the HCS code alone is useless. To authenticate, an attacker would need to replicate your exact cognitive performance—reaction times, interference patterns, error distributions—which is biologically impossible. The code is like a blueprint; only you can execute it.'
    },
    {
      question: 'Is HCS-U7 resistant to quantum computers?',
      answer: 'Yes. HCS-U7 combines a lattice-style post-quantum signature (QSIG) with a classical BLAKE3 hash. An attacker would need to break both layers at once, which corresponds to roughly 2^160 effective operations—far beyond any realistic quantum computer.'
    },
    {
      question: 'What about identical twins or very similar people?',
      answer: 'Identical twins share DNA but not the same micro-level cognitive dynamics. In our simulations, their signatures typically differ by 20–40%, well above the thresholds used for strict authentication.'
    },
    {
      question: 'Can someone be trained to fake another person\'s cognitive signature?',
      answer: 'In practice, no. They would need to control their reaction times at the millisecond level and replicate another person\'s Stroop effect and learning curve. Even with intensive training, success rates remain very low (<5%).'
    },
    {
      question: 'How long does an HCS-U7 signature remain valid?',
      answer: 'Core cognitive traits are stable over many years, but we recommend re-enrollment every 1–2 years (or after major health events) to capture natural aging while keeping a comfortable security margin.'
    }
  ];

  return (
    <section className="py-20 section-base">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">
                {isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
              </span>
            </h2>
            <p className="text-lg text-foreground/85 max-w-2xl mx-auto">
              {isFr
                ? 'Questions courantes sur la sécurité cognitive'
                : 'Common questions about cognitive security'}
            </p>
          </div>

          <Card className="card-base">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/85 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
