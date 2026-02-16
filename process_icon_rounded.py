from PIL import Image, ImageDraw
import os

def process_icon_rounded():
    input_path = '/Users/ashish/Desktop/ShreeKhata/frontend/public/logo.png'
    output_path = '/Users/ashish/Desktop/ShreeKhata/frontend/public/logo.png'
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # Remove Black Background (Make black pixels transparent)
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check if pixel is black or very dark gray
            if item[0] < 15 and item[1] < 15 and item[2] < 15:
                # Keep alpha if it exists, or set to 0
                new_data.append((0, 0, 0, 0)) # Transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        
        # 1. Crop (Zoom)
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print(f"Cropped image to {bbox}")
            
            # 2. Resize to 512x512 (Square)
            # Create a new square image with transparent background to hold the cropped content
            # This ensures we have a square base even if the crop wasn't square
            size = max(img.size)
            square_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
            square_img.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
            
            final_size = (512, 512)
            final_img = square_img.resize(final_size, Image.LANCZOS)
            
            # 3. Apply Rounded Corners
            # Create a mask
            mask = Image.new('L', final_size, 0)
            draw = ImageDraw.Draw(mask)
            
            # Radius for rounded corners (Increased to ~35% of size)
            radius = 180
            draw.rounded_rectangle([(0, 0), final_size], radius=radius, fill=255)
            
            # Apply mask
            result = Image.new('RGBA', final_size, (0, 0, 0, 0))
            result.paste(final_img, mask=mask)
            
            # Save
            result.save(output_path, "PNG")
            print(f"Successfully processed and saved rounded icon to {output_path}")
        else:
            print("Error: Image is completely transparent.")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    process_icon_rounded()
