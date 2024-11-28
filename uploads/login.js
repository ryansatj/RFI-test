// login.js - This JS file generates the HTML content for the login page

const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Page</title>
        <link rel="stylesheet" href="http://localhost:3002/uploads/login.css">
    </head>
    <body>
        <div class="login-container">
            <h1>Login</h1>
            <form action="/submit" method="POST" class="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required placeholder="Enter your username">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>
                <button type="submit" class="login-button">Login</button>
            </form>
        </div>
    </body>
    </html>
`;

module.exports = (req, res) => {
    res.send(htmlContent);
};
