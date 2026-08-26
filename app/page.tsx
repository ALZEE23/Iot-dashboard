import { Desktop } from "./dashboard/Desktop";
import { Mobile } from "./dashboard/Mobile";

export default function Page() {
  return (
    <main>
      <Mobile />
      <Desktop />
    </main>
  );
}