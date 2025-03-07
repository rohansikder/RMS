// Import the mitt library, a lightweight event emitter.
import mitt from "mitt";

type Events = {
    // Event fired when a new thread is created.
    newThread: any;
    // Event fired when a user is mentioned.
    mention: any;
    // Event fired when a reply is made in a thread the user is subscribed to.
    subscribedReply: any;
};

// Create an event bus instance with the specified event types.
const eventBus = mitt<Events>();

export default eventBus;
