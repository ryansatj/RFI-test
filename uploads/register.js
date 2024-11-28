// register.js - This JS file generates the HTML content for the registration page

const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register Page</title>
        <link rel="stylesheet" href="http://localhost:3002/uploads/register.css">
    </head>
    <body>
        <div class="register-container">
            <h1>Register</h1>
            <form action="/submit" method="POST" class="register-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
                </div>
                <button type="submit" class="register-button">Register</button>
            </form>
        </div>
    </body>
    </html>
`;

module.exports = (req, res) => {
    res.send(htmlContent);
};
