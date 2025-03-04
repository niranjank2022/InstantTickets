import { messages } from "../config/logger";
import { seedBookings } from "./booking.seed";
import { seedShows } from "./show.seed";
import { seedVenues } from "./venue.seed";

async function runAllSeeds() {
    console.log(messages.SEEDS_RUNNING);
    await seedShows();
    await seedVenues();
    await seedBookings();
    console.log(messages.SEEDS_COMPLETED);
};

(async () => {
    await runAllSeeds();
})();
