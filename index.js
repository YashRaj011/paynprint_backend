const express = require('express');
const multer = require('multer');

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { calculatePrice } = require('./utils/priceCalc');
const { getPageCount } = require('./utils/pdfUtils');

const app = express();
const PORT = 8000;
const cors = require('cors');
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST'],
  credentials: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Setup file upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.memoryStorage();
const upload = multer({ storage });
const convertToPDF = require('./utils/convertTopdf');
// Route 1: Upload + Parameters => fileId + preview iframe + price
app.post('/upload-process', upload.single('document'), async (req, res) => {
//   try {
//     console.log('📄 File uploaded:', req.file?.filename);
//     console.log('⚙️ Settings received:', req.body);

//     const fileId = path.parse(req.file.filename).name;
//     const settings = req.body;
//     const filePath = path.join(uploadDir, req.file.filename);

//     const pageCount = await getPageCount(filePath);
//     console.log('📄 Page count:', pageCount);

//     const price = calculatePrice(pageCount, settings);
//     const previewUrl = `/files/${req.file.filename}`;

//     const response = { fileId, previewUrl, price };
//     console.log('✅ Responding with:', response);
//     res.json({ fileId, previewUrl, price });
//   } catch (err) {
//     console.error('❌ Error in /upload-process:', err);
//     res.status(500).json({ error: 'Failed to process document' });
//   }
// });
//   try {
//     const fileId = path.parse(req.file.filename).name;
//     const settings = req.body;
//     const filePath = path.join(uploadDir, req.file.filename);

//     const pageCount = await getPageCount(filePath);
//     const price = calculatePrice(pageCount, settings);
//     const previewUrl = `/files/${req.file.filename}`;
    
//     res.json({ fileId, previewUrl, price });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to process document' });
//   }
// });
  try {
    const { originalname, buffer } = req.file;

    // Only allow certain file types
    const allowed = ['.pdf', '.docx', '.pptx', '.xlsx'];
    const ext = path.extname(originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Convert to PDF (or just write if already PDF)
    let finalPath;
    if (ext === '.pdf') {
      const pdfName = `${Date.now()}-${originalname}`;
      finalPath = path.join(__dirname, 'uploads', pdfName);
      fs.writeFileSync(finalPath, buffer); // save PDF directly
    } else {
      finalPath = await convertToPDF(buffer, originalname);
    }
    // kuch bhi
    const fileId = path.parse(finalPath).name;
    const previewUrl = `/files/${path.basename(finalPath)}`;
    const pageCount = await getPageCount(finalPath); // optional
    const price = calculatePrice(pageCount, req.body); // your logic

    res.status(200).json({ fileId, previewUrl, price });

  } catch (err) {
    console.error('❌ Upload/conversion error:', err);
    res.status(500).json({ error: 'Upload or conversion failed' });
  }
});
// Route 2: fileId + settings => price only
app.post('/calculate-price', async (req, res) => {
  try {
    const { fileId, settings } = req.body;
    const filePath = path.join(uploadDir, `${fileId}.pdf`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    const pageCount = await getPageCount(filePath);
    const price = calculatePrice(pageCount, settings);

    res.json({ price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Price calculation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});