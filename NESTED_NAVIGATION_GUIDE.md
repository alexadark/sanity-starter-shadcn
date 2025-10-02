# Nested Navigation Menu Guide

This project now supports a nested navigation menu with dropdown submenus, similar to the shadcnblocks.com navbar component.

## Features

- **Simple Links**: Traditional menu items that link directly to pages
- **Dropdown Menus**: Menu items with nested submenus
- **Clickable Parent Items**: Parent menu items with dropdowns can also have their own links
- **Icons**: Each submenu item can have a Lucide icon
- **Descriptions**: Submenu items can have descriptive text
- **Desktop & Mobile**: Works seamlessly on both desktop (NavigationMenu) and mobile (Accordion)
- **Internal & External Links**: Supports both internal page references and external URLs

## Using the Navigation in Sanity Studio

### 1. Access Navigation Settings

- Go to Sanity Studio (`/studio`)
- Find the "Navigation" document in your content

### 2. Add Menu Items

#### Simple Link (no submenu)

1. Click "Add item" in Links
2. Enter a title (e.g., "Home")
3. Leave "Has Submenu" unchecked
4. Choose internal reference OR enable "Is External" and add URL
5. Optionally enable "Open in new tab" for external links

#### Dropdown Menu with Subitems

1. Click "Add item" in Links
2. Enter a title (e.g., "Products")
3. **Optional**: Add a link for the parent menu item itself:
   - Choose internal reference OR enable "Is External" and add URL
   - This link will be followed when the menu title is clicked (parent item is clickable)
   - If no link is provided, clicking the title only opens the dropdown
4. Enable "Has Submenu"
5. Click "Add item" in Submenu Items
6. For each submenu item:
   - Enter a title (e.g., "Blog")
   - Add a description (e.g., "The latest industry news, updates, and info")
   - Add an icon name in PascalCase (e.g., "Book", "Zap", "Trees")
     - See available icons at https://lucide.dev
   - Choose internal reference OR enable "Is External" and add URL

## Icon Names

Icons use Lucide React. Common examples:

- `Book` - Book icon
- `Zap` - Lightning bolt
- `Trees` - Trees/nature
- `Sunset` - Sun/sunset
- `BookOpen` - Open book
- `MessageCircle` - Chat bubble
- `FileText` - Document
- `Mail` - Email

**Important**: Icon names must be in PascalCase (e.g., `BookOpen` not `book-open`)

## Sample Data

Sample navigation data has been imported showing the structure from shadcnblocks.com:

- Home (simple link to "/")
- Products (dropdown with link to "#" + Blog, Company, Careers, Support subitems)
- Resources (dropdown with link to "#" + Help Center, Contact Us, Status, Terms subitems)
- Pricing (simple link)
- Projects (simple link to "/projects")

## Design Details

### Dropdown Positioning

The dropdown menus now appear directly below the navbar (not as floating popovers). They use the NavigationMenu component with `viewport={false}` to disable the viewport positioning and allow the content to appear naturally below each menu item.

### Parent Item Behavior

- **With link**: Clicking the parent item navigates to that link, hovering shows the dropdown
- **Without link**: Clicking or hovering opens the dropdown

## Technical Details

### Schema Files

- `sanity/schemas/documents/navigation.ts` - Navigation schema with nested structure and parent links

### Query Files

- `sanity/queries/navigation.ts` - GROQ query including submenu items

### Component Files

- `components/header/desktop-nav.tsx` - Desktop navigation with NavigationMenu (viewport disabled)
- `components/header/mobile-nav.tsx` - Mobile navigation with Accordion
- `components/ui/navigation-menu.tsx` - shadcn/ui NavigationMenu component

### How It Works

**Desktop**: Uses shadcn's NavigationMenu component with `viewport={false}`. When a menu item has a submenu, it displays either:

- A clickable link with dropdown functionality (if href is provided)
- A trigger button that opens a dropdown panel (if no href)

The dropdown content appears directly below the navigation bar in a styled panel with a fixed width of 400px.

**Mobile**: Uses shadcn's Accordion component. Menu items with submenus become expandable accordion items, while simple links remain as direct links.

**Icons**: Icons are dynamically loaded from `lucide-react` based on the icon name stored in Sanity. The component looks up the icon component by name.

## Migration from Old Navigation

The new schema is backward compatible. Existing simple menu items will continue to work. To add dropdown functionality:

1. Edit an existing menu item in Sanity Studio
2. Optionally add/update the link for the parent item
3. Enable "Has Submenu"
4. Add submenu items with icons and descriptions

## Customization

### Styling

The navigation uses Tailwind CSS classes and can be customized:

- Desktop: `components/header/desktop-nav.tsx`
- Mobile: `components/header/mobile-nav.tsx`
- Dropdown width: Change `w-[400px]` in desktop-nav.tsx

### Menu Position

The menu position (left/center/right) can be controlled from Settings > Header > Menu Position

### Header Buttons

Additional buttons (like Login/Sign up from the example) can be added in Settings > Header > Header Buttons
