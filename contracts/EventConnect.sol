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
    event ParticipantRegistered(
        address indexed participant,
        uint256 indexed eventID
    );

    event ParticipantUnregistered(
        address indexed participant,
        uint256 indexed eventID
    );

    event EventEnded(uint256 indexed eventID);

    // Main Functions

    /**
     * @notice Method for register participants
     * @param eventID ID of event
     */
    function register(uint256 eventID) public {
        require(eventID <= s_eventID, "Invalid event index");
        require(!events[eventID].isEnded, "Event has ended");

        for (uint256 i = 0; i < events[eventID].attendees.length; i++) {
            require(
                events[eventID].attendees[i] != msg.sender,
                "Participant is already registered"
            );
        }
        events[eventID].attendees.push(msg.sender);
        emit ParticipantRegistered(msg.sender, eventID);
    }

    /**
     * @notice Method for unregister participants
     * @param eventID ID of event
     * @dev Check for participant if exist or not
     * @dev Move the exists participant to last of array to delete him/her
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
     * @notice Method for add new event
     * @param eventURI URL (but it's called URI) it contants the details of event, which stored in IPFS
     * @param streamKey ID of the event that related to event creator
     * @param poapID ID of artwork of Poap, in-case is there any
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
        s_eventID++;
    }

    /**
     * @notice Method for end an event
     * @param eventID ID of event
     */
    function endEvent(uint256 eventID) public {
        require(eventID <= s_eventID, "Invalid event index");
        require(events[eventID].isEnded, "Event Already Finshed!");

        events[eventID].isEnded = true;
        emit EventEnded(eventID);
    }

    /**
     * @notice Method for add ID of Drop of poap artwork, for send it to participants
     * @param eventID ID of event
     * @param poapID ID of Drop of poap
     */
    function addPoapID(uint256 eventID, uint256 poapID) public {
        require(eventID <= s_eventID, "Invalid event index");
        require(events[eventID].providePOAP = true);

        events[eventID].poapID = poapID;
    }

    /**
     * @notice Method for checking if the participant is register to spicific event
     * @param eventID ID of event
     * @param participant Address of participant
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
     * @notice This method returns the ID of event
     * @dev The variable is Private and State Variable type
     */
    function getEventIndex() public view returns (uint256) {
        return s_eventID;
    }

    /**
     * @notice This method returns all paricipants they are registered to spicific event
     * @param eventID ID of event
     */
    function getEventParticipants(
        uint256 eventID
    ) public view returns (address[] memory) {
        require(eventID <= s_eventID, "Invalid event index");
        return events[eventID].attendees;
    }

    /**
     * @notice This method returns spicific event
     * @param eventID ID of event
     */
    function getEvent(
        uint256 eventID
    ) public view returns (WebinarEvent memory) {
        require(eventID <= s_eventID, "Invalid event index");
        return events[eventID];
    }

    /**
     * @notice This method returns all events as Array
     */
    function getAllEvents() public view returns (WebinarEvent[] memory) {
        return events;
    }

    /**
     * @notice This method returns spicific POAP
     * @param eventID ID of event
     */
    function getPoapID(uint256 eventID) public view returns (uint256) {
        require(eventID <= s_eventID, "Invalid event index");
        for (uint256 i = 0; i < events.length; i++) {
            if (events[i].eventID == eventID) {
                return events[i].poapID;
            }
        }
        return 0;
    }
}
