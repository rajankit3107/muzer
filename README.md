# Muzer 🎵

A modern music streaming platform built with Next.js that allows users to share and discover YouTube music videos with a social voting system.

## ✨ Features

- **🔐 Google Authentication** - Secure login with NextAuth.js
- **🎥 YouTube Integration** - Share and discover YouTube music videos
- **👍 Social Voting** - Upvote and downvote your favorite tracks
- **📱 Responsive Design** - Beautiful UI built with Tailwind CSS
- **⚡ Real-time Updates** - Fast and responsive user experience
- **🗄️ Database Integration** - PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Database**: PostgreSQL with Prisma ORM
- **API**: YouTube Search API
- **Validation**: Zod
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credential

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd muzer/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/muzer"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth configuration
│   │   └── streams/
│   │       ├── route.ts              # Stream CRUD operations
│   │       ├── upvote/
│   │       │   └── route.ts          # Upvote functionality
│   │       └── downvote/
│   │           └── route.ts          # Downvote functionality
│   ├── components/
│   │   └── appbar.tsx                # Navigation component
│   ├── lib/
│   │   └── db.ts                     # Prisma client
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── prisma/
│   └── schema.prisma                 # Database schema
├── auth.ts                           # NextAuth configuration
├── package.json
└── README.md
```

## 🗄️ Database Schema

### User Model

- `id`: Unique identifier
- `email`: User email (unique)
- `provider`: Authentication provider (Google)
- `streams`: User's shared streams
- `upvotes`: User's upvotes

### Stream Model

- `id`: Unique identifier
- `type`: Stream type (YouTube/Spotify)
- `url`: Original video URL
- `extractedId`: Video ID extracted from URL
- `title`: Video title
- `smallImg`: Thumbnail URL (small)
- `bigImg`: Thumbnail URL (large)
- `active`: Stream status
- `userId`: Owner of the stream
- `upvotes`: Associated upvotes

### Upvote Model

- `id`: Unique identifier
- `userId`: User who upvoted
- `streamId`: Stream that was upvoted
- Unique constraint on `userId` + `streamId`

## 🔌 API Endpoints

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Streams

- `POST /api/streams` - Create a new stream
  ```json
  {
    "creatorId": "user-id",
    "url": "https://www.youtube.com/watch?v=VIDEO_ID"
  }
  ```
- `GET /api/streams?creatorId=USER_ID` - Get streams by creator

### Voting

- `POST /api/streams/upvote` - Upvote a stream
  ```json
  {
    "streamId": "stream-id"
  }
  ```
- `POST /api/streams/downvote` - Downvote a stream
  ```json
  {
    "streamId": "stream-id"
  }
  ```

## 🎯 Key Features Explained

### YouTube Integration

- Validates YouTube URLs using regex patterns
- Extracts video metadata (title, thumbnails)
- Supports both `youtube.com` and `youtu.be` formats
- Fetches video details using YouTube Search API

### Authentication Flow

- Google OAuth integration
- Automatic user creation on first sign-in
- Session management with NextAuth.js
- Protected API routes

### Voting System

- One vote per user per stream
- Prevents duplicate votes
- Real-time vote counting
- User authentication required

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes
- `npx prisma migrate dev` - Create and apply migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built following the [100xDevs](https://100xdevs.com) curriculum
- Inspired by modern music streaming platforms
- Thanks to the open-source community for the amazing tools

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or reach out to the development team.

---

**Happy coding! 🎵✨**
