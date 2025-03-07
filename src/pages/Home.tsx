import React from "react";
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Divider } from "@mui/material";

const userStories = [
  {
    title: "Notifications for Relevant Activities",
    description:
      "As a user, I want to receive notifications for relevant activities (new discussions, file updates, etc.), so that I stay informed and can take action as needed.",
    criteria: [
      "Users receive notifications for new discussion threads.",
      "Users receive notifications when a document they’re collaborating on is updated.",
      "Users can configure notification preferences (e.g., frequency or type of notifications).",
    ],
  },
  {
    title: "User Tags in Discussions",
    description:
      "As a user, I want to tag users in discussion threads or documents, so that I can directly notify them and bring attention to specific items.",
    criteria: [
      "Users can tag others in discussions and document comments using the '@' symbol.",
      "Tagged users receive notifications about the mention.",
      "Tags are clickable and lead to the profile of the tagged user.",
    ],
  },
  {
    title: "Discussion Threads",
    description:
      "As a user, I want to be able to initiate and participate in topic-specific discussions, so that I can collaborate with others, share knowledge, and brainstorm.",
    criteria: [
      "Users can create discussion threads on specific topics.",
      "Users can reply to discussion threads.",
      "Users can view all discussion threads they are part of.",
      "The system notifies users of new replies to threads they are following.",
    ],
  },
];

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      {userStories.map((story, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {story.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {story.description}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Acceptance Criteria:
            </Typography>
            <List>
              {story.criteria.map((criterion, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText primary={criterion} />
                  </ListItem>
                  {idx < story.criteria.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
