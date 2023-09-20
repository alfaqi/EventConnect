import { Player } from "@livepeer/react";

export default ({ title, playbackId }) => {
  return (
    <Player
      title={title}
      playbackId={playbackId}
      loop
      showPipButton
      autoPlay={true}
      showTitle={false}
      muted={false}
    />
  );
};
