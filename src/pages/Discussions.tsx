// Import React and useState hook
import React, { useState } from "react";
// Import MentionsInput and Mention for @mentions functionality
import { MentionsInput, Mention } from "react-mentions";
// Import Material UI components for UI elements
import {
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    List,
    IconButton,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
// Import icons from Material UI Icons
import {
    ThumbUp,
    ThumbDown,
    ArrowBack,
    ExpandMore,
    ExpandLess,
    Star,
    StarBorder,
    Delete as DeleteIcon
} from "@mui/icons-material";
// Import date-fns for formatting time display
import { formatDistanceToNow } from "date-fns";
// Import eventBus for emitting events
import eventBus from "../utils/eventBus";

// Define interface for a Reply object
interface Reply {
    id: number;
    content: string;
    upvotes: number;
    downvotes: number;
    createdAt: number;
    replies: Reply[];
    showReplyBox?: boolean;
    collapsed?: boolean;
}

// Define interface for a Thread object
interface Thread {
    id: number;
    title: string;
    content: string;
    subjects: string[];
    replies: Reply[];
    upvotes: number;
    downvotes: number;
    createdAt: number;
    showReplyBox?: boolean;
    newReply?: string;
    subscribed?: boolean;
}

// Define a list of users for @mention functionality
const users = [
    { id: "1", display: "Alice" },
    { id: "2", display: "Bob" },
    { id: "3", display: "Charlie" }
];

// Define styles for the MentionsInput component
const mentionsStyles = {
    control: {
        backgroundColor: "#fff",
        fontSize: 14,
        padding: "9px",
        border: "1px solid #ccc",
        borderRadius: 4
    },
    highlighter: {
        overflow: "hidden"
    },
    input: {
        margin: 0,
        color: "black"
    },
    suggestions: {
        list: {
            backgroundColor: "white",
            border: "1px solid #ccc",
            fontSize: 14
        },
        item: {
            padding: "5px 15px",
            borderBottom: "1px solid #ccc",
            "&focused": {
                backgroundColor: "blue",
                color: "white"
            }
        }
    }
};

// NestedReplyBox component for adding a nested reply
const NestedReplyBox = ({
    threadId,
    replyId,
    onPostReply,
    onCancel
}: {
    threadId: number;
    replyId: number;
    onPostReply: (threadId: number, replyId: number, replyText: string) => void;
    onCancel: () => void;
}) => {
    const [input, setInput] = useState("");
    return (
        <Box sx={{ ml: 4, mb: 2 }}>
            <MentionsInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply and tag someone with @"
                style={mentionsStyles}
            >
                <Mention
                    trigger="@"
                    data={users}
                    markup="@[__display__](user:__id__)"
                    style={{ backgroundColor: "#d1c4e9" }}
                />
            </MentionsInput>
            <Button
                variant="contained"
                onClick={() => {
                    onPostReply(threadId, replyId, input);
                    setInput("");
                }}
            >
                Post Reply
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={onCancel}>
                Cancel
            </Button>
        </Box>
    );
};

// Main DiscussionThread component that renders the forum
const DiscussionThread = () => {
    // ----- MOCK DATA WITH SUBJECTS -----
    const initialThreads: Thread[] = [
        {
            id: 1001,
            title: "Welcome to the Forum",
            content:
                "Welcome to our online discussion forum! Feel free to introduce yourself and ask questions.",
            subjects: ["General"],
            replies: [
                {
                    id: 1101,
                    content:
                        "Thanks for creating this forum! I'm excited to be part of this community.",
                    upvotes: 5,
                    downvotes: 0,
                    createdAt: Date.now() - 150000,
                    replies: [
                        {
                            id: 1111,
                            content:
                                "You're welcome! Feel free to start a topic or ask questions anytime.",
                            upvotes: 2,
                            downvotes: 0,
                            createdAt: Date.now() - 140000,
                            replies: [],
                            showReplyBox: false
                        }
                    ],
                    showReplyBox: false
                }
            ],
            upvotes: 10,
            downvotes: 1,
            createdAt: Date.now() - 200000,
            showReplyBox: false,
            newReply: "",
            subscribed: false
        },
        {
            id: 1002,
            title: "React Hooks Discussion",
            content:
                "React Hooks have changed the way we handle state and side effects. Share your experiences!",
            subjects: ["React", "JavaScript"],
            replies: [
                {
                    id: 1102,
                    content:
                        "Hooks are a game-changer! They simplify state management and remove the need for class components.",
                    upvotes: 7,
                    downvotes: 0,
                    createdAt: Date.now() - 180000,
                    replies: [
                        {
                            id: 1112,
                            content:
                                "Absolutely! However, managing dependencies in useEffect can be tricky sometimes.",
                            upvotes: 4,
                            downvotes: 0,
                            createdAt: Date.now() - 170000,
                            replies: [],
                            showReplyBox: false
                        }
                    ],
                    showReplyBox: false
                }
            ],
            upvotes: 15,
            downvotes: 2,
            createdAt: Date.now() - 250000,
            showReplyBox: false,
            newReply: "",
            subscribed: true
        },
        {
            id: 1003,
            title: "JavaScript Best Practices",
            content:
                "What are your best practices for writing clean, maintainable, and efficient JavaScript code?",
            subjects: ["JavaScript"],
            replies: [
                {
                    id: 1103,
                    content:
                        "Always use const and let instead of var to avoid accidental reassignments.",
                    upvotes: 8,
                    downvotes: 1,
                    createdAt: Date.now() - 220000,
                    replies: [
                        {
                            id: 1113,
                            content:
                                "I agree! Also, enabling strict mode by using 'use strict' helps catch errors early.",
                            upvotes: 3,
                            downvotes: 0,
                            createdAt: Date.now() - 210000,
                            replies: [],
                            showReplyBox: false
                        }
                    ],
                    showReplyBox: false
                }
            ],
            upvotes: 12,
            downvotes: 1,
            createdAt: Date.now() - 300000,
            showReplyBox: false,
            newReply: "",
            subscribed: false
        },
        {
            id: 1004,
            title: "UI/UX Design",
            content:
                "Let's discuss the best UI/UX design trends. What practices do you follow for creating intuitive interfaces?",
            subjects: ["UI/UX", "Design"],
            replies: [
                {
                    id: 1104,
                    content:
                        "A great design should be simple, intuitive, and user-friendly.",
                    upvotes: 6,
                    downvotes: 0,
                    createdAt: Date.now() - 200000,
                    replies: [],
                    showReplyBox: false
                },
                {
                    id: 1105,
                    content:
                        "Responsive design is essential for a seamless experience across devices.",
                    upvotes: 9,
                    downvotes: 1,
                    createdAt: Date.now() - 190000,
                    replies: [
                        {
                            id: 1114,
                            content:
                                "Yes, designing for mobile-first often leads to a better overall experience.",
                            upvotes: 4,
                            downvotes: 0,
                            createdAt: Date.now() - 180000,
                            replies: [],
                            showReplyBox: false
                        }
                    ],
                    showReplyBox: false
                }
            ],
            upvotes: 14,
            downvotes: 2,
            createdAt: Date.now() - 320000,
            showReplyBox: false,
            newReply: "",
            subscribed: true
        },
        {
            id: 1005,
            title: "Tech News",
            content:
                "The technology landscape is evolving rapidly. What recent tech innovations have caught your attention?",
            subjects: ["Tech News", "Technology"],
            replies: [
                {
                    id: 1106,
                    content:
                        "AI is evolving at an incredible pace! It's impacting multiple industries.",
                    upvotes: 10,
                    downvotes: 0,
                    createdAt: Date.now() - 210000,
                    replies: [
                        {
                            id: 1115,
                            content:
                                "Indeed, AI is transforming healthcare, finance, and creative fields.",
                            upvotes: 5,
                            downvotes: 0,
                            createdAt: Date.now() - 200000,
                            replies: [],
                            showReplyBox: false
                        }
                    ],
                    showReplyBox: false
                }
            ],
            upvotes: 20,
            downvotes: 3,
            createdAt: Date.now() - 350000,
            showReplyBox: false,
            newReply: "",
            subscribed: false
        }
    ];

    // Define state variables for threads, selected thread, new thread inputs, sorting, filtering, and deletion dialog
    const [threads, setThreads] = useState<Thread[]>(initialThreads);
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
    const [newThreadTitle, setNewThreadTitle] = useState("");
    const [newThreadContent, setNewThreadContent] = useState("");
    const [newThreadSubjects, setNewThreadSubjects] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [subjectFilter, setSubjectFilter] = useState<string[]>([]);
    const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Define current user information for mentions
    const currentUserId = "1";
    const currentUserDisplay = "Alice";
    const currentUserTag = `@[${currentUserDisplay}](user:${currentUserId})`;

    // Create a new thread from the input fields
    const handleCreateThread = () => {
        if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
        const subjects = newThreadSubjects
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "");
        const newThread: Thread = {
            id: Date.now(),
            title: newThreadTitle,
            content: newThreadContent,
            subjects,
            replies: [],
            upvotes: 0,
            downvotes: 0,
            createdAt: Date.now(),
            showReplyBox: false,
            newReply: "",
            subscribed: false
        };
        setThreads([...threads, newThread]);
        setNewThreadTitle("");
        setNewThreadContent("");
        setNewThreadSubjects("");
        // Emit event for new thread creation
        eventBus.emit("newThread", newThread);
    };

    // Recursively update vote counts in replies
    const updateReplyVotes = (
        replies: Reply[],
        id: number,
        type: "upvotes" | "downvotes"
    ): Reply[] => {
        return replies.map((reply) => {
            if (reply.id === id) {
                return { ...reply, [type]: reply[type] + 1 };
            } else if (reply.replies.length > 0) {
                return { ...reply, replies: updateReplyVotes(reply.replies, id, type) };
            }
            return reply;
        });
    };

    // Handle voting for threads or replies
    const handleVote = (id: number, isThread: boolean, type: "upvotes" | "downvotes") => {
        setThreads(
            threads.map((thread) => {
                if (isThread && thread.id === id) {
                    return { ...thread, [type]: thread[type] + 1 };
                }
                return { ...thread, replies: updateReplyVotes(thread.replies, id, type) };
            })
        );
    };

    // Toggle thread subscription (star/unstar)
    const toggleSubscribe = (threadId: number) => {
        setThreads(prevThreads =>
            prevThreads.map(thread =>
                thread.id === threadId
                    ? { ...thread, subscribed: !thread.subscribed }
                    : thread
            )
        );
    };

    // Delete a thread by its ID
    const handleDeleteThread = (threadId: number) => {
        setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
        if (selectedThreadId === threadId) {
            setSelectedThreadId(null);
        }
    };

    // Recursively delete a reply from a thread
    const deleteReply = (replies: Reply[], replyId: number): Reply[] => {
        return replies.reduce<Reply[]>((acc, reply) => {
            if (reply.id === replyId) return acc;
            return [
                ...acc,
                {
                    ...reply,
                    replies: deleteReply(reply.replies, replyId)
                }
            ];
        }, []);
    };

    // Delete a specific reply from a thread
    const handleDeleteReply = (parentId: number, replyId: number) => {
        setThreads(prevThreads =>
            prevThreads.map(thread => {
                if (thread.id === parentId) {
                    return { ...thread, replies: deleteReply(thread.replies, replyId) };
                }
                return thread;
            })
        );
    };

    // Create a reply to a thread or nested reply and emit events if applicable
    const handleReply = (threadId: number, replyId: number | null = null, replyText?: string) => {
        const thread = threads.find((thread) => thread.id === threadId);
        if (!thread) return;
        let replyContent = "";
        if (replyId === null) {
            replyContent = thread.newReply || "";
        } else {
            replyContent = replyText || "";
        }
        if (!replyContent.trim()) return;
        const newReplyObj: Reply = {
            id: Date.now(),
            content: replyContent,
            upvotes: 0,
            downvotes: 0,
            createdAt: Date.now(),
            replies: []
        };

        setThreads((prevThreads) =>
            prevThreads.map((thread) => {
                if (thread.id === threadId) {
                    if (replyId === null) {
                        return {
                            ...thread,
                            replies: [...thread.replies, newReplyObj],
                            showReplyBox: false,
                            newReply: ""
                        };
                    } else {
                        const addReplyRecursively = (replies: Reply[]): Reply[] => {
                            return replies.map((reply) => {
                                if (reply.id === replyId) {
                                    return { ...reply, replies: [...reply.replies, newReplyObj], showReplyBox: false };
                                }
                                return { ...reply, replies: addReplyRecursively(reply.replies) };
                            });
                        };
                        return { ...thread, replies: addReplyRecursively(thread.replies) };
                    }
                }
                return thread;
            })
        );

        // Emit mention and subscribed reply events if conditions are met
        if (replyContent.includes(currentUserTag)) {
            eventBus.emit("mention", { threadId, reply: newReplyObj });
        }
        if (thread.subscribed) {
            eventBus.emit("subscribedReply", { threadId, reply: newReplyObj });
        }
    };

    // Update the new reply text for a thread
    const handleNewReplyChange = (threadId: number, value: string) => {
        setThreads((prevThreads) =>
            prevThreads.map((thread) => {
                if (thread.id === threadId) {
                    return { ...thread, newReply: value };
                }
                return thread;
            })
        );
    };

    // Toggle visibility of the reply box for a thread or nested reply
    const toggleReplyBox = (threadId: number, replyId: number | null = null) => {
        setThreads((prevThreads) =>
            prevThreads.map((thread) => {
                if (thread.id === threadId) {
                    if (replyId === null) {
                        return { ...thread, showReplyBox: !thread.showReplyBox };
                    } else {
                        const toggleRecursively = (replies: Reply[]): Reply[] => {
                            return replies.map((reply) => {
                                if (reply.id === replyId) {
                                    return { ...reply, showReplyBox: !reply.showReplyBox };
                                }
                                return { ...reply, replies: toggleRecursively(reply.replies) };
                            });
                        };
                        return { ...thread, replies: toggleRecursively(thread.replies) };
                    }
                }
                return thread;
            })
        );
    };

    // Toggle collapse/expand for nested replies
    const toggleCollapse = (threadId: number, replyId: number | null = null) => {
        setThreads((prevThreads) =>
            prevThreads.map((thread) => {
                if (thread.id === threadId) {
                    if (replyId === null) return thread;
                    const toggleRecursively = (replies: Reply[]): Reply[] => {
                        return replies.map((reply) => {
                            if (reply.id === replyId) {
                                return { ...reply, collapsed: !reply.collapsed };
                            }
                            return { ...reply, replies: toggleRecursively(reply.replies) };
                        });
                    };
                    return { ...thread, replies: toggleRecursively(thread.replies) };
                }
                return thread;
            })
        );
    };

    // Sort threads based on selected criteria: newest, popular, or starred (subscribed)
    const sortedThreads = [...threads].sort((a, b) => {
        if (sortBy === "newest") {
            return b.createdAt - a.createdAt;
        } else if (sortBy === "popular") {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        } else if (sortBy === "starred") {
            const aStar = a.subscribed ? 1 : 0;
            const bStar = b.subscribed ? 1 : 0;
            if (bStar !== aStar) {
                return bStar - aStar;
            }
            return b.createdAt - a.createdAt;
        }
        return 0;
    });

    // Filter threads based on selected subjects
    const filteredThreads = sortedThreads.filter((thread) => {
        if (subjectFilter.length === 0) return true;
        return thread.subjects.some((subject) => subjectFilter.includes(subject));
    });

    // Get the currently selected thread for detail view
    const currentThread = threads.find((thread) => thread.id === selectedThreadId);

    // Extract available subjects from all threads for the filter dropdown
    const availableSubjects = Array.from(new Set(threads.flatMap((thread) => thread.subjects)));

    // Component to render a reply and its nested replies
    const ReplyComponent = ({ reply, threadId }: { reply: Reply; threadId: number }) => (
        <Card sx={{ mb: 2, ml: 2, borderLeft: "2px solid #ddd", position: "relative" }}>
            <IconButton
                onClick={() => handleDeleteReply(threadId, reply.id)}
                size="small"
                sx={{ position: "absolute", top: 4, right: 4, color: "grey" }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
            <CardContent>
                <Typography variant="body2">{reply.content}</Typography>
                <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(reply.createdAt)} ago
                </Typography>
            </CardContent>
            <CardActions>
                <Tooltip title="Upvote">
                    <IconButton onClick={() => handleVote(reply.id, false, "upvotes")}>
                        <ThumbUp />
                    </IconButton>
                </Tooltip>
                <Typography>{reply.upvotes}</Typography>
                <Tooltip title="Downvote">
                    <IconButton onClick={() => handleVote(reply.id, false, "downvotes")}>
                        <ThumbDown />
                    </IconButton>
                </Tooltip>
                <Typography>{reply.downvotes}</Typography>
                <Tooltip title="Reply">
                    <Button onClick={() => toggleReplyBox(threadId, reply.id)}>Reply</Button>
                </Tooltip>
                {reply.replies.length > 0 && (
                    <Tooltip title={reply.collapsed ? "Expand" : "Collapse"}>
                        <IconButton onClick={() => toggleCollapse(threadId, reply.id)}>
                            {reply.collapsed ? <ExpandMore /> : <ExpandLess />}
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>
            {reply.showReplyBox && (
                <NestedReplyBox
                    threadId={threadId}
                    replyId={reply.id}
                    onPostReply={handleReply}
                    onCancel={() => toggleReplyBox(threadId, reply.id)}
                />
            )}
            <Collapse in={!reply.collapsed}>
                {reply.replies.map((subReply) => (
                    <ReplyComponent key={subReply.id} reply={subReply} threadId={threadId} />
                ))}
            </Collapse>
        </Card>
    );

    return (
        <Box sx={{ minWidth: "1000px", margin: "0 auto", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Discussions
            </Typography>
            {currentThread === undefined ? (
                <>
                    {/* Thread creation form */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Thread Title"
                            fullWidth
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                        />
                        <TextField
                            label="Thread Content"
                            fullWidth
                            multiline
                            minRows={3}
                            value={newThreadContent}
                            onChange={(e) => setNewThreadContent(e.target.value)}
                        />
                        <TextField
                            label="Subjects (comma-separated)"
                            fullWidth
                            value={newThreadSubjects}
                            onChange={(e) => setNewThreadSubjects(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleCreateThread}>
                            Create Thread
                        </Button>
                    </Box>
                    {/* Sorting and filtering controls */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="popular">Popular</MenuItem>
                                <MenuItem value="starred">Starred</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Subjects</InputLabel>
                            <Select
                                multiple
                                value={subjectFilter}
                                onChange={(e) =>
                                    setSubjectFilter(
                                        typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value
                                    )
                                }
                                label="Filter by Subjects"
                            >
                                {availableSubjects.map((subject) => (
                                    <MenuItem key={subject} value={subject}>
                                        {subject}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* Render list of threads */}
                    <List sx={{ mt: 2 }}>
                        {filteredThreads.map((thread) => (
                            <Card key={thread.id} sx={{ mb: 2, position: "relative" }}>
                                <IconButton
                                    onClick={() => {
                                        setThreadToDelete(thread);
                                        setDeleteDialogOpen(true);
                                    }}
                                    size="small"
                                    sx={{ position: "absolute", top: 4, right: 4, color: "grey" }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <CardContent>
                                    <Typography variant="h6">{thread.title}</Typography>
                                    <Typography variant="body2">{thread.content}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {formatDistanceToNow(thread.createdAt)} ago
                                    </Typography>
                                    {thread.subjects.length > 0 && (
                                        <Typography variant="caption" color="primary" sx={{ display: "block", mt: 1 }}>
                                            Subjects: {thread.subjects.join(", ")}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Tooltip title="Upvote">
                                        <IconButton onClick={() => handleVote(thread.id, true, "upvotes")}>
                                            <ThumbUp />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography>{thread.upvotes}</Typography>
                                    <Tooltip title="Downvote">
                                        <IconButton onClick={() => handleVote(thread.id, true, "downvotes")}>
                                            <ThumbDown />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography>{thread.downvotes}</Typography>
                                    <Tooltip title={thread.subscribed ? "Unsubscribe" : "Subscribe"}>
                                        <IconButton onClick={() => toggleSubscribe(thread.id)}>
                                            {thread.subscribed ? <Star /> : <StarBorder />}
                                        </IconButton>
                                    </Tooltip>
                                    <Button onClick={() => setSelectedThreadId(thread.id)}>View</Button>
                                </CardActions>
                                {thread.showReplyBox && (
                                    <Box sx={{ ml: 4, mb: 2 }}>
                                        <MentionsInput
                                            value={thread.newReply || ""}
                                            onChange={(e) => handleNewReplyChange(thread.id, e.target.value)}
                                            placeholder="Type your reply and tag someone with @"
                                            style={mentionsStyles}
                                        >
                                            <Mention
                                                trigger="@"
                                                data={users}
                                                markup="@[__display__](user:__id__)"
                                                style={{ backgroundColor: "#d1c4e9" }}
                                            />
                                        </MentionsInput>
                                        <Button variant="contained" onClick={() => handleReply(thread.id, null)}>
                                            Post Reply
                                        </Button>
                                        <Button variant="outlined" sx={{ ml: 1 }} onClick={() => toggleReplyBox(thread.id, null)}>
                                            Cancel
                                        </Button>
                                    </Box>
                                )}
                            </Card>
                        ))}
                    </List>
                </>
            ) : (
                <>
                    {/* Detail view of a selected thread */}
                    <Button startIcon={<ArrowBack />} onClick={() => setSelectedThreadId(null)}>
                        Back
                    </Button>
                    {currentThread && (
                        <Card sx={{ mt: 2, position: "relative" }}>
                            <IconButton
                                onClick={() => {
                                    setThreadToDelete(currentThread);
                                    setDeleteDialogOpen(true);
                                }}
                                size="small"
                                sx={{ position: "absolute", top: 4, right: 4, color: "grey" }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            <CardContent>
                                <Typography variant="h6">{currentThread.title}</Typography>
                                <Typography variant="body2">{currentThread.content}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {formatDistanceToNow(currentThread.createdAt)} ago
                                </Typography>
                                {currentThread.subjects.length > 0 && (
                                    <Typography variant="caption" color="primary" sx={{ display: "block", mt: 1 }}>
                                        Subjects: {currentThread.subjects.join(", ")}
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions>
                                <Tooltip title="Upvote">
                                    <IconButton onClick={() => handleVote(currentThread.id, true, "upvotes")}>
                                        <ThumbUp />
                                    </IconButton>
                                </Tooltip>
                                <Typography>{currentThread.upvotes}</Typography>
                                <Tooltip title="Downvote">
                                    <IconButton onClick={() => handleVote(currentThread.id, true, "downvotes")}>
                                        <ThumbDown />
                                    </IconButton>
                                </Tooltip>
                                <Typography>{currentThread.downvotes}</Typography>
                                <Tooltip title={currentThread.subscribed ? "Unsubscribe" : "Subscribe"}>
                                    <IconButton onClick={() => toggleSubscribe(currentThread.id)}>
                                        {currentThread.subscribed ? <Star /> : <StarBorder />}
                                    </IconButton>
                                </Tooltip>
                                <Button onClick={() => toggleReplyBox(currentThread.id, null)}>Reply</Button>
                            </CardActions>
                            {currentThread.showReplyBox && (
                                <Box sx={{ ml: 4, mb: 2 }}>
                                    <MentionsInput
                                        value={currentThread.newReply || ""}
                                        onChange={(e) => handleNewReplyChange(currentThread.id, e.target.value)}
                                        placeholder="Type your reply and tag someone with @"
                                        style={mentionsStyles}
                                    >
                                        <Mention
                                            trigger="@"
                                            data={users}
                                            markup="@[__display__](user:__id__)"
                                            style={{ backgroundColor: "#d1c4e9" }}
                                        />
                                    </MentionsInput>
                                    <Button variant="contained" onClick={() => handleReply(currentThread.id, null)}>
                                        Post Reply
                                    </Button>
                                    <Button variant="outlined" sx={{ ml: 1 }} onClick={() => toggleReplyBox(currentThread.id, null)}>
                                        Cancel
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    )}
                    <List sx={{ mt: 2 }}>
                        {currentThread &&
                            currentThread.replies.map((reply) => (
                                <ReplyComponent key={reply.id} reply={reply} threadId={currentThread.id} />
                            ))}
                    </List>
                </>
            )}

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this discussion?
                        <br />
                        <em>
                            Note: In the final application, this action will be tied into your team members'
                            login and user roles features.
                        </em>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (threadToDelete) {
                                handleDeleteThread(threadToDelete.id);
                            }
                            setDeleteDialogOpen(false);
                        }}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Export the DiscussionThread component as the default export
export default DiscussionThread;
