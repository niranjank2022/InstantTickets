import { seedBookings } from "./booking.seed";
import { seedShows } from "./show.seed";
import { seedVenues } from "./venue.seed";

async function runAllSeeds() {
    console.log("Running all seed scripts...");
    await seedShows();
    await seedVenues();
    await seedBookings();
    console.log("All seeds completed!");
};

(async () => {
    await runAllSeeds();
})();
