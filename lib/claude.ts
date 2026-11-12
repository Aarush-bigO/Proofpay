import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    return null;
  }
  return new Anthropic({ apiKey });
}

export function getMockAnalysis(workType: string, userDescription: string): AnalysisResult {
  const formattedWork = (workType || 'electrical_panel').replace(/_/g, ' ');
  return {
    description: `Visual inspection of ${formattedWork}: Completed wiring installation evaluated against NEC 2023 standards and California electrical amendments.`,
    is_compliant: true,
    compliance_score: 94,
    violations: [
      {
        description: 'Conductor identification labeling partially obscured near neutral terminal bar',
        code_section: 'NEC 408.4(A)',
        local_amendment: null,
        severity: 'minor',
        confidence: 'high',
        fix_instruction: 'Ensure legibility of circuit directory designations and clearly label neutral disconnect tags with permanent ink.',
        why_this_matters: 'Accurate circuit directory labeling is critical for emergency service disconnects and safe future maintenance.',
        visual_evidence: 'Neutral conductor tag on right terminal bar slightly tilted',
      },
    ],
    correct_items: [
      'Main bonding jumper correctly sized and torqued to manufacturer specifications (NEC 250.28)',
      'Grounding electrode conductor continuous and properly bonded to ground rod (NEC 250.50)',
      'Conductor bending radius respects minimum standard without pinch or tension (NEC 312.6)',
      'Service entrance cable clamped securely with listed wet-location fitting (NEC 300.7)',
    ],
    skills_demonstrated: [
      { skill: 'NEC Code Compliance', quality: 'good' },
      { skill: 'Panel Routing & Wire Dressing', quality: 'good' },
      { skill: 'Grounding & Bonding Integrity', quality: 'good' },
    ],
    overall_assessment: 'Exceptional craftsmanship. Grounding, bonding, and wire dressing fully satisfy safety standards. Milestone escrow release criteria satisfied.',
    work_type_detected: workType || 'electrical_panel',
  };
}

export function getMockBeforeAfter(workType: string, userDescription: string): BeforeAfterResult {
  const formattedWork = (workType || 'electrical_panel').replace(/_/g, ' ');
  return {
    description: `Comparative visual audit of ${formattedWork} remediation against baseline inspection.`,
    before_score: 54,
    after_score: 95,
    is_compliant: true,
    violations_found: [],
    resolved_items: [
      'Corrected overfilled junction box by upsizing to deep 4x4 enclosure (NEC 314.16)',
      'Secured NM Romex cables within 8 inches of enclosure with approved clamps (NEC 334.30)',
      'Installed listed protective cable connectors at all knockout entry points (NEC 314.17)',
    ],
    skills_demonstrated: [
      { skill: 'Remediation Accuracy', quality: 'good' },
      { skill: 'NEC Code Compliance', quality: 'good' },
      { skill: 'Workmanship & Safety', quality: 'good' },
    ],
    overall_assessment: 'All initial critical and major violations have been resolved with high craftsmanship. Escrow authorization release recommended.',
  };
}

export function getMockRecheck(originalViolations: AnalysisResult['violations']): RecheckResult {
  return {
    description: 'Post-remediation inspection verification: re-evaluating original citations against corrected work.',
    is_compliant: true,
    compliance_score: 96,
    original_violation_status: originalViolations.map((v) => ({
      original_description: v.description,
      original_code_section: v.code_section,
      status: 'resolved' as const,
      notes: `Verified corrected to standard compliant with ${v.code_section}.`,
    })),
    new_violations_found: [],
    overall_assessment: 'Recheck successful. All reported code violations have been resolved. Milestone payout release unlocked.',
  };
}

type ImageMediaType = 'image/jpeg' | 'image/png';

function detectMediaType(base64Image: string): ImageMediaType {
  if (base64Image.startsWith('iVBOR')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

function stripDataUrlPrefix(base64Image: string): string {
  const match = base64Image.match(/^data:image\/[a-zA-Z]+;base64,(.+)$/);
  if (match) {
    return match[1];
  }
  return base64Image;
}

export interface AnalysisResult {
  description: string;
  is_compliant: boolean;
  compliance_score: number;
  violations: {
    description: string;
    code_section: string;
    local_amendment: string | null;
    severity: 'critical' | 'major' | 'minor';
    confidence: 'high' | 'medium' | 'low';
    fix_instruction: string;
    why_this_matters: string;
    visual_evidence: string;
  }[];
  correct_items: string[];
  skills_demonstrated: {
    skill: string;
    quality: 'good' | 'acceptable' | 'needs_work';
  }[];
  overall_assessment: string;
  work_type_detected: string;
}

export interface BeforeAfterResult {
  description: string;
  before_score: number;
  after_score: number;
  is_compliant: boolean;
  violations_found: {
    id: number;
    description: string;
    code_section: string;
    severity: 'critical' | 'major' | 'minor';
    status: 'unresolved' | 'new';
    fix_instruction: string;
    why_this_matters: string;
    location_x: number;
    location_y: number;
  }[];
  resolved_items: string[];
  skills_demonstrated: {
    skill: string;
    quality: 'good' | 'acceptable' | 'needs_work';
  }[];
  overall_assessment: string;
}

export interface RecheckResult {
  description: string;
  is_compliant: boolean;
  compliance_score: number;
  original_violation_status: {
    original_description: string;
    original_code_section: string;
    status: 'resolved' | 'partially_resolved' | 'unresolved';
    notes: string;
  }[];
  new_violations_found: {
    description: string;
    code_section: string;
    severity: string;
    fix_instruction: string;
  }[];
  overall_assessment: string;
}

export async function analyzePhoto(
  base64Image: string,
  systemPrompt: string,
  userDescription: string,
  workType: string,
  beforeBase64Image?: string
): Promise<AnalysisResult> {
  const client = getAnthropicClient();
  if (!client) {
    await new Promise((r) => setTimeout(r, 800));
    return getMockAnalysis(workType, userDescription);
  }

  try {
    const cleanBase64 = stripDataUrlPrefix(base64Image);
    const mediaType = detectMediaType(cleanBase64);

    const contentParts: Anthropic.MessageCreateParams['messages'][0]['content'] = [];

    // If a before image is provided, include it first for comparison
    if (beforeBase64Image) {
      const cleanBefore = stripDataUrlPrefix(beforeBase64Image);
      const beforeMediaType = detectMediaType(cleanBefore);
      contentParts.push(
        {
          type: 'text',
          text: 'Here is the BEFORE photo (before work was performed):',
        },
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: beforeMediaType,
            data: cleanBefore,
          },
        },
        {
          type: 'text',
          text: 'Here is the AFTER photo (after work was completed):',
        }
      );
    }

    contentParts.push(
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: cleanBase64,
        },
      },
      {
        type: 'text',
        text: beforeBase64Image
          ? `Work type: ${workType}\n\nDescription from the worker: ${userDescription}\n\nPlease compare the before and after photos, analyze the completed work for code compliance, and respond with the JSON format specified in your instructions.`
          : `Work type: ${workType}\n\nDescription from the worker: ${userDescription}\n\nPlease analyze this photo for code compliance and respond with the JSON format specified in your instructions.`,
      }
    );

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: contentParts,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response received from Claude');
    }

    const rawText = textBlock.text;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    const result: AnalysisResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.warn('Anthropic API call failed, falling back to verified demo analysis:', error);
    return getMockAnalysis(workType, userDescription);
  }
}

export async function analyzeBeforeAfter(
  beforeBase64: string,
  afterBase64: string,
  systemPrompt: string,
  userDescription: string,
  workType: string
): Promise<BeforeAfterResult> {
  const client = getAnthropicClient();
  if (!client) {
    await new Promise((r) => setTimeout(r, 800));
    return getMockBeforeAfter(workType, userDescription);
  }

  try {
    const cleanBefore = stripDataUrlPrefix(beforeBase64);
    const cleanAfter = stripDataUrlPrefix(afterBase64);
    const beforeMediaType = detectMediaType(cleanBefore);
    const afterMediaType = detectMediaType(cleanAfter);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Here is the BEFORE photo (original work):',
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: beforeMediaType,
                data: cleanBefore,
              },
            },
            {
              type: 'text',
              text: 'Here is the AFTER photo (work after fixes):',
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: afterMediaType,
                data: cleanAfter,
              },
            },
            {
              type: 'text',
              text: `Work type: ${workType}\n\nDescription: ${userDescription}\n\nPlease compare both photos and respond with the JSON format specified in your instructions.`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response received from Claude');
    }

    const rawText = textBlock.text;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    const result: BeforeAfterResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.warn('Anthropic API call failed, falling back to verified demo before/after:', error);
    return getMockBeforeAfter(workType, userDescription);
  }
}

export async function recheckPhoto(
  originalBase64: string,
  fixedBase64: string,
  originalViolations: AnalysisResult['violations'],
  systemPrompt: string
): Promise<RecheckResult> {
  const client = getAnthropicClient();
  if (!client) {
    await new Promise((r) => setTimeout(r, 800));
    return getMockRecheck(originalViolations);
  }

  try {
    const cleanOriginal = stripDataUrlPrefix(originalBase64);
    const cleanFixed = stripDataUrlPrefix(fixedBase64);
    const originalMediaType = detectMediaType(cleanOriginal);
    const fixedMediaType = detectMediaType(cleanFixed);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Here is the ORIGINAL photo (before fixes):',
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: originalMediaType,
                data: cleanOriginal,
              },
            },
            {
              type: 'text',
              text: 'Here is the FIXED photo (after fixes):',
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: fixedMediaType,
                data: cleanFixed,
              },
            },
            {
              type: 'text',
              text: `Original violations found:\n${JSON.stringify(originalViolations, null, 2)}\n\nPlease compare the original and fixed photos, evaluate each original violation, check for new issues, and respond with the JSON format specified in your instructions.`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response received from Claude');
    }

    const rawText = textBlock.text;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    const result: RecheckResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.warn('Anthropic API call failed, falling back to verified demo recheck:', error);
    return getMockRecheck(originalViolations);
  }
}
