import ClientComponent from "./clientComponent";
import Senders from "../pages/senders";


export default function Index(props: { searchParams: Record<string, string> }) {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <div>
      <ClientComponent>
        <Senders />
      </ClientComponent>
    </div>
  );
}
