#!/bin/bash
# Generate PWA icons from the SVG source
# Requires: ImageMagick (convert) or Inkscape
#
# Usage: ./generate-icons.sh
#
# This script converts icon.svg into all required PNG sizes
# for the PWA manifest.

SIZES="72 96 128 144 152 192 384 512"
SOURCE="icon.svg"

for size in $SIZES; do
  echo "Generating icon-${size}x${size}.png..."
  # Using ImageMagick:
  convert -background none -resize ${size}x${size} "$SOURCE" "icon-${size}x${size}.png"
  # Alternative using Inkscape:
  # inkscape -w $size -h $size "$SOURCE" -o "icon-${size}x${size}.png"
done

echo "Done. All icons generated."
