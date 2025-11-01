import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface UserResponse {
  issueId: string;
  position: number;
  importance: number;
}

interface CandidatePosition {
  issue_id: string;
  position: number;
}

interface Candidate {
  id: string;
  name: string;
  office: string;
  party: string;
  bio: string;
  zip_codes: string[];
}

interface CandidateWithMatch extends Candidate {
  matchScore: number;
  matchPercentage: number;
  agreementDetails: {
    issueId: string;
    userPosition: number;
    candidatePosition: number;
    importance: number;
    difference: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zipCode, responses } = body as { zipCode: string; responses: UserResponse[] };

    if (!zipCode || !responses || responses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch candidates for the given zip code
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .contains('zip_codes', [zipCode]);

    if (candidatesError) {
      return NextResponse.json(
        { success: false, error: candidatesError.message },
        { status: 500 }
      );
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        success: true,
        matches: [],
        message: 'No candidates found for your area',
      });
    }

    // Fetch all candidate positions
    const candidateIds = candidates.map((c: Candidate) => c.id);
    const { data: candidatePositions, error: positionsError } = await supabase
      .from('candidate_positions')
      .select('candidate_id, issue_id, position')
      .in('candidate_id', candidateIds);

    if (positionsError) {
      return NextResponse.json(
        { success: false, error: positionsError.message },
        { status: 500 }
      );
    }

    // Calculate match scores for each candidate
    const candidatesWithMatches: CandidateWithMatch[] = candidates.map((candidate: Candidate) => {
      const candidateIssuePositions = candidatePositions?.filter(
        (cp: { candidate_id: string }) => cp.candidate_id === candidate.id
      ) || [];

      // Create a map of candidate positions by issue
      const positionMap = new Map<string, number>();
      candidateIssuePositions.forEach((cp: CandidatePosition) => {
        positionMap.set(cp.issue_id, cp.position);
      });

      let totalWeightedDistance = 0;
      let totalWeight = 0;
      const agreementDetails: CandidateWithMatch['agreementDetails'] = [];

      // Calculate weighted distance for each issue
      responses.forEach((response) => {
        const candidatePosition = positionMap.get(response.issueId);

        // If candidate has no position on this issue, use neutral (3) as default
        const candidatePos = candidatePosition ?? 3;
        const userPos = response.position;
        const importance = response.importance;

        // Calculate absolute difference (0-4 scale)
        const difference = Math.abs(candidatePos - userPos);

        // Weight the difference by importance
        const weightedDistance = difference * importance;

        totalWeightedDistance += weightedDistance;
        totalWeight += importance;

        agreementDetails.push({
          issueId: response.issueId,
          userPosition: userPos,
          candidatePosition: candidatePos,
          importance: importance,
          difference: difference,
        });
      });

      // Calculate match score (0-100)
      // Maximum possible weighted distance is 4 (max difference) * 5 (max importance) * number of issues
      const maxPossibleDistance = 4 * 5 * responses.length;
      const matchScore = totalWeight > 0
        ? Math.max(0, 100 - (totalWeightedDistance / maxPossibleDistance) * 100)
        : 0;

      return {
        ...candidate,
        matchScore,
        matchPercentage: Math.round(matchScore),
        agreementDetails,
      };
    });

    // Sort by match score (highest first)
    candidatesWithMatches.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      matches: candidatesWithMatches,
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
