import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import { TransitionGroup } from "react-transition-group";
import { formatDistanceToNow } from "date-fns";
import eventBus from "../utils/eventBus";

// Define the shape of a notification object.
interface Notification {
  id: number;
  type: "newThread" | "mention" | "subscribedReply";
  data: any;
  createdAt: number;
}

// Props for individual notification items.
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: number) => void;
}

// Component to render a single notification.
const NotificationItem = ({ notification, onRemove }: NotificationItemProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      {/* Button to remove the notification */}
      <IconButton
        onClick={() => onRemove(notification.id)}
        size="small"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Render different layouts based on notification type */}
      {notification.type === "newThread" && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            New Thread: {notification.data.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {notification.data.content}
          </Typography>
        </>
      )}

      {notification.type === "mention" && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Mention in: {notification.data.discussionTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Reply: {notification.data.reply.content}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            Previous: {notification.data.previousMessage}
          </Typography>
        </>
      )}

      {notification.type === "subscribedReply" && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            New reply in: {notification.data.discussionTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Reply: {notification.data.reply.content}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
            Previous: {notification.data.previousMessage}
          </Typography>
        </>
      )}

      {/* Show how long ago the notification was created */}
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mt: 1, display: "block" }}
      >
        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
      </Typography>
    </Box>
  );
};

// Initial notifications for demo purposes.
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "newThread",
    data: {
      title: "Welcome to the Forum",
      content: "Join our discussion and share your ideas!",
    },
    createdAt: Date.now() - 60000, // 1 minute ago
  },
  {
    id: 2,
    type: "mention",
    data: {
      discussionTitle: "React Hooks Discussion",
      reply: { content: "Hey @Alice, check out this new hook!" },
      previousMessage: "I really enjoy using useEffect for side effects.",
    },
    createdAt: Date.now() - 120000, // 2 minutes ago
  },
  {
    id: 3,
    type: "subscribedReply",
    data: {
      discussionTitle: "JavaScript Best Practices",
      reply: { content: "Remember, always use const for constants." },
      previousMessage: "A best practice is to avoid var declarations.",
    },
    createdAt: Date.now() - 180000, // 3 minutes ago
  },
];

// Main component for the notifications tab.
const NotificationTab = () => {
  // Manage notifications state and the filter option.
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  // Helper function to add a new notification with a unique id.
  const addNotification = (
    type: Notification["type"],
    data: any
  ): void => {
    const newNotif: Notification = {
      id: Date.now() + Math.random(),
      type,
      data,
      createdAt: Date.now(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Set up event listeners for notification events.
  useEffect(() => {
    const handleNewThread = (data: any) => addNotification("newThread", data);
    const handleMention = (data: any) => addNotification("mention", data);
    const handleSubscribedReply = (data: any) =>
      addNotification("subscribedReply", data);

    eventBus.on("newThread", handleNewThread);
    eventBus.on("mention", handleMention);
    eventBus.on("subscribedReply", handleSubscribedReply);

    // Clean up listeners on unmount.
    return () => {
      eventBus.off("newThread", handleNewThread);
      eventBus.off("mention", handleMention);
      eventBus.off("subscribedReply", handleSubscribedReply);
    };
  }, []);

  // Mock function to simulate a new thread notification.
  const handleMockNewThread = () => {
    const fakeThread = {
      id: Date.now(),
      title: "Mock New Thread",
      content:
        "This is a simulated new thread content added to the discussion.",
    };
    eventBus.emit("newThread", fakeThread);
    addNotification("newThread", fakeThread);
  };

  // Mock function to simulate a mention notification.
  const handleMockMention = () => {
    const fakeMention = {
      threadId: 1002,
      discussionTitle: "React Hooks Discussion",
      reply: {
        id: Date.now(),
        content: "This is a simulated reply mentioning you.",
      },
      previousMessage: "Original comment: I really like using React Hooks!",
    };
    eventBus.emit("mention", fakeMention);
    addNotification("mention", fakeMention);
  };

  // Mock function to simulate a subscribed reply notification.
  const handleMockSubscribedReply = () => {
    const fakeSubscribedReply = {
      threadId: 1003,
      discussionTitle: "JavaScript Best Practices",
      reply: {
        id: Date.now(),
        content:
          "This is a simulated reply in a discussion you're subscribed to.",
      },
      previousMessage: "Earlier message: Always use const for constants.",
    };
    eventBus.emit("subscribedReply", fakeSubscribedReply);
    addNotification("subscribedReply", fakeSubscribedReply);
  };

  // Remove a notification by filtering it out of the state.
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Clear all notifications.
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filter notifications based on the selected filter type.
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  return (
    <>
      {/* Main notifications card */}
      <Card
        sx={{
          width: { xs: "90%", sm: 500 },
          margin: "40px auto",
          maxHeight: 600,
          overflowY: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Notifications
          </Typography>
          {/* Dropdown to filter notifications */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Filter Notifications</InputLabel>
              <Select
                value={filter}
                label="Filter Notifications"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="newThread">New Thread</MenuItem>
                <MenuItem value="mention">Mention</MenuItem>
                <MenuItem value="subscribedReply">Subscribed Reply</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* Show message if there are no notifications */}
          {filteredNotifications.length === 0 ? (
            <Typography variant="body2" align="center">
              No notifications
            </Typography>
          ) : (
            // Animate notifications appearance/disappearance
            <TransitionGroup>
              {filteredNotifications.map((notif) => (
                <Collapse key={notif.id}>
                  <NotificationItem
                    notification={notif}
                    onRemove={removeNotification}
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          )}
        </CardContent>
      </Card>

      {/* Buttons to trigger mock notifications */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={handleMockNewThread}>
          Mock New Thread
        </Button>
        <Button variant="contained" onClick={handleMockMention}>
          Mock Mention
        </Button>
        <Button variant="contained" onClick={handleMockSubscribedReply}>
          Mock Subscribed Reply
        </Button>
      </Box>

      {/* Button to clear all notifications if any exist */}
      {notifications.length > 0 && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button variant="outlined" onClick={clearAllNotifications}>
            Clear All Notifications
          </Button>
        </Box>
      )}
    </>
  );
};

export default NotificationTab;
