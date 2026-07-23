# Database

## Tables
- **Users:** Basic account info.
- **Profiles:** Detailed user profile info.
- **Sessions:** Practice session history.
- **Conversations:** AI chat interaction logs.
- **Messages:** Individual messages within a conversation.
- **SpeechMetrics:** AI analysis results per session.
- **Achievements:** User accomplishments.

## Relationships
- Users have one profile.
- Users have many sessions.
- Sessions contain many messages.
- Sessions have one SpeechMetric.
