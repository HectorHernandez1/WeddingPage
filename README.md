# Polette & Hector's Wedding Website 💑

A beautiful, responsive wedding website built with React, FastAPI, and PostgreSQL, featuring a romantic rose gold theme and bilingual support.

## ✨ Features

- 🎨 Elegant rose gold theme with custom color palette
- 🌐 Bilingual support (English/Spanish)
- 📱 Fully responsive design
- 🎭 Beautiful animations and transitions
- 🖼️ Decorative elements and romantic styling
- 🗺️ Event details and travel information
- 📖 Interactive "Our Story" timeline
- 📝 RSVP system with database storage
- 🔒 SSL/HTTPS security

## 🎨 Design Elements

### Color Palette
- Light Rose Gold: `#f7cac9`
- Rose Gold: `#b76e79`
- Dark Rose Gold: `#926066`

### Typography
- Cursive Font: "Great Vibes" for romantic elements
- Primary Serif: "Playfair Display" for headings
- Secondary Serif: "Cormorant Garamond" for body text

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v18 or higher)
- Python 3.11+

### Local Development

1. Clone the repository
```bash
git clone https://github.com/HectorHernandez1/WeddingPage.git
cd WeddingPage
```

2. Set up environment variables
```bash
cp .env.example .env 
# Edit .env with your settings
```

3. Start the development environment
```bash
docker-compose up
```

### Running Tests

Backend tests use `pytest`. Install the API requirements and run `pytest` from
the project root:

```bash
pip install -r api/requirements.txt
pytest
```

### Production Deployment

1. Set up SSL certificates
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

2. Create production environment file
```bash
cp .env.example .env.production
# Edit .env.production with production settings
```

3. Deploy using production configuration
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🛠️ Technical Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Internationalization**: React Context
- **Animations**: CSS Transitions & Transforms

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: Raw SQL with psycopg2
- **Security**: Rate limiting, CORS, Input validation

### Infrastructure
- **Web Server**: Nginx
- **SSL**: Let's Encrypt
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions


## 📦 Project Structure

```
WeddingPage/
├── api/                 # FastAPI backend
│   ├── app/            # API application code
│   └── requirements.txt # Python dependencies
├── Database/           # Database scripts and migrations
│   └── schema.sql     # Database schema
├── react_app/         # React frontend
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── index.html     # Entry point
├── docker-compose.yml        # Local development config
├── docker-compose.prod.yml   # Production config
└── README.md
```

## 🤝 Contributing

This is a personal wedding website, but if you find any bugs or have suggestions, please feel free to open an issue.

## 📝 License

This project is private and for personal use only.

## 🙏 Acknowledgments

- FastAPI for the high-performance API framework
- PostgreSQL for reliable data storage
- Docker for containerization
- Nginx for production-grade web serving
- Let's Encrypt for SSL certificates