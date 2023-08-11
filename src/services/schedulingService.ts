const schedule = require("node-schedule");
import { analyzeDomain } from "./analysisService"; // Update path if needed
import Domain, { IDomain } from "../models/DomainModel"; // Update path if needed

export const startDomainAnalysisScheduler = () => {
  // Schedule the job to run at a specific interval, e.g., once a month
  // '0 0 1 * *' means the job will run at 00:00 on the first day of every month
  schedule.scheduleJob("0 0 1 * *", async () => {
    console.log("Starting scheduled domain analysis...");

    // Fetch all domains from the database
    const domains: IDomain[] = await Domain.find({});

    // Analyze each domain
    for (const domain of domains) {
      try {
        const analysis = await analyzeDomain(domain.name);
        // Update the domain with the new analysis data
        Object.assign(domain, analysis);
        await domain.save();
      } catch (error) {
        console.error(`Failed to analyze domain ${domain.name}:`, error);
      }
    }

    console.log("Scheduled domain analysis completed.");
  });
};