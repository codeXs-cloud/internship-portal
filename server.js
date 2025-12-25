// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    appliedInternships: [String]
});
const User = mongoose.model('User', UserSchema);

const InternshipSchema = new mongoose.Schema({
    company: String,
    role: String,
    startDate: String, // Format YYYY-MM
    endDate: String,   // Format YYYY-MM
    link: String
});
const Internship = mongoose.model('Internship', InternshipSchema);

// --- CONFIG ---
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// --- DATABASE ---
// URL Encoded Password: @ becomes %40
const connectionString = "mongodb+srv://admin:Adhyan%402004@cluster0.znpzm7c.mongodb.net/internshipDB?appName=Cluster0";

mongoose.connect(connectionString)
    .then(() => console.log("✅ Connected to MongoDB Atlas Cloud!"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- ROUTES ---

// 1. SIGNUP
app.post('/api/signup', async (req, res) => {
    const { email, password, role, adminKey } = req.body;
    if (role === 'admin' && adminKey !== 'codeXs@2004') {
        return res.status(403).json({ error: "Invalid Admin Passkey" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email, password: hashedPassword, role, appliedInternships: [] });
        await user.save();
        res.json({ message: "User created successfully" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.role !== role) return res.status(400).json({ error: "User not found or wrong role" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ id: user._id, email: user.email, role: user.role, appliedInternships: user.appliedInternships });
});

// 3. CRUD INTERNSHIPS
app.get('/api/internships', async (req, res) => {
    const internships = await Internship.find();
    res.json(internships);
});

app.post('/api/internships', async (req, res) => {
    const newInternship = new Internship(req.body);
    await newInternship.save();
    res.json(newInternship);
});

app.put('/api/internships/:id', async (req, res) => {
    try {
        const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

app.delete('/api/internships/:id', async (req, res) => {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 4. TOGGLE APPLY
app.post('/api/users/:id/apply', async (req, res) => {
    const { internshipId } = req.body;
    const user = await User.findById(req.params.id);
    if (user.appliedInternships.includes(internshipId)) {
        user.appliedInternships = user.appliedInternships.filter(id => id !== internshipId);
    } else {
        user.appliedInternships.push(internshipId);
    }
    await user.save();
    res.json(user.appliedInternships);
});

// Use the port Render gives us, or 3000 if running locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));