// pages/api/notificationPath.js

export default function handler(req, res) {
  const { validationToken } = req.query;

  // Check for a validation token sent as a query parameter in the request
  if (validationToken) {
    // Respond with the validation token and content type text/plain
    // This step is crucial for the validation of the subscription
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(validationToken);
  }

  // Handle notification logic here for POST requests
  if (req.method === 'POST') {
    // Example: Log the received notification
    console.log('Received notification:', req.body);
    
    // Ensure to respond to the notification
    return res.status(202).send('Notification received');
  }

  // For other cases or methods not supported
  return res.status(405).send('Method Not Allowed');
}
