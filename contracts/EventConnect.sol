// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EventConnect {
    // The structual of the Event / Webinar
    struct WebinarEvent {
        uint256 eventID; // Event ID
        string eventURI; // Event URL (called URI) that stors more Information about event
        uint256 poapID; // ID of Drop of Poap that will distribute to participants
        string streamKey; // Key that used to start the Event (Livestream)
        address creator; // Event creator
        address[] attendees; // Attendees of Event
        bool providePOAP;
        bool isEnded; // Set event end or not
    }

    // State variables
    uint256 public s_eventID = 0;

    // Create Array of Webinar object
    WebinarEvent[] public events;

    // Events

    event EventCreated(
        uint256 indexed eventID,
        string eventURI,
        uint256 poapID,
        string streamKey,
        address creator
    );

    event EventEnded(uint256 indexed eventID);

    event ParticipantRegistered(
        address indexed participant,
        uint256 indexed eventID
    );

    event ParticipantUnregistered(
        address indexed participant,
        uint256 indexed eventID
    );

    // Main Functions

    /**
     * @notice Registers a participant for an event.
     * @dev Only participants who are not already registered and if the event is not ended can register.
     * @param eventID The ID of the event to register for.
     * @return True if the registration is successful, otherwise false.
     */
    function register(uint256 eventID) public returns (bool) {
        require(eventID <= s_eventID, "Invalid event index");
        require(!events[eventID].isEnded, "Event Already Finshed!");

        for (uint256 i = 0; i < events[eventID].attendees.length; i++) {
            require(
                events[eventID].attendees[i] != msg.sender,
                "Participant is already registered"
            );
            return false;
        }

        events[eventID].attendees.push(msg.sender);
        emit ParticipantRegistered(msg.sender, eventID);
        return true;
    }

    /**
     * @notice Unregisters a participant from an event.
     * @dev Participants can unregister only if they are already registered.
     * @param eventID The ID of the event to unregister from.
     */
    function unregister(uint256 eventID) public {
        require(eventID < events.length, "Invalid event index");

        bool isRegistered = false;
        for (uint256 i = 0; i < events[eventID].attendees.length; i++) {
            if (events[eventID].attendees[i] == msg.sender) {
                isRegistered = true;
                break;
            }
        }

        require(isRegistered, "Participant is not registered");

        for (uint256 i = 0; i < events[eventID].attendees.length; i++) {
            if (events[eventID].attendees[i] == msg.sender) {
                for (
                    uint256 j = i;
                    j < events[eventID].attendees.length - 1;
                    j++
                ) {
                    events[eventID].attendees[j] = events[eventID].attendees[
                        j + 1
                    ];
                }
                events[eventID].attendees.pop();
                break;
            }
        }
        emit ParticipantUnregistered(msg.sender, eventID);
    }

    /**
     * @notice Adds a new event to the contract.
     * @param eventURI The URI containing event details stored in IPFS.
     * @param streamKey The key used to start the event livestream.
     * @param poapID The ID of the Poap artwork, if available.
     */
    function addEvent(
        string memory eventURI,
        string memory streamKey,
        uint256 poapID
    ) public {
        events.push(
            WebinarEvent(
                s_eventID,
                eventURI,
                poapID,
                streamKey,
                msg.sender,
                new address[](0),
                false,
                false
            )
        );
        emit EventCreated(s_eventID, eventURI, poapID, streamKey, msg.sender);
        s_eventID++;
    }

    /**
     * @notice Ends an event, preventing further registrations.
     * @param eventID The ID of the event to end.
     */
    function endEvent(uint256 eventID) public {
        require(eventID <= s_eventID, "Invalid event index");
        require(!events[eventID].isEnded, "Event Already Finshed!");

        events[eventID].isEnded = true;
        emit EventEnded(eventID);
    }

    /**
     * @notice Adds the ID of a Poap artwork drop for an event.
     * @param eventID The ID of the event to add the Poap ID to.
     * @param poapID The ID of the Poap artwork drop.
     */
    function addPoapID(uint256 eventID, uint256 poapID) public {
        require(eventID <= s_eventID, "Invalid event index");
        require(events[eventID].poapID == 0);

        events[eventID].poapID = poapID;
        events[eventID].providePOAP = true;
    }

    /**
     * @notice Checks if a participant is registered for a specific event.
     * @param eventID The ID of the event to check registration for.
     * @param participant The address of the participant to check.
     * @return True if the participant is registered, otherwise false.
     */
    function isParticipantRegistered(
        uint256 eventID,
        address participant
    ) public view returns (bool) {
        require(eventID <= s_eventID, "Invalid event index");
        for (uint256 i = 0; i < events[eventID].attendees.length; i++) {
            if (events[eventID].attendees[i] == participant) {
                return true;
            }
        }
        return false;
    }

    // Getter Functions

    /**
     * @notice Gets the total number of events.
     * @return The total number of events created.
     */
    function getEventIndex() public view returns (uint256) {
        return s_eventID;
    }

    /**
     * @notice Gets the list of participants for a specific event.
     * @param eventID The ID of the event to retrieve participants for.
     * @return An array of participant addresses.
     */
    function getEventParticipants(
        uint256 eventID
    ) public view returns (address[] memory) {
        require(eventID <= s_eventID, "Invalid event index");
        return events[eventID].attendees;
    }

    /**
     * @notice Gets details of a specific event.
     * @param eventID The ID of the event to retrieve details for.
     * @return An object containing event details.
     */
    function getOneEvent(
        uint256 eventID
    ) public view returns (WebinarEvent memory) {
        require(eventID <= s_eventID, "Invalid event index");
        require(eventID >= 0, "Invalid event index");
        return events[eventID];
    }

    /**
     * @notice Gets an array of all events.
     * @return An array of all events stored in the contract.
     */
    function getAllEvents() public view returns (WebinarEvent[] memory) {
        return events;
    }

    /**
     * @notice Gets the Poap ID for a specific event.
     * @param eventID The ID of the event to retrieve the Poap ID for.
     * @return The Poap ID associated with the event.
     */
    function getPoapID(uint256 eventID) public view returns (uint256) {
        require(eventID <= s_eventID, "Invalid event index");
        return events[eventID].poapID;
    }
}
