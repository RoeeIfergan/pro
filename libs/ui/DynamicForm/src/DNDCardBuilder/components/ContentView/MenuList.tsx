import React from 'react'
import { Paper, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material'

export interface MenuCategory {
  id: string
  label: string
  icon: React.ReactNode
}

export interface MenuListProps {
  categories: MenuCategory[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
  availableCategories?: string[]
}

const MenuList: React.FC<MenuListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  availableCategories
}) => {
  const filteredCategories = availableCategories
    ? categories.filter((category) => availableCategories.includes(category.id))
    : categories

  return (
    <Paper
      sx={{
        width: 240,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: 1,
        borderColor: 'divider',
        flexShrink: 0
      }}
    >
      <List sx={{ flex: 1, p: 0 }}>
        {filteredCategories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
              sx={{
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
              <ListItemText primary={category.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default MenuList
