# VoterEd Setup Instructions

## Database Seeding

To populate your database with sample data for testing:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/yevltknwdqwekgnjbufo
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the Seed Data**
   - Open the file: `supabase/seed-data.sql`
   - Copy the entire contents
   - Paste into the SQL editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

3. **Verify the Data**
   - Go to "Table Editor" in the left sidebar
   - Check these tables:
     - `issues` - should have 10 rows
     - `sources` - should have 5 rows
     - `candidates` - should have 5 rows
     - `candidate_positions` - should have multiple rows

## Testing the App

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Test the complete flow**:
   - Go to http://localhost:3000
   - Click "Get Started"
   - Enter a valid zip code:
     - **Loudoun County, VA**: 20147, 20148, 20164, or 20165
     - **Lincoln County, NC**: 28092 or 28090
   - Complete the 10-question quiz
   - Rate the importance of each issue
   - View your candidate matches!

## Expected Results

After completing the quiz, you should see:
- **For Loudoun County zip codes**: 3 candidates (John Smith, Sarah Johnson, Michael Chen)
- **For Lincoln County zip codes**: 2 candidates (Robert Williams, Jennifer Davis)

Each candidate will show:
- Match percentage (0-100%)
- Match quality label (Strong/Good/Moderate/Weak)
- Detailed issue-by-issue comparison when expanded

## What's Been Built

✓ Landing page with "How It Works" and features
✓ Zip code entry with validation
✓ 10-question issue quiz with progress indicator
✓ Importance ranking interface
✓ Candidate matching algorithm (weighted by importance)
✓ Results page with detailed breakdowns
✓ Complete user flow from start to finish

## Next Steps

Once you've tested the app and verified it works:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add complete quiz flow and candidate matching

   - Created zip code entry page with validation
   - Built issue quiz with 10 questions
   - Added importance ranking interface
   - Implemented weighted candidate matching algorithm
   - Created results page with detailed comparisons
   - Added API endpoints for issues and matching

   🤖 Generated with Claude Code"
   git push
   ```

2. **Add environment variables to Vercel** (if not done already):
   - Go to your Vercel dashboard
   - Select the VoterEd project
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Test on production** after Vercel deploys

## Troubleshooting

**Issue: No candidates showing up**
- Make sure you ran the seed data SQL
- Verify candidates exist in Supabase Table Editor
- Check that zip codes in database match what you entered

**Issue: API errors**
- Check browser console for error messages
- Verify Supabase environment variables are set correctly
- Check Supabase Table Editor to ensure tables have data

**Issue: Quiz not loading**
- Check that issues table has 10 rows
- Verify API endpoint is working: http://localhost:3000/api/issues
