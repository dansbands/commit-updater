// Import required packages
const fs = require("fs");
const path = require("path");
const cron = require("cron");
const simpleGit = require("simple-git");

// File path to store the counter
const filePath = path.join(__dirname, "counter.txt");

// Git configuration
const git = simpleGit();

const USER = process.env.USER;
console.log('USER', USER)
const PASS = process.env.PASS;
console.log('PASS', PASS)
const REPO = "github.com/dansbands/commit-updater";
console.log('REPO', REPO)

const remote = `https://${USER}:${PASS}@${REPO}`;
// const remote = "git@github.com:dansbands/commit-updater.git";

// Ensure the counter file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "0", "utf8");
}

// Function to call the backend
const callBackend = async () => {
  console.log("Secondary job started, pinging ai-todo-list every 1 min.");

  return fetch("https://ai-todo-list.onrender.com/");
};

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

    const setupGitConfig = async () => {
      try {
        await git.addConfig("user.name", process.env.NAME);
        await git.addConfig("user.email", process.env.EMAIL);

        const config = await git.listConfig();
        console.log(
          `Git user configuration set. ${JSON.stringify(config, null, 2)}`
        );
      } catch (error) {
        console.error("Error setting Git user configuration:", error);
      }
    };

    // Call this function before making Git operations
    // setupGitConfig().then(() => {
    //   console.log("Git configuration completed.");
    // });
    // Stage, commit, and push changes
    await git.add("./*");
    await git.commit(randomMessage);
    // await git.addRemote("origin", remote);
    await git.push(remote, "main");

    console.log(`Counter updated and committed: ${counter}`);
  } catch (error) {
    console.error("Error updating counter:", error);
  }
};

// Schedule the cron job (runs every 14 minutes in this example)
const job = new cron.CronJob("0 * * * * *", updateCounter);
job.start();

const secondaryJob = new cron.CronJob("0 * * * * *", callBackend);
secondaryJob.start();

console.log("Cron job started, updating counter every 1 min");
