// Import required packages
const fs = require("fs");
const path = require("path");
const cron = require("cron");
const simpleGit = require("simple-git");

// File path to store the counter
const filePath = path.join(__dirname, "counter.txt");

// Git configuration
const git = simpleGit();
const remoteRepo = "git@github.com:dansbands/commit-updater.git"; // Replace with your repository URL

// Ensure the counter file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "0", "utf8");
}

// Function to update the counter and commit changes
const updateCounter = async () => {
  try {
    // Read the current counter value
    let counter = parseInt(fs.readFileSync(filePath, "utf8"), 10);

    // Increment the counter
    counter += 1;

    // Write the new counter value back to the file
    fs.writeFileSync(filePath, counter.toString(), "utf8");

    // Generate a random commit message
    const commitMessages = [
      "Update counter 🚀",
      "Another day, another commit 💾",
      "Keep the counter rolling 🔢",
      "Incremental progress 🛠️",
      "Pushing updates 🌟",
    ];
    const randomMessage =
      commitMessages[Math.floor(Math.random() * commitMessages.length)];

    // Stage, commit, and push changes
    await git.add("./*");
    await git.commit(randomMessage);
    await git.push("origin", "main");

    console.log(`Counter updated and committed: ${counter}`);
  } catch (error) {
    console.error("Error updating counter:", error);
  }
};

// Schedule the cron job (runs every hour in this example)
const job = new cron.CronJob("0 0 * * * *", updateCounter);
job.start();

console.log("Cron job started, updating counter every hour.");
