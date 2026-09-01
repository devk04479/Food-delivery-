import React from 'react';
import { 
  UtensilsCrossed, 
  Flame, 
  Pizza, 
  Soup, 
  Croissant, 
  Cake, 
  Coffee,
  Sparkles
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Pizza':
      return <Pizza className={className} />;
    case 'Soup':
      return <Soup className={className} />;
    case 'Croissant':
      return <Croissant className={className} />;
    case 'Cake':
      return <Cake className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
