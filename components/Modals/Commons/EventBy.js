import { useMoralis } from "react-moralis";

export default ({ eventBy }) => {
  const { account } = useMoralis();

  return <p>By: {eventBy.toLowerCase() === account ? "You" : eventBy}</p>;
};
