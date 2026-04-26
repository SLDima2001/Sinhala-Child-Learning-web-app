const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Milestone = require('./models/Milestone');
const Document = require('./models/Document');
const TeamMember = require('./models/TeamMember');

dotenv.config();

const milestones = [
  { title: 'Project Proposal', description: 'Initial presentation of the project idea, domain, and literature survey.', date: new Date('2026-03-01'), marksPercentage: 10, status: 'Completed' },
  { title: 'Progress Presentation 1', description: 'Demonstration of initial UI designs and basic backend APIs.', date: new Date('2026-04-15'), marksPercentage: 15, status: 'Completed' },
  { title: 'Progress Presentation 2', description: 'Showcase of the functional MERN stack application with core features.', date: new Date('2026-05-20'), marksPercentage: 15, status: 'Upcoming' },
  { title: 'Final Presentation & Viva', description: 'Comprehensive walkthrough of the completed system and architecture.', date: new Date('2026-06-15'), marksPercentage: 60, status: 'Upcoming' }
];

const documents = [
  { title: 'Project Charter', description: 'High-level project scope and requirements.', type: 'Charter', link: '#' },
  { title: 'Proposal Document', description: 'Detailed problem statement and proposed methodology.', type: 'Report', link: '#' },
  { title: 'UI Mockups', description: 'Prototypes and design specifications.', type: 'Report', link: '#' },
  { title: 'Final Report Drafting', description: 'Draft for the final year project report.', type: 'Report', link: '#' }
];

const teamMembers = [
  { name: 'John Doe', role: 'Full Stack Developer', email: 'john@example.com', achievements: ['Best UI Design Award', 'Hackathon Winner'], photoUrl: 'https://placehold.co/150x150?text=JD' },
  { name: 'Jane Smith', role: 'Backend Engineer', email: 'jane@example.com', achievements: ['DB Optimization Expert'], photoUrl: 'https://placehold.co/150x150?text=JS' },
  { name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@example.com', achievements: ['Certified React Native Developer'], photoUrl: 'https://placehold.co/150x150?text=AJ' },
  { name: 'Bob Williams', role: 'QA & Testing', email: 'bob@example.com', achievements: ['Automated Testing Master'], photoUrl: 'https://placehold.co/150x150?text=BW' }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-website');
    
    await Milestone.deleteMany();
    await Document.deleteMany();
    await TeamMember.deleteMany();

    await Milestone.insertMany(milestones);
    await Document.insertMany(documents);
    await TeamMember.insertMany(teamMembers);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
