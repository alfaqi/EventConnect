export function useFetchData(allEvents) {
  let fetchedData = [];
  for (let i of allEvents) {
    fetch(i.eventURI)
      .then((response) => {
        if (!response) {
          throw new Error("Request failed!");
        }
        return response.json();
      })
      .then((data) => {
        fetchedData.push(data);
      })
      .catch((err) => {
        return err;
      });
  }
  return fetchedData;
}
