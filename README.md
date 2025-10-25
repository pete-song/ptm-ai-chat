# PTM AI Chat

A modern AI chatbot application built with Next.js, shadcn/ui, and OpenAI integration. Features a ChatGPT-like interface with conversation management, real-time messaging, and responsive design.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 💬 **Chat Interface**: ChatGPT-like messaging experience
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Conversation Management**: Create, switch between, and delete conversations
- ⚡ **Real-time Updates**: Live typing indicators and message updates
- 🤖 **AI Integration**: Ready for OpenAI API integration
- 📊 **Data Support**: Prepared for Excel file processing (P5.xlsx)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional for initial setup)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## OpenAI API Setup

To enable actual AI functionality:

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. Uncomment the OpenAI integration code in `app/api/chat/route.ts`
4. Restart the development server

## Project Structure

```
├── app/
│   ├── api/chat/          # API routes for chat functionality
│   ├── globals.css         # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── chat-interface.tsx # Main chat interface
│   ├── chat-input.tsx     # Message input component
│   ├── chat-message.tsx   # Individual message component
│   ├── sidebar.tsx        # Conversation sidebar
│   └── typing-indicator.tsx # Loading animation
├── lib/
│   └── utils.ts           # Utility functions
└── public/
    └── data/
        └── P5.xlsx        # Sample Excel file for data processing
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 16** - React framework
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **OpenAI API** - AI integration
- **xlsx** - Excel file processing
- **Lucide React** - Icons

## Features in Detail

### Chat Interface
- Clean, modern design similar to ChatGPT
- Message bubbles with timestamps
- User and AI message differentiation
- Auto-scroll to latest messages

### Sidebar
- Conversation history
- New chat creation
- Conversation switching
- Delete conversations
- Mobile-responsive with toggle

### Input Area
- Multi-line text input
- Send button with loading state
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Character limit handling

### Future Enhancements
- File upload support
- Excel data integration
- Message search
- Export conversations
- Custom AI models
- Voice input/output

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.