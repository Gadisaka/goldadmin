# Gold Bingo Admin

A Next.js-based administration panel for managing Gold Bingo vouchers and system administration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB=your_database_name

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Default Admin (optional - will use 0911223344 if not set)
DEFAULT_ADMIN_PHONE=0911223344
DEFAULT_ADMIN_PASSWORD=0911223344
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster or use an existing one
3. In "Network Access", add your current IP address
4. In "Database Access", create a user with read/write permissions
5. Get your connection string from "Connect" → "Connect your application"

### 4. Run Setup Script

```bash
npm run setup
```

This will:

- Test your database connection
- Create the default admin user
- Verify everything is working

### 5. Start Development Server

```bash
npm run dev
```

## 🔐 Default Login Credentials

- **Phone:** 0911223344
- **Password:** 0911223344

## 📱 Features

- **Single Login Page** at `/login`
- **Dashboard** for voucher management
- **Voucher Creation** with custom amounts and quantities
- **Secure Authentication** with JWT tokens
- **Responsive Design** with Tailwind CSS

## 🏗️ Project Structure

```
goldadmin/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Admin dashboard
│   ├── login/        # Login page
│   └── vouchers/     # Voucher management
├── lib/
│   ├── auth.js       # Authentication logic
│   ├── db.js         # Database connection
│   └── models/       # Mongoose models
├── middleware.js      # Route protection
└── scripts/          # Utility scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run setup` - Run initial setup
- `npm run seed` - Seed database with sample data

## 🔒 Security Features

- JWT-based authentication
- Protected routes with middleware
- Secure password hashing with bcrypt
- HTTP-only cookies
- IP whitelisting support

## 🚨 Troubleshooting

### Database Connection Error

- Ensure your IP is whitelisted in MongoDB Atlas
- Check your connection string in `.env.local`
- Verify database user has correct permissions

### Login Not Working

- Check browser console for errors
- Ensure JWT_SECRET is set in environment
- Verify admin user exists in database

### Redirect Issues

- Clear browser cookies
- Check if middleware is blocking access
- Verify route protection is working

## 📝 Environment Variables Reference

| Variable                 | Description               | Required | Default               |
| ------------------------ | ------------------------- | -------- | --------------------- |
| `MONGODB_URI`            | MongoDB connection string | Yes      | -                     |
| `MONGODB_DB`             | Database name             | Yes      | -                     |
| `JWT_SECRET`             | Secret for JWT tokens     | No       | fallback key          |
| `NEXTAUTH_SECRET`        | NextAuth secret           | No       | -                     |
| `NEXTAUTH_URL`           | Application URL           | No       | http://localhost:3000 |
| `DEFAULT_ADMIN_PHONE`    | Default admin phone       | No       | 0911223344            |
| `DEFAULT_ADMIN_PASSWORD` | Default admin password    | No       | 0911223344            |

## 🎯 Next Steps

1. **Customize the UI** - Modify colors, branding, and layout
2. **Add more features** - User management, analytics, etc.
3. **Deploy to production** - Set up proper environment variables
4. **Add monitoring** - Logging, error tracking, performance monitoring

## 📄 License

This project is private and proprietary.
