import ClientComponent from "./clientComponent";
import SendersList from "./senders/page";


export default function Index(props: { searchParams: Record<string, string> }) {

  const token = props.searchParams.sessionToken;

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <div>
      <ClientComponent>
        <SendersList />
      </ClientComponent>
    </div>
  );
}
