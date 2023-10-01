import Image from "next/image";

export default ({ name, banner }) => {
  return (
    <Image
      loader={() => banner}
      src={banner}
      alt={name}
      width="400"
      height="400"
    />
  );
};
