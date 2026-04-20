const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const simpleGit = require('simple-git');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize git
const git = simpleGit();

// Configure Multer for Video Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// API: Load Data
app.get('/api/data', (req, res) => {
    const dataPath = path.join(__dirname, 'db.json');
    if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ error: 'Data file not found' });
    }
});

// API: Save Data
app.post('/api/save', async (req, res) => {
    const newData = req.body;
    const dataPath = path.join(__dirname, 'db.json');
    
    try {
        // Always write the file first - this is what matters
        fs.writeFileSync(dataPath, JSON.stringify(newData, null, 4));
        
        // Attempt GitHub sync in background (non-blocking) - won't fail the save
        syncWithGithub('Update site configuration').catch(err => {
            console.warn('GitHub sync skipped (git not configured):', err.message);
        });
        
        res.json({ success: true, message: 'Changes saved successfully' });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Upload file (image or video)
app.post('/api/upload', upload.single('video'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    
    const relativePath = `/uploads/${req.file.filename}`;
    
    // Attempt GitHub sync in background - won't fail the upload
    syncWithGithub(`Upload file: ${req.file.filename}`).catch(err => {
        console.warn('GitHub sync skipped (git not configured):', err.message);
    });
    
    res.json({ success: true, url: relativePath });
});

async function syncWithGithub(message) {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
        const remote = `https://${token}@github.com/sagardhiman01/ai-vieo.git`;
        await git.remote(['set-url', 'origin', remote]);
    }
    await git.addConfig('user.email', 'admin@visionai.studio');
    await git.addConfig('user.name', 'Vision AI CMS');
    await git.add('./*');
    await git.commit(message);
    await git.push('origin', 'main');
}

app.get('/ping', (req, res) => res.send('pong'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // KEEP-ALIVE LOGIC: Self-ping every 10 minutes to prevent Render sleep
    const SITE_URL = 'https://layerscut.online'; // or your render internal url
    setInterval(() => {
        fetch(`${SITE_URL}/ping`)
            .then(() => console.log('Keep-alive ping successful'))
            .catch(err => console.error('Keep-alive ping failed:', err.message));
    }, 10 * 60 * 1000); // 10 minutes
});
