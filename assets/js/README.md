# Menu System Documentation

## Overview
The menu system uses a JSON-based data structure to dynamically render menu items. This allows easy updates to the menu without modifying HTML directly.

## File Structure
- `menu.json`: Contains all menu data
- `script.js`: Contains the logic for rendering menu items
- `menu.html`: Contains the menu page structure

## Updating the Menu

### Menu JSON Structure
```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "CATEGORY NAME",
      "icon": "font-awesome-icon-class",
      "items": [
        {
          "id": "item-id",
          "name": "Item Name",
          "description": "Item description",
          "price": "XX MAD",
          "imageURL": "./assets/images/image-name.jpg"
        }
      ]
    }
  ]
}
```

### Adding a New Category
1. Open `menu.json`
2. Add a new object to the `categories` array with:
   - `id`: Unique identifier (e.g., "desserts")
   - `name`: Display name (e.g., "DESSERTS")
   - `icon`: Font Awesome icon class (e.g., "fas fa-ice-cream")
   - `items`: Array of menu items

### Adding Menu Items
1. Open `menu.json`
2. Find the appropriate category
3. Add a new object to the category's `items` array with:
   - `id`: Unique identifier (e.g., "d1")
   - `name`: Item name
   - `description`: Item description
   - `price`: Price with "MAD" suffix
   - `imageURL`: Path to item image

### Modifying Existing Items
1. Open `menu.json`
2. Locate the item to modify
3. Update the desired properties
4. Save the file

### Example: Adding a New Dessert
```json
{
  "id": "d3",
  "name": "Baklava aux Amandes",
  "description": "Pâtisserie feuilletée aux amandes et au miel",
  "price": "35 MAD",
  "imageURL": "./assets/images/menu-slider-dessert.png"
}
```

## Important Notes
- Always include the "MAD" suffix in prices
- Use relative paths for images starting with "./assets/images/"
- Keep category IDs lowercase and hyphen-separated
- Ensure all IDs are unique across the menu
- Images should be in the correct aspect ratio for the menu display

## Features
- Dynamic category rendering
- Real-time search functionality
- Responsive slider navigation
- Maintains existing styling and animations
