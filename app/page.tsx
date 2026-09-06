import { Desktop } from "./dashboard/Desktop";
import { Mobile } from "./dashboard/Mobile";
import { PresenceBeacon } from "./component/PresenceBeacon";

export default function Page() {
  return (
    <main>
      <PresenceBeacon />
      <Mobile />
      <Desktop />
    </main>
  );
}