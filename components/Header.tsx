import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { deepPurple } from '@mui/material/colors';
import { Logout, PostAdd } from '@mui/icons-material';
import { useCookies } from 'react-cookie';
import Nextlink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    setUser(cookies.user);
  }, [cookies]);

  return (
    <AppBar position="relative">
      <Toolbar>
        <LunchDiningIcon sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap>
          Cookzilla
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                router.push(`/?q=${e.currentTarget.value}`);
              }
            }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }}></Box>
        {user ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  sx={{ ml: 2 }}
                  aria-controls={isMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                  color="primary"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: deepPurple[500] }}
                  >
                    {user.userName[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <MenuItem
                onClick={(e) => {
                  router.push('/post-recipe');
                }}
              >
                <ListItemIcon>
                  <PostAdd fontSize="small" />
                </ListItemIcon>
                Post a Recipe
              </MenuItem>
              <MenuItem
                onClick={async (e) => {
                  e.preventDefault();
                  removeCookie('user');
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Nextlink href="/login">
            <Button color="success" variant="contained">
              Login
            </Button>
          </Nextlink>
        )}
      </Toolbar>
    </AppBar>
  );
}
