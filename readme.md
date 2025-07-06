# Scheduling/Calendar App Development Prompt

## Project Overview

Develop a web-based scheduling and calendar application hosted at `hydra.newpaltz.edu/calendar`. It will allow authenticated TAs and professors to manage events, lab hours, and schedules. All users can view events, but only authenticated users can create, edit, or delete events. Authentication is done via campus Single Sign-On (SSO) using the `hydra-saml-auth` middleware with Office 365.

## Tech Stack

* **Backend**: Laravel (PHP), Composer
* **Frontend**: React, Inertia.js, Blade Templates (emails/fallback)
* **Authentication**: Hydra SAML Auth Middleware
* **Database**: MySQL or SQLite
* **Design**: Bento-style, responsive, clean UI similar to Framer

---

## Authentication

* Use existing SSO at `hydra.newpaltz.edu/login`.
* Protect edit/create/delete event routes using provided middleware:

```javascript
// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Not authenticated' });
}
```

* Initially, any logged-in user can edit; structure logic to add role-based permissions in the future (TA, Professor).

---

## Event Management

### Event Attributes

* **Title** (Short Text)
* **Description** (Long Text, optional)
* **Room** (Short Text)
* **Start & End Time** (DateTime picker)
* **Recurring**: Select days of the week and semester duration

### Semester Duration

* **Spring 2025**: January 21 – May 15
* **Fall 2025**: August 25 – December 18
* *Winter and Summer semesters as future placeholders.*

### CRUD Operations

* **Create, Update, Delete** events restricted to authenticated users.
* **View** events available publicly (no auth required).

---

## Calendar Interface

* Allow users to switch views:

  * **Day View**: Detailed single-day schedule
  * **Week View**: Seven-day horizontal layout
  * **Month View**: Traditional monthly grid
  * **Year View**: Overview highlighting each month

* Smooth transitions between views.

* Highlight the current date prominently.

---

## User Interface Design

* **Responsive & Mobile-Friendly**: Adaptable for desktops, tablets, and phones.
* **Bento Box Layout**: Clean, grid-based UI with modular blocks/cards.
* **Intuitive Navigation**: Easily accessible buttons for switching views, adding events.
* **Interactive & Reactive**: Immediate feedback when creating/editing events.

---

## Backend Structure (MVC)

### Models

* **Event Model**

  * `id`, `title`, `description`, `room`, `start_time`, `end_time`, `recurrence_pattern` (e.g., weekdays), `semester`.
* **User Model** *(future use)*

  * `id`, `name`, `email`, `role` (e.g., TA, Professor, Student).

### Controllers

* `EventController`

  * `index()`: Show calendar with events
  * `store()`: Create event
  * `update()`: Edit event
  * `destroy()`: Delete event

### Routes Example

```php
Route::middleware(['ensureAuthenticated'])->group(function () {
    Route::post('/calendar/events', [EventController::class, 'store']);
    Route::put('/calendar/events/{id}', [EventController::class, 'update']);
    Route::delete('/calendar/events/{id}', [EventController::class, 'destroy']);
});

Route::get('/calendar', [EventController::class, 'index']);
```

---

## Database Schema

```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    room VARCHAR(50),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    recurrence_pattern VARCHAR(255), -- e.g., "Mon,Wed,Fri"
    semester VARCHAR(50) -- e.g., "Spring 2025"
);
```

---

## Deployment

* Hosted at `hydra.newpaltz.edu/calendar` in a Docker container
* Ensure secure connections via HTTPS.
* Integrate seamlessly with existing campus SSO infrastructure.

---

## Future Considerations

* Add role-based permissions for granular access control.
* Implement detailed recurring event rules (exceptions, custom patterns).
* Integrate notifications, calendar exports (e.g., iCal), and real-time updates.
