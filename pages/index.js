import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <header className="text-4xl font-bold mb-4">
        Welcome to EventConnect
      </header>
      <p className="text-lg mb-6 text-center">
        Discover and participate in educational events.
      </p>
      <ul className="text-left mb-6">
        <li className="mb-2">Explore a wide range of educational events.</li>
        <li className="mb-2">Register for upcoming webinars and workshops.</li>
      </ul>

      <Link
        href="/Events"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
