const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventConnect", function () {
  let EventConnect;
  let eventConnect;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let eventURI, streamKey, poapID;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    EventConnect = await ethers.getContractFactory("EventConnect");
    eventConnect = await EventConnect.deploy();
    eventURI = "https://example.com/event";
    streamKey = "livestream_key";
    poapID = 0;
    await eventConnect.addEvent(eventURI, streamKey, poapID);
  });

  it("Should add a new event", async function () {
    const newEvent = await eventConnect.getOneEvent(0);

    expect(newEvent.eventURI).to.equal(eventURI);
    expect(newEvent.streamKey).to.equal(streamKey);
    expect(newEvent.poapID).to.equal(poapID);
  });

  it("Should register and unregister participants", async function () {
    const eventIDd = await eventConnect.getEventIndex();
    const eventID = Number(eventIDd) - 1;
    const participant = addr1.address;

    await eventConnect.connect(addr1).register(eventID);
    const isRegisteredBeforeUnregister =
      await eventConnect.isParticipantRegistered(eventID, participant);

    expect(isRegisteredBeforeUnregister).to.be.true;

    await eventConnect.connect(addr1).unregister(eventID);
    const isRegisteredAfterUnregister =
      await eventConnect.isParticipantRegistered(eventID, participant);

    expect(isRegisteredAfterUnregister).to.be.false;
  });

  it("Should end an event", async function () {
    const eventIDd = await eventConnect.getEventIndex();
    const eventID = Number(eventIDd) - 1;
    await eventConnect.endEvent(eventID);
    const endedEvent = await eventConnect.getOneEvent(eventID);

    expect(endedEvent.isEnded).to.be.true;
  });

  it("Should add a Poap ID to an event", async function () {
    const eventIDd = await eventConnect.getEventIndex();
    const eventID = Number(eventIDd) - 1;
    const poapID = 456;

    await eventConnect.addPoapID(eventID, poapID);
    const updatedEvent = await eventConnect.getOneEvent(eventID);

    expect(updatedEvent.poapID).to.equal(poapID);
  });

  it("Should get event participants", async function () {
    const eventIDd = await eventConnect.getEventIndex();
    const eventID = Number(eventIDd) - 1;
    const participants = await eventConnect.getEventParticipants(eventID);

    expect(participants.length).to.equal(0);
  });

  it("Should get all events", async function () {
    const allEvents = await eventConnect.getAllEvents();

    expect(allEvents.length).to.equal(await eventConnect.getEventIndex());
  });

  it("Should get Poap ID", async function () {
    const eventIDd = await eventConnect.getEventIndex();
    const eventID = Number(eventIDd) - 1;
    const poapID = await eventConnect.getPoapID(eventID);

    expect(poapID).to.equal(0);
  });
});
