import dynamic from "next/dynamic";

export default function Map(): JSX.Element {
  const MapWithNoSSR = dynamic(() => import("./MapSSR"), {
    ssr: false,
  });

  return <MapWithNoSSR />;
}
