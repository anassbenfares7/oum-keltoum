#!/bin/bash

# File naming standardization script
# Converts inconsistent naming to standardized kebab-case

cd "C:\Users\hp\Desktop\OUM KELTOUM\oum-keltoum v0.6+node.modules\assets\images"

echo "Starting file naming standardization..."

# Renaming rules for consistency
declare -A rename_map=(
    # Counter images
    ["counter-1.png"]="counter-01.png"
    ["counter-2.png"]="counter-02.png"
    ["counter-3.png"]="counter-03.png"
    ["counter-4.png"]="counter-04.png"

    # Team images
    ["team-1.png"]="team-01.png"
    ["team-2.png"]="team-02.png"
    ["team-3.png"]="team-03.png"
    ["team-4.png"]="team-04.png"

    # Partner images
    ["partner-01.png"]="partner-01.png"  # already correct
    ["partner-02.png"]="partner-02.png"  # already correct
    ["partner-03.png"]="partner-03.png"  # already correct
    ["partner-04.png"]="partner-04.png"  # already correct

    # Testimonial images
    ["testi-1.jpg"]="testimonial-01.jpg"
    ["testi-2.jpg"]="testimonial-02.jpg"
    ["testi-3.jpg"]="testimonial-03.jpg"
    ["testi-4.jpg"]="testimonial-04.jpg"
    ["testi-bg.jpg"]="testimonial-bg.jpg"
    ["testi-signal.png"]="testimonial-signal.png"

    # Timeline images
    ["timeline-1.jpg"]="timeline-01.jpg"
    ["timeline-2.jpg"]="timeline-02.jpg"
    ["timeline-3.jpg"]="timeline-03.jpg"
    ["timeline-4.jpg"]="timeline-04.jpg"
    ["timeline-5.jpg"]="timeline-05.jpg"
    ["timeline-6.jpg"]="timeline-06.jpg"

    # Food dish images (convert from French to English with consistent naming)
    ["plat1.jpg"]="dish-01.jpg"
    ["plat2.jpg"]="dish-02.jpg"
    ["plat3.jpg"]="dish-03.jpg"
    ["plat4.jpg"]="dish-04.jpg"
    ["plat5.jpg"]="dish-05.jpg"
    ["plat6.jpg"]="dish-06.jpg"
    ["plat7.jpg"]="dish-07.jpg"
    ["plat8.jpg"]="dish-08.jpg"
    ["plat10.jpg"]="dish-10.jpg"
    ["plat11.jpg"]="dish-11.jpg"
    ["plat-10-2.jpg"]="dish-10-2.jpg"
    ["salad-1.jpg"]="salad-01.jpg"
    ["salad-2.jpg"]="salad-02.jpg"
    ["salad-3.jpg"]="salad-03.jpg"

    # Product images
    ["product-2a.jpg"]="product-02a.jpg"
    ["product-2b.jpg"]="product-02b.jpg"
    ["product-2c.jpg"]="product-02c.jpg"
    ["product-2d.jpg"]="product-02d.jpg"
    ["product-decorate.jpg"]="product-decoration.jpg"
)

# Execute renaming
for old_name in "${!rename_map[@]}"; do
    new_name="${rename_map[$old_name]}"
    if [ -f "$old_name" ]; then
        echo "Renaming: $old_name -> $new_name"
        mv "$old_name" "$new_name"
    else
        echo "File not found: $old_name"
    fi
done

echo "File renaming complete!"
echo "Updated files follow these naming conventions:"
echo "- Use kebab-case (dashes) instead of underscores or camelCase"
echo "- Use leading zeros for single-digit numbers (01, 02, etc.)"
echo "- Use descriptive English names for food items"
echo "- Maintain consistency across similar file types"