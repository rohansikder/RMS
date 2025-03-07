import { useEffect, useState } from "react";
import eventBus from "../utils/eventBus";
import { Card, CardContent, Typography } from "@mui/material";

// Define the structure of a notification object with a type and associated data.
interface NotificationSystem {
    type: "newThread" | "mention" | "subscribedReply";
    data: any;
}

// NotificationComponent listens for events via eventBus and displays notifications in a fixed card.
const NotificationComponent = () => {
    // State to store the list of notifications.
    const [notifications, setNotifications] = useState<NotificationSystem[]>([]);

    // Set up event listeners when the component mounts.
    useEffect(() => {
        // Handler for new thread notifications.
        const handleNewThread = (thread: any) => {
            setNotifications((prev) => [
                ...prev,
                { type: "newThread", data: thread }
            ]);
        };

        // Handler for mention notifications.
        const handleMention = (data: any) => {
            setNotifications((prev) => [
                ...prev,
                { type: "mention", data }
            ]);
        };

        // Handler for subscribed reply notifications.
        const handleSubscribedReply = (data: any) => {
            setNotifications((prev) => [
                ...prev,
                { type: "subscribedReply", data }
            ]);
        };

        // Register event listeners with eventBus.
        eventBus.on("newThread", handleNewThread);
        eventBus.on("mention", handleMention);
        eventBus.on("subscribedReply", handleSubscribedReply);

        // Clean up the event listeners when the component unmounts.
        return () => {
            eventBus.off("newThread", handleNewThread);
            eventBus.off("mention", handleMention);
            eventBus.off("subscribedReply", handleSubscribedReply);
        };
    }, []); // Empty dependency array ensures this effect runs once on mount.

    return (
        // Display the notifications inside a fixed-position card at the top-right of the screen.
        <Card sx={{ position: "fixed", top: 16, right: 16, width: 300 }}>
            <CardContent>
                {/* Title for the notifications card */}
                <Typography variant="h6">Notifications</Typography>
                {/* Display a message if there are no notifications */}
                {notifications.length === 0 && (
                    <Typography variant="body2">No new notifications</Typography>
                )}
                {/* Iterate over the notifications array and render each notification */}
                {notifications.map((notif, index) => (
                    <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                        {notif.type === "newThread" && `New thread: ${notif.data.title}`}
                        {notif.type === "mention" &&
                            `You were mentioned in a reply in thread ${notif.data.threadId}`}
                        {notif.type === "subscribedReply" &&
                            `New reply in subscribed thread ${notif.data.threadId}`}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );
};

export default NotificationComponent;
