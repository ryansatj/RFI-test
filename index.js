const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // For running the file in a child process

const app = express();
const PORT = 3002;

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route: Serve the upload form
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>File Upload</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        text-align: center;
                        padding: 50px;
                    }

                    h1 {
                        font-size: 2rem;
                        margin-bottom: 20px;
                    }

                    .button-container {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-top: 30px;
                    }

                    .nav-button {
                        background-color: #007bff;
                        color: white;
                        padding: 12px 20px;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }

                    .nav-button:hover {
                        background-color: #0056b3;
                    }

                    .nav-button:active {
                        background-color: #003c82;
                    }
                </style>
            </head>
            <body>
                <h1>Welcome to html css compiler with Template Page</h1>
                <p>Choose one of the template options below to proceed:</p>

                <div class="button-container">
                    <a href="/template/login.js" class="nav-button">Login</a>
                    <a href="/template/register.js" class="nav-button">Register</a>
                    <a href="/template/blank.js" class="nav-button">Blank Page</a>
                </div>
            </body>
        </html>
    `);
});


// Route: Handle file upload
app.post('/upload', (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).send('Filename and content are required.');
    }

    // Ensure the filename has a valid extension (e.g., .js)
    const validExtensions = ['.js', '.txt', '.html', '.css'];
    const fileExtension = path.extname(filename);

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).send('Invalid file extension. Use .js, .txt, .html, or .css');
    }

    const filePath = path.join(__dirname, 'uploads', filename);

    // Write the content to the file
    fs.writeFileSync(filePath, content);

    // Redirect to template page
    res.redirect(`/template/${filename}`);
    res.redirect(`/template/${filename}`);
    res.redirect(`/template/${filename}`);
    res.redirect(`/template/${filename}`);
});

// Dynamic route to execute the uploaded .js file
app.get('/execute/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Ensure it's a .js file
        const fileExtension = path.extname(filename);
        if (fileExtension !== '.js') {
            return res.status(400).send('Invalid file type. Only .js files can be executed.');
        }

        // Read the content of the .js file
        const fileContent = fs.readFileSync(filePath, 'utf8');

        try {
            const scriptFunction = require(filePath);  // Execute the uploaded file as a module
            scriptFunction(req, res);  // Pass req and res to send the HTML content

        } catch (error) {
            // Handle any errors that occur during execution
            res.status(500).send(`
                <h1>Error Executing File</h1>
                <p>Error: ${error.message}</p>
            `);
        }
    } else {
        res.status(404).send('File not found');
    }
});

// Route: Template page that shows the left and right sections
// Route: Template page that shows the left and right sections with the filename as part of the URL
app.get('/template/:filename?', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    const filenames = fs.readdirSync(uploadsDir).filter(file => {
        return fs.statSync(path.join(uploadsDir, file)).isFile();
    });

    const { filename } = req.params;  // Get filename from URL path parameter
    const fileName = filename && filenames.includes(filename) ? filename : filenames.length > 0 ? filenames[0] : 'ivan.js';
    const filePath = path.join(uploadsDir, fileName);

    let uploadedContent = '';
    if (fs.existsSync(filePath)) {
        uploadedContent = fs.readFileSync(filePath, 'utf8');
    }

    const templateContent = `
        <html>
            <head>
                <title>Template View</title>
                <style>
                    body {
                        display: flex;
                        justify-content: space-between;
                        padding: 20px;
                    }
                    .left, .right {
                        width: 45%;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    .right textarea {
                        width: 100%;
                        height: 200px;
                        font-family: monospace;
                        font-size: 14px;
                    }
                </style>
                <script>
                    // Function to fetch the content of the selected file
                    function fetchFileContent() {
                        const filename = document.getElementById('filename').value;
                        
                        // Fetch the content of the selected file
                        fetch('/fetch-file?filename=' + filename)
                            .then(response => response.text())
                            .then(data => {
                                document.getElementById('content').value = data;
                            })
                            .catch(error => alert('Error fetching file content: ' + error));
                    }

                    // When the dropdown changes, redirect to the selected file's URL
                    function handleFileChange() {
                        const filename = document.getElementById('filename').value;
                        window.location.href = '/template/' + filename;  // Redirect to the selected filename
                    }
                </script>
            </head>
            <body>
                <div class="left">
                    <h2>Executed File Output</h2>
                    <iframe src="http://localhost:3002/execute/${fileName}" width="100%" height="400px"></iframe>
                </div>
                <div class="right">
                    <h2>Edit File</h2>
                    <form action="/upload" method="POST">
                        <label for="filename">Filename:</label>
                        <select name="filename" id="filename" onchange="handleFileChange()">
                            ${filenames.map(file => {
                                return `<option value="${file}" ${file === fileName ? 'selected' : ''}>${file}</option>`;
                            }).join('')}
                        </select><br><br>
                        
                        <label for="content">File Content:</label><br>
                        <textarea name="content" id="content">${uploadedContent}</textarea><br><br>
                        
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </body>
        </html>
    `;

    res.send(templateContent);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
