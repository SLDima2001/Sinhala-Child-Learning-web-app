const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Milestone = require('../models/Milestone');
const Document = require('../models/Document');
const TeamMember = require('../models/TeamMember');
const ProjectOverview = require('../models/ProjectOverview');

// Get all milestones
router.get('/milestones', async (req, res) => {
  try {
    const milestones = await Milestone.find().sort({ date: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all documents
router.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all team members
router.get('/team', async (req, res) => {
  try {
    const team = await TeamMember.find();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Hardcoded Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    // In a real app we'd use JWT, but per requirement we are keeping it simple
    res.json({ token: 'hardcoded-secure-token-123', message: 'Logged in successfully' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protect middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer hardcoded-secure-token-123') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Upload a document
router.post('/documents/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, type } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newDoc = new Document({
      title,
      description,
      type,
      fileData: req.file.buffer,
      contentType: req.file.mimetype
    });

    await newDoc.save();
    
    // Update link to point to our download endpoint
    newDoc.link = `/api/documents/download/${newDoc._id}`;
    await newDoc.save();

    res.status(201).json({ message: 'Document uploaded successfully', document: newDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download a document
router.get('/documents/download/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.fileData) {
      return res.status(404).json({ message: 'Document or file data not found' });
    }

    res.set('Content-Type', doc.contentType);
    res.set('Content-Disposition', `inline; filename="${doc.title}"`);
    res.send(doc.fileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DELETE Document ---
router.delete('/documents/:id', requireAuth, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MILESTONE CMS ---
router.post('/milestones', requireAuth, async (req, res) => {
  try {
    const newMilestone = new Milestone(req.body);
    await newMilestone.save();
    res.status(201).json(newMilestone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/milestones/:id', requireAuth, async (req, res) => {
  try {
    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- TEAM MEMBER CMS ---
router.post('/team', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { name, role, email, achievements } = req.body;
    let achievementsArray = [];
    if (achievements) {
      achievementsArray = Array.isArray(achievements) ? achievements : achievements.split(',').map(a => a.trim());
    }

    const newTeamMember = new TeamMember({
      name,
      role,
      email,
      achievements: achievementsArray
    });

    if (req.file) {
      newTeamMember.photoData = req.file.buffer;
      newTeamMember.photoContentType = req.file.mimetype;
    }

    await newTeamMember.save();
    res.status(201).json(newTeamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Download/View team member photo
router.get('/team/photo/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member || !member.photoData) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.set('Content-Type', member.photoContentType);
    res.send(member.photoData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/team/:id', requireAuth, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- PROJECT OVERVIEW ---
// Public: get overview
router.get('/project-overview', async (req, res) => {
  try {
    let overview = await ProjectOverview.findOne();
    if (!overview) {
      overview = {};
    }
    res.json(overview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected: upsert overview
router.put('/project-overview', requireAuth, async (req, res) => {
  try {
    const { title, description, highlights, videoUrl } = req.body;
    let highlightsArray = [];
    if (highlights) {
      highlightsArray = Array.isArray(highlights)
        ? highlights
        : highlights.split(',').map(h => h.trim()).filter(Boolean);
    }
    const overview = await ProjectOverview.findOneAndUpdate(
      {},
      { title, description, highlights: highlightsArray, videoUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(overview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
