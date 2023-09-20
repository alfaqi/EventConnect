import { Broadcast } from "@livepeer/react";

export default ({ title, streamKey }) => {
  return (
    <Broadcast
      streamKey={streamKey}
      controls={{ autohide: 0, hotkeys: false, defaultVolume: 0.6 }}
      title={title}
      showPipButton
    />
  );
};
