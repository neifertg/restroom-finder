# Vote Smart API Integration Strategy

## Executive Summary

This document outlines the strategy for integrating Project Vote Smart API into VoterEd to replace synthetic candidate position data with real Political Courage Test (PCT) responses and voting records.

## 1. API Overview & Access

### Key Facts
- **API URL**: https://api.votesmart.org/
- **Documentation**: https://api.votesmart.org/docs/
- **Registration**: http://votesmart.org/services_api.php
- **Response Formats**: JSON or XML

### Cost & Licensing
- **Individual Use**: Restricted to Vote Smart members only
- **Business/Organizational Use**: **Subject to fees** (details at votesmart.org/share/api/register)
- **Registration Required**: Must obtain unique API key
- **API Key**: Personal, non-transferable, cannot be shared or sublicensed

### Critical Restrictions
⚠️ **CAMPAIGN PROHIBITION**: "Project Vote Smart does not permit the use of its name or programs...in any campaign activity, including advertising, debates, and speeches"

**Implications for VoterEd**:
- ✅ Can use for voter education
- ❌ Cannot be used if platform is perceived as campaign-related
- ✅ Educational/informational use appears permitted
- ⚠️ Must consult Vote Smart directly about specific use case

### Attribution
- Attribution to Vote Smart is **optional but welcomed**
- Cannot misattribute data to another source
- Recommended: Include clear attribution in UI

## 2. Relevant API Endpoints

### 2.1 Candidates.getByZip()
**Purpose**: Get candidates by zip code (our primary entry point)

**Input**:
- `zip5` or `zip4` (required)
- `electionYear` (optional)

**Output**: List of candidates with candidateId

**Use Case**: Match Google Civic API candidates to Vote Smart candidateIds

---

### 2.2 CandidateBio.getBio()
**Purpose**: Get detailed candidate biographical information

**Input**:
- `candidateId` (required)

**Output**:
- Name, birth info, party, office
- Education, profession (deprecated - use getDetailedBio)
- Election dates, district

**Use Case**: Enrich candidate profiles with biographical data

---

### 2.3 CandidateBio.getDetailedBio()
**Purpose**: Get granular biographical details (replaces deprecated fields)

**Input**:
- `candidateId` (required)

**Output**:
- Education: degree, field, school, GPA
- Professional history: titles, organizations
- Political involvement, memberships

**Use Case**: Display comprehensive candidate background

---

### 2.4 Npat.getNpat() ⭐ **PRIMARY ENDPOINT**
**Purpose**: Get candidate's Political Courage Test (PCT) responses

**Input**:
- `candidateId` (required)

**Output**:
- Survey sections with hierarchical structure
- Questions with paths and text
- Answer text and response options
- Recursive nested rows (complex structure)

**Use Case**: **This is where actual issue positions come from**

**Key Challenge**:
- Recursive data structure
- Need to map PCT questions to our issue categories
- Responses may be free-text or multiple choice

---

### 2.5 Rating.getCandidateRating()
**Purpose**: Get interest group ratings for candidate

**Input**:
- `candidateId` (required)
- `ratingId` (optional - specific rating/group)

**Output**:
- Interest group ratings (numeric scores)
- Categories (e.g., "Liberal", "Conservative")

**Use Case**:
- Supplement position data with group ratings
- Infer positions when PCT not available

---

### 2.6 Votes.getByOfficial()
**Purpose**: Get voting record for elected officials

**Input**:
- `candidateId` (required)
- `year` (optional)

**Output**:
- Bill information
- Vote cast (Yea/Nay/Abstain)
- Bill description and outcome

**Use Case**:
- Show voting record for incumbents
- Derive positions from actual votes

## 3. Integration Architecture

### Phase 1: Data Collection & Caching (Backend)

```
┌─────────────────────────────────────────────────────────┐
│                    VoterEd Backend                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Google Civic API ──> Get Candidate Names & Offices    │
│         │                                               │
│         ▼                                               │
│  Vote Smart API ──> Match by Name + Office + Zip       │
│         │                                               │
│         ├──> Npat.getNpat() (Political Courage Test)   │
│         ├──> Rating.getCandidateRating() (Group Scores)│
│         └──> Votes.getByOfficial() (Voting Record)     │
│                                                         │
│         ▼                                               │
│  Transform & Store in Supabase                         │
│         │                                               │
│         └──> Cache with timestamp & coverage metadata  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Database Schema Changes

#### New Table: `votesmart_cache`
```sql
CREATE TABLE votesmart_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id),
  votesmart_candidate_id TEXT NOT NULL,

  -- Biographical data
  bio_data JSONB,
  detailed_bio_data JSONB,

  -- Issue positions (PCT)
  npat_data JSONB,
  npat_last_updated TIMESTAMP,

  -- Ratings
  ratings_data JSONB,
  ratings_last_updated TIMESTAMP,

  -- Voting record
  votes_data JSONB,
  votes_last_updated TIMESTAMP,

  -- Metadata
  last_synced TIMESTAMP DEFAULT NOW(),
  sync_status TEXT DEFAULT 'pending', -- pending, synced, error
  coverage_notes TEXT,

  UNIQUE(votesmart_candidate_id),
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_last_synced (last_synced)
);
```

#### New Table: `votesmart_issue_mapping`
Maps Vote Smart PCT questions to our issue IDs

```sql
CREATE TABLE votesmart_issue_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id),

  -- Vote Smart question identifiers
  pct_question_path TEXT,
  pct_question_text TEXT,

  -- Mapping configuration
  position_mapping JSONB, -- Maps their responses to our 1-5 scale
  confidence_level TEXT, -- high, medium, low
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(issue_id, pct_question_path)
);
```

#### Update: `candidate_positions` Table
Add source attribution:

```sql
ALTER TABLE candidate_positions
  ADD COLUMN data_source TEXT DEFAULT 'manual', -- manual, votesmart_npat, votesmart_rating, votesmart_vote, inferred
  ADD COLUMN votesmart_question_path TEXT,
  ADD COLUMN source_confidence TEXT, -- high, medium, low
  ADD COLUMN last_verified TIMESTAMP,
  ADD COLUMN raw_response TEXT; -- Original response from Vote Smart
```

### Phase 2: Background Sync Process

Create a scheduled job (Vercel Cron or separate service):

**Script**: `scripts/sync-votesmart-data.mjs`

```javascript
// Pseudo-code
async function syncVoteSmartData() {
  // 1. Get all candidates needing sync (no cache or stale cache)
  const candidates = await getCandidatesNeedingSync();

  for (const candidate of candidates) {
    try {
      // 2. Match candidate to Vote Smart by name + office + location
      const vsCandidate = await findVoteSmartCandidate(candidate);

      if (!vsCandidate) {
        markAsNotFound(candidate);
        continue;
      }

      // 3. Fetch all data types
      const [npat, ratings, votes, bio] = await Promise.all([
        fetchNPAT(vsCandidate.id),
        fetchRatings(vsCandidate.id),
        fetchVotes(vsCandidate.id),
        fetchBio(vsCandidate.id)
      ]);

      // 4. Transform PCT responses to our position scale
      const positions = transformNPATToPositions(npat);

      // 5. Store in cache
      await upsertVoteSmartCache({
        candidate_id: candidate.id,
        votesmart_candidate_id: vsCandidate.id,
        npat_data: npat,
        ratings_data: ratings,
        votes_data: votes,
        bio_data: bio
      });

      // 6. Update candidate_positions with attribution
      await updateCandidatePositions(candidate.id, positions);

      // Rate limit: wait between requests
      await sleep(500); // 2 requests/second

    } catch (error) {
      logError(candidate, error);
    }
  }
}
```

### Phase 3: API Routes

#### `/api/sync-candidate-positions`
Manually trigger sync for specific candidates

**Input**:
```json
{
  "candidateIds": ["uuid1", "uuid2"],
  "force": false // Force re-sync even if cached
}
```

**Output**:
```json
{
  "success": true,
  "synced": 2,
  "errors": 0,
  "candidates": [
    {
      "id": "uuid1",
      "name": "Jane Doe",
      "votesmart_id": "12345",
      "positions_updated": 8,
      "data_source": "votesmart_npat",
      "last_synced": "2025-01-15T10:30:00Z"
    }
  ]
}
```

## 4. UI/UX Integration

### 4.1 Results Page Updates

Replace demo disclaimer with data source attribution:

```jsx
{/* Data Source Attribution */}
<div className="mb-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
  <div className="flex gap-3">
    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" {/* checkmark icon */} />
    <div>
      <h3 className="font-semibold text-blue-900 mb-1">Real Candidate Data</h3>
      <p className="text-sm text-blue-800 leading-relaxed">
        Position data sourced from <strong>Project Vote Smart</strong>, including
        Political Courage Test responses{coverage.hasVotes && ', voting records'}
        {coverage.hasRatings && ', and interest group ratings'}.
        Last updated: {formatDate(lastUpdated)}.
        {' '}
        <a href="https://www.votesmart.org" target="_blank" className="underline font-medium">
          Learn more at VoteSmart.org
        </a>
      </p>
    </div>
  </div>
</div>
```

### 4.2 Candidate Cards

Add data source indicators:

```jsx
<div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
  <span className={`px-2 py-1 rounded ${getDataSourceColor(candidate.dataSource)}`}>
    {getDataSourceLabel(candidate.dataSource)}
  </span>
  {candidate.dataSource === 'votesmart_npat' && (
    <span>✓ Political Courage Test</span>
  )}
  {candidate.dataSource === 'votesmart_vote' && (
    <span>✓ Voting Record</span>
  )}
</div>
```

### 4.3 Position Details Modal

Show original responses:

```jsx
<button
  onClick={() => setShowDetails(true)}
  className="text-sm text-blue-600 hover:underline"
>
  View original response
</button>

{showDetails && (
  <div className="mt-2 p-3 bg-slate-50 rounded text-sm">
    <p className="font-medium mb-1">Political Courage Test Response:</p>
    <p className="text-slate-700 italic">"{candidate.rawResponse}"</p>
    <p className="text-xs text-slate-500 mt-2">
      Source: Vote Smart Political Courage Test, {formatDate(responseDate)}
    </p>
  </div>
)}
```

### 4.4 Coverage Dashboard (Admin)

New admin page at `/admin/votesmart-coverage`:

- Total candidates in database
- Candidates with Vote Smart data (%)
- Candidates with PCT responses (%)
- Candidates with voting records (%)
- Last sync status
- Manual sync controls

## 5. PCT Question Mapping Strategy

### Challenge
Vote Smart PCT questions don't directly map to our custom issues. We need intelligent mapping.

### Approach 1: Manual Mapping (Initial)

1. Fetch sample PCT data for various candidates
2. Manually review questions and responses
3. Create mapping table linking PCT questions to our issues
4. Define transformation rules (their response → our 1-5 scale)

**Example Mapping**:
```json
{
  "issue_id": "550e8400-...-440301", // "Utah Water Rights and Conservation"
  "pct_question_path": "Environment.WaterQuality",
  "pct_question_text": "Do you support state funding for water conservation programs?",
  "position_mapping": {
    "Strongly Support": 1,
    "Somewhat Support": 2,
    "Neutral": 3,
    "Somewhat Oppose": 4,
    "Strongly Oppose": 5
  },
  "confidence_level": "high"
}
```

### Approach 2: AI-Assisted Mapping (Future)

Use AI to:
1. Analyze PCT question text
2. Analyze our issue descriptions
3. Suggest mappings with confidence scores
4. Human review and approve

### Approach 3: Keyword/Topic Matching

- Tag our issues with keywords
- Tag PCT questions with keywords
- Auto-match when overlap is high
- Human review edge cases

## 6. Rate Limiting & Performance

### Estimated API Calls

**Per Candidate Full Sync**:
- 1 call: Find candidate by name
- 1 call: Get bio
- 1 call: Get detailed bio
- 1 call: Get NPAT
- 1 call: Get ratings
- 1 call: Get votes
= **6 calls per candidate**

**Our Scale**:
- 91 candidates currently
- ~550 API calls for full sync

### Rate Limiting Strategy

1. **No documented rate limit** from Vote Smart, but be respectful
2. Implement: **2 requests/second** (500ms delay between calls)
3. Full sync time: ~4.5 minutes for all candidates
4. Run sync: **Daily or weekly** (not real-time)
5. Cache everything with TTL

### Caching Policy

| Data Type | TTL (Time To Live) | Refresh Trigger |
|-----------|-------------------|-----------------|
| Bio Data | 30 days | Manual or scheduled |
| PCT Responses | 90 days | Manual or scheduled |
| Voting Records | 7 days (during session) | Manual or scheduled |
| Interest Group Ratings | 30 days | Manual or scheduled |

## 7. Fallback Strategy

Not all candidates will have Vote Smart data. Graceful degradation:

```javascript
function getCandidatePositions(candidateId) {
  // Priority 1: Vote Smart PCT
  if (hasVoteSmartNPAT(candidateId)) {
    return getVoteSmartPositions(candidateId);
  }

  // Priority 2: Vote Smart Ratings (infer from group scores)
  if (hasVoteSmartRatings(candidateId)) {
    return inferPositionsFromRatings(candidateId);
  }

  // Priority 3: Vote Smart Voting Record (for incumbents)
  if (hasVoteSmartVotes(candidateId)) {
    return inferPositionsFromVotes(candidateId);
  }

  // Priority 4: Manual research data (if entered)
  if (hasManualPositions(candidateId)) {
    return getManualPositions(candidateId);
  }

  // Priority 5: No data available
  return null; // Show "No position data available"
}
```

### UI Handling

```jsx
{!candidate.hasPositionData ? (
  <div className="p-4 bg-slate-50 rounded-lg text-center">
    <p className="text-slate-600 mb-2">
      No position data available for this candidate yet.
    </p>
    <a
      href={candidate.campaignWebsite}
      target="_blank"
      className="text-blue-600 hover:underline text-sm"
    >
      Visit campaign website →
    </a>
  </div>
) : (
  // Show positions
)}
```

## 8. Implementation Phases

### Phase 0: Prerequisites (Week 1)
- [ ] Register for Vote Smart API
- [ ] Clarify commercial use terms for VoterEd
- [ ] Confirm fee structure (if any)
- [ ] Get API key
- [ ] Test basic API calls

### Phase 1: Database & Schema (Week 2)
- [ ] Create `votesmart_cache` table
- [ ] Create `votesmart_issue_mapping` table
- [ ] Update `candidate_positions` table with source fields
- [ ] Create indexes for performance

### Phase 2: API Integration (Week 3)
- [ ] Create Vote Smart API client wrapper
- [ ] Implement candidate matching logic
- [ ] Implement PCT data fetching
- [ ] Implement rating/vote data fetching
- [ ] Add error handling and retries

### Phase 3: Data Transformation (Week 4)
- [ ] Manually review sample PCT questions
- [ ] Create initial question→issue mappings
- [ ] Build transformation logic (PCT response → 1-5 scale)
- [ ] Test with 5-10 candidates

### Phase 4: Sync Process (Week 5)
- [ ] Build background sync script
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Test full sync with all candidates
- [ ] Deploy as Vercel Cron job (or separate service)

### Phase 5: UI Updates (Week 6)
- [ ] Replace demo disclaimer with attribution
- [ ] Add data source indicators to candidate cards
- [ ] Show original PCT responses in details
- [ ] Handle "no data" states gracefully
- [ ] Add "last updated" timestamps

### Phase 6: Admin Tools (Week 7)
- [ ] Build coverage dashboard
- [ ] Add manual sync controls
- [ ] Create question mapping interface
- [ ] Add data quality monitoring

### Phase 7: Testing & Launch (Week 8)
- [ ] Test with real users
- [ ] Monitor API usage and costs
- [ ] Gather feedback on accuracy
- [ ] Iterate on mappings

## 9. Cost Estimation

### Unknown Variables
- Vote Smart API costs for organizational use
- Need to contact: votesmart.org/share/api/register

### Estimated Ongoing Costs
- **API Access**: $? per month (TBD)
- **Developer Time**: Maintenance ~2-4 hours/month
- **Server/Cron**: Covered by existing Vercel plan

## 10. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| High API costs | High | Medium | Start with pilot, negotiate nonprofit rates |
| Limited candidate coverage | Medium | High | Use fallback strategies, set expectations |
| PCT questions don't match our issues | Medium | High | Manual mapping + AI assistance |
| Terms prohibit our use case | High | Low | Clarify before investing development time |
| API rate limits too restrictive | Medium | Low | Cache aggressively, sync less frequently |
| Data quality issues | Medium | Medium | Human review, confidence scores |

## 11. Success Metrics

- **Coverage**: % of candidates with Vote Smart data
- **Accuracy**: User feedback on position accuracy
- **Performance**: Sync job completion time
- **Cost**: API costs vs. budget
- **User Trust**: Reduction in "is this real?" questions

## 12. Next Steps

1. **Immediate**: Contact Vote Smart at votesmart.org/share/api/register
   - Explain VoterEd's educational mission
   - Clarify usage terms
   - Get pricing information
   - Obtain API key

2. **Short-term**: Test API with pilot candidates
   - Fetch PCT data for 10 candidates
   - Review question formats
   - Assess mapping feasibility

3. **Decision Point**: Proceed with full integration or explore alternatives
   - If Vote Smart works: Continue with Phase 1
   - If costs/terms prohibitive: Consider alternatives (BallotReady, manual curation, etc.)

## 13. Alternative APIs (If Vote Smart Doesn't Work)

### BallotReady
- Focus: Local elections
- Strength: Good local candidate coverage
- Cost: Likely requires licensing

### OpenSecrets
- Focus: Federal candidates
- Strength: Campaign finance, some voting records
- Limitation: Federal only

### ProPublica Congress API
- Focus: Federal legislators
- Strength: Free, excellent voting record data
- Limitation: Federal only, incumbents only

### Ballotpedia
- Focus: All levels
- Strength: Comprehensive
- Limitation: Web scraping (no official API), legal gray area

## Conclusion

Vote Smart API integration is **feasible but requires upfront investment** in API costs (TBD), development time (~8 weeks), and ongoing maintenance. The key unknowns are cost and whether our educational use case complies with their terms.

**Recommendation**:
1. Contact Vote Smart ASAP to clarify costs and terms
2. If favorable, proceed with pilot integration (5-10 candidates)
3. Evaluate data quality and user response
4. Scale if successful, pivot to alternatives if not
