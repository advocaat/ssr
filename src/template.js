export default (body) => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
           
        </head>
        <body>
            <div id="app">${body}</div>
            
            <script src="/bund.js"></script>
        </body>
    </html>`;