# Real-time Chat App 💬

A modern, full-stack real-time chat application built with the MERN stack, featuring instant messaging, user authentication, and a beautiful responsive UI.

## 🌟 Highlights

- **Tech Stack**: MERN + Socket.io + TailwindCSS + Daisy UI
- **Authentication & Authorization**: Secure JWT-based user system
- **Real-time Messaging**: Instant communication with Socket.io
- **Online User Status**: See who's currently active
- **Global State Management**: Efficient state handling with Zustand
- **Error Handling**: Comprehensive error management on client and server
- **Professional Deployment**: Ready for production deployment
- **Responsive Design**: Works seamlessly on all devices

## ✨ Features

### Core Functionality
- **Instant Messaging**: Send and receive messages in real-time
- **User Authentication**: Secure login and registration system
- **Online Status**: Real-time user presence indicators
- **Message History**: Persistent chat conversations
- **Profile Pictures**: Image upload and management with Cloudinary
- **Responsive UI**: Beautiful interface that works on desktop and mobile

### Advanced Features
- **JWT Security**: Token-based authentication with refresh mechanism
- **Real-time Updates**: Live message delivery and read receipts
- **Error Boundaries**: Graceful error handling and user feedback
- **State Persistence**: Maintain user session across browser refreshes
- **Optimized Performance**: Efficient rendering and state management

## 🛠️ Tech Stack

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **Daisy UI**: Beautiful component library built on Tailwind
- **Zustand**: Lightweight state management solution
- **Socket.io Client**: Real-time bidirectional event-based communication

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for storing messages and user data
- **Socket.io**: Real-time WebSocket communication
- **JWT**: JSON Web Tokens for secure authentication
- **Cloudinary**: Cloud-based image and video management

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Achraf-Rejouan/real-time-chat-app.git
   cd real-time-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:5001`

## 📁 Project Structure

```
real-time-chat-app/
├── backend/                # Server-side application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── socket/            # Socket.io configuration
│   └── utils/             # Utility functions
├── frontend/              # Client-side React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── store/         # Zustand state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
├── .env.example          # Environment variables template
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Messages
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages/send/:id` - Send a message

### Users
- `GET /api/users` - Get all users for sidebar
- `PUT /api/users/profile` - Update user profile

## 🌐 Socket Events

### Client to Server
- `join_room` - Join a conversation room
- `send_message` - Send a new message
- `typing` - Indicate user is typing

### Server to Client
- `new_message` - Receive new message
- `user_online` - User came online
- `user_offline` - User went offline
- `typing_indicator` - Show typing indicator

## 🎨 UI Components

Built with **Daisy UI** components for consistent, beautiful design:
- **Chat Interface**: Modern chat bubbles and message layout
- **User Sidebar**: Online users list with status indicators
- **Authentication Forms**: Styled login and signup forms
- **Profile Management**: User profile editing interface
- **Responsive Navigation**: Mobile-friendly navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Server-side request validation
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API endpoint protection
- **XSS Prevention**: Cross-site scripting protection

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run client       # Start frontend only
npm run server       # Start backend only
```

### Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Deployment Platforms
- **Render**: Full-stack deployment
- **Vercel**: Frontend deployment
- **Railway**: Backend deployment
- **MongoDB Atlas**: Database hosting
- **Cloudinary**: Image hosting

## 🧪 Testing

```bash
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🛠️ Development Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Screenshots

*Add screenshots of your application here*

## 🔧 Troubleshooting

### Common Issues

**Socket connection failed**
- Check if the server is running
- Verify CORS configuration
- Ensure correct port configuration

**Authentication errors**
- Verify JWT_SECRET is set
- Check token expiration
- Validate user credentials

**Database connection issues**
- Verify MongoDB URI
- Check network connectivity
- Ensure database permissions

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/Achraf-Rejouan/real-time-chat-app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer: [Achraf Rejouan](https://github.com/Achraf-Rejouan)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular chat applications
- Thanks to the open-source community
- Special thanks to all contributors

---

**Built with ❤️ by [Achraf Rejouan](https://github.com/Achraf-Rejouan)**
