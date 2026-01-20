# Notifier Service

Service de notifications multi-canaux via RabbitMQ (Email, SMS, Push).

## Config (.env.dev)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@paris-sportif.com
```

## Usage

### Email
```typescript
await notifier.emit('send_notification', {
  type: 'EMAIL',
  data: {
    to: 'user@example.com',
    subject: 'Hello',
    html: '<h1>Hi!</h1>'
  }
});
```

### SMS (à venir)
```typescript
await notifier.emit('send_notification', {
  type: 'SMS',
  data: {
    to: '+33612345678',
    message: 'Hello!'
  }
});
```

### Push (à venir)
```typescript
await notifier.emit('send_notification', {
  type: 'PUSH',
  data: {
    to: 'device-token',
    title: 'Hello',
    body: 'Message'
  }
});
```
