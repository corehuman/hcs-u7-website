#!/bin/bash

HEADER='/**
 * HCS-U7 - Human Cognitive Signature
 * 
 * Copyright (c) 2025 Benjamin BARRERE / IA SOLUTION
 * Licensed under CC BY-NC-SA 4.0 for non-commercial use
 * Commercial use requires license: contact@ia-solution.fr
 * 
 * Patent Pending: Multi-layer cognitive biometrics (November 2025)
 * 
 * @author Benjamin BARRERE
 * @license CC-BY-NC-SA-4.0
 * @see https://hcs-u7.com/legal
 */

'

# Fichiers à traiter (lib/ uniquement)
FILES=$(find lib -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next)

for file in $FILES; do
  # Vérifier si header déjà présent
  if ! grep -q "Copyright (c) 2025 Benjamin BARRERE" "$file"; then
    # Ajouter header en début de fichier
    echo "$HEADER" | cat - "$file" > temp && mv temp "$file"
    echo "✅ Header ajouté: $file"
  else
    echo "⏭️  Header déjà présent: $file"
  fi
done

echo ""
echo "✅ Copyright headers ajoutés à tous les fichiers lib/"
