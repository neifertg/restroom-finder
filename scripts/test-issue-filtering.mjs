// Test script to verify issue filtering by zip code

async function testIssueFiltering() {
  const zipCodes = ['77493', '84043', '20147', '67002'];

  for (const zip of zipCodes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing zip code: ${zip}`);
    console.log('='.repeat(60));

    try {
      const response = await fetch(`http://localhost:3000/api/issues?zipCode=${zip}`);
      const data = await response.json();

      if (!data.success) {
        console.error('Error:', data.error);
        continue;
      }

      console.log(`Total issues returned: ${data.issues.length}\n`);

      // Group by location
      const byLocation = {};
      const noLocation = [];

      data.issues.forEach(issue => {
        if (!issue.locations || issue.locations.length === 0) {
          noLocation.push(issue);
        } else {
          const key = issue.locations.join(', ');
          if (!byLocation[key]) byLocation[key] = [];
          byLocation[key].push(issue);
        }
      });

      // Print location-specific issues
      console.log('Location-specific issues:');
      Object.keys(byLocation).sort().forEach(loc => {
        console.log(`  ${loc}: ${byLocation[loc].length} issues`);
        byLocation[loc].forEach(i => {
          console.log(`    - ${i.title}`);
        });
      });

      // Print generic issues
      if (noLocation.length > 0) {
        console.log(`\n  Generic (no location): ${noLocation.length} issues`);
        noLocation.forEach(i => {
          console.log(`    - ${i.title}`);
        });
      }

    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  }
}

testIssueFiltering();
