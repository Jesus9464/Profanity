import { prisma } from "@/lib/prisma";
import { normalize } from "@/lib/normalize";

/**
 * This script updates all existing words in the database with the enhanced normalize function
 * Run this script after updating the normalize function to ensure all words in the database
 * have their normalizedTerm field updated with the latest normalization logic
 */
async function updateNormalizedTerms() {
  try {
    console.log("Fetching all words from the database...");
    const words = await prisma.word.findMany();
    console.log(`Found ${words.length} words to update.`);

    let updatedCount = 0;
    
    for (const word of words) {
      const newNormalizedTerm = normalize(word.term);
      
      // Only update if the normalized term has changed
      if (newNormalizedTerm !== word.normalizedTerm) {
        await prisma.word.update({
          where: { id: word.id },
          data: { normalizedTerm: newNormalizedTerm }
        });
        updatedCount++;
        console.log(`Updated word: ${word.term} -> ${newNormalizedTerm}`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} words.`);
  } catch (error) {
    console.error("Error updating normalized terms:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateNormalizedTerms()
  .then(() => console.log("Update completed."))
  .catch((error) => console.error("Update failed:", error));
