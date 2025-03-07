import { Container, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";

const About = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom color="primary">
                        About Research Management System (RMS)
                    </Typography>
                    <Typography variant="body1">
                        Welcome to the Research Management System (RMS), a platform designed to facilitate collaboration,
                        discussions, and organization in research environments. RMS aims to enhance communication among
                        researchers, streamline documentation, and ensure seamless knowledge sharing within academic and
                        professional research communities.
                    </Typography>
                    <Typography variant="h5" gutterBottom>Key Features</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Discussion Threads" secondary="Engage in topic-specific discussions, share insights, and collaborate with peers through structured conversation threads." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="User Mentions" secondary="Easily tag colleagues using the '@' mention feature to bring their attention to relevant discussions." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Notifications" secondary="Stay informed with real-time updates on new discussions, replies, and mentions, ensuring you never miss important conversations." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Customizable Preferences" secondary="Personalize your notification settings to receive updates based on your preferences." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="User-Friendly Interface" secondary="A clean and intuitive UI designed to facilitate smooth navigation and efficient research collaboration." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Light/Dark Mode" secondary="Toggle between light and dark themes for a comfortable viewing experience." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>Why Use RMS?</Typography>
                    <Typography variant="body1">
                        RMS is built for researchers, by researchers, with a focus on improving productivity and collaboration in
                        research-driven environments. Whether you're engaging in academic discussions, managing collaborative
                        projects, or sharing best practices in research methodologies, RMS provides a structured and interactive
                        platform for knowledge exchange.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default About;