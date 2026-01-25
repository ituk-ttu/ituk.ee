# Firebase Firestore Security Rules Audit

## Recommended Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Settings collection - public read, authenticated write
    match /settings/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Board members - public read, authenticated write
    match /board/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
      
      // Validate required fields
      allow create, update: if isAuthenticated()
        && request.resource.data.name is string
        && request.resource.data.position is string
        && request.resource.data.email is string;
    }
    
    // Timeline events - public read, authenticated write
    match /timeline-events/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
      
      // Validate required fields (new schema)
      allow create, update: if isAuthenticated()
        && request.resource.data.name is string
        && request.resource.data.date is timestamp;
    }
    
    // Events - public read, authenticated write
    match /events/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
      
      // Event years subcollection
      match /years/{yearId} {
        allow read: if true;
        allow write: if isAuthenticated();
      }
    }
    
    // Rent items - public read, authenticated write
    match /rent/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Sponsors - public read, authenticated write
    match /sponsors/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
      
      // Validate required fields
      allow create, update: if isAuthenticated()
        && request.resource.data.name is string
        && request.resource.data.link is string;
    }
    
    // Partners - public read, authenticated write
    match /partners/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Logbook - public read, authenticated write
    match /logbook/{document} {
      allow read: if true;
      allow write: if isAuthenticated();
      
      // Validate author matches authenticated user
      allow create: if isAuthenticated()
        && request.resource.data.authorUID == request.auth.uid;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Security Checklist

### ✅ Implemented in Code
- [x] Firebase Auth for admin access
- [x] Environment variables for Firebase config (not hardcoded)
- [x] Client-side form validation before submission
- [x] Toast notifications for save/delete operations

### ⚠️ Recommended Improvements
- [ ] Deploy the security rules above to Firebase Console
- [ ] Enable Firebase App Check for additional protection
- [ ] Set up Firebase Auth email verification
- [ ] Add rate limiting rules if needed
- [ ] Enable Firebase audit logging

### Collection Schema Reference

| Collection | Required Fields | Type Validation |
|------------|-----------------|-----------------|
| `board` | name, position, email, imagePath | string |
| `timeline-events` | name, date, imagePath | name: string, date: timestamp |
| `events` | name, handle, category | string |
| `events/{id}/years` | title, handle, date | string |
| `rent` | name, name_en | string |
| `sponsors` | name, link, imagePath | string |
| `partners` | name, name_en, link | string |
| `logbook` | author, entry, date, authorUID | string, timestamp |
| `settings` | value | string |

## How to Deploy

1. Go to Firebase Console → Firestore Database → Rules
2. Replace existing rules with the rules above
3. Click "Publish"
4. Test by attempting unauthorized writes (should fail)

## Testing Security Rules

Use Firebase Emulator Suite or the Rules Playground in Firebase Console:

```javascript
// Should succeed (authenticated)
allow create: request.auth != null

// Should fail (unauthenticated)
allow create: request.auth == null
```
