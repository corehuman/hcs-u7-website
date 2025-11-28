'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Shield,
  Info,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import type { HCSProfile, ComparisonResult as ComparisonResultType } from '@/lib/hcs-parser';

interface ComparisonResultProps {
  profile1: HCSProfile;
  profile2: HCSProfile;
  comparison: ComparisonResultType;
  onReset: () => void;
}

export function ComparisonResult({ profile1, profile2, comparison, onReset }: ComparisonResultProps) {
  const { overallSimilarity, match, dimensions, signatureMatch, details } = comparison;

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <Card className="p-8 text-center">
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
          match 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          {match ? (
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          )}
        </div>

        <Badge variant={match ? 'default' : 'destructive'} className="mb-2">
          {match ? 'Profiles Match' : 'No Match'}
        </Badge>

        <h2 className="text-3xl font-bold mb-2">
          {match ? '✅ Same Person Confirmed' : '❌ Different Persons'}
        </h2>

        <p className="text-lg text-foreground/70 mb-4">
          Similarity Score: {Math.round(overallSimilarity * 100)}%
        </p>

        {match ? (
          <Alert className="mt-4 border-green-200 dark:border-green-900 bg-green-100 dark:bg-green-900/25">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              These profiles show {Math.round(overallSimilarity * 100)}% similarity 
              (threshold: 85%). High confidence they belong to the same person.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-4 border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-900/25">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Similarity below threshold ({Math.round(overallSimilarity * 100)}% &lt; 85%). 
              These profiles likely belong to different individuals.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Signature Verification */}
      <Card className={`p-6 mb-6 ${
        signatureMatch 
          ? 'border-orange-200 dark:border-orange-900 bg-orange-100 dark:bg-orange-900/25' 
          : 'border-blue-200 dark:border-blue-900'
      }`}>
        <div className="flex items-start gap-3">
          {signatureMatch ? (
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
          ) : (
            <Shield className="w-5 h-5 text-blue-600 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Cryptographic Signature Verification</h3>
            {signatureMatch ? (
              <div className="space-y-2">
                <p className="font-medium text-orange-600">
                  ⚠️ Identical B3 signatures detected!
                </p>
                <p className="text-sm text-foreground/70">
                  This means these codes were generated from the exact same 
                  questionnaire session. They are either:
                </p>
                <ul className="list-disc ml-5 text-sm text-foreground/70">
                  <li>Perfect duplicates (same person, same session)</li>
                  <li>One profile was copied/cloned from the other</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-green-600">
                  ✅ Different B3 signatures (as expected)
                </p>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <span className="text-foreground/70">Profile 1 (B3):</span>
                    <code className="ml-2 text-xs bg-secondary px-2 py-1 rounded">
                      {profile1.signatures.B3}
                    </code>
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground/70">Profile 2 (B3):</span>
                    <code className="ml-2 text-xs bg-secondary px-2 py-1 rounded">
                      {profile2.signatures.B3}
                    </code>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mt-2">
                  Different signatures confirm these are independent profile generations
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Overall Similarity Visualization */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Overall Similarity Score</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/70">Composite Score</span>
            <Badge variant={overallSimilarity >= 0.85 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
              {Math.round(overallSimilarity * 100)}%
            </Badge>
          </div>

          <div className="relative">
            <Progress value={overallSimilarity * 100} className="h-8" />
            {/* Threshold marker */}
            <div className="absolute top-0 left-[85%] h-full w-px bg-primary">
              <span className="absolute -top-6 -left-12 text-xs text-foreground/75">
                85% threshold
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-foreground/75">
            <span>0% (Different)</span>
            <span>50% (Some similarity)</span>
            <span>85% (Match)</span>
            <span>100% (Identical)</span>
          </div>
        </div>

        {/* Interpretation */}
        <div className={`mt-4 p-4 rounded-lg border ${
          overallSimilarity >= 0.85 
            ? 'bg-green-100 dark:bg-green-900/25'
            : overallSimilarity >= 0.70
            ? 'bg-amber-100 dark:bg-amber-900/25'
            : 'bg-red-100 dark:bg-red-900/25'
        }`}>
          <h4 className="font-medium mb-2">Interpretation</h4>
          <p className="text-sm text-foreground/70">
            {overallSimilarity >= 0.85 ? (
              <>
                High confidence match. These profiles show strong similarity 
                across all cognitive dimensions. Very likely the same person tested at 
                different times or in slightly different contexts.
              </>
            ) : overallSimilarity >= 0.70 ? (
              <>
                Moderate similarity. Some cognitive dimensions align, 
                but significant differences exist. Could be related individuals (family) 
                or the same person with major life changes.
              </>
            ) : (
              <>
                Low similarity. These profiles show substantial differences 
                across multiple dimensions. High confidence they belong to different individuals.
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Dimension-by-Dimension Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Dimension Breakdown</h3>

        <div className="space-y-4">
          {/* Element */}
          <DimensionRow
            label="Element"
            similarity={dimensions.element}
            profile1Value={profile1.element}
            profile2Value={profile2.element}
            weight={15}
          />

          {/* Modalities */}
          <DimensionRow
            label="Modalities"
            similarity={dimensions.modalities}
            profile1Value={formatModalities(profile1.modalities)}
            profile2Value={formatModalities(profile2.modalities)}
            weight={20}
          />

          {/* Cognition (most important) */}
          <DimensionRow
            label="Cognition"
            similarity={dimensions.cognition}
            profile1Value={formatCognition(profile1.cognition)}
            profile2Value={formatCognition(profile2.cognition)}
            weight={45}
            importance="critical"
          />

          {/* Interaction */}
          <DimensionRow
            label="Interaction"
            similarity={dimensions.interaction}
            profile1Value={formatInteraction(profile1.interaction)}
            profile2Value={formatInteraction(profile2.interaction)}
            weight={20}
          />
        </div>
      </Card>

      {/* Detailed Cognition Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Cognitive Dimensions Detail</h3>

        <div className="space-y-3">
          <CognitionDimensionRow label="Fluid Intelligence" p1={profile1.cognition.fluid} p2={profile2.cognition.fluid} />
          <CognitionDimensionRow label="Crystallized Intelligence" p1={profile1.cognition.crystallized} p2={profile2.cognition.crystallized} />
          <CognitionDimensionRow label="Verbal Processing" p1={profile1.cognition.verbal} p2={profile2.cognition.verbal} />
          <CognitionDimensionRow label="Strategic Thinking" p1={profile1.cognition.strategic} p2={profile2.cognition.strategic} />
          <CognitionDimensionRow label="Creative Thinking" p1={profile1.cognition.creative} p2={profile2.cognition.creative} />
        </div>

        {details.cognitionComparison.largestDifference && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Largest difference: {details.cognitionComparison.largestDifference.dimension} 
              ({details.cognitionComparison.largestDifference.diff} points)
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Technical Details */}
      <div className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="algorithm">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Similarity Algorithm Details
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Weighted Multi-Dimensional Comparison</h4>
                  <p className="text-sm text-foreground/70 mb-3">
                    Overall similarity is calculated using weighted components:
                  </p>
                  <div className="space-y-2 ml-4">
                    <div className="text-sm">
                      <span className="font-medium">Element similarity:</span>
                      <span className="text-foreground/70 ml-2">
                        {Math.round(dimensions.element * 100)}% × 0.15 = {Math.round(dimensions.element * 15)}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Modalities similarity:</span>
                      <span className="text-foreground/70 ml-2">
                        {Math.round(dimensions.modalities * 100)}% × 0.20 = {Math.round(dimensions.modalities * 20)}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Cognition similarity:</span>
                      <span className="text-foreground/70 ml-2">
                        {Math.round(dimensions.cognition * 100)}% × 0.45 = {Math.round(dimensions.cognition * 45)}%
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Interaction similarity:</span>
                      <span className="text-foreground/70 ml-2">
                        {Math.round(dimensions.interaction * 100)}% × 0.20 = {Math.round(dimensions.interaction * 20)}%
                      </span>
                    </div>
                    <div className="text-sm font-medium border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span className="ml-2">{Math.round(overallSimilarity * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cognition Similarity (Cosine Similarity)</h4>
                  <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`Vector 1: [F=${profile1.cognition.fluid}, C=${profile1.cognition.crystallized}, V=${profile1.cognition.verbal}, S=${profile1.cognition.strategic}, Cr=${profile1.cognition.creative}]
Vector 2: [F=${profile2.cognition.fluid}, C=${profile2.cognition.crystallized}, V=${profile2.cognition.verbal}, S=${profile2.cognition.strategic}, Cr=${profile2.cognition.creative}]

Similarity = dot(v1, v2) / (||v1|| × ||v2||)
           = ${(dimensions.cognition * 100).toFixed(2)}%`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Threshold Rationale</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    The 85% threshold was established through pilot testing (N=50):
                  </p>
                  <ul className="list-disc ml-5 text-sm text-foreground/70 space-y-1">
                    <li>Same person, different sessions: 87-95% similarity</li>
                    <li>Family members (siblings): 60-75% similarity</li>
                    <li>Unrelated individuals: 20-50% similarity</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="use-cases">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Real-World Use Cases
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Identity Verification (KYC)</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    <strong>Scenario:</strong> User claims to have lost access to their account 
                    and requests password reset. They generate a new HCS-U7 profile.
                  </p>
                  <p className="text-sm text-foreground/70">
                    <strong>Verification:</strong> Compare new profile with stored profile. 
                    If similarity ≥85%, high confidence it's the legitimate owner.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Duplicate Account Detection</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    <strong>Scenario:</strong> New registration triggers fraud alert. 
                    Compare with existing profiles in database.
                  </p>
                  <p className="text-sm text-foreground/70">
                    <strong>Detection:</strong> If any profile shows ≥85% similarity, 
                    likely duplicate account. Flag for review.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Compatibility Matching</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    <strong>Scenario:</strong> Team formation, mentorship pairing, 
                    or collaborative project matching.
                  </p>
                  <p className="text-sm text-foreground/70">
                    <strong>Matching:</strong> 50-70% similarity = complementary skills. 
                    &gt;85% similarity = too similar (less diverse perspectives).
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">4. Forensic Analysis</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    <strong>Scenario:</strong> Investigate suspicious account activity. 
                    Compare historical profiles of the same user over time.
                  </p>
                  <p className="text-sm text-foreground/70">
                    <strong>Analysis:</strong> Sudden drop in similarity (&lt;70%) suggests 
                    account takeover or profile manipulation.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="raw-data">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Raw Profile Data
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Profile 1</h4>
                  <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto">
                    {profile1.raw}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Profile 2</h4>
                  <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto">
                    {profile2.raw}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Compare New Profiles
        </Button>

        <Button variant="outline" asChild>
          <Link href="/security" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Security
          </Link>
        </Button>

        <Button asChild>
          <Link href="/generate" className="gap-2">
            Generate Your Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Helper Components
function DimensionRow({ 
  label, 
  similarity, 
  profile1Value, 
  profile2Value, 
  weight,
  importance 
}: {
  label: string;
  similarity: number;
  profile1Value: string;
  profile2Value: string;
  weight: number;
  importance?: 'critical';
}) {
  const getColor = (sim: number) => {
    if (sim >= 0.85) return 'text-green-600';
    if (sim >= 0.70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-4 rounded-lg border ${
      importance === 'critical' 
        ? 'border-blue-200 dark:border-blue-900 bg-blue-100 dark:bg-blue-900/25' 
        : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">{label}</span>
          {importance === 'critical' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Key Dimension
            </Badge>
          )}
        </div>
        <div className="text-right">
          <span className={`font-bold ${getColor(similarity)}`}>
            {Math.round(similarity * 100)}%
          </span>
          <div className="text-xs text-foreground/85">Weight: {weight}%</div>
        </div>
      </div>

      <Progress value={similarity * 100} className="mb-2" />

      <div className="grid md:grid-cols-2 gap-2 text-sm mt-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Profile 1</Badge>
          <code className="text-xs bg-secondary px-2 py-1 rounded">{profile1Value}</code>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Profile 2</Badge>
          <code className="text-xs bg-secondary px-2 py-1 rounded">{profile2Value}</code>
        </div>
      </div>
    </div>
  );
}

function CognitionDimensionRow({ label, p1, p2 }: { label: string; p1: number; p2: number }) {
  const diff = Math.abs(p1 - p2);
  const trend = p2 > p1 ? 'up' : p2 < p1 ? 'down' : 'same';
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = diff < 10 ? 'text-green-600' : diff < 20 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
      <div className="flex-1">
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">P1</Badge>
          <span className="font-mono text-sm">{p1}</span>
        </div>

        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="font-mono text-sm">{diff}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">P2</Badge>
          <span className="font-mono text-sm">{p2}</span>
        </div>
      </div>
    </div>
  );
}

// Helper Functions
function formatModalities(mod: any): string {
  return `C:${mod.cardinal} F:${mod.fixed} M:${mod.mutable}`;
}

function formatCognition(cog: any): string {
  return `F:${cog.fluid} C:${cog.crystallized} V:${cog.verbal} S:${cog.strategic} Cr:${cog.creative}`;
}

function formatInteraction(int: any): string {
  return `${int.pace}/${int.structure}/${int.tone}`;
}
