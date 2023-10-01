export default ({ name, eventStatus, broadCast, playbackId }) => {
  const gotoEventFunc = () => {
    const liveEventURL =
      eventBy.toLowerCase() === account
        ? `/Live/Live?id=${broadCast}&title=${name}&auth=0`
        : `/Live/Live?id=${playbackId}&title=${name}&auth=1`;
    window.location.href = liveEventURL;
  };
  return (
    <>
      {eventStatus === "online" && (
        <div>
          <Button text="Goto LiveStream" onClick={gotoEventFunc} />
        </div>
      )}
    </>
  );
};
