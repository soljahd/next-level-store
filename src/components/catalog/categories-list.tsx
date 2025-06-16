import { Stack, Typography } from '@mui/material';
import { type CategoryWithChildren } from '@/components/catalog';

type CategoryListProps = {
  categories: CategoryWithChildren[];
  selectedCategoryId: string | null;
  handleCategoryClick: (categoryId: string) => Promise<void>;
};

type CategoryTreeProps = {
  categories: CategoryWithChildren[];
  handleCategoryClick: (categoryId: string) => Promise<void>;
  selectedCategoryId?: string | null;
  level: number;
};

type CategoryNodeProps = {
  category: CategoryWithChildren;
  handleCategoryClick: (categoryId: string) => Promise<void>;
  selectedCategoryId?: string | null;
  level: number;
};

export default function CategoryList({ categories, selectedCategoryId, handleCategoryClick }: CategoryListProps) {
  return (
    <Stack sx={{ maxWidth: 230, width: '100%', gap: 1 }}>
      <Typography variant="h6">Categories</Typography>
      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
        <CategoryTree
          categories={categories}
          handleCategoryClick={handleCategoryClick}
          selectedCategoryId={selectedCategoryId}
          level={1}
        />
      </ul>
    </Stack>
  );
}

function CategoryTree({ categories, handleCategoryClick, selectedCategoryId, level }: CategoryTreeProps) {
  return (
    <>
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          handleCategoryClick={handleCategoryClick}
          selectedCategoryId={selectedCategoryId}
          level={level}
        />
      ))}
    </>
  );
}

function CategoryNode({ category, handleCategoryClick, selectedCategoryId, level }: CategoryNodeProps) {
  const isSelected = category.id === selectedCategoryId;

  const handleClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await handleCategoryClick(category.id);
  };

  return (
    <li>
      <Stack
        component="div"
        onClick={(event) => void handleClick(event)}
        sx={{
          pl: level * 2,
          py: 0.5,
          cursor: 'pointer',
          backgroundColor: isSelected ? 'action.selected' : 'transparent',
          '&:hover': {
            backgroundColor: isSelected ? 'action.selected' : 'action.hover',
          },
          borderRadius: 1,
          transition: 'background-color 0.2s ease',
          fontWeight: isSelected ? 'bold' : 'normal',
        }}
      >
        {category.name?.en ?? 'Untitled'}
      </Stack>

      {category.children && category.children.length > 0 && (
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          <CategoryTree
            categories={category.children}
            handleCategoryClick={handleCategoryClick}
            selectedCategoryId={selectedCategoryId}
            level={level + 1}
          />
        </ul>
      )}
    </li>
  );
}
