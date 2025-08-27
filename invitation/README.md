# VPlanit • Invitation & RSVP Webpage

A beautiful, shareable invitation + RSVP page with multi-member inputs, event selection, accommodation needs, arrival details, and transport modes.

## ✨ Features

- **Edge-to-edge dark theme** with VPlanit yellow accent (#ffd43b)
- **Multi-member RSVP** with individual guest details
- **Event selection** (Haldi, Mehndi, Sangeet, Wedding, Reception)
- **Accommodation tracking** for each guest
- **Arrival details** (date, time, city)
- **Transport modes** (Flight, Train, Car, Bus, Other)
- **Dietary preferences** (Veg, Non-Veg, Vegan, Jain)
- **Real-time summary** with guest table
- **Export functionality** (JSON & CSV)
- **Local storage** for draft saving
- **Responsive design** for all devices

## 🚀 Usage

1. **Open** `.web/invitation/index.html` in your browser
2. **Customize** couple names, date, and venue in the hero section
3. **Fill out** family details and contact information
4. **Select events** the family will attend
5. **Add family members** with individual details
6. **Set travel plans** and accommodation needs
7. **Save draft** or submit RSVP
8. **Export data** as JSON or CSV

## 🎨 Customization

### Couple Details
Edit the hero section in `index.html`:
```html
<span id="coupleNames">Aarav & Aditi</span>
<span id="eventDate">Sunday, 12 Oct 2025</span>
<span id="venueName">Jaipur</span>
```

### Events
Modify the events list in the HTML:
```html
<label><input class="evt" type="checkbox" value="Haldi"> Haldi</label>
<label><input class="evt" type="checkbox" value="Mehndi"> Mehndi</label>
```

### Colors
Update CSS variables in `styles.css`:
```css
:root {
  --accent: #ffd43b;  /* VPlanit yellow */
  --bg: #0b0c0f;      /* Dark background */
  --card: #111318;     /* Card background */
}
```

## 🔧 Technical Details

- **Vanilla HTML/CSS/JavaScript** - No frameworks required
- **Local Storage** - Data persists between sessions
- **Responsive Grid** - Works on all screen sizes
- **Form Validation** - Required fields and error handling
- **Keyboard Shortcuts** - Ctrl+S (save), Ctrl+Enter (submit)
- **Accessibility** - Proper ARIA labels and focus states

## 📱 Mobile Experience

- **Touch-friendly** form inputs
- **Responsive grids** that stack on small screens
- **Optimized spacing** for mobile devices
- **Smooth scrolling** between sections

## 🔗 Integration

The page is currently self-contained with local storage. To integrate with your backend:

1. **Replace** the `save()` function in `script.js`
2. **POST** the RSVP data to your API endpoint
3. **Handle** success/error responses
4. **Update** the notice messages accordingly

## 📊 Data Structure

The RSVP data is structured as:
```json
{
  "familyName": "Pachauri Family",
  "contactPhone": "+91 98XXXXXX",
  "contactEmail": "name@example.com",
  "familyNote": "Blessings and wishes",
  "selectedEvents": ["Haldi", "Wedding"],
  "overall": {
    "city": "Jaipur",
    "date": "2025-10-10",
    "time": "14:00"
  },
  "members": [
    {
      "name": "Guest Name",
      "age": 28,
      "diet": "Veg",
      "accommodation": true,
      "arrivalDate": "2025-10-09",
      "arrivalTime": "12:00",
      "transport": "Flight",
      "events": ["Wedding", "Reception"]
    }
  ]
}
```

## 🌟 Future Enhancements

- **QR Code** generation for easy sharing
- **Email notifications** to couples
- **Guest list management** for couples
- **Accommodation booking** integration
- **Travel coordination** features
- **Photo gallery** integration

---

Made with ♥ by VPlanit
